import { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickQuestions = [
    "What documents do I need?",
    "How to verify plot ownership?",
    "EMI calculator",
    "Legal requirements"
  ];

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col animate-scale-in border-0">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-[#ff5a5f]" />
              </div>
              <div>
                <span className="font-semibold block">Smart Assistant</span>
                <span className="text-xs text-white/70">Always here to help</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="font-medium mb-2 flex items-center gap-2">
                <span className="text-2xl">👋</span>
                <span>Hi! I'm your plot assistant.</span>
              </p>
              <p className="text-muted-foreground text-sm">How can I help you today?</p>
            </div>

            {/* Quick Questions */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">Quick Questions</p>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="w-full text-left text-sm p-3 rounded-lg bg-white border border-gray-200 hover:border-[#ff5a5f] hover:bg-[#ff5a5f]/5 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Type your question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setMessage('')}
                className="flex-1 border-gray-300 focus:border-[#ff5a5f] focus:ring-[#ff5a5f]"
              />
              <Button 
                size="icon" 
                className="shrink-0 bg-[#ff5a5f] hover:bg-[#ff4449] rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#ff5a5f] to-[#ff4449] text-white rounded-full shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,90,95,0.5)] hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>
          </div>
        )}
      </button>
    </>
  );
};

export default FloatingAssistant;
