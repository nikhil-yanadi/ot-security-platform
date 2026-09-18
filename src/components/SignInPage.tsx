import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface SignInPageProps {
  onSuccess: (user: { name: string; email: string; role: string }) => void;
  onNavigateToSignUp: () => void;
  onBackToLanding: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSuccess,
  onNavigateToSignUp,
  onBackToLanding
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid work email address (e.g. analyst@industrial-grid.com).');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Derive display name from email or default to SecOps Lead
      const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      onSuccess({
        name: formattedName || 'J. Martinez',
        email: email,
        role: 'OT Security Lead'
      });
    }, 600);
  };

  const handleDemoSignIn = () => {
    setEmail('j.martinez@houston-refinery.local');
    setPassword('••••••••••••');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: 'J. Martinez',
        email: 'j.martinez@houston-refinery.local',
        role: 'SecOps Tier 3 (OT Lead)'
      });
    }, 400);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter your registered work email above first.');
      return;
    }
    setForgotEmailSent(true);
    setTimeout(() => {
      setForgotEmailSent(false);
      setShowForgotPassword(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 font-sans selection:bg-orange-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Back link */}
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to overview</span>
        </button>

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-orange-950/60 border border-orange-500/50 mx-auto flex items-center justify-center text-orange-400 shadow-lg shadow-orange-950/50">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to your OT Security Platform
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#131b2e] border border-[#23314d] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quick Demo Sign In Shortcut */}
          <div className="p-3 rounded-lg bg-[#0b0f17] border border-[#1e293b] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pre-configured Demo Analyst</span>
              </div>
              <div className="text-[11px] text-slate-400">J. Martinez (SecOps Tier 3 OT Lead)</div>
            </div>
            <button
              onClick={handleDemoSignIn}
              type="button"
              className="px-3 py-1.5 rounded bg-orange-600/90 hover:bg-orange-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              One-Click Sign In
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#1e293b] w-full" />
            <span className="bg-[#131b2e] px-2 text-[11px] text-slate-500 font-mono uppercase">
              Or sign in with work credentials
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-start space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Work Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="signin-email" className="block text-slate-300 font-medium">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  autoComplete="email"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="signin-password" className="block text-slate-300 font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your security token or password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-9 pr-10 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password notification */}
            {showForgotPassword && (
              <div className="p-3 rounded-lg bg-[#0b0f17] border border-[#23314d] space-y-2">
                <div className="text-[11px] text-slate-300">
                  Password reset link will be dispatched to your organization's identity provider (IdP).
                </div>
                {forgotEmailSent ? (
                  <div className="text-[11px] text-emerald-400 flex items-center space-x-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Reset link dispatched to {email || 'your email'}.</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleForgotPasswordSubmit}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                  >
                    Send Reset Instructions
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              id="signin-submit-btn"
              className="w-full py-2.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating with Industrial Directory...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="text-center pt-2 border-t border-[#1e293b]">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToSignUp}
                className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
