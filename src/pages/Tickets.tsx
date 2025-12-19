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
import { Ticket, Plus, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Tickets = () => {
  const [tickets] = useState([
    { 
      id: 'TK001', 
      subject: 'Payment Issue', 
      status: 'Open', 
      priority: 'High',
      created: '2024-11-15',
      lastUpdate: '2024-11-16'
    },
    { 
      id: 'TK002', 
      subject: 'Property Verification Delay', 
      status: 'In Progress', 
      priority: 'Medium',
      created: '2024-11-10',
      lastUpdate: '2024-11-14'
    },
    { 
      id: 'TK003', 
      subject: 'Document Upload Error', 
      status: 'Resolved', 
      priority: 'Low',
      created: '2024-11-05',
      lastUpdate: '2024-11-08'
    },
  ]);

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
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-4xl font-bold">
                    My <span className="text-primary">Tickets</span>
                  </h1>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Support Ticket</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input id="subject" placeholder="Brief description of your issue" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <select id="priority" className="w-full border rounded-md p-2">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Provide detailed information about your issue"
                            rows={5}
                          />
                        </div>
                        <Button type="submit" className="w-full">Submit Ticket</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Ticket className="h-6 w-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                            <p className="text-sm text-muted-foreground">Ticket ID: {ticket.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.status === 'Resolved' 
                              ? 'bg-green-100 text-green-700'
                              : ticket.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {ticket.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.priority === 'High'
                              ? 'bg-red-100 text-red-700'
                              : ticket.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{ticket.created}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Update</p>
                          <p className="font-medium">{ticket.lastUpdate}</p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Card>
                  ))}
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

export default Tickets;
