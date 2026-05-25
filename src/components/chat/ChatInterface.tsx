import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Send, Users, Wifi, WifiOff, Settings } from "lucide-react";
import { LocalChatService, ChatMessage, ChatRoom } from "@/services/LocalChatService";

interface ChatInterfaceProps {
  roomId: string;
  roomName: string;
}

export const ChatInterface = ({ roomId, roomName }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [isConnected, setIsConnected] = useState(true); // Local chat is always "connected"
  const [chatService] = useState(() => new LocalChatService());
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize user and join room
    const user = chatService.getCurrentUser();
    setCurrentUser(user);
    chatService.joinRoom(roomId);

    // Load existing messages
    const existingMessages = chatService.getRoomMessages(roomId);
    setMessages(existingMessages);

    // Subscribe to room updates
    const unsubscribe = chatService.subscribe((rooms: ChatRoom[]) => {
      const currentRoom = rooms.find(room => room.id === roomId);
      if (currentRoom) {
        setMessages(currentRoom.messages);
      }
    });

    return () => {
      chatService.leaveRoom(roomId);
      unsubscribe();
    };
  }, [roomId, chatService]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Cannot send message while disconnected",
        variant: "destructive",
      });
      return;
    }

    chatService.sendMessage(roomId, newMessage);
    setNewMessage("");
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwnMessage = (message: ChatMessage) => {
    return currentUser && message.userId === currentUser.id;
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{roomName}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {messages.reduce((users, msg) => {
                if (!users.includes(msg.username)) {
                  users.push(msg.username);
                }
                return users;
              }, [] as string[]).length} users
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <Separator />

      {/* Messages Area */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Welcome to {roomName}</p>
                <p className="text-sm mt-2">Start the conversation by sending a message below.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isOwnMessage(message)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {!isOwnMessage(message) && (
                      <div className="text-xs font-medium mb-1 text-muted-foreground">
                        {message.username}
                      </div>
                    )}
                    <div className="text-sm break-words">{message.message}</div>
                    <div className={`text-xs mt-1 ${
                      isOwnMessage(message) 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <Separator />

      {/* Message Input */}
      <CardContent className="p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Reconnecting..."}
            disabled={!isConnected}
            className="flex-1"
            maxLength={500}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Logged in as: {currentUser?.username}</span>
          <span>{newMessage.length}/500</span>
        </div>
      </CardContent>
    </Card>
  );
};