import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { CIVIC_CATEGORIES } from '../../data/mockComplaints';
import {
  Mic, MicOff, Upload, X, MapPin, Navigation, AlertCircle, CheckCircle2,
  Camera, ArrowRight, Loader2, Sparkles, Image as ImageIcon, Eye,
  Clock, Calendar, FileText, Check, ShieldCheck
} from 'lucide-react';

export default function ReportComplaintPage() {
  const { currentUser } = useAuth();
  const { submitComplaint } = useComplaints();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Roads and Potholes',
    description: '',
    address: '',
    location: '',
    nearbyLandmark: '',
    issueDurationDays: '',
    latitude: null,
    longitude: null,
    imagePreview: null
  });

  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef(null);

  // Geolocation state
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState(null);

  // Form review & submission state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const MAX_DESC_CHARS = 600;

  // Initialize browser SpeechRecognition API if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setFormData((prev) => ({
          ...prev,
          description: prev.description ? `${prev.description} ${transcript}`.trim() : transcript.trim()
        }));
      };

      recognition.onerror = (err) => {
        setIsListening(false);
        if (err.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied in your browser settings.');
        } else if (err.error === 'no-speech') {
          setSpeechError('No speech was detected. Please try speaking again.');
        } else {
          setSpeechError(`Voice input error: ${err.error}. You may enter text manually.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceRecording = () => {
    setSpeechError('');
    if (!speechSupported) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your description.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        setSpeechError('Could not start microphone recording. Please type your complaint.');
        setIsListening(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Browser Geolocation Permission & Coordinate Handler
  const handleFetchLocation = () => {
    setGeoMessage(null);
    if (!navigator.geolocation) {
      setGeoMessage({
        type: 'error',
        text: 'Geolocation is not supported by your current browser.'
      });
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: Number(latitude.toFixed(6)),
          longitude: Number(longitude.toFixed(6)),
          location: prev.location || `GPS Verified Location (±${Math.round(accuracy)}m)`
        }));
        setGeoLoading(false);
        setGeoMessage({
          type: 'success',
          text: `Coordinates acquired accurately (±${Math.round(accuracy)}m).`
        });
      },
      (geoError) => {
        setGeoLoading(false);
        let errorMsg = 'Unable to retrieve GPS location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. You may enter the address and locality manually.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is currently unavailable.';
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMsg = 'Location request timed out. Please enter address manually.';
        }
        setGeoMessage({ type: 'error', text: errorMsg });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Selected image exceeds the 5MB file size limit.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imagePreview: null }));
  };

  const handleApplySamplePhoto = () => {
    const samplePhotos = {
      'Roads and Potholes': 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      'Garbage and Waste': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      'Water Supply': 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
      'Drainage and Sewage': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'Streetlights': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
      'Public Safety Hazards': 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
      'Public Infrastructure': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      'Other': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    };
    const chosen = samplePhotos[formData.category] || samplePhotos['Roads and Potholes'];
    setFormData((prev) => ({ ...prev, imagePreview: chosen }));
  };

  // Validate form before opening Review Modal
  const handleOpenReview = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a complaint title.');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 15) {
      setError('Please provide a detailed description (minimum 15 characters).');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please specify the address or street area.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please specify the city, ward, or locality.');
      return;
    }
    const daysNum = Number(formData.issueDurationDays);
    if (formData.issueDurationDays === '' || isNaN(daysNum) || daysNum < 0) {
      setError('Please enter how many days this problem has existed (e.g. 0 for today, 3 for 3 days).');
      return;
    }

    setIsReviewModalOpen(true);
  };

  // Final confirmed submission
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const created = await submitComplaint({
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        address: formData.address.trim(),
        location: formData.location.trim(),
        nearbyLandmark: formData.nearbyLandmark.trim() || 'Nil',
        issueDurationDays: Number(formData.issueDurationDays) || 1,
        latitude: formData.latitude,
        longitude: formData.longitude,
        imagePreview: formData.imagePreview
      });

      setIsReviewModalOpen(false);
      setSubmittedComplaint(created);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please retry.');
      setIsReviewModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Confirmation Screen when successfully submitted
  if (submittedComplaint) {
    return (
      <div className="py-12 bg-civic-sand-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-8 border border-civic-navy-200/90 shadow-xl space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                Status: Registered
              </span>
              <h2 className="text-2xl font-extrabold text-civic-navy-950 mt-3">
                Complaint Reference: {submittedComplaint.id}
              </h2>
              <p className="text-xs text-civic-charcoal-500 mt-1">
                Recorded on {new Date(submittedComplaint.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Assessment Summary Box */}
            <div className="bg-civic-sand-50 rounded-xl p-5 border border-civic-navy-100 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-civic-navy-100 pb-2">
                <span className="text-xs font-bold text-civic-navy-900 uppercase tracking-wider">
                  Automated Intake Assessment
                </span>
                <span className="text-[11px] font-mono text-civic-teal-700 font-semibold">
                  Triage Complete
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-civic-charcoal-500 block text-[11px]">Priority Assigned:</span>
                  <strong className="text-civic-navy-900 font-bold">{submittedComplaint.priority} Priority</strong>
                </div>
                <div>
                  <span className="text-civic-charcoal-500 block text-[11px]">Assessed Risk Score:</span>
                  <strong className="text-civic-navy-900 font-mono font-bold">{submittedComplaint.riskScore} / 100</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-civic-charcoal-500 block text-[11px]">Suggested Department:</span>
                  <strong className="text-civic-navy-900">{submittedComplaint.suggestedDepartment}</strong>
                </div>
              </div>

              {submittedComplaint.duplicateResult?.isDuplicate && (
                <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{submittedComplaint.duplicateResult.note}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-civic-charcoal-600 leading-relaxed">
              Your complaint has been successfully registered and queued for municipal inspection. You will receive updates as the operations team assigns field staff.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/citizen/complaints/${submittedComplaint.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs transition-all"
              >
                <span>Track Complaint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmittedComplaint(null);
                  setFormData({
                    title: '',
                    category: 'Roads and Potholes',
                    description: '',
                    address: '',
                    location: '',
                    nearbyLandmark: '',
                    issueDurationDays: '',
                    latitude: null,
                    longitude: null,
                    imagePreview: null
                  });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-civic-navy-900 bg-civic-sand-100 hover:bg-civic-sand-200 transition-colors"
              >
                Report Another Issue
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-civic-sand-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-civic-teal-700">
            Citizen Action Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
            Report a Civic Problem
          </h1>
          <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-1">
            Provide clear details, location, and photos so municipal authorities can dispatch maintenance crews efficiently.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleOpenReview} className="bg-white rounded-2xl p-6 sm:p-8 border border-civic-navy-200/90 shadow-xs space-y-6">
          
          {/* SECTION A: Complaint Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-civic-navy-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-civic-navy-900 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-civic-navy-950">
                Complaint Description
              </h2>
            </div>

            <div>
              <label htmlFor="comp-title" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1.5">
                Complaint Title *
              </label>
              <input
                id="comp-title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Deep pothole near school gate or Broken water pipeline leaking"
                className="w-full text-xs rounded-lg border border-civic-navy-200 p-3 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 focus:border-civic-teal-600 text-civic-navy-950"
              />
            </div>

            <div>
              <label htmlFor="comp-category" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1.5">
                Issue Category *
              </label>
              <select
                id="comp-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full text-xs font-medium rounded-lg border border-civic-navy-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 text-civic-navy-950"
              >
                {CIVIC_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* SECTION B: Voice Complaint & Detailed Description */}
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                <label htmlFor="comp-description" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider">
                  Detailed Description *
                </label>

                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-civic-teal-50 text-civic-teal-800 hover:bg-civic-teal-100 border border-civic-teal-200'
                  }`}
                  title="Speak into your microphone to convert speech to text"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-civic-teal-700" />
                      <span>Speak Your Complaint</span>
                    </>
                  )}
                </button>
              </div>

              {isListening && (
                <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span className="font-semibold">Listening to microphone... Speak clearly into your device.</span>
                </div>
              )}

              {speechError && (
                <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>{speechError}</span>
                </div>
              )}

              <textarea
                id="comp-description"
                name="description"
                rows={4}
                required
                maxLength={MAX_DESC_CHARS}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the condition, the hazard, how long it has persisted, and any specific landmarks nearby..."
                className="w-full text-xs rounded-lg border border-civic-navy-200 p-3 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 text-civic-navy-950 leading-relaxed"
              />

              <div className="flex justify-between items-center text-[11px] text-civic-charcoal-400 mt-1">
                <span>Text entry is always editable after speech conversion.</span>
                <span className="font-mono">{formData.description.length} / {MAX_DESC_CHARS} chars</span>
              </div>
            </div>
          </div>

          {/* SECTION C: Problem Image */}
          <div className="space-y-3 pt-2 border-t border-civic-navy-100">
            <div className="flex items-center justify-between border-b border-civic-navy-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-civic-navy-900 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-civic-navy-950">
                  Problem Photographic Evidence
                </h2>
              </div>

              {!formData.imagePreview && (
                <button
                  type="button"
                  onClick={handleApplySamplePhoto}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-civic-teal-700 hover:text-civic-teal-900 underline"
                  title="Attach realistic demonstration photo matching selected category"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Use Sample Demo Photo</span>
                </button>
              )}
            </div>

            {formData.imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-civic-navy-200 max-w-md bg-civic-sand-100">
                <img
                  src={formData.imagePreview}
                  alt="Complaint Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-civic-navy-950/80 text-white rounded-full hover:bg-rose-600 transition-colors shadow-xs"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-2 bg-white text-[11px] text-civic-charcoal-500 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-civic-teal-700" />
                    Selected Image Attached
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-rose-600 hover:underline font-semibold"
                  >
                    Remove / Replace
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-civic-navy-200 hover:border-civic-teal-400 rounded-xl cursor-pointer bg-civic-sand-50/50 hover:bg-civic-sand-100/60 transition-all">
                <Camera className="w-8 h-8 text-civic-charcoal-400 mb-2" />
                <span className="text-xs font-semibold text-civic-navy-900">
                  Click to select or capture photograph
                </span>
                <span className="text-[11px] text-civic-charcoal-500 mt-1">
                  Supports JPG, JPEG, PNG, WEBP (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* SECTION D: Location */}
          <div className="space-y-4 pt-2 border-t border-civic-navy-100">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-civic-navy-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-civic-navy-900 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-civic-navy-950">
                  Location & Area Details
                </h2>
              </div>

              {/* Geolocation Button */}
              <button
                type="button"
                onClick={handleFetchLocation}
                disabled={geoLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-civic-teal-700 hover:text-civic-teal-900 bg-civic-teal-50 px-2.5 py-1 rounded-md border border-civic-teal-200 transition-colors disabled:opacity-50"
              >
                {geoLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Acquiring GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5 text-civic-teal-600" />
                    <span>Use My Location</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="comp-address" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Address or Area *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="comp-address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 100ft Inner Ring Road, Sector 4"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="comp-location" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  City or Locality *
                </label>
                <input
                  id="comp-location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Indiranagar, Ward 12"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                />
              </div>
            </div>

            {/* Nearby landmark */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="comp-landmark" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider">
                  Nearby Landmark (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, nearbyLandmark: 'Nil' }))}
                  className="text-[11px] font-semibold text-civic-teal-700 hover:underline"
                >
                  Set as "Nil"
                </button>
              </div>
              <input
                id="comp-landmark"
                name="nearbyLandmark"
                type="text"
                value={formData.nearbyLandmark}
                onChange={handleInputChange}
                placeholder="e.g. Opposite Government Dispensary or enter Nil if no landmarks"
                className="w-full text-xs px-3 py-2 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              />
            </div>

            {geoMessage && (
              <div
                className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  geoMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {geoMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
                <span>{geoMessage.text}</span>
              </div>
            )}

            {formData.latitude && formData.longitude && (
              <div className="flex items-center gap-3 text-[11px] font-mono text-civic-navy-800 bg-civic-sand-100 p-2 rounded border border-civic-navy-200">
                <span>Lat: {formData.latitude}</span>
                <span>•</span>
                <span>Lng: {formData.longitude}</span>
                <span className="text-civic-teal-700 font-sans font-semibold ml-auto">
                  ✓ GPS Coordinates Attached
                </span>
              </div>
            )}
          </div>

          {/* SECTION E: Issue Duration */}
          <div className="space-y-3 pt-2 border-t border-civic-navy-100">
            <div className="flex items-center gap-2 border-b border-civic-navy-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-civic-navy-900 text-white font-mono text-xs flex items-center justify-center font-bold">4</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-civic-navy-950">
                Problem Duration
              </h2>
            </div>

            <div>
              <label htmlFor="comp-duration" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                How long has this problem existed? *
              </label>
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  id="comp-duration"
                  name="issueDurationDays"
                  type="number"
                  min="0"
                  max="3650"
                  required
                  value={formData.issueDurationDays}
                  onChange={handleInputChange}
                  placeholder="e.g. 3"
                  className="w-32 text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 font-mono"
                />
                <span className="text-xs text-civic-charcoal-600 font-medium">Days (approximate)</span>
              </div>
              <span className="text-[11px] text-civic-charcoal-500 mt-1 block">
                Enter 0 if the issue occurred today.
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-civic-navy-100 flex items-center justify-between flex-wrap gap-3">
            <span className="text-[11px] text-civic-charcoal-500">
              Reporter: <strong className="text-civic-navy-900">{currentUser?.name || 'Citizen'}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/citizen/dashboard')}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-civic-charcoal-600 hover:bg-civic-sand-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Review & Submit</span>
              </button>
            </div>
          </div>

        </form>

        {/* SECTION F: Concise Review Modal before Final Submission */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-civic-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-civic-navy-200 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-civic-navy-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-civic-teal-700" />
                  <h3 className="text-base font-bold text-civic-navy-950">
                    Review Complaint Submission
                  </h3>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-1 rounded text-civic-charcoal-400 hover:text-civic-navy-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-civic-charcoal-700 max-h-[60vh] overflow-y-auto pr-1">
                <div className="bg-civic-sand-50 p-3 rounded-xl border border-civic-navy-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-civic-charcoal-400 block">Title</span>
                  <p className="font-bold text-civic-navy-950 text-sm">{formData.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-civic-sand-50 p-2.5 rounded-lg border border-civic-navy-100">
                    <span className="text-[10px] uppercase font-bold text-civic-charcoal-400 block">Category</span>
                    <p className="font-semibold text-civic-navy-900">{formData.category}</p>
                  </div>
                  <div className="bg-civic-sand-50 p-2.5 rounded-lg border border-civic-navy-100">
                    <span className="text-[10px] uppercase font-bold text-civic-charcoal-400 block">Problem Duration</span>
                    <p className="font-semibold text-civic-navy-900">{formData.issueDurationDays} days</p>
                  </div>
                </div>

                <div className="bg-civic-sand-50 p-3 rounded-xl border border-civic-navy-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-civic-charcoal-400 block">Description</span>
                  <p className="text-civic-charcoal-700 leading-relaxed whitespace-pre-line">{formData.description}</p>
                </div>

                <div className="bg-civic-sand-50 p-3 rounded-xl border border-civic-navy-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-civic-charcoal-400 block">Location & Landmark</span>
                  <p className="font-semibold text-civic-navy-950">{formData.address}, {formData.location}</p>
                  <p className="text-[11px] text-civic-charcoal-500">
                    Landmark: <span className="font-medium text-civic-navy-900">{formData.nearbyLandmark || 'Nil'}</span>
                  </p>
                  {formData.latitude && formData.longitude && (
                    <p className="text-[10px] font-mono text-civic-teal-700">GPS: {formData.latitude}, {formData.longitude}</p>
                  )}
                </div>

                {formData.imagePreview && (
                  <div className="bg-civic-sand-50 p-3 rounded-xl border border-civic-navy-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-civic-charcoal-400 block">Attached Photograph</span>
                    <img src={formData.imagePreview} alt="Review Preview" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-civic-navy-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-civic-charcoal-600 hover:bg-civic-sand-100"
                >
                  Review Details / Edit
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Submit Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
