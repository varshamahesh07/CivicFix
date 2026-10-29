import { DEPARTMENTS } from '../utils/constants';

// Rule-based DEMO analysis. These are not verified AI predictions. Replace the body with a
// call to the Flask analysis endpoint (image classification, NLP, duplicates, risk scoring).
export const ANALYSIS_NOTICE =
  'Rule-based demo analysis. These are estimates, not verified AI predictions.';

const URGENT = ['injur', 'accident', 'electric', 'live wire', 'fire', 'gas leak', 'flood', 'collapse', 'school', 'hospital', 'child'];
const SERIOUS = ['deep', 'large', 'blocked', 'overflow', 'no water', 'burst', 'unsafe', 'dark'];

const tokens = (s) => new Set(s.toLowerCase().split(/\W+/).filter((w) => w.length > 3));

function similarity(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  const shared = [...A].filter((x) => B.has(x)).length;
  return shared / new Set([...A, ...B]).size;
}

export async function analyzeComplaint({ title, description, category, issueDurationDays, locality, hasImage, existing = [] }) {
  await new Promise((r) => setTimeout(r, 600)); // simulates processing time

  const text = `${title} ${description}`.toLowerCase();
  let score = 0;
  if (URGENT.some((k) => text.includes(k))) score += 2;
  if (SERIOUS.some((k) => text.includes(k))) score += 1;
  if (issueDurationDays >= 14) score += 1;
  if (category === 'Public Safety') score += 1;

  const priority = score >= 3 ? 'Critical' : score === 2 ? 'High' : score === 1 ? 'Medium' : 'Low';

  const match = existing.find(
    (c) =>
      c.category === category &&
      (c.locality || '').toLowerCase() === locality.trim().toLowerCase() &&
      similarity(c.title, title) >= 0.5
  );

  return {
    classification: category,
    priority,
    suggestedDepartment: DEPARTMENTS[category] ?? 'General Administration',
    duplicateOf: match?.id ?? null,
    imageState: hasImage
      ? 'Image attached. Automatic image classification is not connected in this prototype.'
      : 'No image provided.',
  };
}
