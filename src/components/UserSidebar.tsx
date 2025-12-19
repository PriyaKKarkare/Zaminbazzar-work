import { LayoutDashboard, MessageSquare, User, Settings, IndianRupee, Ticket, PenLine, ChevronRight, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Messages', url: '/messages', icon: MessageSquare },
  { title: 'My Profile', url: '/profile', icon: User },
  { title: 'Settings', url: '/settings', icon: Settings },
  { title: 'Finance', url: '/finance', icon: IndianRupee },
  { title: 'My Tickets', url: '/tickets', icon: Ticket },
  { title: 'Any Suggestion', url: '/suggestions', icon: PenLine },
];

export function UserSidebar() {
  
  const { user } = useAuth();
  console.log("user", user)
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r h-screen sticky top-0 w-80">
      <SidebarContent className="flex flex-col h-full">
        {/* User Profile Section */}
        <div className="p-4 border-b bg-primary/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {/* {user?.email?.[0].toUpperCase() || 'U'} */}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">
                {/* {loginEmail?.split('@')[0].toUpperCase() || 'USER'} */}
                {user?.user_metadata?.full_name?.toUpperCase() || 'USER'}
              </h2>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <SidebarGroup 
        className="flex-1 overflow-y-auto"
        >
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => navigate(item.url)}
                  // className={`w-full justify-between ${isActive(item.url)
                  //   ? 'bg-primary/10 text-primary font-semibold'
                  //   : 'text-muted-foreground hover:bg-muted'
                  //   }`}
                >
                  <div className="flex items-center gap-5 text-lg b-3">
                    <item.icon className="h-8 w-8" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className="h-8 w-8" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Help Section */}
        <div className="p-4 flex-shrink-0 border-t">
          <div className="bg-primary/5 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Call: 096-9696-9696</p>
              </div>
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <MessageCircle className="h-5 w-5" />
              Chat With Us
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
