import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import {
  ShieldCheck, User, Building, BadgeCheck, Upload, FileText,
  Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, X
} from 'lucide-react';

export default function AuthorityRegisterPage() {
  const { registerAuthority } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    employeeId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    idProofFileName: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file format. Please upload a PDF, JPG, or PNG document.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds the 5MB limit.');
      return;
    }

    setFormData((prev) => ({ ...prev, idProofFileName: file.name }));
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, idProofFileName: '' }));
    setFileError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) return setError('Please enter your full name.');
    if (!formData.designation.trim()) return setError('Please specify your official designation.');
    if (!formData.department.trim()) return setError('Please select or specify your department.');
    if (!formData.employeeId.trim()) return setError('Employee or authority identification number is required.');
    if (!formData.idProofFileName) return setError('Official ID-proof document upload is mandatory.');
    if (!formData.email.trim()) return setError('Official email is required.');
    if (formData.password.length < 6) return setError('Passkey must be at least 6 characters.');
    if (formData.password !== formData.confirmPassword) return setError('Passkeys do not match.');

    try {
      setSubmitting(true);
      await registerAuthority(formData);
      navigate('/authority/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-civic-sand-100/60">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-2">
        <div className="inline-block mb-2">
          <Logo size="lg" to="/" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-civic-navy-900 text-civic-teal-300 border border-civic-navy-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>OFFICIAL PERSONNEL ONBOARDING</span>
        </div>
        <h2 className="text-2xl font-extrabold text-civic-navy-950 tracking-tight">
          Authority Onboarding Registration
        </h2>
        <p className="text-xs text-civic-charcoal-500 max-w-md mx-auto">
          Designated for municipal engineers, zone inspectors, and public works triage officers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border-2 border-civic-navy-900 sm:px-10 space-y-6">
          
          {/* Important Verification Prototype Notice */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Identity Verification Notice (Prototype Policy)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              The frontend prototype does not pretend to automatically verify identity documents. Submitting this form provisions a demo authority session marked as <strong>Pending Verification (Demo Approved)</strong>. Production access requires authorized background clearance through the municipal backend.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Priya Nair"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Official Designation *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g. Ward Executive Engineer"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
                  />
                </div>
              </div>
            </div>

            {/* Department & Employee ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Responsible Department *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Public Works Department (PWD)"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Employee ID / Badge No. *
                </label>
                <input
                  type="text"
                  required
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="e.g. EMP-CIV-9241"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-civic-navy-200 font-mono focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
                />
              </div>
            </div>

            {/* ID Proof Document Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider">
                ID-Proof Document Upload *
              </label>
              <p className="text-[11px] text-civic-charcoal-500">
                Accepted: Official Government/Municipal Department ID Card (PDF, JPG, PNG — Max 5MB).
              </p>

              {formData.idProofFileName ? (
                <div className="flex items-center justify-between p-3 bg-civic-teal-50 border border-civic-teal-300 rounded-lg text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-civic-teal-700 flex-shrink-0" />
                    <span className="font-mono text-civic-teal-900 font-semibold truncate">
                      {formData.idProofFileName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 rounded text-rose-600 hover:bg-rose-50 ml-2"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-civic-navy-200 hover:border-civic-teal-500 rounded-xl cursor-pointer bg-civic-sand-50/50 hover:bg-civic-sand-100 transition-colors">
                  <Upload className="w-6 h-6 text-civic-charcoal-400 mb-1" />
                  <span className="text-xs font-semibold text-civic-navy-900">
                    Click to select official ID-proof file
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/jpg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}

              {fileError && (
                <p className="text-[11px] text-rose-700 font-medium">{fileError}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Official Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="officer@civic.gov"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Department Contact Phone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 94480 00000"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm with Show/Hide toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Passkey *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="w-full text-xs pl-3 pr-9 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
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
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Confirm Passkey *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repeat passkey"
                    className="w-full text-xs pl-3 pr-9 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-civic-navy-950 hover:bg-civic-navy-900 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting Authority Credential...' : 'Register as Municipal Authority'}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-civic-charcoal-500 border-t border-civic-navy-100">
            <span>Already provisioned? </span>
            <Link to="/authority/login" className="font-bold text-civic-teal-700 hover:text-civic-teal-800">
              Authority Portal Sign In &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
