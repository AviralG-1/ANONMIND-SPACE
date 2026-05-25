// Local storage-based chat service for demo/offline use
export interface ChatMessage {
  id: string;
  roomId: string;
  message: string;
  timestamp: number;
  userId: string;
  username: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  messages: ChatMessage[];
  activeUsers: string[];
}

export class LocalChatService {
  private static STORAGE_KEY = 'safespace_chat_data';
  private static USER_KEY = 'safespace_user';
  private listeners: ((rooms: ChatRoom[]) => void)[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const existingData = localStorage.getItem(LocalChatService.STORAGE_KEY);
    if (!existingData) {
      const defaultRooms: ChatRoom[] = [
        {
          id: 'depression-support',
          name: 'Depression Support',
          messages: [],
          activeUsers: []
        },
        {
          id: 'anxiety-panic',
          name: 'Anxiety & Panic',
          messages: [],
          activeUsers: []
        },
        {
          id: 'general-support',
          name: 'General Mental Health',
          messages: [],
          activeUsers: []
        }
      ];
      this.saveRooms(defaultRooms);
    }
  }

  private getRooms(): ChatRoom[] {
    const data = localStorage.getItem(LocalChatService.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveRooms(rooms: ChatRoom[]) {
    localStorage.setItem(LocalChatService.STORAGE_KEY, JSON.stringify(rooms));
    this.notifyListeners(rooms);
  }

  private notifyListeners(rooms: ChatRoom[]) {
    this.listeners.forEach(listener => listener(rooms));
  }

  public subscribe(listener: (rooms: ChatRoom[]) => void) {
    this.listeners.push(listener);
    listener(this.getRooms());
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getCurrentUser(): { id: string; username: string } {
    let user = localStorage.getItem(LocalChatService.USER_KEY);
    if (!user) {
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: `Anonymous_${Math.random().toString(36).substr(2, 4)}`
      };
      localStorage.setItem(LocalChatService.USER_KEY, JSON.stringify(newUser));
      return newUser;
    }
    return JSON.parse(user);
  }

  public sendMessage(roomId: string, message: string): void {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.id === roomId);
    const user = this.getCurrentUser();

    if (room) {
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        message: message.trim(),
        timestamp: Date.now(),
        userId: user.id,
        username: user.username
      };

      room.messages.push(newMessage);
      
      // Keep only last 100 messages per room
      if (room.messages.length > 100) {
        room.messages = room.messages.slice(-100);
      }

      this.saveRooms(rooms);
    }
  }

  public joinRoom(roomId: string): void {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.id === roomId);
    const user = this.getCurrentUser();

    if (room && !room.activeUsers.includes(user.id)) {
      room.activeUsers.push(user.id);
      this.saveRooms(rooms);
    }
  }

  public leaveRoom(roomId: string): void {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.id === roomId);
    const user = this.getCurrentUser();

    if (room) {
      room.activeUsers = room.activeUsers.filter(id => id !== user.id);
      this.saveRooms(rooms);
    }
  }

  public getRoomMessages(roomId: string): ChatMessage[] {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.id === roomId);
    return room ? room.messages : [];
  }

  public clearAllData(): void {
    localStorage.removeItem(LocalChatService.STORAGE_KEY);
    localStorage.removeItem(LocalChatService.USER_KEY);
    this.initializeData();
  }
}
