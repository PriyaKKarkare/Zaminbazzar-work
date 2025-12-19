import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/UserSidebar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  plot_id: string;
  buyer_id: string;
  seller_id: string;
  updated_at: string;
  plots: {
    title: string;
  };
  lastMessage?: {
    content: string;
    created_at: string;
  };
  unreadCount: number;
  otherPartyName: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchConversations();
  }, [user, authLoading]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
      subscribeToMessages(selectedChat);
    }
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          plots (title)
        `)
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Fetch last message and unread count for each conversation
      const conversationsWithDetails = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user?.id);

          // Fetch other party profile
          const otherPartyId = conv.buyer_id === user?.id ? conv.seller_id : conv.buyer_id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', otherPartyId)
            .maybeSingle();

          return {
            ...conv,
            lastMessage: lastMsg || undefined,
            unreadCount: count || 0,
            otherPartyName: profile?.full_name || 'User'
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user?.id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = (conversationId: string) => {
    channelRef.current = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedChat,
          sender_id: user.id,
          content: message.trim()
        });

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedChat);

      setMessage('');
      fetchConversations(); // Refresh conversation list
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <SidebarProvider>
        <div className="flex w-full">
          <UserSidebar />
          
          <main className="flex-1">
            <div className="border-b bg-background p-4">
              <SidebarTrigger />
            </div>
            
            <section className="py-8">
              <div className="container px-4">
                <h1 className="text-4xl font-bold mb-8">
                  <span className="text-primary">Messages</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                  {/* Conversations List */}
                  <Card className="lg:col-span-1">
                    <div className="p-4 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search conversations..." className="pl-10" />
                      </div>
                    </div>
                    <ScrollArea className="h-[500px]">
                      {conversations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No conversations yet</p>
                        </div>
                      ) : (
                        conversations.map((conv) => (
                          <div
                            key={conv.id}
                            onClick={() => setSelectedChat(conv.id)}
                            className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedChat === conv.id ? 'bg-muted' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center">
                                {conv.otherPartyName[0]}
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold truncate">{conv.otherPartyName}</h3>
                                    <p className="text-xs text-muted-foreground truncate">{conv.plots.title}</p>
                                  </div>
                                  {conv.lastMessage && (
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                      {formatTime(conv.lastMessage.created_at)}
                                    </span>
                                  )}
                                </div>
                                {conv.lastMessage && (
                                  <p className="text-sm text-muted-foreground truncate mt-1">
                                    {conv.lastMessage.content}
                                  </p>
                                )}
                                {conv.unreadCount > 0 && (
                                  <span className="inline-block mt-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    {conv.unreadCount} new
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </ScrollArea>
                  </Card>

                  {/* Chat Area */}
                  <Card className="lg:col-span-2">
                    {selectedChat && selectedConversation ? (
                      <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                          <h2 className="font-semibold">{selectedConversation.otherPartyName}</h2>
                          <p className="text-sm text-muted-foreground">{selectedConversation.plots.title}</p>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-4">
                            {messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`rounded-lg p-3 max-w-[70%] ${
                                    msg.sender_id === user?.id
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                  <span className={`text-xs ${msg.sender_id === user?.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>
                        <div className="p-4 border-t">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type a message..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button size="icon" onClick={handleSendMessage}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Select a conversation to start messaging</p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </section>
          </main>
        </div>
      </SidebarProvider>
      
      <Footer />
    </div>
  );
};

export default Messages;
