// WebSocket-based chat service for connecting to external chat servers
export interface WebSocketMessage {
  type: 'join' | 'leave' | 'message' | 'user_list' | 'error';
  data: any;
  timestamp?: number;
  user?: {
    id: string;
    username: string;
  };
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class WebSocketChatService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private isConnected = false;
  private currentUser: { id: string; username: string } | null = null;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...config
    };
  }

  public connect(user: { id: string; username: string }): Promise<void> {
    this.currentUser = user;
    
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Send user identification
          this.send({
            type: 'join',
            data: { user: this.currentUser }
          });
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type) || [];
    listeners.forEach(listener => listener(message.data));
    
    // Also notify 'all' listeners
    const allListeners = this.listeners.get('all') || [];
    allListeners.forEach(listener => listener(message));
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5)) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      if (this.currentUser) {
        this.connect(this.currentUser).catch(console.error);
      }
    }, this.config.reconnectInterval);
  }

  public send(message: WebSocketMessage): void {
    if (this.ws && this.isConnected) {
      const messageWithTimestamp = {
        ...message,
        timestamp: Date.now(),
        user: this.currentUser
      };
      this.ws.send(JSON.stringify(messageWithTimestamp));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  }

  public sendChatMessage(roomId: string, message: string): void {
    this.send({
      type: 'message',
      data: {
        roomId,
        message: message.trim()
      }
    });
  }

  public joinRoom(roomId: string): void {
    this.send({
      type: 'join',
      data: { roomId }
    });
  }

  public leaveRoom(roomId: string): void {
    this.send({
      type: 'leave',
      data: { roomId }
    });
  }

  public subscribe(eventType: string, listener: (data: any) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.listeners.clear();
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}