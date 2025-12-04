/**
 * Mapeo de deportes a tipos de instalaciones
 */

export const sportToFacilityTypeMap: Record<string, string> = {
  'archery': 'Archery Range',
  'basketball': 'Basketball Court',
  'golf': 'Golf Course',
  'volleyball': 'Volleyball Court',
  'boxing': 'Boxing Ring',
  'rock-climbing': 'Rock Climbing Wall',
  'swimming': 'Swimming Pool',
  'trampolining': 'Trampoline Park',
  'equitation': 'Equestrian Center',
  'bowling': 'Bowling Alley',
  'baseball': 'Baseball Field',
  'tennis': 'Tennis Court',
};

export const getSportDisplayName = (sport: string): string => {
  return sport.charAt(0).toUpperCase() + sport.slice(1).replace(/-/g, ' ');
};

export const getFacilityTypeForSport = (sport: string): string => {
  return sportToFacilityTypeMap[sport.toLowerCase()] || sport;
};

