export default function Logo({ size = 32, showText = true }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <rect width="40" height="40" rx="10" fill="#14274e" />
        <path d="M20 8 L30 12 V19 C30 25 26 29.5 20 32 C14 29.5 10 25 10 19 V12 Z" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M15.5 20.5 L19 24 L25 17" fill="none" stroke="#5eead4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && <span className="logo-text">CivicFix</span>}
    </span>
  );
}
