
export enum AppSection {
  HOME = 'home',
  ECO_LIFE = 'eco-life',
  NEWS = 'news',
  PROBLEMS = 'problems',
  NEWS_FORUM = 'news-forum',
  QUIZ = 'quiz',
  ECO_INFO = 'eco-info',
  RED_BOOK = 'red-book',
  COMMUNITY_CHAT = 'community-chat',
  PROFILE = 'profile',
  GAMES = 'games',
  SUPPORT = 'support',
  ADMIN_PANEL = 'admin-panel',
  MARKET = 'market',
  SETTINGS = 'settings'
}

export interface RedBookConfig {
  history: string;
  updates: string;
  plantsPdfUrl: string;
  animalsPdfUrl: string;
  lastUpdated: string;
}

export interface NatureReserve {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  timestamp: any;
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

export interface MarketItem {
  id: string;
  name: string;
  price: string;
  image: string;
  phone: string;
  description: string;
  sellerName: string;
  category: string;
  timestamp: any;
}

export interface EcoArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  link?: string;
}

export interface NewsComment {
  id: string;
  newsId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: any;
}

export interface GameItem {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'text' | 'image' | 'video';
  text?: string;
  mediaUrl?: string;
  timestamp: any;
}

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  level: string;
}

export interface TreeAction {
  id: string;
  title: string;
  date: string;
  volunteers: number;
  status: string;
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

export interface ContestSubmission {
  id: string;
  fullName: string;
  phone: string;
  imageUrl: string;
  likes: number;
  timestamp: any;
}

export interface ContestConfig {
  title: string;
  description?: string;
  prizes: {
    rank: string;
    amount: string;
    bonus: string;
  }[];
}
