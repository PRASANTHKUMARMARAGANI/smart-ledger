/**
 * SmartLedger Real Authentication & OTP Email Verification Engine
 * Handles user account registration, 6-digit OTP verification, password setup, and Supabase user storage.
 */

import { supabase, isSupabaseConfigured } from './supabase';

export type UserRole = 'Chartered Accountant' | 'Finance Manager' | 'SMB Client';

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface OTPRecord {
  code: string;
  expiresAt: number;
}

const STORAGE_USERS_KEY = 'smart_ledger_registered_users_v1';
const STORAGE_CURRENT_USER = 'ledger_agent_auth';

// Pre-registered initial CA account
const DEFAULT_CA_USER: UserAccount = {
  id: 'usr_ca_alex',
  email: 'alex.morgan@apexaccounting.com',
  password: 'Ledger2026!',
  fullName: 'Alex Morgan, CA',
  role: 'Chartered Accountant',
  isVerified: true,
  createdAt: '2026-09-10T10:00:00Z',
};

// Memory cache for active OTPs (email -> OTPRecord)
const otpCache = new Map<string, OTPRecord>();

/**
 * Gets all registered users from Supabase or localStorage
 */
export async function getRegisteredUsers(): Promise<UserAccount[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data && data.length > 0) {
        return data.map((u) => ({
          id: u.id,
          email: u.email,
          password: u.password,
          fullName: u.full_name,
          role: u.role as UserRole,
          isVerified: u.is_verified,
          createdAt: u.created_at,
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch users from Supabase, using local fallback', e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_USERS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return [DEFAULT_CA_USER];
}

/**
 * Generates and sends a 6-digit OTP verification code to the user's real email inbox
 */
export async function sendOtpToEmail(email: string): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minute expiry

  otpCache.set(normalizedEmail, { code, expiresAt });

  try {
    const response = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, code }),
    });

    const data = await response.json();

    if (data.success && data.delivered) {
      return {
        success: true,
        message: `A 6-digit real-time OTP verification code was sent to ${normalizedEmail}. Please check your email inbox and spam folder.`,
      };
    } else if (data.error) {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (e) {
    console.error('Failed to dispatch OTP email via API:', e);
  }

  return {
    success: true,
    message: `A 6-digit OTP code was generated for ${normalizedEmail}. Please configure SMTP_USER and SMTP_PASS in .env.local for email inbox delivery.`,
  };
}

/**
 * Verifies if the 6-digit OTP entered matches the active OTP for the email
 */
export async function verifyOtp(email: string, enteredCode: string): Promise<{ valid: boolean; reason?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const record = otpCache.get(normalizedEmail);

  if (!record) {
    return { valid: false, reason: 'No active OTP found for this email. Please click "Resend OTP" to receive a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    otpCache.delete(normalizedEmail);
    return { valid: false, reason: 'OTP verification code has expired. Please request a new code.' };
  }

  if (record.code !== enteredCode.trim()) {
    return { valid: false, reason: 'Invalid 6-digit OTP verification code. Please check your email inbox and try again.' };
  }

  // Clear OTP on successful verification
  otpCache.delete(normalizedEmail);
  return { valid: true };
}

/**
 * Registers a new verified user account and stores in Supabase PostgreSQL & localStorage
 */
export async function registerUser(account: Omit<UserAccount, 'id' | 'createdAt' | 'isVerified'>): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const users = await getRegisteredUsers();
  const normalizedEmail = account.email.toLowerCase().trim();

  // Check if email already registered
  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
  }

  const newUser: UserAccount = {
    id: `usr_${Date.now()}`,
    email: normalizedEmail,
    password: account.password,
    fullName: account.fullName,
    role: account.role,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [newUser, ...users];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('users').insert([{
        id: newUser.id,
        email: newUser.email,
        password: newUser.password,
        full_name: newUser.fullName,
        role: newUser.role,
        is_verified: true,
        created_at: newUser.createdAt,
      }]);
    } catch (e) {
      console.error('Failed to insert user into Supabase', e);
    }
  }

  return { success: true, user: newUser };
}

/**
 * Authenticates a user with Email + Password against registered accounts
 */
export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const users = await getRegisteredUsers();
  const normalizedEmail = email.toLowerCase().trim();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || (user.password && user.password !== password)) {
    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials and try again.',
    };
  }

  // Set current logged in user session
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      STORAGE_CURRENT_USER,
      JSON.stringify({
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        authenticated: true,
      })
    );
  }

  return { success: true, user };
}

/**
 * Gets the current logged in user profile
 */
export function getCurrentUserSession(): { email: string; fullName: string; role: string } | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return null;
}

/**
 * Updates the logged-in user profile details (fullName, role, password) in localStorage & Supabase
 */
export async function updateUserProfile(
  email: string,
  updates: { fullName?: string; role?: UserRole; password?: string }
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Update in local users array
  if (typeof window !== 'undefined') {
    const savedUsers = localStorage.getItem(STORAGE_USERS_KEY);
    if (savedUsers) {
      try {
        const users: UserAccount[] = JSON.parse(savedUsers);
        const userIdx = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
        if (userIdx !== -1) {
          if (updates.fullName) users[userIdx].fullName = updates.fullName;
          if (updates.role) users[userIdx].role = updates.role;
          if (updates.password) users[userIdx].password = updates.password;
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Update active session object
    const savedSession = localStorage.getItem(STORAGE_CURRENT_USER);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.email && session.email.toLowerCase() === normalizedEmail) {
          if (updates.fullName) session.fullName = updates.fullName;
          if (updates.role) session.role = updates.role;
          localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(session));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  // 3. Update in Supabase cloud PostgreSQL table
  if (isSupabaseConfigured()) {
    try {
      const dbUpdates: Record<string, string> = {};
      if (updates.fullName) dbUpdates.full_name = updates.fullName;
      if (updates.role) dbUpdates.role = updates.role;
      if (updates.password) dbUpdates.password = updates.password;

      await supabase.from('users').update(dbUpdates).eq('email', normalizedEmail);
    } catch (e) {
      console.warn('Supabase profile update notice:', e);
    }
  }

  return { success: true };
}
