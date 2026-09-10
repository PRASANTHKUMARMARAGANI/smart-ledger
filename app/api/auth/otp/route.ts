import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP code are required.' },
        { status: 400 }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">SmartLedger Email Verification</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">Your 6-digit real-time OTP verification code is:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; text-align: center; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #64748b; font-size: 12px; line-height: 1.4;">This verification code expires in 5 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">SmartLedger Platform • Secure Authentication</p>
      </div>
    `;

    let delivered = false;

    // 1. Try Supabase Auth OTP if configured
    if (isSupabaseConfigured()) {
      try {
        const { error: supaErr } = await supabase.auth.signInWithOtp({ email });
        if (!supaErr) {
          console.log(`[SUPABASE AUTH] Triggered OTP verification email via Supabase for ${email}`);
          delivered = true;
        } else {
          console.warn('[SUPABASE AUTH OTP NOTICE]', supaErr.message);
        }
      } catch (e) {
        console.warn('[SUPABASE AUTH OTP EXCEPTION]', e);
      }
    }

    // 2. Try Resend API if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'SmartLedger <onboarding@resend.dev>',
            to: [email],
            subject: `[SmartLedger] Your 6-Digit Real-Time Verification Code: ${code}`,
            html: emailHtml,
          }),
        });

        if (resendRes.ok) {
          delivered = true;
        }
      } catch (resendErr) {
        console.warn('Resend email dispatch attempt failed:', resendErr);
      }
    }

    // 3. Try Nodemailer SMTP
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000,
          socketTimeout: 10000,
        });

        await transporter.sendMail({
          from: `"SmartLedger Security" <${smtpUser}>`,
          to: email,
          subject: `[SmartLedger] Your 6-Digit Real-Time Verification Code: ${code}`,
          html: emailHtml,
        });

        delivered = true;
      } catch (smtpErr) {
        console.error('[SMTP DISPATCH ERROR]', smtpErr);
      }
    }

    if (delivered) {
      return NextResponse.json({
        success: true,
        delivered: true,
        message: `A 6-digit real-time OTP verification code was sent to ${email}. Check your email inbox and spam folder.`,
      });
    }

    console.warn(`[SMTP NOTICE] Email dispatch attempted for ${email}. Check server credentials if not delivered.`);
    return NextResponse.json({
      success: true,
      delivered: false,
      message: `A 6-digit real-time OTP verification code has been generated for ${email}.`,
    });
  } catch (error) {
    console.error('Failed to process OTP email request:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

