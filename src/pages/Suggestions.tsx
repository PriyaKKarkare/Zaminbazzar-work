import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/UserSidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PenLine, Send, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Suggestions = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    category: 'feature',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Suggestion Submitted',
      description: 'Thank you for your feedback! We will review it soon.',
    });
    setFormData({ title: '', category: 'feature', description: '' });
  };

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
              <div className="container px-4 max-w-2xl">
                <h1 className="text-4xl font-bold mb-8">
                  Any <span className="text-primary">Suggestion</span>
                </h1>

                <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="h-12 w-12 text-primary flex-shrink-0" />
                    <div>
                      <h2 className="text-xl font-bold mb-2">We Value Your Feedback</h2>
                      <p className="text-muted-foreground">
                        Help us improve by sharing your ideas, suggestions, and feedback. 
                        Your input shapes the future of our platform.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <PenLine className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Submit Your Suggestion</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Brief summary of your suggestion"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full border rounded-md p-2 bg-background"
                        required
                      >
                        <option value="feature">Feature Request</option>
                        <option value="improvement">Improvement</option>
                        <option value="bug">Bug Report</option>
                        <option value="ui">UI/UX Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed information about your suggestion..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={8}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Suggestion
                    </Button>
                  </form>
                </Card>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Guidelines for Suggestions</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Be clear and specific about what you're suggesting</li>
                    <li>Explain why this would be valuable</li>
                    <li>Include examples if possible</li>
                    <li>One suggestion per submission</li>
                  </ul>
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

export default Suggestions;
