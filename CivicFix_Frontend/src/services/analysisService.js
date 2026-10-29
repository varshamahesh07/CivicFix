import { DEPARTMENT_MAPPINGS } from '../data/mockComplaints';

/**
 * Intelligent Complaint Analysis & Assessment Service
 * Executes deterministic rule-based analysis for the frontend demo prototype.
 * Clearly isolates simulated results from actual AI microservices.
 */

// High-severity civic safety trigger keywords
const CRITICAL_KEYWORDS = [
  'electrocution', 'bare wire', 'bare wiring', 'open wire', 'high voltage',
  'collapsed', 'cave in', 'explosion', 'fire hazard', 'gas leak', 'drowning',
  'sinkhole', 'falling tree', 'live wire'
];

const HIGH_KEYWORDS = [
  'accident', 'deep pothole', 'crater', 'ruptured', 'flooding', 'sewage backflow',
  'darkness', 'school', 'hospital', 'injury', 'swerving', 'hazardous', 'water main',
  'dark zone'
];

const MEDIUM_KEYWORDS = [
  'overflowing', 'garbage', 'stench', 'flickering', 'clogged', 'debris',
  'broken tiles', 'street light off', 'pavement', 'culvert', 'silt'
];

/**
 * Calculates deterministic risk score (0 - 100) based on textual signals and category baseline.
 * NOTE: Illustrative score based on configured scoring rules. Not a validated scientific metric.
 */
export function calculateRiskScore(category, text) {
  const content = text.toLowerCase();
  let baseScore = 35;

  if (category === 'Public Safety Hazards') baseScore = 65;
  else if (category === 'Water Supply') baseScore = 55;
  else if (category === 'Roads and Potholes') baseScore = 50;
  else if (category === 'Drainage and Sewage') baseScore = 48;
  else if (category === 'Streetlights') baseScore = 40;
  else if (category === 'Garbage and Waste') baseScore = 35;
  else if (category === 'Public Infrastructure') baseScore = 42;

  let urgencyBonus = 0;
  let matchedKeywords = [];

  for (const word of CRITICAL_KEYWORDS) {
    if (content.includes(word)) {
      urgencyBonus += 25;
      matchedKeywords.push(word);
    }
  }

  for (const word of HIGH_KEYWORDS) {
    if (content.includes(word)) {
      urgencyBonus += 15;
      matchedKeywords.push(word);
    }
  }

  for (const word of MEDIUM_KEYWORDS) {
    if (content.includes(word)) {
      urgencyBonus += 8;
      matchedKeywords.push(word);
    }
  }

  if (content.length > 150) urgencyBonus += 5;

  const finalScore = Math.min(99, Math.max(15, baseScore + urgencyBonus));
  return { score: finalScore, keywords: matchedKeywords };
}

export function determinePriority(riskScore, matchedKeywords) {
  if (riskScore >= 85) {
    return {
      level: 'Critical',
      reason: `Imminent public hazard assessed. High-severity indicators detected: ${matchedKeywords.slice(0, 3).join(', ') || 'Severe safety conditions'}.`
    };
  }
  if (riskScore >= 68) {
    return {
      level: 'High',
      reason: `Substantial disruption or injury risk detected. Urgency triggers: ${matchedKeywords.slice(0, 3).join(', ') || 'High impact public zone'}.`
    };
  }
  if (riskScore >= 45) {
    return {
      level: 'Medium',
      reason: 'Moderate civic disruption affecting neighborhood routine. Routine operations required.'
    };
  }
  return {
    level: 'Low',
    reason: 'Standard maintenance issue with minimal immediate public safety exposure.'
  };
}

export function checkDuplicateComplaint(newComplaint, existingComplaints = []) {
  if (!existingComplaints || existingComplaints.length === 0) {
    return {
      isDuplicate: false,
      candidateId: null,
      similarityScore: null,
      note: 'No potential duplicate found in current database.'
    };
  }

  const newWords = new Set(
    `${newComplaint.title} ${newComplaint.description}`
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  let bestMatch = null;
  let highestSimilarity = 0;

  for (const item of existingComplaints) {
    if (item.category !== newComplaint.category) continue;

    const existingWords = new Set(
      `${item.title} ${item.description}`
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

    let commonCount = 0;
    newWords.forEach((word) => {
      if (existingWords.has(word)) commonCount++;
    });

    const totalUnique = new Set([...newWords, ...existingWords]).size;
    const similarity = totalUnique > 0 ? Math.round((commonCount / totalUnique) * 100) : 0;

    const sameLocation =
      newComplaint.location &&
      item.location &&
      item.location.toLowerCase().includes(newComplaint.location.toLowerCase().split(',')[0]);

    const finalSim = sameLocation ? Math.min(95, similarity + 30) : similarity;

    if (finalSim > highestSimilarity && finalSim >= 55) {
      highestSimilarity = finalSim;
      bestMatch = item;
    }
  }

  if (bestMatch) {
    return {
      isDuplicate: true,
      candidateId: bestMatch.id,
      similarityScore: highestSimilarity,
      note: `Potential duplicate of ${bestMatch.id} (${highestSimilarity}% content & location alignment).`
    };
  }

  return {
    isDuplicate: false,
    candidateId: null,
    similarityScore: null,
    note: 'No potential duplicate found in local jurisdiction.'
  };
}

export function analyzeComplaint(complaintData, existingComplaints = []) {
  const combinedText = `${complaintData.title || ''} ${complaintData.description || ''}`;
  const { score, keywords } = calculateRiskScore(complaintData.category, combinedText);
  const priority = determinePriority(score, keywords);
  const duplicate = checkDuplicateComplaint(complaintData, existingComplaints);
  const suggestedDepartment = DEPARTMENT_MAPPINGS[complaintData.category] || 'General Municipal Operations';

  return {
    analysisStatus: 'Completed',
    riskScore: score,
    priority: priority.level,
    priorityReason: priority.reason,
    suggestedDepartment,
    duplicateResult: duplicate,
    analysisDetails: {
      urgencyKeywords: keywords,
      confidenceScore: 0.92,
      ruleEngineVersion: 'Demo-Rules-v2.0',
      disclaimer: 'Simulated rule-based assessment for prototype evaluation.'
    }
  };
}
