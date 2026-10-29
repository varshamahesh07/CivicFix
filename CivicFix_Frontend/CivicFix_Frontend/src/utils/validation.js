export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v) => /^\+?[0-9]{10,15}$/.test(v.replace(/[\s-]/g, ''));

export function passwordChecks(pw) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
}

export function passwordStrength(pw) {
  const c = passwordChecks(pw);
  const classes = [c.upper, c.lower, c.digit, c.symbol].filter(Boolean).length;
  const score = c.length ? classes : 0; // 0-4
  const label = !pw ? '' : score <= 1 ? 'Weak' : score <= 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong';
  return { score, label };
}

export const isStrongPassword = (pw) => {
  const c = passwordChecks(pw);
  const classes = [c.upper, c.lower, c.digit, c.symbol].filter(Boolean).length;
  return c.length && classes >= 3;
};

const STRONG_MSG = 'Use at least 8 characters, including three of: uppercase, lowercase, number, symbol.';

export function validateLogin(v) {
  const e = {};
  if (!v.identifier.trim()) e.identifier = 'Enter your email or ID.';
  if (!v.password) e.password = 'Enter your password.';
  return e;
}

export function validateCitizenRegistration(v) {
  const e = {};
  const age = Number(v.age);
  if (!v.name.trim()) e.name = 'Enter your full name.';
  if (!v.age) e.age = 'Enter your age.';
  else if (!Number.isInteger(age) || age < 13 || age > 120) e.age = 'Enter a valid age between 13 and 120.';
  if (!v.address.trim()) e.address = 'Enter your residential address.';
  if (!v.email.trim()) e.email = 'Enter your email address.';
  else if (!isEmail(v.email)) e.email = 'Enter a valid email address, such as name@example.com.';
  if (!v.phone.trim()) e.phone = 'Enter your phone number.';
  else if (!isPhone(v.phone)) e.phone = 'Enter 10 to 15 digits. A leading + is allowed.';
  if (!v.password) e.password = 'Create a password.';
  else if (!isStrongPassword(v.password)) e.password = STRONG_MSG;
  if (v.confirmPassword !== v.password) e.confirmPassword = 'Passwords do not match.';
  return e;
}

export function validateAuthorityRegistration(v, file) {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter your full name.';
  if (!v.designation.trim()) e.designation = 'Enter your designation.';
  if (!v.department) e.department = 'Select your department.';
  if (!v.authorityId.trim()) e.authorityId = 'Enter your official employee or authority ID.';
  if (!file) e.idDocument = 'Upload a copy of your official ID proof.';
  if (!v.email.trim()) e.email = 'Enter your official email address.';
  else if (!isEmail(v.email)) e.email = 'Enter a valid email address.';
  if (!v.phone.trim()) e.phone = 'Enter your phone number.';
  else if (!isPhone(v.phone)) e.phone = 'Enter 10 to 15 digits. A leading + is allowed.';
  if (!v.password) e.password = 'Create a password.';
  else if (!isStrongPassword(v.password)) e.password = STRONG_MSG;
  if (v.confirmPassword !== v.password) e.confirmPassword = 'Passwords do not match.';
  return e;
}

export function validateComplaint(v) {
  const e = {};
  const days = v.issueDurationDays.trim();
  if (!v.title.trim()) e.title = 'Give the complaint a short title.';
  else if (v.title.trim().length < 5) e.title = 'The title should be at least 5 characters.';
  if (!v.category) e.category = 'Select a category.';
  if (!v.description.trim()) e.description = 'Describe the problem in your own words.';
  else if (v.description.trim().length < 20) e.description = 'Add a little more detail. Use at least 20 characters.';
  if (!v.address.trim()) e.address = 'Enter the address or street where the problem is.';
  if (!v.locality.trim()) e.locality = 'Enter the city or locality.';
  if (!days) e.issueDurationDays = 'Enter the number of days. Use 0 if it started today.';
  else if (!/^\d+$/.test(days) || Number(days) > 36500) e.issueDurationDays = 'Enter a whole number of days (0 or more).';
  return e;
}

export function validateProfile(v) {
  const e = {};
  const age = Number(v.age);
  if (!v.name.trim()) e.name = 'Enter your full name.';
  if (!v.age) e.age = 'Enter your age.';
  else if (!Number.isInteger(age) || age < 13 || age > 120) e.age = 'Enter a valid age between 13 and 120.';
  if (!v.address.trim()) e.address = 'Enter your residential address.';
  if (!v.phone.trim()) e.phone = 'Enter your phone number.';
  else if (!isPhone(v.phone)) e.phone = 'Enter 10 to 15 digits. A leading + is allowed.';
  return e;
}

export function validateFile(file, { types, maxMB, typeLabel }) {
  if (!types.includes(file.type)) return `Unsupported file type. Please upload ${typeLabel}.`;
  if (file.size > maxMB * 1024 * 1024) return `This file is too large. The limit is ${maxMB} MB.`;
  if (file.size === 0) return 'The selected file is empty.';
  return null;
}
