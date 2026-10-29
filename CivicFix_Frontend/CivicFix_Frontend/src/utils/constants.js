export const STATUSES = ['Registered', 'Ongoing', 'Resolved', 'Denied', 'Waiting List'];
export const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
export const PRIORITY_RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export const CATEGORIES = [
  'Roads and Potholes',
  'Garbage and Waste',
  'Water Supply',
  'Drainage and Sewage',
  'Streetlights',
  'Public Safety',
  'Public Infrastructure',
  'Other',
];

export const DEPARTMENTS = {
  'Roads and Potholes': 'Roads & Infrastructure',
  'Garbage and Waste': 'Solid Waste Management',
  'Water Supply': 'Water Works',
  'Drainage and Sewage': 'Drainage & Sewerage',
  Streetlights: 'Electrical & Street Lighting',
  'Public Safety': 'Public Safety Office',
  'Public Infrastructure': 'Public Works',
  Other: 'General Administration',
};

export const AUTHORITY_DEPARTMENTS = [...new Set(Object.values(DEPARTMENTS))];

export const STATUS_MESSAGES = {
  Registered: 'Your complaint has been submitted successfully.',
  Ongoing: 'Your concern is being addressed. Every step brings us closer to a solution.',
  'Waiting List': 'Your complaint matters. Waiting does not mean forgotten.',
  Resolved: 'The authority has recorded this complaint as resolved.',
  Denied: 'The authority reviewed this complaint and recorded a decision. The reason is shown below.',
};
