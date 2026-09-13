import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import MarketingLayout from "./layouts/MarketingLayout";
import About from "./pages/marketing/About";
import Services from "./pages/marketing/Services";
import Contact from "./pages/marketing/Contact";
import FAQ from "./pages/marketing/FAQ";
import Blog from "./pages/marketing/Blog";
import Donate from "./pages/marketing/Donate";
import Privacy from "./pages/marketing/Privacy";
import Terms from "./pages/marketing/Terms";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound.tsx";
import AppLayout from "./layouts/AppLayout";
import UsersPage from "./pages/UsersPage";
import VendorsPage from "./pages/VendorsPage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import ReportsPage from "./pages/ReportsPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import FeedbackPage from "./pages/FeedbackPage";
import SecurityLogPage from "./pages/SecurityLogPage";
import { useCampus } from "./store/campusStore";
import SettingsPage from "./pages/SettingsPage";
import { LanguageProvider } from "./i18n";

const queryClient = new QueryClient();

/** Pulls restaurants + menu items from the Fake Restaurant API on boot. */
const CatalogLoader = () => {
  const loadCatalog = useCampus((s) => s.loadCatalog);
  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CatalogLoader />
      <BrowserRouter>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/security-log" element={<SecurityLogPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
