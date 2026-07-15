'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { useAppStore } from '@/store/useAppStore';
import { ShieldAlert, Loader2, Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Invalid email or password');
      }

      // Set cookie for middleware
      Cookies.set('haizotech_session', result.token, { expires: 1, path: '/' });
      localStorage.setItem('token', result.token);
      
      // Update global state
      setRole(result.user.role);
      
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-[10%] left-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[30%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '7s', animationDelay: '1s' }} />

      <AnimatedSection className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-primary/20 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="flex flex-col items-center text-center gap-2 relative z-10">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2 border border-primary/20">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Sign in to access the HaizoTech dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 relative z-10">
            {error && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@haizotech.com"
                className="bg-white/5 border-white/10"
                disabled={isSubmitting}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-white/80">
                  Password
                </label>
                <a href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="bg-white/5 border-white/10 pr-10"
                  disabled={isSubmitting}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="relative z-10 text-center mt-2">
            <p className="text-xs text-muted-foreground">
              By logging in, you agree to our strictly enforced internal security policies.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
