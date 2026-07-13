'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSent(true);
      sessionStorage.setItem('reset_email', email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-[10%] left-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[30%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '7s', animationDelay: '1s' }} />

      <AnimatedSection className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-primary/20 blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-col items-center text-center gap-2 relative z-10">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2 border border-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">
              {sent
                ? 'A 6-digit reset code has been sent to your Super Admin. Ask them for the code.'
                : 'Enter your email and a 6-digit code will be sent to your Super Admin.'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
              {error && (
                <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium text-white/80">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@haizotech.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading || !email}>
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : 'Send Reset Code'}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-4 relative z-10">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                <p className="text-green-400 text-sm font-medium">Reset code generated!</p>
                <p className="text-muted-foreground text-xs mt-1">Check the backend console or contact your Super Admin for the 6-digit code.</p>
              </div>
              <Button className="w-full" onClick={() => router.push('/forgot-password/verify')}>
                I Have the Code — Continue
              </Button>
            </div>
          )}

          <div className="relative z-10 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3 w-3" />
              Back to login
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
