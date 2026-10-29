import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, MapPin, Calendar, AlertCircle
} from 'lucide-react';

export default function CitizenRegisterPage() {
  const { registerCitizen } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) return setError('Please enter your full name.');
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 16 || ageNum > 120) {
      return setError('Please enter a valid age (minimum 16 years for community reporting).');
    }
    if (!formData.address.trim()) return setError('Please provide your residential address or locality.');
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return setError('Please provide a valid email address.');
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      return setError('Please provide a valid phone number.');
    }
    if (formData.password.length < 6) {
      return setError('Password must contain at least 6 characters.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (!formData.termsAgreed) {
      return setError('You must acknowledge the citizen reporting code of conduct and privacy terms.');
    }

    try {
      setSubmitting(true);
      await registerCitizen(formData);
      navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-civic-sand-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-block mb-2">
          <Logo size="lg" to="/" />
        </div>
        <h2 className="text-2xl font-extrabold text-civic-navy-950 tracking-tight">
          Citizen Registration
        </h2>
        <p className="text-xs text-civic-charcoal-500">
          Create an account to report civic issues and monitor ground resolution progress
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-civic-navy-200/80 sm:px-10 space-y-6">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 focus:border-civic-teal-600"
                />
              </div>
            </div>

            {/* Age & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="reg-age" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Age *
                </label>
                <div className="relative">
                  <input
                    id="reg-age"
                    name="age"
                    type="number"
                    min="16"
                    max="120"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 28"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="reg-address" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Residential Address / Locality *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 7th Cross, Indiranagar"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ramesh.k@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 focus:border-civic-teal-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 focus:border-civic-teal-600"
                />
              </div>
            </div>

            {/* Password & Confirm with show/hide toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
                    className="w-full text-xs pl-3 pr-9 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
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

              <div>
                <label htmlFor="reg-confirmPassword" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Confirm *
                </label>
                <div className="relative">
                  <input
                    id="reg-confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat"
                    className="w-full text-xs pl-3 pr-9 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-civic-charcoal-400 hover:text-civic-navy-900"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms acknowledgement */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-civic-teal-600 focus:ring-civic-teal-500"
                />
                <span className="text-[11px] text-civic-charcoal-600 leading-snug">
                  I confirm that all complaints submitted will represent genuine neighborhood civic problems observed in person, and I accept the platform terms.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Create Citizen Account'}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-civic-charcoal-500 border-t border-civic-navy-100">
            <span>Already registered? </span>
            <Link to="/citizen/login" className="font-bold text-civic-teal-700 hover:text-civic-teal-800">
              Sign in to portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
