import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Search, Bell, Menu } from "lucide-react";
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
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:flex flex-shrink-0">
        <DashboardSidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-[2px] z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <DashboardSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[57px] border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors pressable"
              aria-label="Open navigation"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            <div className="hidden md:flex items-center gap-2.5 bg-muted/60 rounded-md px-3 py-1.5 w-full max-w-xs border border-border/40 hover:border-border transition-colors focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
              <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full placeholder:text-muted-foreground/60"
                placeholder="Search teams, players, events..."
                type="text"
              />
              <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground/50 border border-border rounded px-1 py-0.5 flex-shrink-0">
                Ctrl K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <span className="hidden sm:inline truncate max-w-[80px]">{timezoneLabel}</span>
                  <span className="sm:hidden text-xs">TZ</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto scrollbar-thin w-52">
                {timezones.map((tz) => (
                  <DropdownMenuItem
                    key={tz.value}
                    onClick={() => setTimezone(tz.value)}
                    className={timezone === tz.value ? "bg-primary/8 text-primary font-medium" : ""}
                  >
                    {tz.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="relative w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors pressable">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-screen-2xl mx-auto p-5 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
