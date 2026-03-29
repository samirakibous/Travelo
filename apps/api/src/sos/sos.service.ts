import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  EmergencyContact,
  EmergencyContactDocument,
} from './entities/emergency-contact.entity';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';

type EmergencyNumbers = {
  country: string;
  police: string;
  fire: string;
  ambulance: string;
  general?: string;
};

const EMERGENCY_NUMBERS: Record<string, EmergencyNumbers> = {
  FR: {
    country: 'France',
    police: '17',
    fire: '18',
    ambulance: '15',
    general: '112',
  },
  MA: {
    country: 'Maroc',
    police: '19',
    fire: '15',
    ambulance: '15',
    general: '15',
  },
  TN: { country: 'Tunisie', police: '197', fire: '198', ambulance: '190' },
  DZ: {
    country: 'Algérie',
    police: '17',
    fire: '14',
    ambulance: '14',
    general: '1021',
  },
  SN: { country: 'Sénégal', police: '17', fire: '18', ambulance: '15' },
  CM: { country: 'Cameroun', police: '17', fire: '18', ambulance: '15' },
  CI: {
    country: "Côte d'Ivoire",
    police: '111',
    fire: '180',
    ambulance: '185',
  },
  US: {
    country: 'États-Unis',
    police: '911',
    fire: '911',
    ambulance: '911',
    general: '911',
  },
  GB: {
    country: 'Royaume-Uni',
    police: '999',
    fire: '999',
    ambulance: '999',
    general: '112',
  },
  DE: { country: 'Allemagne', police: '110', fire: '112', ambulance: '112' },
  ES: {
    country: 'Espagne',
    police: '091',
    fire: '080',
    ambulance: '061',
    general: '112',
  },
  IT: {
    country: 'Italie',
    police: '113',
    fire: '115',
    ambulance: '118',
    general: '112',
  },
  TR: { country: 'Turquie', police: '155', fire: '110', ambulance: '112' },
  EG: { country: 'Égypte', police: '122', fire: '180', ambulance: '123' },
  AE: { country: 'Émirats', police: '999', fire: '997', ambulance: '998' },
  DEFAULT: {
    country: 'International',
    police: '112',
    fire: '112',
    ambulance: '112',
    general: '112',
  },
};

@Injectable()
export class SosService {
  constructor(
    @InjectModel(EmergencyContact.name)
    private contactModel: Model<EmergencyContactDocument>,
  ) {}

  getEmergencyNumbers(country?: string): EmergencyNumbers {
    if (country) {
      const key = country.toUpperCase();
      if (EMERGENCY_NUMBERS[key]) return EMERGENCY_NUMBERS[key];
    }
    return EMERGENCY_NUMBERS.DEFAULT;
  }

  getAllCountries(): { code: string; name: string }[] {
    return Object.entries(EMERGENCY_NUMBERS)
      .filter(([code]) => code !== 'DEFAULT')
      .map(([code, data]) => ({ code, name: data.country }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getContacts(userId: string) {
    return this.contactModel
      .find({ userId: new Types.ObjectId(userId) })
      .lean();
  }

  async createContact(userId: string, dto: CreateEmergencyContactDto) {
    const contact = new this.contactModel({
      userId: new Types.ObjectId(userId),
      ...dto,
    });
    await contact.save();
    return contact;
  }

  async updateContact(
    contactId: string,
    userId: string,
    dto: Partial<CreateEmergencyContactDto>,
  ) {
    const contact = await this.contactModel.findById(contactId);
    if (!contact) throw new NotFoundException('Contact introuvable');
    if (!contact.userId.equals(new Types.ObjectId(userId)))
      throw new ForbiddenException('Accès interdit');
    Object.assign(contact, dto);
    await contact.save();
    return contact;
  }

  async deleteContact(contactId: string, userId: string) {
    const contact = await this.contactModel.findById(contactId);
    if (!contact) throw new NotFoundException('Contact introuvable');
    if (!contact.userId.equals(new Types.ObjectId(userId)))
      throw new ForbiddenException('Accès interdit');
    await contact.deleteOne();
    return { message: 'Contact supprimé' };
  }
}
