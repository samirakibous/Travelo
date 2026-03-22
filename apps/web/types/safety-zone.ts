export type RiskLevel = 'safe' | 'caution' | 'danger';
export type ZoneCategory = 'tourist' | 'transport' | 'accommodation' | 'food' | 'general';
export type ZoneType = 'point' | 'polygon';

export type SafeZone = {
  _id: string;
  name: string;
  description?: string;
  riskLevel: RiskLevel;
  category: ZoneCategory;
  type: ZoneType;
  lat?: number;
  lng?: number;
  coordinates?: { lat: number; lng: number }[];
  activeDay: boolean;
  activeNight: boolean;
  createdAt: string;
};

export type SafeZoneQuery = {
  riskLevel?: string;
  category?: string;
  time?: 'day' | 'night' | 'all';
};
