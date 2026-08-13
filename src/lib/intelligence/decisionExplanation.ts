import { Recommendation } from '../../types/recommendation';
import { CareRequirement } from '../../types/care';

export function generateExplanation(recommendation: Recommendation, requirements: CareRequirement): string {
  const { hospital, matchScore, reasons, expectedArrivalCapacity } = recommendation;
  const parts: string[] = [];

  if (matchScore >= 80) {
    parts.push(`CARE ROUTE RECOMMENDS ${hospital.name.toUpperCase()}`);
  } else {
    parts.push(`${hospital.name.toUpperCase()} is a candidate`);
  }

  parts.push("because");

  const metReasons = reasons.filter(r => r.met).map(r => r.description.toLowerCase());
  
  if (requirements.specialists && requirements.specialists.length > 0 && metReasons.some(r => r.includes(requirements.specialists![0].toLowerCase()))) {
    parts.push(`the required ${requirements.specialists[0]} is available,`);
  }

  if (requirements.resources && requirements.resources.length > 0) {
    parts.push(`required resources (${requirements.resources.join(', ')}) are operational,`);
  }

  if (expectedArrivalCapacity && expectedArrivalCapacity.expectedAvailable > 0) {
    parts.push(`and there is a high probability of ${expectedArrivalCapacity.resourceName} capacity at your expected arrival.`);
  } else if (expectedArrivalCapacity && expectedArrivalCapacity.expectedAvailable <= 0) {
    parts.push(`however, ${expectedArrivalCapacity.resourceName} capacity is expected to be full by the time you arrive.`);
  }

  return parts.join(' ').replace(/, and/, ' and').replace(/,\./, '.');
}
