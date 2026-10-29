// DEMO RECORDS ONLY. Sample accounts and complaints for prototype testing.
// Demo passwords exist solely for these seeded demo accounts. Production authentication
// must happen on a secure backend. Accounts created in the app store only a hash.
const daysAgo = (d) => new Date(Date.now() - d * 86400000).toISOString();

export const DEMO_CITIZENS = [
  {
    id: 'c-1', name: 'Demo Citizen', age: 34, address: '12 Park Street, Ward 7',
    email: 'citizen@demo.civicfix', phone: '9876543210', demoPassword: 'Citizen@123', isDemo: true,
  },
  {
    id: 'c-2', name: 'Sample Citizen Two', age: 52, address: '45 Market Road, Ward 3',
    email: 'citizen2@demo.civicfix', phone: '9123456780', demoPassword: 'Citizen@123', isDemo: true,
  },
];

export const DEMO_AUTHORITIES = [
  {
    id: 'a-1', name: 'Demo Officer', designation: 'Assistant Engineer', department: 'Roads & Infrastructure',
    authorityId: 'AUTH-DEMO-001', email: 'officer@demo.civicfix', phone: '9000000001',
    demoPassword: 'Authority@123', verification: 'approved', isDemo: true,
  },
  {
    id: 'a-2', name: 'Sample Pending Applicant', designation: 'Sanitary Inspector', department: 'Solid Waste Management',
    authorityId: 'AUTH-DEMO-002', email: 'pending@demo.civicfix', phone: '9000000002',
    demoPassword: 'Pending@123', verification: 'pending', isDemo: true,
  },
];

// history entries: [status, daysAgo, note, by]
function seed({ id, citizenId, title, category, description, address, locality, landmark, days, priority, history }) {
  const citizen = DEMO_CITIZENS.find((c) => c.id === citizenId);
  const statusHistory = history.map(([status, ago, note, by]) => ({
    status, at: daysAgo(ago), note, by: by || 'System',
  }));
  const last = statusHistory[statusHistory.length - 1];
  const latestDecision = statusHistory.filter((h) => h.status === 'Resolved').pop();
  const latestDenial = statusHistory.filter((h) => h.status === 'Denied').pop();
  return {
    id, citizenId, citizenName: citizen.name,
    citizenContact: { email: citizen.email, phone: citizen.phone },
    title, category, description, imageName: '', imagePreview: null,
    address, locality, nearbyLandmark: landmark, latitude: null, longitude: null,
    issueDurationDays: days, status: last.status, priority, riskScore: null,
    suggestedDepartment: category === 'Streetlights' ? 'Electrical & Street Lighting' : 'Roads & Infrastructure',
    analysis: { classification: category, state: 'simulated', duplicateOf: null, imageState: 'No image provided' },
    createdAt: statusHistory[0].at, updatedAt: last.at, statusHistory,
    resolutionNote: latestDecision ? latestDecision.note : '',
    decisionReason: latestDenial ? latestDenial.note : '',
    isDemo: true,
  };
}

export const DEMO_COMPLAINTS = [
  seed({
    id: 'CF-2026-0001', citizenId: 'c-1', title: 'Deep pothole near bus stop', category: 'Roads and Potholes',
    description: 'A deep pothole has formed in the left lane near Bus Stop 4. Two-wheelers swerve into traffic to avoid it.',
    address: 'Main Road, near Bus Stop 4', locality: 'Ward 7', landmark: 'Bus Stop 4', days: 12, priority: 'Medium',
    history: [['Registered', 2]],
  }),
  seed({
    id: 'CF-2026-0002', citizenId: 'c-1', title: 'Uncollected garbage for a week', category: 'Garbage and Waste',
    description: 'Garbage bins behind the community hall have not been cleared for a week and smell strongly.',
    address: '22 Lake View Lane', locality: 'Ward 7', landmark: 'Nil', days: 7, priority: 'Low',
    history: [['Registered', 9], ['Ongoing', 6, 'Sanitation team has been assigned to this location.', 'Demo Officer']],
  }),
  seed({
    id: 'CF-2026-0003', citizenId: 'c-1', title: 'Open manhole with sewage overflow', category: 'Drainage and Sewage',
    description: 'The manhole cover is missing and sewage is overflowing onto the footpath after rain. Pedestrians have to walk on the road.',
    address: 'Temple Street junction', locality: 'Ward 7', landmark: 'Opposite the temple gate', days: 3, priority: 'Critical',
    history: [['Registered', 14], ['Waiting List', 10, 'Replacement cover is on order. Your complaint remains active.', 'Demo Officer']],
  }),
  seed({
    id: 'CF-2026-0004', citizenId: 'c-1', title: 'Streetlight out on residential lane', category: 'Streetlights',
    description: 'The streetlight at the end of the lane has been out for three nights, leaving the walkway dark.',
    address: '8 Chestnut Lane', locality: 'Ward 7', landmark: 'Nil', days: 3, priority: 'High',
    history: [
      ['Registered', 20],
      ['Ongoing', 17, 'Electrical team scheduled to inspect the pole.', 'Demo Officer'],
      ['Resolved', 15, 'Faulty bulb and fuse replaced. Light is working again.', 'Demo Officer'],
    ],
  }),
  seed({
    id: 'CF-2026-0005', citizenId: 'c-2', title: 'Low water pressure for three days', category: 'Water Supply',
    description: 'Water pressure has dropped sharply in our building. Upper floors receive almost no water in the mornings.',
    address: '45 Market Road', locality: 'Ward 3', landmark: 'Nil', days: 3, priority: 'Medium',
    history: [
      ['Registered', 6],
      ['Denied', 4, 'This address falls outside the Ward 3 water-supply boundary. Please resubmit with an address inside the boundary, or contact the Water Works helpdesk.', 'Demo Officer'],
    ],
  }),
  seed({
    id: 'CF-2026-0006', citizenId: 'c-2', title: 'Exposed live wire near school gate', category: 'Public Safety',
    description: 'A live electrical wire is hanging low from a utility pole beside the school gate. Children gather here in the morning.',
    address: 'Gate 2, Government School Road', locality: 'Ward 3', landmark: 'School Gate 2', days: 1, priority: 'Critical',
    history: [['Registered', 1], ['Ongoing', 0, 'Emergency electrical team dispatched.', 'Demo Officer']],
  }),
  seed({
    id: 'CF-2026-0007', citizenId: 'c-2', title: 'Broken footpath slab', category: 'Public Infrastructure',
    description: 'A concrete slab on the footpath is cracked and tilted, creating a trip hazard for older residents.',
    address: '60 Market Road', locality: 'Ward 3', landmark: 'Nil', days: 30, priority: 'Low',
    history: [['Registered', 1]],
  }),
];
