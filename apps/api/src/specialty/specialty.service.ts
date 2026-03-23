import { Injectable, ConflictException, NotFoundException, BadRequestException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Specialty, SpecialtyDocument } from './entities/specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { GuideProfile, GuideProfileDocument } from '../guide/entities/guide-profile.entity';

const SEED_SPECIALTIES = [
  'Randonnée',
  'Culture',
  'Gastronomie',
  'Histoire',
  'Aventure',
  'Photographie',
  'Nature',
  'Architecture',
];

@Injectable()
export class SpecialtyService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Specialty.name) private specialtyModel: Model<SpecialtyDocument>,
    @InjectModel(GuideProfile.name) private guideModel: Model<GuideProfileDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.specialtyModel.countDocuments();
    if (count === 0) {
      await this.specialtyModel.insertMany(SEED_SPECIALTIES.map((name) => ({ name })));
    }
  }

  findAll() {
    return this.specialtyModel.find().sort({ name: 1 }).lean();
  }

  async create(dto: CreateSpecialtyDto) {
    const exists = await this.specialtyModel.findOne({ name: { $regex: `^${dto.name}$`, $options: 'i' } });
    if (exists) throw new ConflictException('Une spécialité avec ce nom existe déjà');
    return this.specialtyModel.create({ name: dto.name });
  }

  async update(id: string, dto: Partial<CreateSpecialtyDto>) {
    const updated = await this.specialtyModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Spécialité introuvable');
    return updated;
  }

  async remove(id: string) {
    const specialty = await this.specialtyModel.findById(id);
    if (!specialty) throw new NotFoundException('Spécialité introuvable');

    const guidesCount = await this.guideModel.countDocuments({ specialties: new Types.ObjectId(id) });
    if (guidesCount > 0)
      throw new BadRequestException(`Impossible de supprimer : ${guidesCount} guide(s) utilisent cette spécialité`);

    await this.specialtyModel.findByIdAndDelete(id);
    return { success: true };
  }
}
