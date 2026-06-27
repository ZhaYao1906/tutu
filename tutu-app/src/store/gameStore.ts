import { create } from 'zustand';
import type { Spot, Quest, Achievement, User, DailyRecord, AuthUser } from '../types';
import { mockUser, mockSpots, mockQuests, mockAchievements } from '../data/mockData';
import { authApi, userApi, spotsApi, questsApi, dailyRecordApi, TokenManager } from '../services/api';

// AuthUser 转换为前端 User
function authUserToUser(authUser: AuthUser): User {
  return {
    name: authUser.username,
    avatar: authUser.avatar,
    level: authUser.level,
    title: authUser.title,
    xp: authUser.xp,
    totalXp: authUser.totalXp,
    spotsVisited: authUser.spotsVisited,
    questsCompleted: authUser.questsCompleted,
    achievementsUnlocked: authUser.achievementsUnlocked,
    streakDays: authUser.streakDays,
    home: authUser.homeName ? { name: authUser.homeName, location: authUser.homeLocation || '' } : undefined,
    company: authUser.companyName ? { name: authUser.companyName, location: authUser.companyLocation || '' } : undefined,
  };
}

interface GameState {
  user: User;
  spots: Spot[];
  quests: Quest[];
  achievements: Achievement[];
  dailyRecords: DailyRecord[];
  selectedSpot: Spot | null;
  filterType: 'all' | 'scenic' | 'food' | 'culture' | 'personal';

  // 认证状态
  isAuthenticated: boolean;
  xpForNextLevel: number;

  // 原有 actions
  setSelectedSpot: (spot: Spot | null) => void;
  setFilterType: (type: 'all' | 'scenic' | 'food' | 'culture' | 'personal') => void;
  visitSpot: (spotId: string, visitTime?: string) => void;
  updateQuestStatus: (questId: string, status: 'available' | 'inProgress' | 'completed') => void;
  addQuest: (quest: Quest) => void;
  addXp: (amount: number) => void;

  // 认证 actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, avatar?: string) => Promise<void>;
  logout: () => void;
  loadUserData: () => Promise<void>;
  loadPublicSpots: () => Promise<void>;
  checkAuth: () => Promise<void>;

  // 编辑家/公司
  updateHomeCompany: (type: 'home' | 'company', name: string, location: string) => Promise<void>;

  // 每日记录
  saveDailyRecord: (record: DailyRecord) => Promise<void>;
  loadDailyRecords: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: mockUser,
  spots: mockSpots,
  quests: mockQuests,
  achievements: mockAchievements,
  dailyRecords: [],
  selectedSpot: null,
  filterType: 'all',

  // 认证状态
  isAuthenticated: false,
  xpForNextLevel: 1000,

  setSelectedSpot: (spot) => set({ selectedSpot: spot }),

  setFilterType: (type) => set({ filterType: type }),

  visitSpot: (spotId, visitTime) => {
    const state = get();
    const spot = state.spots.find(s => s.id === spotId);
    if (spot && !spot.visited) {
      const updatedSpots = state.spots.map(s =>
        s.id === spotId ? { ...s, visited: true } : s
      );
      set({
        spots: updatedSpots,
        user: {
          ...state.user,
          xp: state.user.xp + spot.xp,
          totalXp: state.user.totalXp + spot.xp,
          spotsVisited: state.user.spotsVisited + 1
        }
      });

      // 如果已登录，同步到后端
      if (state.isAuthenticated) {
        spotsApi.visit(parseInt(spotId), visitTime).catch(console.error);
      }
    }
  },

  updateQuestStatus: (questId, status) => {
    const state = get();
    const quest = state.quests.find(q => q.id === questId);
    let xpGain = 0;

    if (status === 'completed' && quest && quest.status !== 'completed') {
      xpGain = quest.xp;
    }

    const updatedQuests = state.quests.map(q =>
      q.id === questId ? { ...q, status } : q
    );

    const completedCount = updatedQuests.filter(q => q.status === 'completed').length;

    set({
      quests: updatedQuests,
      user: {
        ...state.user,
        xp: state.user.xp + xpGain,
        totalXp: state.user.totalXp + xpGain,
        questsCompleted: completedCount
      }
    });

    // 如果已登录，同步到后端
    if (state.isAuthenticated) {
      questsApi.updateStatus(parseInt(questId), status).catch(console.error);
    }
  },

  addQuest: (quest) => {
    set((state) => ({ quests: [...state.quests, quest] }));

    // 如果已登录，同步到后端
    const state = get();
    if (state.isAuthenticated) {
      questsApi.create({
        title: quest.title,
        description: quest.desc,
        xp: quest.xp,
        difficulty: quest.difficulty,
        category: quest.category,
        date: quest.date,
      }).catch(console.error);
    }
  },

  addXp: (amount) => set((state) => ({
    user: {
      ...state.user,
      xp: state.user.xp + amount,
      totalXp: state.user.totalXp + amount
    }
  })),

  // ===== 认证 actions =====

  login: async (email, password) => {
    const result = await authApi.login(email, password);
    TokenManager.setToken(result.token);
    const user = authUserToUser(result.user);
    set({ user, isAuthenticated: true });
    await get().loadUserData();
  },

  register: async (username, email, password, avatar) => {
    const result = await authApi.register(username, email, password, avatar);
    TokenManager.setToken(result.token);
    const user = authUserToUser(result.user);
    set({ user, isAuthenticated: true });
    await get().loadUserData();
  },

  logout: () => {
    TokenManager.removeToken();
    set({
      user: mockUser,
      spots: mockSpots,
      quests: mockQuests,
      achievements: mockAchievements,
      dailyRecords: [],
      isAuthenticated: false,
      xpForNextLevel: 1000,
    });
  },

  checkAuth: async () => {
    const token = TokenManager.getToken();
    if (!token) {
      // 未登录时也加载公开景点数据（保证未登录也能看到全部景点）
      await get().loadPublicSpots();
      return;
    }

    try {
      const profile = await userApi.getProfile();
      const user = authUserToUser(profile);
      set({ user, isAuthenticated: true });
      await get().loadUserData();
    } catch {
      TokenManager.removeToken();
      // token 失效时也尝试加载公开数据
      await get().loadPublicSpots();
    }
  },

  // 加载公开景点数据（不依赖登录状态）
  loadPublicSpots: async () => {
    try {
      const spotsData = await spotsApi.getAll();
      if (spotsData && Array.isArray(spotsData) && spotsData.length > 0) {
        set({ spots: spotsData as Spot[] });
      }
    } catch (error) {
      console.error('加载公开景点数据失败:', error);
    }
  },

  loadUserData: async () => {
    try {
      // 并行加载所有数据
      const [levelInfo, spotsData, questsData, dailyRecordsData] = await Promise.all([
        userApi.getLevelInfo().catch(() => null),
        spotsApi.getAll().catch(() => null),
        questsApi.getAll().catch(() => null),
        dailyRecordApi.getAll().catch(() => null),
      ]);

      const updates: Partial<GameState> = {};

      // 更新等级信息
      if (levelInfo) {
        updates.xpForNextLevel = (levelInfo as Record<string, unknown>).xpForNextLevel as number || 1000;
        updates.user = {
          ...get().user,
          level: (levelInfo as Record<string, unknown>).level as number || get().user.level,
          xp: (levelInfo as Record<string, unknown>).currentXp as number || get().user.xp,
          totalXp: (levelInfo as Record<string, unknown>).totalXp as number || get().user.totalXp,
          title: (levelInfo as Record<string, unknown>).title as string || get().user.title,
        };
      }

      // 更新地点数据
      if (spotsData && Array.isArray(spotsData) && spotsData.length > 0) {
        updates.spots = spotsData as Spot[];
      }

      // 更新任务数据
      if (questsData && Array.isArray(questsData) && questsData.length > 0) {
        updates.quests = questsData as Quest[];
      }

      // 更新每日记录
      if (dailyRecordsData && Array.isArray(dailyRecordsData)) {
        updates.dailyRecords = dailyRecordsData as DailyRecord[];
      }

      set(updates);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  },

  // ===== 编辑家/公司 =====

  updateHomeCompany: async (type, name, location) => {
    const state = get();
    const updates = type === 'home'
      ? { home: { name, location } }
      : { company: { name, location } };

    set({ user: { ...state.user, ...updates } });

    // 同步到后端
    if (state.isAuthenticated) {
      const apiUpdates = type === 'home'
        ? { homeName: name, homeLocation: location }
        : { companyName: name, companyLocation: location };
      await userApi.updateProfile(apiUpdates);
    }
  },

  // ===== 每日记录 =====

  saveDailyRecord: async (record) => {
    const state = get();

    // 乐观更新本地数据
    const existingIndex = state.dailyRecords.findIndex(r => r.date === record.date);
    let updatedRecords: DailyRecord[];
    if (existingIndex >= 0) {
      updatedRecords = state.dailyRecords.map((r, i) => i === existingIndex ? record : r);
    } else {
      updatedRecords = [...state.dailyRecords, record];
    }
    set({ dailyRecords: updatedRecords });

    // 同步到后端
    if (state.isAuthenticated) {
      const saved = await dailyRecordApi.createOrUpdate(record);
      // 用后端返回的数据更新
      if (saved) {
        const idx = get().dailyRecords.findIndex(r => r.date === record.date);
        if (idx >= 0) {
          const newRecords = [...get().dailyRecords];
          newRecords[idx] = saved;
          set({ dailyRecords: newRecords });
        }
      }
    }
  },

  loadDailyRecords: async () => {
    if (!get().isAuthenticated) return;
    try {
      const records = await dailyRecordApi.getAll();
      if (records && Array.isArray(records)) {
        set({ dailyRecords: records });
      }
    } catch (error) {
      console.error('加载每日记录失败:', error);
    }
  },
}));
