import type { Spot, Quest, Achievement, User, ForumPost, AccountItem, Skill, LeaderboardPlayer } from '../types';

export const mockUser: User = {
  name: '城市探险家',
  avatar: '🧭',
  level: 15,
  title: '探索者',
  xp: 2400,
  totalXp: 15000,
  spotsVisited: 23,
  questsCompleted: 45,
  achievementsUnlocked: 12,
  streakDays: 7,
  home: { name: '我的家', location: '朝阳区望京' },
  company: { name: '我的公司', location: '海淀区中关村' }
};

export const mockSpots: Spot[] = [
  {
    id: '1',
    icon: '🏛️',
    name: '天安门',
    sub: '东城区 · 景点',
    desc: '中华人民共和国的象征，世界上最大的城市广场之一',
    rating: 5,
    xp: 100,
    score: '5.0',
    price: '免费',
    time: '2-3小时',
    tags: ['历史', '地标', '必去'],
    visited: true,
    type: 'scenic',
    coordinates: { x: 520, y: 380 }
  },
  {
    id: '2',
    icon: '🏯',
    name: '故宫',
    sub: '东城区 · 景点',
    desc: '明清两代皇宫，世界文化遗产',
    rating: 5,
    xp: 150,
    score: '4.9',
    price: '60元',
    time: '半天',
    tags: ['历史', '文化', '必去'],
    visited: true,
    type: 'scenic',
    coordinates: { x: 530, y: 370 }
  },
  {
    id: '3',
    icon: '🌳',
    name: '天坛',
    sub: '东城区 · 景点',
    desc: '明清皇帝祭天的场所，世界文化遗产',
    rating: 5,
    xp: 120,
    score: '4.8',
    price: '15元',
    time: '2-3小时',
    tags: ['历史', '建筑', '公园'],
    visited: false,
    type: 'scenic',
    coordinates: { x: 560, y: 420 }
  },
  {
    id: '4',
    icon: '🏔️',
    name: '长城',
    sub: '延庆区 · 景点',
    desc: '世界七大奇迹之一，中华民族的象征',
    rating: 5,
    xp: 200,
    score: '4.9',
    price: '45元',
    time: '全天',
    tags: ['历史', '世界遗产', '必去'],
    visited: false,
    type: 'scenic',
    coordinates: { x: 350, y: 150 }
  },
  {
    id: '5',
    icon: '🌊',
    name: '后海',
    sub: '西城区 · 景点',
    desc: '北京著名的酒吧街，夜景迷人',
    rating: 4,
    xp: 80,
    score: '4.5',
    price: '免费',
    time: '晚上',
    tags: ['夜生活', '酒吧', '湖景'],
    visited: true,
    type: 'scenic',
    coordinates: { x: 500, y: 360 }
  },
  {
    id: '6',
    icon: '🏟️',
    name: '鸟巢',
    sub: '朝阳区 · 景点',
    desc: '2008年北京奥运会主体育场',
    rating: 4,
    xp: 90,
    score: '4.6',
    price: '50元',
    time: '2小时',
    tags: ['奥运', '建筑', '地标'],
    visited: false,
    type: 'scenic',
    coordinates: { x: 580, y: 320 }
  },
  {
    id: '7',
    icon: '🏯',
    name: '颐和园',
    sub: '海淀区 · 景点',
    desc: '中国现存规模最大、保存最完整的皇家园林',
    rating: 5,
    xp: 130,
    score: '4.8',
    price: '30元',
    time: '半天',
    tags: ['园林', '历史', '必去'],
    visited: false,
    type: 'scenic',
    coordinates: { x: 420, y: 300 }
  },
  {
    id: '8',
    icon: '🍜',
    name: '簋街',
    sub: '东城区 · 美食',
    desc: '北京最著名的美食街，以小龙虾闻名',
    rating: 4,
    xp: 70,
    score: '4.4',
    price: '人均100元',
    time: '晚上',
    tags: ['美食', '夜宵', '小龙虾'],
    visited: true,
    type: 'food',
    coordinates: { x: 540, y: 360 }
  },
  {
    id: '9',
    icon: '🥟',
    name: '南锣鼓巷',
    sub: '东城区 · 美食',
    desc: '北京最古老的街区之一，各种特色小吃',
    rating: 4,
    xp: 60,
    score: '4.3',
    price: '人均50元',
    time: '下午',
    tags: ['小吃', '胡同', '文艺'],
    visited: false,
    type: 'food',
    coordinates: { x: 525, y: 365 }
  },
  {
    id: '10',
    icon: '🛍️',
    name: '王府井',
    sub: '东城区 · 美食',
    desc: '北京最繁华的商业街，小吃街闻名',
    rating: 4,
    xp: 80,
    score: '4.5',
    price: '人均80元',
    time: '全天',
    tags: ['购物', '美食', '商业'],
    visited: false,
    type: 'food',
    coordinates: { x: 535, y: 375 }
  },
  {
    id: '11',
    icon: '🎉',
    name: '三里屯',
    sub: '朝阳区 · 美食',
    desc: '北京时尚地标，酒吧和餐厅聚集地',
    rating: 4,
    xp: 75,
    score: '4.4',
    price: '人均150元',
    time: '晚上',
    tags: ['酒吧', '时尚', '夜生活'],
    visited: false,
    type: 'food',
    coordinates: { x: 570, y: 350 }
  },
  {
    id: '12',
    icon: '🥩',
    name: '牛街',
    sub: '西城区 · 美食',
    desc: '北京最正宗的清真美食街',
    rating: 5,
    xp: 65,
    score: '4.7',
    price: '人均60元',
    time: '全天',
    tags: ['清真', '小吃', '传统'],
    visited: false,
    type: 'food',
    coordinates: { x: 490, y: 390 }
  },
  {
    id: '13',
    icon: '🎨',
    name: '798艺术区',
    sub: '朝阳区 · 文化',
    desc: '当代艺术聚集地，文艺青年必去',
    rating: 4,
    xp: 85,
    score: '4.6',
    price: '免费',
    time: '半天',
    tags: ['艺术', '文艺', '拍照'],
    visited: false,
    type: 'culture',
    coordinates: { x: 600, y: 340 }
  },
  {
    id: '14',
    icon: '🏛️',
    name: '国家博物馆',
    sub: '东城区 · 文化',
    desc: '世界上单体建筑面积最大的博物馆',
    rating: 5,
    xp: 100,
    score: '4.8',
    price: '免费',
    time: '半天',
    tags: ['博物馆', '历史', '文化'],
    visited: false,
    type: 'culture',
    coordinates: { x: 525, y: 385 }
  },
  {
    id: '15',
    icon: '🎭',
    name: '北京人艺',
    sub: '东城区 · 文化',
    desc: '中国话剧艺术的殿堂',
    rating: 5,
    xp: 90,
    score: '4.7',
    price: '80-280元',
    time: '晚上',
    tags: ['话剧', '艺术', '演出'],
    visited: false,
    type: 'culture',
    coordinates: { x: 515, y: 395 }
  },
  {
    id: '16',
    icon: '🏠',
    name: '我的家',
    sub: '朝阳区 · 个人',
    desc: '温馨的家',
    rating: 5,
    xp: 0,
    score: '5.0',
    price: '-',
    time: '-',
    tags: ['家', '个人'],
    visited: true,
    personal: true,
    type: 'personal',
    coordinates: { x: 560, y: 330 }
  },
  {
    id: '17',
    icon: '🏢',
    name: '我的公司',
    sub: '海淀区 · 个人',
    desc: '奋斗的地方',
    rating: 4,
    xp: 0,
    score: '4.0',
    price: '-',
    time: '-',
    tags: ['工作', '个人'],
    visited: true,
    personal: true,
    type: 'personal',
    coordinates: { x: 430, y: 290 }
  },
  {
    id: '18',
    icon: '🏛️',
    name: '圆明园',
    sub: '海淀区 · 景点',
    desc: '清代皇家园林，历史的见证',
    rating: 4,
    xp: 100,
    score: '4.5',
    price: '25元',
    time: '半天',
    tags: ['历史', '园林', '遗址'],
    visited: false,
    type: 'scenic',
    coordinates: { x: 410, y: 280 }
  }
];

export const mockQuests: Quest[] = [
  {
    id: '1',
    title: '完成今日工作目标',
    desc: '高效完成今天的工作任务，提升职业能力',
    xp: 50,
    difficulty: 'medium',
    category: 'work',
    status: 'available'
  },
  {
    id: '2',
    title: '晨跑5公里',
    desc: '保持健康的生活方式，增强体质',
    xp: 30,
    difficulty: 'easy',
    category: 'fitness',
    status: 'inProgress'
  },
  {
    id: '3',
    title: '学习新技术1小时',
    desc: '持续学习，提升技能水平',
    xp: 40,
    difficulty: 'medium',
    category: 'study',
    status: 'available'
  },
  {
    id: '4',
    title: '整理房间',
    desc: '保持生活环境的整洁有序',
    xp: 20,
    difficulty: 'easy',
    category: 'life',
    status: 'completed'
  },
  {
    id: '5',
    title: '完成项目报告',
    desc: '撰写详细的项目总结报告',
    xp: 80,
    difficulty: 'hard',
    category: 'work',
    status: 'available'
  },
  {
    id: '6',
    title: '健身房训练',
    desc: '进行力量训练，塑造完美身材',
    xp: 60,
    difficulty: 'hard',
    category: 'fitness',
    status: 'available'
  },
  {
    id: '7',
    title: '阅读一本书',
    desc: '每月读完一本书，拓展知识面',
    xp: 100,
    difficulty: 'medium',
    category: 'study',
    status: 'available'
  },
  {
    id: '8',
    title: '学习烹饪新菜',
    desc: '提升生活技能，享受美食',
    xp: 30,
    difficulty: 'easy',
    category: 'life',
    status: 'available'
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    icon: '🗺️',
    name: '初探京城',
    desc: '探索第一个北京景点',
    xp: 50,
    category: 'explore',
    progress: 1,
    total: 1,
    unlocked: true
  },
  {
    id: '2',
    icon: '🏃',
    name: '健身达人',
    desc: '完成10次健身任务',
    xp: 100,
    category: 'challenge',
    progress: 7,
    total: 10,
    unlocked: false
  },
  {
    id: '3',
    icon: '📚',
    name: '学霸之路',
    desc: '完成20个学习任务',
    xp: 150,
    category: 'challenge',
    progress: 15,
    total: 20,
    unlocked: false
  },
  {
    id: '4',
    icon: '🍜',
    name: '美食家',
    desc: '打卡5个美食地点',
    xp: 80,
    category: 'explore',
    progress: 3,
    total: 5,
    unlocked: false
  },
  {
    id: '5',
    icon: '🏛️',
    name: '文化探索者',
    desc: '参观3个文化场所',
    xp: 100,
    category: 'explore',
    progress: 1,
    total: 3,
    unlocked: false
  },
  {
    id: '6',
    icon: '⭐',
    name: '连续打卡',
    desc: '连续7天打卡',
    xp: 200,
    category: 'life',
    progress: 7,
    total: 7,
    unlocked: true
  },
  {
    id: '7',
    icon: '🎯',
    name: '任务达人',
    desc: '完成50个任务',
    xp: 300,
    category: 'challenge',
    progress: 45,
    total: 50,
    unlocked: false
  },
  {
    id: '8',
    icon: '💬',
    name: '社交达人',
    desc: '在论坛发布10个帖子',
    xp: 150,
    category: 'social',
    progress: 5,
    total: 10,
    unlocked: false
  },
  {
    id: '9',
    icon: '🏔️',
    name: '长城英雄',
    desc: '打卡长城',
    xp: 200,
    category: 'explore',
    progress: 0,
    total: 1,
    unlocked: false
  },
  {
    id: '10',
    icon: '🌟',
    name: '北京通',
    desc: '探索所有北京景点',
    xp: 500,
    category: 'explore',
    progress: 7,
    total: 15,
    unlocked: false
  }
];

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    author: '北漂小王',
    avatar: '👨',
    time: '2小时前',
    title: '望京租房避坑指南',
    excerpt: '刚来北京的朋友注意了，望京租房一定要看清楚合同条款，特别是押金退还部分...',
    category: '租房交流',
    likes: 128,
    comments: 45
  },
  {
    id: '2',
    author: '美食达人',
    avatar: '👩‍🍳',
    time: '5小时前',
    title: '北京最值得去的10家餐厅',
    excerpt: '作为一个在北京生活了5年的吃货，给大家推荐这些宝藏餐厅...',
    category: '美食推荐',
    likes: 256,
    comments: 89
  },
  {
    id: '3',
    author: '程序员小李',
    avatar: '👨‍💻',
    time: '1天前',
    title: '中关村互联网公司求职经验分享',
    excerpt: '最近面试了几家大厂，分享一下面试经验，希望能帮到正在找工作的朋友...',
    category: '求职招聘',
    likes: 189,
    comments: 67
  },
  {
    id: '4',
    author: '文艺青年',
    avatar: '🎨',
    time: '2天前',
    title: '798艺术区周末打卡攻略',
    excerpt: '周末去了798，整理了一份详细的打卡路线，包括必去的画廊和咖啡馆...',
    category: '城市攻略',
    likes: 342,
    comments: 112
  },
  {
    id: '5',
    author: '健身教练',
    avatar: '💪',
    time: '3天前',
    title: '北京最好的健身房推荐',
    excerpt: '根据我多年的健身经验，推荐几家性价比高、环境好的健身房...',
    category: '经验分享',
    likes: 167,
    comments: 54
  }
];

export const mockAccountItems: AccountItem[] = [
  {
    id: '1',
    type: 'expense',
    amount: 35,
    category: '餐饮',
    note: '午餐',
    time: '2024-01-15 12:30'
  },
  {
    id: '2',
    type: 'expense',
    amount: 200,
    category: '交通',
    note: '地铁充值',
    time: '2024-01-15 18:00'
  },
  {
    id: '3',
    type: 'income',
    amount: 15000,
    category: '工资',
    note: '1月工资',
    time: '2024-01-10 09:00'
  },
  {
    id: '4',
    type: 'expense',
    amount: 500,
    category: '购物',
    note: '购买日用品',
    time: '2024-01-14 15:20'
  },
  {
    id: '5',
    type: 'expense',
    amount: 80,
    category: '娱乐',
    note: '看电影',
    time: '2024-01-13 20:00'
  }
];

export const mockSkills: Skill[] = [
  { name: '技术能力', level: 8, progress: 75, icon: '💻' },
  { name: '身体素质', level: 6, progress: 40, icon: '💪' },
  { name: '社交能力', level: 7, progress: 60, icon: '🤝' },
  { name: '生活管理', level: 5, progress: 30, icon: '🏠' },
  { name: '理财能力', level: 4, progress: 20, icon: '💰' },
  { name: '兴趣爱好', level: 6, progress: 50, icon: '🎨' }
];

export const mockLeaderboard: LeaderboardPlayer[] = [
  { rank: 1, name: '探索大师', avatar: '🧭', title: '传奇探险家', xp: 50000, level: 30 },
  { rank: 2, name: '城市猎人', avatar: '🎯', title: '资深探索者', xp: 45000, level: 28 },
  { rank: 3, name: '美食家小王', avatar: '🍜', title: '美食达人', xp: 42000, level: 26 },
  { rank: 4, name: '健身达人', avatar: '💪', title: '运动健将', xp: 38000, level: 24 },
  { rank: 5, name: '文艺青年', avatar: '🎨', title: '文化探索者', xp: 35000, level: 22 },
  { rank: 6, name: '程序员小李', avatar: '👨‍💻', title: '技术达人', xp: 32000, level: 20 },
  { rank: 7, name: '北漂小王', avatar: '👨', title: '城市新人', xp: 28000, level: 18 },
  { rank: 8, name: '城市探险家', avatar: '🧭', title: '探索者', xp: 15000, level: 15, isCurrentUser: true },
  { rank: 9, name: '新手玩家', avatar: '🎮', title: '初学者', xp: 8000, level: 10 },
  { rank: 10, name: '刚来北京', avatar: '🌟', title: '新人', xp: 3000, level: 5 }
];