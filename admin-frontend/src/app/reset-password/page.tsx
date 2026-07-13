'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LockKeyhole, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('reset_token');
    const storedRole = sessionStorage.getItem('reset_role');
    if (!token) router.replace('/forgot-password');
    setRole(storedRole);
  }, [router]);

  const getRedirectPath = (role: string | null) => {
    // All roles go to dashboard
    return '/';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const resetToken = sessionStorage.getItem('reset_token');
    if (!resetToken) {
      setError('Session expired. Please start the reset process again.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      // Clean up session storage
      sessionStorage.removeItem('reset_email');
      sessionStorage.removeItem('reset_token');
      sessionStorage.removeItem('reset_role');

      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = newPassword.length === 0 ? 0 
    : newPassword.length < 8 ? 1 
    : newPassword.length < 12 ? 2 
    : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-[10%] left-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[30%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '7s', animationDelay: '1s' }} />

      <AnimatedSection className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-primary/20 blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-col items-center text-center gap-2 relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 border transition-colors ${success ? 'bg-green-500/10 border-green-500/20' : 'bg-primary/10 border-primary/20'}`}>
              {success ? <CheckCircle2 className="h-6 w-6 text-green-400" /> : <LockKeyhole className="h-6 w-6 text-primary" />}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {success ? 'Password Reset!' : 'Set New Password'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {success
                ? 'Your password has been updated successfully. Redirecting to login...'
                : 'Create a strong new password for your account.'}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
              {error && (
                <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <label className="text-sm font-medium text-white/80">New Password</label>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/5 border-white/10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password strength bar */}
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className={`h-1 flex-1 rounded-full transition-colors ${strength >= s ? strengthColor[strength] : 'bg-white/10'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {strengthLabel[strength]}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-white/80">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/5 border-white/10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Resetting...</>) : 'Reset Password'}
              </Button>
            </form>
          ) : (
            <div className="relative z-10 flex items-center justify-center">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
