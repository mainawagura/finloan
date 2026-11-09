import React, { useState } from 'react';
import { LoginPage } from './LoginPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { ResetPasswordPage } from './ResetPasswordPage';
import { EmailVerificationPage } from './EmailVerificationPage';
import { MfaVerificationPage } from './MfaVerificationPage';
import { UnauthorizedPage } from './UnauthorizedPage';
import { SessionExpiredPage } from './SessionExpiredPage';
import { Shield, KeyRound, Mail, Smartphone, AlertOctagon, Clock } from 'lucide-react';

type ScreenKey =
  | 'login'
  | 'forgot-password'
  | 'reset-password'
  | 'email-verification'
  | 'mfa-verification'
  | 'unauthorized'
  | 'session-expired';

export const AuthScreensGalleryPage: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('login');

  const screens = [
    { key: 'login', label: '1. Sign In', icon: Shield },
    { key: 'forgot-password', label: '2. Forgot Password', icon: Mail },
    { key: 'reset-password', label: '3. Reset Password', icon: KeyRound },
    { key: 'email-verification', label: '4. Email Verification', icon: Mail },
    { key: 'mfa-verification', label: '5. MFA Verification', icon: Smartphone },
    { key: 'unauthorized', label: '6. 403 Access Denied', icon: AlertOctagon },
    { key: 'session-expired', label: '7. Session Expired', icon: Clock },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Authentication Screens Showcase (Section 9.2)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Preview each of the mandatory enterprise security screens specified in Phase 1.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {screens.map((s) => {
            const isCurrent = activeScreen === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setActiveScreen(s.key as ScreenKey)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isCurrent
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Current Showcase Screen */}
      <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80">
        {activeScreen === 'login' && <LoginPage />}
        {activeScreen === 'forgot-password' && <ForgotPasswordPage />}
        {activeScreen === 'reset-password' && <ResetPasswordPage />}
        {activeScreen === 'email-verification' && <EmailVerificationPage />}
        {activeScreen === 'mfa-verification' && <MfaVerificationPage />}
        {activeScreen === 'unauthorized' && <UnauthorizedPage />}
        {activeScreen === 'session-expired' && <SessionExpiredPage />}
      </div>
    </div>
  );
};
