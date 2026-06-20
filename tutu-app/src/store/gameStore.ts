import { create } from 'zustand';
import type { Spot, Quest, Achievement, User } from '../types';
import { mockUser, mockSpots, mockQuests, mockAchievements } from '../data/mockData';

interface GameState {
  user: User;
  spots: Spot[];
  quests: Quest[];
  achievements: Achievement[];
  selectedSpot: Spot | null;
  filterType: 'all' | 'scenic' | 'food' | 'culture' | 'personal';
  
  setSelectedSpot: (spot: Spot | null) => void;
  setFilterType: (type: 'all' | 'scenic' | 'food' | 'culture' | 'personal') => void;
  visitSpot: (spotId: string) => void;
  updateQuestStatus: (questId: string, status: 'available' | 'inProgress' | 'completed') => void;
  addXp: (amount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  user: mockUser,
  spots: mockSpots,
  quests: mockQuests,
  achievements: mockAchievements,
  selectedSpot: null,
  filterType: 'all',
  
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
  
  setFilterType: (type) => set({ filterType: type }),
  
  visitSpot: (spotId) => set((state) => {
    const spot = state.spots.find(s => s.id === spotId);
    if (spot && !spot.visited) {
      const updatedSpots = state.spots.map(s =>
        s.id === spotId ? { ...s, visited: true } : s
      );
      return {
        spots: updatedSpots,
        user: {
          ...state.user,
          xp: state.user.xp + spot.xp,
          totalXp: state.user.totalXp + spot.xp,
          spotsVisited: state.user.spotsVisited + 1
        }
      };
    }
    return state;
  }),
  
  updateQuestStatus: (questId, status) => set((state) => {
    const quest = state.quests.find(q => q.id === questId);
    let xpGain = 0;
    
    if (status === 'completed' && quest && quest.status !== 'completed') {
      xpGain = quest.xp;
    }
    
    const updatedQuests = state.quests.map(q =>
      q.id === questId ? { ...q, status } : q
    );
    
    const completedCount = updatedQuests.filter(q => q.status === 'completed').length;
    
    return {
      quests: updatedQuests,
      user: {
        ...state.user,
        xp: state.user.xp + xpGain,
        totalXp: state.user.totalXp + xpGain,
        questsCompleted: completedCount
      }
    };
  }),
  
  addXp: (amount) => set((state) => ({
    user: {
      ...state.user,
      xp: state.user.xp + amount,
      totalXp: state.user.totalXp + amount
    }
  }))
}));