import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Search, Bell, Zap } from "lucide-react";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <div className="hidden md:flex items-center bg-muted rounded-lg px-3 py-1.5 w-full max-w-md">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full ml-2 placeholder:text-muted-foreground" placeholder="Search teams, players or leagues..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
              <Zap className="w-4 h-4" />
              Live Analysis
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
