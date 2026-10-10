import { NavLink, useLocation } from "react-router-dom";
import { Users, Store, UtensilsCrossed, ShoppingBag, LayoutDashboard, FileBarChart, MessageSquare, ShieldAlert,
  Settings, LogOut } from "lucide-react";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
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

export function AppSidebar() {
  const { pathname } = useLocation();
  const { currentUserId, users, logout } = useCampus();
  const navigate = useNavigate();
  const { t } = useI18n();
  const user = users.find((u) => u.id === currentUserId);
  const role = user?.role ?? "Admin";

  const adminItems = [
    { title: t("shell.dashboard"), url: "/dashboard", icon: LayoutDashboard },
    { title: t("shell.userManagement"), url: "/users", icon: Users },
    { title: t("shell.vendorManagement"), url: "/vendors", icon: Store },
    { title: t("shell.menuManagement"), url: "/menu", icon: UtensilsCrossed },
    { title: t("shell.orderManagement"), url: "/orders", icon: ShoppingBag },
    { title: t("shell.reports"), url: "/reports", icon: FileBarChart },
    { title: t("shell.securityLog"), url: "/security-log", icon: ShieldAlert },
    { title: t("shell.settings"), url: "/settings", icon: Settings },
  ];

  const studentItems = [
    { title: t("shell.browseOrder"), url: "/student", icon: UtensilsCrossed },
    { title: t("shell.feedback"), url: "/feedback", icon: MessageSquare },
    { title: t("shell.settings"), url: "/settings", icon: Settings },
  ];

  const vendorItems = [
    { title: t("shell.vendorDashboard"), url: "/vendor", icon: LayoutDashboard },
    { title: t("shell.settings"), url: "/settings", icon: Settings },
  ];

  const items = role === "Admin" ? adminItems : role === "Vendor" ? vendorItems : studentItems;
  const subtitle =
    role === "Admin" ? t("shell.adminConsole")
    : role === "Vendor" ? t("shell.vendorPortal")
    : role === "Standard" ? t("shell.standardPortal")
    : t("shell.studentPortal");
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
            CE
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sidebar-foreground">{t("shell.brand")}</span>
            <span className="text-xs text-sidebar-foreground/60">{subtitle}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("shell.modules")}</SidebarGroupLabel>
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
                <LogOut className="h-4 w-4 mr-2" /> {t("shell.signOut")}
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
