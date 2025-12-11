/**
 * Mapeo de deportes a tipos de instalaciones
 */

export const sportToFacilityTypeMap: Record<string, string> = {
  'tiro-con-arco': 'Campo de Tiro con Arco',
  'baloncesto': 'Cancha de Baloncesto',
  'golf': 'Campo de Golf',
  'voleibol': 'Cancha de Voleibol',
  'boxeo': 'Ring de Boxeo',
  'escalada': 'Muro de Escalada',
  'natacion': 'Piscina',
  'trampolin': 'Parque de Trampolines',
  'equitacion': 'Centro Ecuestre',
  'bolos': 'Bolera',
  'beisbol': 'Campo de Béisbol',
  'tenis': 'Cancha de Tenis',
};

// Mapeo de deportes en inglés a español (para compatibilidad)
export const sportTranslationMap: Record<string, string> = {
  'archery': 'tiro-con-arco',
  'basketball': 'baloncesto',
  'golf': 'golf',
  'volleyball': 'voleibol',
  'boxing': 'boxeo',
  'rock-climbing': 'escalada',
  'swimming': 'natacion',
  'trampolining': 'trampolin',
  'equitation': 'equitacion',
  'bowling': 'bolos',
  'baseball': 'beisbol',
  'tennis': 'tenis',
};

// Mapeo inverso (español a inglés)
export const sportReverseTranslationMap: Record<string, string> = {
  'tiro-con-arco': 'archery',
  'baloncesto': 'basketball',
  'golf': 'golf',
  'voleibol': 'volleyball',
  'boxeo': 'boxing',
  'escalada': 'rock-climbing',
  'natacion': 'swimming',
  'trampolin': 'trampolining',
  'equitacion': 'equitation',
  'bolos': 'bowling',
  'beisbol': 'baseball',
  'tenis': 'tennis',
};

export const getSportDisplayName = (sport: string): string => {
  // Si es español, devolver con primera letra mayúscula
  if (sportToFacilityTypeMap[sport.toLowerCase()]) {
    return sport.charAt(0).toUpperCase() + sport.slice(1).replace(/-/g, ' ');
  }
  // Si es inglés, traducir primero
  const spanishSport = sportTranslationMap[sport.toLowerCase()];
  if (spanishSport) {
    return spanishSport.charAt(0).toUpperCase() + spanishSport.slice(1).replace(/-/g, ' ');
  }
  return sport.charAt(0).toUpperCase() + sport.slice(1).replace(/-/g, ' ');
};

export const getFacilityTypeForSport = (sport: string): string => {
  const lowerSport = sport.toLowerCase();
  // Intentar con el nombre en español
  if (sportToFacilityTypeMap[lowerSport]) {
    return sportToFacilityTypeMap[lowerSport];
  }
  // Intentar traducir del inglés
  const spanishSport = sportTranslationMap[lowerSport];
  if (spanishSport && sportToFacilityTypeMap[spanishSport]) {
    return sportToFacilityTypeMap[spanishSport];
  }
  return sport;
};



