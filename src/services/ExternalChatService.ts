// Service for connecting to external chat APIs (Socket.io, Pusher, etc.)
import { useToast } from "@/hooks/use-toast";

export interface ExternalChatConfig {
  service: 'socketio' | 'pusher' | 'custom';
  apiKey?: string;
  endpoint?: string;
  cluster?: string; // For Pusher
  appId?: string;   // For Pusher
}

export interface ChatEvent {
  type: 'message' | 'join' | 'leave' | 'typing' | 'error';
  data: any;
  timestamp: number;
  user: {
    id: string;
    username: string;
  };
}

export class ExternalChatService {
  private config: ExternalChatConfig;
  private connection: any = null;
  private listeners: Map<string, ((event: ChatEvent) => void)[]> = new Map();

  constructor(config: ExternalChatConfig) {
    this.config = config;
  }

  // Socket.io implementation
  private async initializeSocketIO(): Promise<void> {
    try {
      // Note: In a real implementation, you'd install socket.io-client
      // npm install socket.io-client
      console.log('Initializing Socket.io connection to:', this.config.endpoint);
      
      // Placeholder for socket.io initialization
      const mockConnection = {
        emit: (event: string, data: any) => {
          console.log('Socket.io emit:', event, data);
        },
        on: (event: string, handler: (data: any) => void) => {
          console.log('Socket.io listening for:', event);
          // In real implementation, this would set up actual event listeners
        },
        disconnect: () => {
          console.log('Socket.io disconnected');
        }
      };

      this.connection = mockConnection;
      
    } catch (error) {
      console.error('Failed to initialize Socket.io:', error);
      throw error;
    }
  }

  // Pusher implementation  
  private async initializePusher(): Promise<void> {
    try {
      // Note: In a real implementation, you'd install pusher-js
      // npm install pusher-js
      console.log('Initializing Pusher connection');
      
      if (!this.config.apiKey || !this.config.cluster) {
        throw new Error('Pusher requires apiKey and cluster');
      }

      // Placeholder for Pusher initialization
      const mockConnection = {
        subscribe: (channel: string) => {
          console.log('Pusher subscribed to channel:', channel);
          return {
            bind: (event: string, handler: (data: any) => void) => {
              console.log('Pusher listening for event:', event);
            }
          };
        },
        trigger: (channel: string, event: string, data: any) => {
          console.log('Pusher trigger:', channel, event, data);
        },
        disconnect: () => {
          console.log('Pusher disconnected');
        }
      };

      this.connection = mockConnection;
      
    } catch (error) {
      console.error('Failed to initialize Pusher:', error);
      throw error;
    }
  }

  public async connect(user: { id: string; username: string }): Promise<void> {
    try {
      switch (this.config.service) {
        case 'socketio':
          await this.initializeSocketIO();
          break;
        case 'pusher':
          await this.initializePusher();
          break;
        case 'custom':
          // Custom WebSocket or other implementation
          console.log('Custom chat service not implemented');
          break;
        default:
          throw new Error(`Unsupported chat service: ${this.config.service}`);
      }

      console.log('Connected to external chat service:', this.config.service);
    } catch (error) {
      console.error('Failed to connect to chat service:', error);
      throw error;
    }
  }

  public sendMessage(roomId: string, message: string, user: { id: string; username: string }): void {
    const event: ChatEvent = {
      type: 'message',
      data: {
        roomId,
        message: message.trim()
      },
      timestamp: Date.now(),
      user
    };

    switch (this.config.service) {
      case 'socketio':
        if (this.connection) {
          this.connection.emit('chat_message', event);
        }
        break;
      case 'pusher':
        if (this.connection) {
          this.connection.trigger(`room-${roomId}`, 'message', event);
        }
        break;
    }
  }

  public joinRoom(roomId: string, user: { id: string; username: string }): void {
    const event: ChatEvent = {
      type: 'join',
      data: { roomId },
      timestamp: Date.now(),
      user
    };

    switch (this.config.service) {
      case 'socketio':
        if (this.connection) {
          this.connection.emit('join_room', event);
        }
        break;
      case 'pusher':
        if (this.connection) {
          const channel = this.connection.subscribe(`room-${roomId}`);
          channel.bind('message', (data: any) => {
            this.notifyListeners('message', data);
          });
          channel.bind('user_joined', (data: any) => {
            this.notifyListeners('join', data);
          });
        }
        break;
    }
  }

  public leaveRoom(roomId: string, user: { id: string; username: string }): void {
    const event: ChatEvent = {
      type: 'leave',
      data: { roomId },
      timestamp: Date.now(),
      user
    };

    switch (this.config.service) {
      case 'socketio':
        if (this.connection) {
          this.connection.emit('leave_room', event);
        }
        break;
      case 'pusher':
        // Pusher doesn't have explicit leave, just unsubscribe
        console.log('Left room:', roomId);
        break;
    }
  }

  private notifyListeners(eventType: string, data: any): void {
    const listeners = this.listeners.get(eventType) || [];
    listeners.forEach(listener => listener(data));
  }

  public subscribe(eventType: string, listener: (event: ChatEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);

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
    if (this.connection) {
      this.connection.disconnect();
      this.connection = null;
    }
    this.listeners.clear();
  }
}

// Configuration helper for different services
export const createChatServiceConfig = (
  service: 'socketio' | 'pusher' | 'custom',
  options: Partial<ExternalChatConfig> = {}
): ExternalChatConfig => {
  const baseConfig: ExternalChatConfig = {
    service,
    ...options
  };

  switch (service) {
    case 'socketio':
      return {
        ...baseConfig,
        endpoint: options.endpoint || 'ws://localhost:3001'
      };
    case 'pusher':
      return {
        ...baseConfig,
        cluster: options.cluster || 'us2',
        // API key would be provided by user
      };
    case 'custom':
      return baseConfig;
    default:
      return baseConfig;
  }
};