'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react';

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    const email = sessionStorage.getItem('reset_email');
    if (!email) {
      setError('Session expired. Please start the process again.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');

      // Store the reset token for the final step
      sessionStorage.setItem('reset_token', data.resetToken);
      sessionStorage.setItem('reset_role', data.role);
      router.push('/reset-password');
    } catch (err: any) {
      setError(err.message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
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
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Enter Reset Code</h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code provided by your Super Admin. The code expires in 15 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            {error && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-center">
                {error}
              </div>
            )}

            {/* 6-digit code input boxes */}
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  disabled={loading}
                />
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={loading || code.join('').length !== 6}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>) : 'Verify Code'}
            </Button>
          </form>

          <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/forgot-password" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
              <ArrowLeft className="h-3 w-3" />
              Request new code
            </Link>
            <Link href="/login" className="hover:text-primary transition-colors">
              Back to login
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
