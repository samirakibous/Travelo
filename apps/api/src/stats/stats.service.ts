import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { GuideProfile } from '../guide/entities/guide-profile.entity';
import { Post } from '../post/entities/post.entity';
import { Advice } from '../advice/entities/advice.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(GuideProfile.name) private guideModel: Model<GuideProfile>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Advice.name) private adviceModel: Model<Advice>,
  ) {}

  async getPublicStats() {
    const [users, guides, posts, advices] = await Promise.all([
      this.userModel.countDocuments({ isActive: true }),
      this.guideModel.countDocuments(),
      this.postModel.countDocuments(),
      this.adviceModel.countDocuments(),
    ]);
    return { users, guides, posts, advices };
  }
}
