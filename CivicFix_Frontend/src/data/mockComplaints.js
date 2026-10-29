// CivicFix Mock Complaints Store
// Provides realistic initial civic complaints for the demonstration prototype
// Uses the exact 5 platform statuses: Registered, Ongoing, Waiting List, Resolved, Denied

export const CIVIC_CATEGORIES = [
  "Roads and Potholes",
  "Garbage and Waste",
  "Water Supply",
  "Drainage and Sewage",
  "Streetlights",
  "Public Safety Hazards",
  "Public Infrastructure",
  "Other"
];

export const DEPARTMENT_MAPPINGS = {
  "Roads and Potholes": "Road Infrastructure & Public Works (PWD)",
  "Garbage and Waste": "Solid Waste Management Division",
  "Water Supply": "Municipal Water Supply & Sewerage Board",
  "Drainage and Sewage": "Stormwater Drainage & Flood Control",
  "Streetlights": "Electrical & Street Lighting Department",
  "Public Safety Hazards": "Public Safety & Municipal Power Inspection",
  "Public Infrastructure": "Civic Asset & Infrastructure Maintenance",
  "Other": "General Municipal Operations"
};

export const INITIAL_COMPLAINTS = [
  {
    id: "CF-2026-0001",
    citizenId: "citizen-1",
    citizenName: "Aarav Sharma",
    citizenEmail: "aarav.sharma@example.com",
    citizenPhone: "+91 98765 43210",
    citizenAge: 29,
    citizenAddress: "Flat 402, Shanti Nilaya, 5th Cross, Indiranagar",
    title: "Deep crater-like pothole causing vehicle swerving on Main Arterial",
    category: "Roads and Potholes",
    description: "A dangerous 8-inch deep pothole has formed right in the middle of 100ft Inner Ring Road near Junction 4. Two two-wheelers nearly skidded during heavy evening traffic. Poses immediate accident risk to commuters.",
    address: "100ft Inner Ring Road, Sector 4 Junction",
    location: "Indiranagar, Ward 12",
    latitude: 12.9716,
    longitude: 77.5946,
    nearbyLandmark: "Near Indiranagar Metro Pillar 42",
    issueDurationDays: 4,
    createdAt: "2026-10-21T09:30:00.000Z",
    updatedAt: "2026-10-22T11:15:00.000Z",
    status: "Ongoing",
    priority: "High",
    riskScore: 78,
    suggestedDepartment: "Road Infrastructure & Public Works (PWD)",
    duplicateResult: {
      isDuplicate: false,
      candidateId: null,
      similarityScore: null,
      note: "No matching duplicate reports detected within 150m radius."
    },
    analysisStatus: "Completed",
    analysisDetails: {
      urgencyKeywords: ["accident risk", "vehicle swerving", "8-inch deep", "skidded"],
      impactRadiusMeters: 250,
      confidenceScore: 0.92,
      assessmentNote: "Rule-based analysis detected traffic hazard keywords and critical arterial road location."
    },
    statusHistory: [
      {
        status: "Registered",
        timestamp: "2026-10-21T09:30:00.000Z",
        note: "Complaint submitted with location and photographic documentation.",
        updatedBy: "Aarav Sharma (Citizen)"
      },
      {
        status: "Ongoing",
        timestamp: "2026-10-22T11:15:00.000Z",
        note: "Assigned to Ward 14 Road Maintenance Squad. Asphalt patching crew scheduled.",
        updatedBy: "Commissioner Priya Nair (Authority)"
      }
    ],
    resolutionNote: null,
    deniedReason: null,
    imagePreview: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2026-0002",
    citizenId: "citizen-1",
    citizenName: "Aarav Sharma",
    citizenEmail: "aarav.sharma@example.com",
    citizenPhone: "+91 98765 43210",
    citizenAge: 29,
    citizenAddress: "Flat 402, Shanti Nilaya, 5th Cross, Indiranagar",
    title: "Broken drinking water main pipeline leaking on 5th Cross",
    category: "Water Supply",
    description: "Potable water pipeline has ruptured beneath the pedestrian sidewalk. Clean water has been gushing out continuously for the past 14 hours, flooding basements of adjacent homes and depleting ward water reserve.",
    address: "5th Cross Road, Ward 12",
    location: "Indiranagar, Bangalore East",
    latitude: 12.9784,
    longitude: 77.6408,
    nearbyLandmark: "Opposite Government Primary Health Centre",
    issueDurationDays: 2,
    createdAt: "2026-10-22T08:10:00.000Z",
    updatedAt: "2026-10-22T08:10:00.000Z",
    status: "Registered",
    priority: "Critical",
    riskScore: 91,
    suggestedDepartment: "Municipal Water Supply & Sewerage Board",
    duplicateResult: {
      isDuplicate: true,
      candidateId: "CF-2026-0098",
      similarityScore: 84,
      note: "Potential duplicate: CF-2026-0098 reported similar water leakage 40 meters away 2 hours earlier."
    },
    analysisStatus: "Completed",
    analysisDetails: {
      urgencyKeywords: ["ruptured", "flooding basements", "continuous leak", "depleting reserve"],
      impactRadiusMeters: 400,
      confidenceScore: 0.96,
      assessmentNote: "High risk due to severe water loss and basement inundation hazard."
    },
    statusHistory: [
      {
        status: "Registered",
        timestamp: "2026-10-22T08:10:00.000Z",
        note: "Initial citizen submission logged via citizen portal.",
        updatedBy: "Aarav Sharma (Citizen)"
      }
    ],
    resolutionNote: null,
    deniedReason: null,
    imagePreview: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2026-0003",
    citizenId: "citizen-2",
    citizenName: "Sunita Roy",
    citizenEmail: "sunita.roy@example.com",
    citizenPhone: "+91 98220 11223",
    citizenAge: 42,
    citizenAddress: "House 18, 2nd Main, Ward 7, Market Road",
    title: "Overflowing commercial garbage skips blocking pedestrian walkway",
    category: "Garbage and Waste",
    description: "Three municipal secondary waste bins at the corner of Market Street are overflowing with rotting organic waste and packaging. Stray animals are scattering waste across the roadway, generating foul stench near vegetable stalls.",
    address: "Market Street, Commercial Zone",
    location: "Ward 7, Central Market",
    latitude: 12.9698,
    longitude: 77.5855,
    nearbyLandmark: "Adjacent to Central Fruit & Vegetable Mandi Gate 1",
    issueDurationDays: 3,
    createdAt: "2026-10-20T14:20:00.000Z",
    updatedAt: "2026-10-21T10:45:00.000Z",
    status: "Resolved",
    priority: "Medium",
    riskScore: 54,
    suggestedDepartment: "Solid Waste Management Division",
    duplicateResult: {
      isDuplicate: false,
      candidateId: null,
      similarityScore: null,
      note: "Unique complaint within the designated commercial market zone."
    },
    analysisStatus: "Completed",
    analysisDetails: {
      urgencyKeywords: ["overflowing", "rotting organic waste", "stray animals", "stench"],
      impactRadiusMeters: 100,
      confidenceScore: 0.88,
      assessmentNote: "Sanitation hazard in public market area assessed as Medium priority."
    },
    statusHistory: [
      {
        status: "Registered",
        timestamp: "2026-10-20T14:20:00.000Z",
        note: "Complaint lodged with photos of overflowing dumpsters.",
        updatedBy: "Sunita Roy (Citizen)"
      },
      {
        status: "Ongoing",
        timestamp: "2026-10-20T17:00:00.000Z",
        note: "Sanitation compactors dispatched for unscheduled clearance.",
        updatedBy: "Superintendent Rao (Authority)"
      },
      {
        status: "Resolved",
        timestamp: "2026-10-21T10:45:00.000Z",
        note: "All bins cleared, pressure sanitized, and collection frequency increased to twice daily.",
        updatedBy: "Commissioner Priya Nair (Authority)"
      }
    ],
    resolutionNote: "Waste completely cleared and bins sanitized by Zone 3 sanitation team on 21 Oct. Daily sweep roster updated.",
    deniedReason: null,
    imagePreview: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2026-0004",
    citizenId: "citizen-1",
    citizenName: "Aarav Sharma",
    citizenEmail: "aarav.sharma@example.com",
    citizenPhone: "+91 98765 43210",
    citizenAge: 29,
    citizenAddress: "Flat 402, Shanti Nilaya, 5th Cross, Indiranagar",
    title: "Cluster of 4 defunct streetlights creating dark zone on school lane",
    category: "Streetlights",
    description: "Four sequential sodium vapor lamps along Crescent School Lane have been dead for 5 nights. Schoolchildren returning from evening tuition and elderly pedestrians are in complete darkness. High risk of accidents.",
    address: "Crescent School Lane, 8th Block",
    location: "Jayanagar, Ward 15",
    latitude: 12.9250,
    longitude: 77.5838,
    nearbyLandmark: "Behind Crescent Girls High School",
    issueDurationDays: 5,
    createdAt: "2026-10-22T19:40:00.000Z",
    updatedAt: "2026-10-23T09:15:00.000Z",
    status: "Ongoing",
    priority: "High",
    riskScore: 71,
    suggestedDepartment: "Electrical & Street Lighting Department",
    duplicateResult: {
      isDuplicate: false,
      candidateId: null,
      similarityScore: null,
      note: "No duplicate complaints recorded for this circuit feeder line."
    },
    analysisStatus: "Completed",
    analysisDetails: {
      urgencyKeywords: ["complete darkness", "school lane", "safety risk", "defunct"],
      impactRadiusMeters: 180,
      confidenceScore: 0.90,
      assessmentNote: "Safety concern elevated due to school vicinity and consecutive fixture failures."
    },
    statusHistory: [
      {
        status: "Registered",
        timestamp: "2026-10-22T19:40:00.000Z",
        note: "Night-time visibility complaint submitted with photos.",
        updatedBy: "Aarav Sharma (Citizen)"
      },
      {
        status: "Ongoing",
        timestamp: "2026-10-23T09:15:00.000Z",
        note: "Feeder pillar circuit fault identified. Electrician lineman team assigned.",
        updatedBy: "Commissioner Priya Nair (Authority)"
      }
    ],
    resolutionNote: null,
    deniedReason: null,
    imagePreview: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2026-0005",
    citizenId: "citizen-3",
    citizenName: "Vikram Mehta",
    citizenEmail: "vikram.m@example.com",
    citizenPhone: "+91 99112 33445",
    citizenAge: 38,
    citizenAddress: "Plot 12, Lake View Enclave, BTM 2nd Stage",
    title: "Storm-water drain silt buildup scheduled for pre-monsoon heavy machinery",
    category: "Drainage and Sewage",
    description: "The primary stormwater culvert under 3rd Cross has gathered 2 feet of construction silt and dried vegetation. Requires heavy mechanical excavator, which is currently queued under the municipal seasonal desilting tender.",
    address: "3rd Cross, Lake View Layout",
    location: "Ward 18, South Zone",
    latitude: 12.9345,
    longitude: 77.6101,
    nearbyLandmark: "Beside Lake View Park Entrance",
    issueDurationDays: 14,
    createdAt: "2026-10-18T10:00:00.000Z",
    updatedAt: "2026-10-19T14:30:00.000Z",
    status: "Waiting List",
    priority: "Medium",
    riskScore: 58,
    suggestedDepartment: "Stormwater Drainage & Flood Control",
    duplicateResult: {
      isDuplicate: false,
      candidateId: null,
      similarityScore: null,
      note: "Single report logged for culvert desilting."
    },
    analysisStatus: "Completed",
    analysisDetails: {
      urgencyKeywords: ["culvert", "silt buildup", "excavator", "seasonal desilting"],
      impactRadiusMeters: 200,
      confidenceScore: 0.89,
      assessmentNote: "Requires mechanical desilting machinery allocated in next weekly roster."
    },
    statusHistory: [
      {
        status: "Registered",
        timestamp: "2026-10-18T10:00:00.000Z",
        note: "Citizen reported storm drain silt accumulation.",
        updatedBy: "Vikram Mehta (Citizen)"
      },
      {
        status: "Waiting List",
        timestamp: "2026-10-19T14:30:00.000Z",
        note: "Queued for Zone 4 mechanical backhoe loader availability starting Monday.",
        updatedBy: "Chief Engineer K. Murthy (Authority)"
      }
    ],
    resolutionNote: null,
    deniedReason: null,
    imagePreview: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2026-0006",
    citizenId: "citizen-4",
    citizenName: "Meera Krishnan",
    citizenEmail: "meera.k@example.com",
    citizenPhone: "+91 97400 55667",
    citizenAge: 34,
    citizenAddress: "Apartment 101, Rose Gardens, Ward 9",
    title: "Uncovered high-voltage utility junction box near public park entrance",
    category: "Public Safety Hazards",
    description: "An electrical junction cabinet near the children's park gate has its metal door swung open with exposed bare wiring at knee height. Rain showers pose imminent electrocution hazard for children playing nearby.",
    address: "Rose Garden Community Park, Gate 2",
    location: "Ward 9, Central Sector",
    latitude: 12.9512,
    longitude: 77.5899,
    nearbyLandmark: "Gate 2 next to Children Carousel",
    issueDurationDays: 1,
    createdAt: "2026-10-23T11:00:00.000Z",
    updatedAt: "2026-10-23T11:00:00.000Z",
    status: "Registered",
    priority: "Critical",
    riskScore: 97,
    suggestedDepartment: "Public Safety & Municipal Power Inspection",
    duplicateResult: {
      isDuplicate: false,
      candidateId: null,
      similarityScore: null,
      note: "Urgent individual public safety hazard."
    },
    analysisStatus: "Completed",
    analysisDetails: {
      urgencyKeywords: ["electrocution hazard", "bare wiring", "children park", "exposed high-voltage"],
      impactRadiusMeters: 50,
      confidenceScore: 0.99,
      assessmentNote: "Maximum risk score triggered: imminent threat to human life in high-traffic child zone."
    },
    statusHistory: [
      {
        status: "Registered",
        timestamp: "2026-10-23T11:00:00.000Z",
        note: "Critical public safety alert submitted.",
        updatedBy: "Meera Krishnan (Citizen)"
      }
    ],
    resolutionNote: null,
    deniedReason: null,
    imagePreview: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2026-0007",
    citizenId: "citizen-2",
    citizenName: "Sunita Roy",
    citizenEmail: "sunita.roy@example.com",
    citizenPhone: "+91 98220 11223",
    citizenAge: 42,
    citizenAddress: "House 18, 2nd Main, Ward 7, Market Road",
    title: "Collapsed branch of ancient tree leaning on telecom cables",
    category: "Public Infrastructure",
    description: "A huge 20-foot limb of a tree broke during gusty winds. It is dangling precariously across roadside telecom cables and could snap onto vehicles.",
    address: "Station Road, opposite Post Office",
    location: "Ward 5, Railway Station Approach",
    latitude: 12.9810,
    longitude: 77.6020,
    nearbyLandmark: "Opposite Head Post Office",
    issueDurationDays: 2,
    createdAt: "2026-10-19T16:15:00.000Z",
    updatedAt: "2026-10-20T12:00:00.000Z",
    status: "Resolved",
    priority: "Medium",
    riskScore: 62,
    suggestedDepartment: "Civic Asset & Infrastructure Maintenance",
    duplicateResult: {
      isDuplicate: false,
      candidateId: null,
      similarityScore: null,
      note: "Tree fall hazard verified."
    },
    analysisStatus: "Completed",
    analysisDetails: {
      urgencyKeywords: ["collapsed branch", "dangling limb", "overhead cables", "traffic hazard"],
      impactRadiusMeters: 80,
      confidenceScore: 0.86,
      assessmentNote: "Structural tree hazard on roadside cables."
    },
    statusHistory: [
      {
        status: "Registered",
        timestamp: "2026-10-19T16:15:00.000Z",
        note: "Initial citizen complaint filed.",
        updatedBy: "Sunita Roy (Citizen)"
      },
      {
        status: "Ongoing",
        timestamp: "2026-10-20T08:30:00.000Z",
        note: "Hydraulic crane pruning team deployed on site.",
        updatedBy: "Officer George (Authority)"
      },
      {
        status: "Resolved",
        timestamp: "2026-10-20T12:00:00.000Z",
        note: "Hanging branches safely lopped and cleared. Road reopened.",
        updatedBy: "Officer George (Authority)"
      }
    ],
    resolutionNote: "Hydraulic pruning squad completed limb removal and cleared road debris. Cable lines intact.",
    deniedReason: null,
    imagePreview: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2026-0008",
    citizenId: "citizen-5",
    citizenName: "Deepak Verma",
    citizenEmail: "deepak.v@example.com",
    citizenPhone: "+91 91234 56789",
    citizenAge: 31,
    citizenAddress: "House 55, Green Valley Colony",
    title: "Interior private bathroom pipe leakage inside private apartment",
    category: "Other",
    description: "My bathroom sink tap inside my private master bedroom is dripping. Please send municipal plumber to repair it.",
    address: "Green Valley Colony, Block C, Apt 304",
    location: "Ward 11, Green Valley",
    latitude: 12.9150,
    longitude: 77.6200,
    nearbyLandmark: "Nil",
    issueDurationDays: 3,
    createdAt: "2026-10-22T14:00:00.000Z",
    updatedAt: "2026-10-23T10:00:00.000Z",
    status: "Denied",
    priority: "Low",
    riskScore: 22,
    suggestedDepartment: "General Municipal Operations",
    duplicateResult: {
      isDuplicate: false,
      candidateId: null,
      similarityScore: null,
      note: "No duplicates found."
    },
    analysisStatus: "Completed",
    analysisDetails: {
      urgencyKeywords: ["private bathroom", "sink tap"],
      impactRadiusMeters: 5,
      confidenceScore: 0.95,
      assessmentNote: "Private interior plumbing issue outside municipal public jurisdiction."
    },
    statusHistory: [
      {
        status: "Registered",
        timestamp: "2026-10-22T14:00:00.000Z",
        note: "Complaint submitted.",
        updatedBy: "Deepak Verma (Citizen)"
      },
      {
        status: "Denied",
        timestamp: "2026-10-23T10:00:00.000Z",
        note: "Issue rejected after officer review. Municipal maintenance applies strictly to public utility lines outside private residential premises. Please consult a licensed private plumbing technician.",
        updatedBy: "Commissioner Priya Nair (Authority)"
      }
    ],
    resolutionNote: null,
    deniedReason: "Municipal civic services manage public water pipelines, streets, drains, and lighting. Private domestic plumbing within apartments falls under individual residential maintenance. Please consult your building association or private technician.",
    imagePreview: null
  }
];
