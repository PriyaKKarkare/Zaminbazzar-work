import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/UserSidebar';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bell, Lock, Globe, Eye, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    publicProfile: true,
    showPhone: false,
    showEmail: true,
  });

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    navigate('/');
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
                  <span className="text-primary">Settings</span>
                </h1>

                <div className="space-y-6">
                  {/* Notifications */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notif">Email Notifications</Label>
                        <Switch
                          id="email-notif"
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, emailNotifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-notif">Push Notifications</Label>
                        <Switch
                          id="push-notif"
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, pushNotifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notif">SMS Notifications</Label>
                        <Switch
                          id="sms-notif"
                          checked={settings.smsNotifications}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, smsNotifications: checked })
                          }
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Privacy */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Privacy</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="public-profile">Public Profile</Label>
                        <Switch
                          id="public-profile"
                          checked={settings.publicProfile}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, publicProfile: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-phone">Show Phone Number</Label>
                        <Switch
                          id="show-phone"
                          checked={settings.showPhone}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, showPhone: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-email">Show Email Address</Label>
                        <Switch
                          id="show-email"
                          checked={settings.showEmail}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, showEmail: checked })
                          }
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Account Actions */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Account</h2>
                    </div>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="mr-2 h-4 w-4" />
                        Language Preferences
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
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

export default Settings;
