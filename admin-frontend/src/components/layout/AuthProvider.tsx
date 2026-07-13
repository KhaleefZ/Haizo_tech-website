'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, role, user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  useEffect(() => {
    if (loading) return;

    const isPublicPath = ['/login', '/forgot-password', '/reset-password'].includes(pathname) || pathname.startsWith('/invite');
    if (!user && !isPublicPath) {
      router.replace('/login');
      return;
    }

    // Prevent access to restricted routes based on role
    if (role === 'MANAGER' && pathname.startsWith('/team')) {
      router.replace('/');
    } else if (role === 'DEV') {
      const allowedPaths = ['/', '/kanban', '/calendar', '/announcements', '/blogs', '/settings'];
      const isAllowed = allowedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
      if (!isAllowed) {
        router.replace('/');
      }
    }
  }, [pathname, role, loading, router, user]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
