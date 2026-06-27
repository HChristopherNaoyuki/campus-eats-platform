import { NavLink, useLocation } from "react-router-dom";
import { Users, Store, UtensilsCrossed, ShoppingBag, LayoutDashboard, FileBarChart, MessageSquare, ShieldAlert, LogOut } from "lucide-react";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "User Management", url: "/users", icon: Users },
  { title: "Vendor Management", url: "/vendors", icon: Store },
  { title: "Menu Management", url: "/menu", icon: UtensilsCrossed },
  { title: "Order Management", url: "/orders", icon: ShoppingBag },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "Security Log", url: "/security-log", icon: ShieldAlert },
];

const studentItems = [
  { title: "Browse & Order", url: "/student", icon: UtensilsCrossed },
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
];

const vendorItems = [
  { title: "Vendor Dashboard", url: "/vendor", icon: LayoutDashboard },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { currentUserId, users, logout } = useCampus();
  const navigate = useNavigate();
  const user = users.find((u) => u.id === currentUserId);
  const role = user?.role ?? "Admin";
  const items = role === "Admin" ? adminItems : role === "Vendor" ? vendorItems : studentItems;
  const subtitle =
    role === "Admin" ? "Admin Console"
    : role === "Vendor" ? "Vendor Portal"
    : role === "Standard" ? "Standard Portal"
    : "Student Portal";
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
            CE
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sidebar-foreground">Campus Eats</span>
            <span className="text-xs text-sidebar-foreground/60">{subtitle}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user && (
          <SidebarGroup>
            <SidebarGroupContent className="p-2 space-y-2 group-data-[collapsible=icon]:hidden">
              <div className="text-xs text-sidebar-foreground/70 px-2">
                <div className="font-medium text-sidebar-foreground">{user.name}</div>
                <div className="font-mono text-[10px] break-all">{user.id}</div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { logout(); navigate("/login"); }}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}