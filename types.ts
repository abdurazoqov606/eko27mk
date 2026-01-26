
export enum AppSection {
  HOME = 'home',
  ECO_LIFE = 'eco-life',
  NEWS = 'news',
  PROBLEMS = 'problems',
  NEWS_FORUM = 'news-forum',
  QUIZ = 'quiz',
  ECO_INFO = 'eco-info',
  COMMUNITY_CHAT = 'community-chat',
  PROFILE = 'profile',
  GAMES = 'games',
  MARKET = 'market',
  MAP = 'map',
  SUPPORT = 'support',
  ADMIN_PANEL = 'admin-panel'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
  balance: number; 
  rank: string;
  level: number;
  xp: number;
  maxXp: number;
  achievements: { id: string; name: string; icon: string; date: string }[];
  joinedDate: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'text' | 'image' | 'video';
  text?: string;
  mediaUrl?: string;
  timestamp: string;
  isMe: boolean;
}

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export interface EcoArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  level: 'easy' | 'medium' | 'hard';
}

export interface TreeAction {
  id: string;
  title: string;
  date: string;
  volunteers: number;
  status: 'planning' | 'ongoing' | 'completed';
}

export interface ForumEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  prizes: {
    rank: string;
    prize: string;
    description: string;
    icon: string;
  }[];
}
