import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Settings, Wifi, Server, Zap } from "lucide-react";

interface ChatSelectorProps {
  onRoomSelect: (roomId: string, roomName: string) => void;
}

const chatRooms = [
  {
    id: "depression-support",
    name: "Depression Support",
    description: "Support for those dealing with depression",
    activeUsers: 23,
    category: "mood"
  },
  {
    id: "anxiety-panic",
    name: "Anxiety & Panic",
    description: "Help with anxiety and panic disorders",
    activeUsers: 31,
    category: "anxiety"
  },
  {
    id: "ptsd-recovery",
    name: "PTSD Recovery",
    description: "Recovery-focused support for trauma survivors",
    activeUsers: 12,
    category: "trauma"
  },
  {
    id: "general-support",
    name: "General Mental Health",
    description: "Open discussions about mental wellness",
    activeUsers: 45,
    category: "general"
  }
];

export const ChatSelector = ({ onRoomSelect }: ChatSelectorProps) => {
  const [chatMode, setChatMode] = useState<'local' | 'websocket' | 'external'>('local');
  const [externalConfig, setExternalConfig] = useState({
    service: 'socketio',
    endpoint: '',
    apiKey: ''
  });
  const { toast } = useToast();

  const handleRoomJoin = (roomId: string, roomName: string) => {
    if (chatMode === 'external' && !externalConfig.endpoint && !externalConfig.apiKey) {
      toast({
        title: "Configuration Required",
        description: "Please configure your external chat service first",
        variant: "destructive",
      });
      return;
    }
    
    onRoomSelect(roomId, roomName);
  };

  const handleExternalConfig = () => {
    if (externalConfig.service === 'socketio' && !externalConfig.endpoint) {
      toast({
        title: "Missing Configuration",
        description: "Please provide a WebSocket endpoint for Socket.io",
        variant: "destructive",
      });
      return;
    }
    
    if (externalConfig.service === 'pusher' && !externalConfig.apiKey) {
      toast({
        title: "Missing Configuration", 
        description: "Please provide an API key for Pusher",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configuration Saved",
      description: `${externalConfig.service} settings have been saved`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Chat Mode Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Chat Configuration</span>
          </CardTitle>
          <CardDescription>
            Choose your chat backend implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Local Storage Option */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                chatMode === 'local' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => setChatMode('local')}
            >
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">Local Storage</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Browser-based chat (demo mode)
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                No Setup Required
              </Badge>
            </div>

            {/* WebSocket Option */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                chatMode === 'websocket' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => setChatMode('websocket')}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Wifi className="w-4 h-4" />
                <span className="font-medium">WebSocket</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time WebSocket connection
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                Server Required
              </Badge>
            </div>

            {/* External Service Option */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                chatMode === 'external' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => setChatMode('external')}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Server className="w-4 h-4" />
                <span className="font-medium">External API</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Socket.io, Pusher, or custom API
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                API Key Required
              </Badge>
            </div>
          </div>

          {/* External Service Configuration */}
          {chatMode === 'external' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure External Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>External Chat Service Configuration</DialogTitle>
                  <DialogDescription>
                    Set up your external chat service connection
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="service">Service Type</Label>
                    <Select 
                      value={externalConfig.service} 
                      onValueChange={(value) => setExternalConfig(prev => ({ ...prev, service: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="socketio">Socket.io</SelectItem>
                        <SelectItem value="pusher">Pusher</SelectItem>
                        <SelectItem value="custom">Custom WebSocket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {externalConfig.service === 'socketio' && (
                    <div>
                      <Label htmlFor="endpoint">WebSocket Endpoint</Label>
                      <Input
                        id="endpoint"
                        placeholder="ws://localhost:3001"
                        value={externalConfig.endpoint}
                        onChange={(e) => setExternalConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                      />
                    </div>
                  )}

                  {externalConfig.service === 'pusher' && (
                    <div>
                      <Label htmlFor="apiKey">Pusher API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Your Pusher API key"
                        value={externalConfig.apiKey}
                        onChange={(e) => setExternalConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                    </div>
                  )}

                  <Button onClick={handleExternalConfig} className="w-full">
                    Save Configuration
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Room Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chatRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{room.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {room.activeUsers} active
                </Badge>
              </div>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleRoomJoin(room.id, room.name)}
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Room
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <h4 className="font-medium">Current Mode: {chatMode}</h4>
            {chatMode === 'local' && (
              <p className="text-muted-foreground">
                Messages are stored in your browser's local storage. Perfect for demos and testing.
              </p>
            )}
            {chatMode === 'websocket' && (
              <p className="text-muted-foreground">
                Connects to a WebSocket server for real-time communication. Requires a backend server.
              </p>
            )}
            {chatMode === 'external' && (
              <p className="text-muted-foreground">
                Uses external chat services like Socket.io or Pusher for production-ready messaging.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};