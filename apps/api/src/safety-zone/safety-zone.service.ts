import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SafeZone, SafeZoneDocument } from './entities/safety-zone.entity';
import { CreateSafeZoneDto } from './dto/create-safety-zone.dto';
import { QuerySafeZoneDto } from './dto/query-safety-zone.dto';

@Injectable()
export class SafeZoneService {
  constructor(
    @InjectModel(SafeZone.name)
    private safeZoneModel: Model<SafeZoneDocument>,
  ) {}

  async findAll(query: QuerySafeZoneDto) {
    const filter: Record<string, any> = {};

    if (query.riskLevel) {
      filter.riskLevel = { $in: query.riskLevel.split(',') };
    }
    if (query.category) {
      filter.category = { $in: query.category.split(',') };
    }
    if (query.time === 'day') {
      filter.activeDay = true;
    } else if (query.time === 'night') {
      filter.activeNight = true;
    }

    return this.safeZoneModel.find(filter).lean();
  }

  async findOne(id: string) {
    const zone = await this.safeZoneModel.findById(id).lean();
    if (!zone) throw new NotFoundException('Zone introuvable');
    return zone;
  }

  async create(dto: CreateSafeZoneDto) {
    const zone = new this.safeZoneModel(dto);
    return zone.save();
  }

  async remove(id: string) {
    const zone = await this.safeZoneModel.findByIdAndDelete(id);
    if (!zone) throw new NotFoundException('Zone introuvable');
    return { message: 'Zone supprimée' };
  }
}
