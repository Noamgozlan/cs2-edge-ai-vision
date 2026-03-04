import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Search, Bell, Zap, Menu, X, Clock } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTimezone } from "@/contexts/TimezoneContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { timezone, timezoneLabel, setTimezone, timezones } = useTimezone();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <DashboardSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 sm:h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold hidden sm:block">Dashboard</h2>
            <div className="hidden md:flex items-center bg-muted rounded-lg px-3 py-1.5 w-full max-w-md">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full ml-2 placeholder:text-muted-foreground"
                placeholder="Search teams, players or leagues..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Timezone Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{timezoneLabel}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto w-56">
                {timezones.map((tz) => (
                  <DropdownMenuItem
                    key={tz.value}
                    onClick={() => setTimezone(tz.value)}
                    className={timezone === tz.value ? "bg-primary/10 text-primary font-bold" : ""}
                  >
                    {tz.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors relative">
              <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
              <Zap className="w-4 h-4" />
              Live Analysis
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
