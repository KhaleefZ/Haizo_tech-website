'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Briefcase, 
  Users, 
  Activity, 
  Settings,
  ChevronLeft,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Calendar,
  Megaphone
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { disconnectSocket } from '@/lib/socket';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Kanban Board', href: '/kanban', icon: FolderKanban },
  { name: 'Calendar View', href: '/calendar', icon: Calendar },
  { name: 'Announcements', href: '/announcements', icon: Megaphone },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Works (Portfolio)', href: '/works', icon: ImageIcon },
  { name: 'Blogs', href: '/blogs', icon: FileText },
  { name: 'Inquiries', href: '/inquiries', icon: MessageSquare },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Clients', href: '/clients', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar, role } = useAppStore();

  const handleLogout = () => {
    disconnectSocket();
    Cookies.remove('haizotech_session');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const filteredNavItems = navItems.filter(item => {
    if (role === 'SUPER_ADMIN') return true;
    if (role === 'MANAGER') {
      return item.name !== 'Team';
    }
    if (role === 'DEV') {
      return ['Dashboard', 'Kanban Board', 'Calendar View', 'Announcements', 'Blogs', 'Settings'].includes(item.name);
    }
    return false;
  });

  return (
    <aside
      className={cn(
        "glass-panel rounded-none border-t-0 border-b-0 border-l-0 flex flex-col transition-all duration-300 z-20 relative",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {isSidebarOpen && (
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="HaizoTech Logo" className="h-10 w-10 rounded-md object-contain" />
            <span className="text-xl font-bold text-gradient">
              HaizoTech
            </span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn("h-8 w-8 ml-auto", !isSidebarOpen && "mx-auto")}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isSidebarOpen && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2 custom-scrollbar">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                !isSidebarOpen && "justify-center px-0"
              )}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 flex flex-col gap-4">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full flex items-center justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors",
            !isSidebarOpen && "justify-center px-0"
          )}
          onClick={handleLogout}
          title={!isSidebarOpen ? "Log out" : undefined}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {isSidebarOpen && <span>Log out</span>}
        </Button>
        <div className="text-xs text-muted-foreground text-center">
          {isSidebarOpen ? "© 2026 HaizoTech" : "HT"}
        </div>
      </div>
    </aside>
  );
}
