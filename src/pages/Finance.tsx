import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/UserSidebar';
import { Card } from '@/components/ui/card';
import { IndianRupee, TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';

const Finance = () => {
  const transactions = [
    { id: 1, type: 'credit', amount: 50000, description: 'Plot Sale - Mumbai', date: '2024-11-15' },
    { id: 2, type: 'debit', amount: 2500, description: 'Listing Fee', date: '2024-11-10' },
    { id: 3, type: 'credit', amount: 75000, description: 'Plot Sale - Delhi', date: '2024-11-08' },
    { id: 4, type: 'debit', amount: 1500, description: 'Featuredx Listing', date: '2024-11-05' },
  ];

  const stats = [
    { label: 'Total Earnings', value: '₹1,25,000', icon: IndianRupee, trend: '+12%', positive: true },
    { label: 'Total Spent', value: '₹4,000', icon: CreditCard, trend: '-8%', positive: true },
    { label: 'Current Balance', value: '₹1,21,000', icon: Wallet, trend: '+15%', positive: true },
  ];

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
                  <span className="text-primary">Finance</span>
                </h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className="h-8 w-8 text-primary" />
                        <div className={`flex items-center gap-1 text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {stat.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {stat.trend}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </Card>
                  ))}
                </div>

                {/* Recent Transactions */}
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Recent Transactions</h2>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {transaction.type === 'credit' ? (
                              <TrendingUp className="h-5 w-5" />
                            ) : (
                              <TrendingDown className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <p className={`text-xl font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
};

export default Finance;
