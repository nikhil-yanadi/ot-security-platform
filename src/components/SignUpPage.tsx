import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Briefcase, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface SignUpPageProps {
  onSuccess: (user: { name: string; email: string; role: string }) => void;
  onNavigateToSignIn: () => void;
  onBackToLanding: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateToSignIn,
  onBackToLanding
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('OT Security Analyst');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }
    if (!organization.trim()) {
      setErrorMessage('Please specify your organization or plant facility.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and re-type.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: fullName.trim(),
        email: email.trim(),
        role: role
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 font-sans selection:bg-orange-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg space-y-4">
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
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Set up access to your industrial security environment.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#131b2e] border border-[#23314d] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-start space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="block text-slate-300 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Maria Vance"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                />
              </div>
            </div>

            {/* Work Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-slate-300 font-medium">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@energy-corp.com"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                />
              </div>
            </div>

            {/* Organization & Role Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Organization */}
              <div className="space-y-1.5">
                <label htmlFor="signup-org" className="block text-slate-300 font-medium">
                  Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="signup-org"
                    type="text"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder="Houston Refining Facility"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                  />
                </div>
              </div>

              {/* Role Selector */}
              <div className="space-y-1.5">
                <label htmlFor="signup-role" className="block text-slate-300 font-medium">
                  Operational Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    id="signup-role"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs cursor-pointer"
                  >
                    <option value="CISO / Security Leader">CISO / Security Leader</option>
                    <option value="SOC Analyst">SOC Analyst</option>
                    <option value="OT Security Analyst">OT Security Analyst</option>
                    <option value="Plant / Site Operator">Plant / Site Operator</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="block text-slate-300 font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="signup-confirm-password" className="block text-slate-300 font-medium">
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="signup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Security Protocol Check */}
            <div className="p-3 rounded-lg bg-[#0b0f17] border border-[#1e293b] text-[11px] text-slate-400 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                Account provisioning grants view-only access to monitored Purdue model levels and requires MFA upon elevated industrial conduit commands.
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              id="signup-submit-btn"
              className="w-full py-2.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Setting Up Industrial Security Workspace...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="text-center pt-2 border-t border-[#1e293b]">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                onClick={onNavigateToSignIn}
                className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
