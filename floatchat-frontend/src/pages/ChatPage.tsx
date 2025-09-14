import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import ChatBubble from "@/components/ChatBubble";
import MessageInput from "@/components/MessageInput";
import ParticleBackground from "@/components/ParticleBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2, Plus, MessageCircle } from "lucide-react";
import { chatApi } from "@/utils/chatApi"; // ✅ backend API
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

const ChatPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your FloatChat AI assistant. I can help you explore ocean data, answer questions about marine research, and provide insights from vast oceanographic datasets. What would you like to know?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Fetch chat history when page loads
  useEffect(() => {
    (async () => {
      const res = await chatApi.getHistory();
      if (res.success) {
        setChatSessions(res.data.sessions || []);
      }
    })();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(content, currentSessionId);

      if (response.success && response.data) {
        // Assign session ID if new
        if (!currentSessionId && response.data.sessionId) {
          setCurrentSessionId(response.data.sessionId);
        }

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, aiResponse]);

        // Update chat history sidebar
        setChatSessions((prev) => {
          const updated = [
            {
              id: response.data.sessionId,
              title: response.data.title || "New Chat",
              lastMessage: content,
              timestamp: new Date().toLocaleTimeString(),
            },
            ...prev.filter((s) => s.id !== response.data.sessionId),
          ];
          return updated;
        });
      } else {
        throw new Error(response.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Chat API error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });

      // Fallback error message in chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const res = await chatApi.deleteSession(sessionId);
    if (res.success) {
      setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast({
        title: "Chat deleted",
        description: "The session has been removed successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticleBackground />
      <Navbar />

      <div className="flex-1 flex relative z-10">
        {/* Chat History Sidebar */}
        <div className="w-80 glass border-r border-accent/20 hidden lg:flex flex-col">
          <div className="p-4 border-b border-accent/20">
            <Button
              variant="ocean"
              className="w-full"
              onClick={() => {
                setMessages([]);
                setCurrentSessionId(undefined);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <History className="w-4 h-4 mr-2" />
                Chat History
              </h3>

              {chatSessions.map((session) => (
                <Card
                  key={session.id}
                  className="glass border-accent/20 hover:border-accent/40 transition-all cursor-pointer"
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {session.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {session.timestamp}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 glass border-b border-accent/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Ocean AI Assistant
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ask me anything about ocean data and marine science
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}

              {isLoading && (
                <ChatBubble
                  message="Analyzing ocean data..."
                  isUser={false}
                  timestamp={new Date().toLocaleTimeString()}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
