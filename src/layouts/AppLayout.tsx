import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AppLayout() {
  const { currentUserId, users, logout } = useCampus();
  const user = users.find((u) => u.id === currentUserId);

  // Any authenticated user can use the shell; pages enforce their own role.
  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="font-semibold text-foreground">Campus Eats</h1>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Not signed in</span>
              )}
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}