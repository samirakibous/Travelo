import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import {
  GuideProfile,
  GuideProfileDocument,
} from '../guide/entities/guide-profile.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(GuideProfile.name)
    private guideModel: Model<GuideProfileDocument>,
  ) {}

  async findByGuide(guideId: string) {
    return this.reviewModel
      .find({ guideId })
      .populate('touristId', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .lean();
  }

  async create(
    touristId: string,
    userRole: string,
    guideId: string,
    dto: CreateReviewDto,
  ) {
    if (userRole !== Role.TOURIST) {
      throw new ForbiddenException(
        'Seuls les touristes peuvent laisser un avis',
      );
    }

    const guide = await this.guideModel.findById(guideId);
    if (!guide) throw new NotFoundException('Guide introuvable');

    // Prevent guide from reviewing themselves
    if (guide.userId.toString() === touristId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas noter votre propre profil',
      );
    }

    const existing = await this.reviewModel.findOne({ guideId, touristId });
    if (existing)
      throw new ConflictException(
        'Vous avez déjà laissé un avis pour ce guide',
      );

    const review = new this.reviewModel({ guideId, touristId, ...dto });
    await review.save();

    await this.recalculateRating(guideId);

    return review.populate('touristId', 'firstName lastName profilePicture');
  }

  async remove(reviewId: string, userId: string, userRole: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Avis introuvable');

    const isAuthor = review.touristId.toString() === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!isAuthor && !isAdmin) throw new ForbiddenException('Accès interdit');

    const guideId = review.guideId.toString();
    await review.deleteOne();
    await this.recalculateRating(guideId);

    return { message: 'Avis supprimé' };
  }

  private async recalculateRating(guideId: string) {
    const reviews = await this.reviewModel.find({ guideId }).lean();
    const count = reviews.length;
    const avg =
      count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    await this.guideModel.findByIdAndUpdate(guideId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: count,
    });
  }
}
