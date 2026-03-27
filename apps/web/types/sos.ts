export type EmergencyNumbers = {
  country: string;
  police: string;
  fire: string;
  ambulance: string;
  general?: string;
};

export type CountryOption = {
  code: string;
  name: string;
};

export type EmergencyContact = {
  _id: string;
  name: string;
  phone: string;
  relationship?: string;
};
