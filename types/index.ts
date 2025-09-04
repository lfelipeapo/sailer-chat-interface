export interface User {
  id: string;
  name: string;
  type: 'customer' | 'agent' | 'bot';
  avatar?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  timestamp: Date;
  read?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingStatus {
  userId: string;
  chatId: string;
  isTyping: boolean;
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'user_joined' | 'user_left';
  data: any;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, TypingStatus[]>;
  loggedInUser: User | null;
  isConnected: boolean;
}

