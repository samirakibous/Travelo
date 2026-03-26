import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Advice, AdviceDocument } from './entities/advice.entity';
import { GuideProfile, GuideProfileDocument } from '../guide/entities/guide-profile.entity';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { QueryAdviceDto } from './dto/query-advice.dto';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class AdviceService {
  constructor(
    @InjectModel(Advice.name) private adviceModel: Model<AdviceDocument>,
    @InjectModel(GuideProfile.name) private guideProfileModel: Model<GuideProfileDocument>,
  ) {}

  async findAll(query: QueryAdviceDto) {
    const filter: Record<string, any> = {};

    if (query.category) {
      filter.category = { $in: query.category.split(',') };
    }
    if (query.certifiedOnly === 'true') {
      filter.isCertifiedGuide = true;
    }
    if (query.authorId) {
      filter.author = query.authorId;
    }
    if (query.adviceType) {
      filter.adviceType = { $in: query.adviceType.split(',') };
    }

    return this.adviceModel
      .find(filter)
      .populate('author', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(id: string) {
    const advice = await this.adviceModel
      .findById(id)
      .populate('author', 'firstName lastName profilePicture')
      .populate('linkedZone', 'name riskLevel')
      .lean();
    if (!advice) throw new NotFoundException('Conseil introuvable');
    return advice;
  }

  async findByAuthor(userId: string) {
    return this.adviceModel
      .find({ author: userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async create(userId: string, dto: CreateAdviceDto, mediaUrls: string[]) {
    const profile = await this.guideProfileModel.findOne({ userId });
    const isCertifiedGuide = profile?.isCertified ?? false;

    const advice = new this.adviceModel({
      ...dto,
      author: userId,
      mediaUrls,
      isCertifiedGuide,
    });

    await advice.save();
    return advice.populate('author', 'firstName lastName profilePicture');
  }

  async vote(id: string, userId: string, type: 'useful' | 'not_useful') {
    const advice = await this.adviceModel.findById(id);
    if (!advice) throw new NotFoundException('Conseil introuvable');

    const uid = new Types.ObjectId(userId);
    const hasUseful    = advice.usefulVotes.some((v) => v.equals(uid));
    const hasNotUseful = advice.notUsefulVotes.some((v) => v.equals(uid));

    if (type === 'useful') {
      if (hasUseful) {
        advice.usefulVotes = advice.usefulVotes.filter((v) => !v.equals(uid));
      } else {
        advice.notUsefulVotes = advice.notUsefulVotes.filter((v) => !v.equals(uid));
        advice.usefulVotes.push(uid);
      }
    } else {
      if (hasNotUseful) {
        advice.notUsefulVotes = advice.notUsefulVotes.filter((v) => !v.equals(uid));
      } else {
        advice.usefulVotes = advice.usefulVotes.filter((v) => !v.equals(uid));
        advice.notUsefulVotes.push(uid);
      }
    }

    await advice.save();

    const newHasUseful    = advice.usefulVotes.some((v) => v.equals(uid));
    const newHasNotUseful = advice.notUsefulVotes.some((v) => v.equals(uid));

    return {
      usefulVotes:    advice.usefulVotes.length,
      notUsefulVotes: advice.notUsefulVotes.length,
      userVote: newHasUseful ? 'useful' : newHasNotUseful ? 'not_useful' : null,
    };
  }

  async remove(id: string, userId: string, userRole: string) {
    const advice = await this.adviceModel.findById(id);
    if (!advice) throw new NotFoundException('Conseil introuvable');

    const isAuthor = advice.author.toString() === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('Accès interdit');
    }

    await advice.deleteOne();
    return { message: 'Conseil supprimé' };
  }
}
