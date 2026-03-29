import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  GuideProfile,
  GuideProfileDocument,
} from './entities/guide-profile.entity';
import { CreateGuideProfileDto } from './dto/create-guide-profile.dto';
import { QueryGuideDto } from './dto/query-guide.dto';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class GuideService {
  constructor(
    @InjectModel(GuideProfile.name)
    private guideModel: Model<GuideProfileDocument>,
  ) {}

  async findAll(query: QueryGuideDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '12', 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }
    if (query.expertiseLevel) {
      filter.expertiseLevel = query.expertiseLevel;
    }
    if (query.specialty) {
      filter.specialties = new Types.ObjectId(query.specialty);
    }
    if (query.language) {
      filter.languages = { $in: [new RegExp(query.language, 'i')] };
    }
    if (query.minRate || query.maxRate) {
      filter.hourlyRate = {};
      if (query.minRate) filter.hourlyRate.$gte = parseInt(query.minRate, 10);
      if (query.maxRate) filter.hourlyRate.$lte = parseInt(query.maxRate, 10);
    }

    const [data, total] = await Promise.all([
      this.guideModel
        .find(filter)
        .populate('userId', 'firstName lastName profilePicture email')
        .populate('specialties')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.guideModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const guide = await this.guideModel
      .findById(id)
      .populate('userId', 'firstName lastName profilePicture email')
      .populate('specialties');
    if (!guide) throw new NotFoundException('Guide introuvable');
    return guide;
  }

  async createProfile(
    userId: string,
    userRole: string,
    dto: CreateGuideProfileDto,
  ) {
    if (userRole !== Role.GUIDE) {
      throw new ForbiddenException(
        'Seuls les guides peuvent créer un profil guide',
      );
    }
    const userOid = new Types.ObjectId(userId);
    const existing = await this.guideModel.findOne({ userId: userOid });
    if (existing) throw new ConflictException('Profil guide déjà existant');

    const profile = new this.guideModel({ ...dto, userId: userOid });
    await profile.save();
    return profile.populate(['userId', 'specialties']);
  }

  async updateProfile(userId: string, dto: Partial<CreateGuideProfileDto>) {
    const profile = await this.guideModel
      .findOneAndUpdate({ userId: new Types.ObjectId(userId) }, dto, {
        new: true,
      })
      .populate('userId', 'firstName lastName profilePicture email')
      .populate('specialties');
    if (!profile) throw new NotFoundException('Profil guide introuvable');
    return profile;
  }

  async getMyProfile(userId: string) {
    const profile = await this.guideModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'firstName lastName profilePicture email')
      .populate('specialties');
    if (!profile) throw new NotFoundException('Profil guide introuvable');
    return profile;
  }
}
