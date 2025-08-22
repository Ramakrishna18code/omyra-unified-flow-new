import { cn } from "@/lib/utils";
import { NavigationSidebar } from "./NavigationSidebar";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <NavigationSidebar
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          className={cn(
            "transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "w-[70px]" : "w-[280px]"
          )}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="h-full px-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hover:bg-muted/50"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="h-9 w-64 pl-9 rounded-md border border-border bg-muted/50 focus:bg-background focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="hover:bg-muted/50"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/50 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">JD</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/50">
            <div className="min-h-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
