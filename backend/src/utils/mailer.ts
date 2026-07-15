import nodemailer from 'nodemailer';
import { config } from '../config/env';

const mailConfigured = Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);

const transporter = mailConfigured
    ? nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure, // true for 465 (SSL), false for 587 (STARTTLS)
        auth: { user: config.smtp.user, pass: config.smtp.pass },
    })
    : null;

export const isMailConfigured = (): boolean => mailConfigured;

interface MailOptions { to: string; subject: string; html: string; text?: string; }

export async function sendMail(opts: MailOptions): Promise<{ sent: boolean; reason?: string }> {
    if (!transporter) {
        const reason = 'SMTP not configured (set SMTP_HOST / SMTP_USER / SMTP_PASS)';
        console.warn(`[MAIL] ${reason}. Skipped "${opts.subject}" -> ${opts.to}`);
        if (!config.isProd) console.log(`[MAIL DEV] ${opts.subject}\n${opts.text || opts.html}`);
        return { sent: false, reason };
    }
    try {
        await transporter.sendMail({
            from: config.mailFrom, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html,
        });
        return { sent: true };
    } catch (err: any) {
        console.error('[MAIL] send failed:', err?.message);
        return { sent: false, reason: err?.message || 'send failed' };
    }
}

const BRAND = '#4E6BFF';
const shell = (inner: string) => `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0E1221;padding:32px;color:#F4F7FA">
    <div style="max-width:480px;margin:0 auto;background:#181C31;border-radius:16px;padding:32px">
      <h2 style="margin:0 0 8px;color:#fff">HaizoTech</h2>
      ${inner}
      <p style="margin-top:24px;font-size:12px;color:#79808A">If you weren't expecting this email, you can ignore it.</p>
    </div>
  </div>`;

export function inviteEmail(name: string, inviteUrl: string) {
    const subject = 'You have been invited to the HaizoTech admin';
    const text = `Hi ${name},\n\nYou've been invited to the HaizoTech admin dashboard. Set your password to activate your account:\n${inviteUrl}\n\nThis link expires in 24 hours.`;
    const html = shell(`
    <p style="color:#F4F7FA">Hi ${name},</p>
    <p style="color:#F4F7FA">You've been invited to the HaizoTech admin dashboard. Click below to set your password and activate your account.</p>
    <a href="${inviteUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:${BRAND};color:#fff;text-decoration:none;border-radius:8px">Set your password</a>
    <p style="font-size:13px;color:#79808A">This link expires in 24 hours. If the button doesn't work, copy this URL:<br>${inviteUrl}</p>
  `);
    return { subject, text, html };
}

export function resetCodeEmail(name: string, code: string) {
    const subject = 'Your HaizoTech password reset code';
    const text = `Hi ${name},\n\nYour password reset code is: ${code}\n\nIt expires in 15 minutes. If you didn't request this, ignore this email.`;
    const html = shell(`
    <p style="color:#F4F7FA">Hi ${name},</p>
    <p style="color:#F4F7FA">Use this code to reset your password. It expires in 15 minutes.</p>
    <div style="margin:16px 0;padding:16px;background:#0E1221;border-radius:8px;text-align:center;font-size:28px;letter-spacing:6px;color:${BRAND};font-weight:700">${code}</div>
  `);
    return { subject, text, html };
}