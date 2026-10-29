import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import { Lock, Mail, AlertCircle, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';

export default function CitizenLoginPage() {
  const { loginCitizen, quickDemoSwitch } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please provide your registered email or phone number and password.');
      return;
    }

    try {
      setSubmitting(true);
      await loginCitizen(identifier.trim(), password);
      navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    quickDemoSwitch('citizen');
    navigate('/citizen/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-civic-sand-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-block mb-2">
          <Logo size="lg" to="/" />
        </div>
        <h2 className="text-2xl font-extrabold text-civic-navy-950 tracking-tight">
          Citizen Portal Sign In
        </h2>
        <p className="text-xs text-civic-charcoal-500">
          Access your reported issues, track ground resolution, and request new repairs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-civic-navy-200/80 sm:px-10 space-y-6">
          
          {/* Quick Demo Access Box */}
          <div className="bg-civic-teal-50 border border-civic-teal-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-civic-teal-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-civic-teal-700" />
                Reviewer Demo Access
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-civic-teal-200 text-civic-teal-900 font-semibold">
                Instant Fill
              </span>
            </div>
            <p className="text-civic-teal-800 text-[11px] leading-relaxed">
              Click below to immediately log in as demo citizen <strong>Aarav Sharma</strong> without typing credentials.
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full mt-1 py-2 px-3 rounded-lg text-xs font-bold text-white bg-civic-teal-700 hover:bg-civic-teal-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Sign In as Demo Citizen (Aarav Sharma)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-civic-navy-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-civic-charcoal-400 font-medium">
                Or enter citizen credentials
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="citizen-identifier" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Email or Phone Number
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="citizen-identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="aarav.sharma@example.com or +91 98765 43210"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 focus:border-civic-teal-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="citizen-password" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="citizen-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-9 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 focus:border-civic-teal-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-civic-charcoal-400 hover:text-civic-navy-900"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-civic-navy-900 hover:bg-civic-navy-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Citizen Account'}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-civic-charcoal-500 border-t border-civic-navy-100">
            <span>New citizen user? </span>
            <Link to="/citizen/register" className="font-bold text-civic-teal-700 hover:text-civic-teal-800">
              Register an account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
