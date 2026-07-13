'use client';

import { usePathname } from 'next/navigation';
import { Bell, Copy, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { fetchWithAuth } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type?: string;
  code?: string;
  userName?: string;
  userEmail?: string;
  expiresAt?: string;
  isRead?: boolean;
}

export function Header() {
  const pathname = usePathname();
  const { user } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5001/api/notifications');
        if (res.ok) {
          const data = await res.json();
          // Map backend format to frontend Notification format if needed
          const mapped = data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: new Date(n.createdAt).toLocaleTimeString(),
            type: n.type,
            isRead: n.isRead,
          }));
          setNotifications(mapped);
          setUnreadCount(mapped.filter((n: any) => !n.isRead).length);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = getSocket();
    if (socket) {
      socket.on('notification', (data: Notification) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, []);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const markAsRead = async (id: string) => {
    try {
      await fetchWithAuth(`http://localhost:5001/api/notifications/${id}/read`, {
        method: 'PATCH',
      });
      setNotifications((prev) => 
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const getBreadcrumb = () => {
    if (pathname === '/') return 'Dashboard';
    const path = pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-16 border-b border-border/50 glass-panel rounded-none border-t-0 border-l-0 border-r-0 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold capitalize">
          {getBreadcrumb()}
        </h2>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        
        <DropdownMenu>
          <DropdownMenuTrigger onClick={() => setUnreadCount(0)} className="relative h-10 w-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors border border-transparent outline-none">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full animate-pulse" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 glass-panel border-white/10" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-medium flex items-center justify-between">
                Notifications
                {unreadCount > 0 && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{unreadCount} new</span>
                )}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuGroup className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
              ) : (
                notifications.map((notif, index) => (
                  <div key={notif.id || index}>
                    {notif.type === 'password_reset' ? (
                      // Special card for password reset codes
                      <div className="p-3 m-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-amber-400">{notif.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          <span className="font-medium text-white/70">{notif.userName}</span> ({notif.userEmail})
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">Requested a password reset</p>
                        {notif.code && (
                          <div className="flex items-center gap-2 bg-black/30 rounded-md px-3 py-2 border border-white/10">
                            <span className="font-mono text-xl font-bold tracking-[0.3em] text-amber-300 flex-1 text-center">
                              {notif.code}
                            </span>
                            <button
                              onClick={() => handleCopyCode(notif.id, notif.code!)}
                              className="text-muted-foreground hover:text-white transition-colors shrink-0"
                              title="Copy code"
                            >
                              {copiedId === notif.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 text-right">{notif.time} · expires in 15 min</p>
                      </div>
                    ) : (
                      <DropdownMenuItem 
                        className={`flex flex-col items-start gap-1 cursor-pointer focus:bg-white/5 ${notif.isRead ? 'opacity-50' : ''}`}
                        onClick={() => { if (!notif.isRead) markAsRead(notif.id); }}
                      >
                        <span className="font-medium text-sm flex items-center gap-2">
                          {notif.title}
                          {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </span>
                        <span className="text-xs text-muted-foreground">{notif.message}</span>
                        <span className="text-xs text-muted-foreground mt-1">{notif.time}</span>
                      </DropdownMenuItem>
                    )}
                    {index < notifications.length - 1 && <DropdownMenuSeparator className="bg-border/50" />}
                  </div>
                ))
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative h-10 w-10 rounded-full flex items-center justify-center border border-border">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt={user?.name || "@user"} className="object-cover" />
            <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

