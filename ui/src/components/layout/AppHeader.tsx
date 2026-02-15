import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sun, Moon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AppHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleAssistant: () => void;
}

export function AppHeader({ isDark, onToggleTheme, onToggleAssistant }: AppHeaderProps) {
  return (
    <header className="h-12 border-b bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-8 w-8" />
        <span className="font-semibold text-foreground tracking-tight">Idea Factory</span>
        <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-widest border-primary text-primary">
          Pilot #001
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onToggleTheme} className="h-8 w-8">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleAssistant} className="h-8 w-8">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
