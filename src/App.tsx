import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BrowsePlots from "./pages/BrowsePlots";
import AddPlot from "./pages/AddPlot";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CreateBlog from "./pages/CreateBlog";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Finance from "./pages/Finance";
import Tickets from "./pages/Tickets";
import Suggestions from "./pages/Suggestions";
import Profit from "./pages/Profit";
import Compare from "./pages/Compare";
import SavedPlots from "./pages/SavedPlots";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [selectedValue, setSelectedValue] = useState('');


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index onSelect={setSelectedValue} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/properties" element={<BrowsePlots selected={selectedValue} />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/saved" element={<SavedPlots />} />
          <Route path="/add-plot" element={<AddPlot />} />
          <Route path="/edit-plot/:id" element={<AddPlot />} />
          <Route path="/profit" element={<Profit />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/create" element={<CreateBlog />} />
          <Route path="/blog/edit/:id" element={<CreateBlog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  )
};

export default App;
