import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { User, UserSchema } from '../user/entities/user.entity';
import {
  GuideProfile,
  GuideProfileSchema,
} from '../guide/entities/guide-profile.entity';
import { Post, PostSchema } from '../post/entities/post.entity';
import { Advice, AdviceSchema } from '../advice/entities/advice.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: GuideProfile.name, schema: GuideProfileSchema },
      { name: Post.name, schema: PostSchema },
      { name: Advice.name, schema: AdviceSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
