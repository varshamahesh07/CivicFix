import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, KeyRound, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function AuthorityLoginPage() {
  const { loginAuthority, quickDemoSwitch } = useAuth();
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
      setError('Authority credential identifier and passkey are required.');
      return;
    }

    try {
      setSubmitting(true);
      await loginAuthority(identifier.trim(), password);
      navigate('/authority/dashboard');
    } catch (err) {
      setError(err.message || 'Authorization failed. Verify departmental credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    quickDemoSwitch('authority');
    navigate('/authority/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-civic-sand-100/60">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-block mb-2">
          <Logo size="lg" to="/" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-civic-navy-900 text-civic-teal-300 border border-civic-navy-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CIVIC OPERATIONS DESK</span>
        </div>
        <h2 className="text-2xl font-extrabold text-civic-navy-950 tracking-tight">
          Municipal Authority Access
        </h2>
        <p className="text-xs text-civic-charcoal-500">
          Restricted operations portal for departmental officers and triage managers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border-2 border-civic-navy-900 sm:px-10 space-y-6">
          
          {/* Reviewer Quick Access Callout */}
          <div className="bg-civic-navy-950 text-white rounded-xl p-4 text-xs space-y-2 border border-civic-navy-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-civic-teal-300 flex items-center gap-1.5 font-mono text-[11px]">
                <KeyRound className="w-4 h-4 text-civic-teal-400" />
                Reviewer Authority Mode
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-civic-navy-800 text-civic-teal-200">
                Evaluation Access
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Instantly enter the Operations Workspace as <strong>Commissioner Priya Nair</strong> (Senior Municipal Operations Command) without manual credentials.
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full mt-1 py-2 px-3 rounded-lg text-xs font-bold text-civic-navy-950 bg-civic-teal-400 hover:bg-civic-teal-300 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Authorize as Commissioner Priya Nair (Demo)</span>
              <ArrowRight className="w-3.5 h-3.5 text-civic-navy-950" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-civic-navy-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-civic-charcoal-400 font-medium font-mono text-[11px]">
                Or enter departmental credentials
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
              <label htmlFor="auth-email" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Authority Email or Employee ID
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="auth-email"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="priya.nair@civic.gov or EMP-CIV-8842"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800 focus:border-civic-navy-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Passkey
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-9 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800 focus:border-civic-navy-800"
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
              className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-civic-navy-950 hover:bg-civic-navy-900 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Verifying Departmental Clearance...' : 'Authenticate Authority Session'}
            </button>
          </form>

          <div className="pt-3 text-center text-xs text-civic-charcoal-600 border-t border-civic-navy-100 flex items-center justify-between">
            <span>New municipal personnel?</span>
            <Link
              to="/authority/register"
              className="font-bold text-civic-teal-700 hover:text-civic-teal-900 inline-flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Authority ID &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
