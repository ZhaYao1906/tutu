export interface Spot {
  id: string;
  icon: string;
  name: string;
  sub: string;
  desc: string;
  rating: number;
  xp: number;
  score: string;
  price: string;
  time: string;
  tags: string[];
  visited: boolean;
  personal?: boolean;
  type: 'scenic' | 'food' | 'culture' | 'personal';
  coordinates: { x: number; y: number };
}

export interface Quest {
  id: string;
  title: string;
  desc: string;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'work' | 'fitness' | 'study' | 'life';
  status: 'available' | 'inProgress' | 'completed';
  date?: string;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  xp: number;
  category: 'explore' | 'life' | 'challenge' | 'social';
  progress: number;
  total: number;
  unlocked: boolean;
}

export interface User {
  name: string;
  avatar: string;
  level: number;
  title: string;
  xp: number;
  totalXp: number;
  spotsVisited: number;
  questsCompleted: number;
  achievementsUnlocked: number;
  streakDays: number;
  home?: { name: string; location: string };
  company?: { name: string; location: string };
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  title: string;
  excerpt: string;
  category: string;
  likes: number;
  comments: number;
}

export interface AccountItem {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  note: string;
  time: string;
}

export interface Skill {
  name: string;
  level: number;
  progress: number;
  icon: string;
}

export interface LeaderboardPlayer {
  rank: number;
  name: string;
  avatar: string;
  title: string;
  xp: number;
  level: number;
  isCurrentUser?: boolean;
}