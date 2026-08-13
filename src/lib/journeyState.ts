import { CareJourney } from '../types/journey';

const JOURNEY_STORAGE_KEY = 'careRoute_activeJourney';

export const saveActiveJourney = (journey: CareJourney): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(journey));
};

export const getActiveJourney = (): CareJourney | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(JOURNEY_STORAGE_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as CareJourney;
  } catch (error) {
    console.error('Failed to parse active journey from local storage', error);
    return null;
  }
};

export const clearActiveJourney = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(JOURNEY_STORAGE_KEY);
};
