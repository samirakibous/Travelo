import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../user/entities/user.entity';
import { Post, PostSchema } from '../post/entities/post.entity';
import { Advice, AdviceSchema } from '../advice/entities/advice.entity';
import { SafeZone, SafeZoneSchema } from '../safety-zone/entities/safety-zone.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Advice.name, schema: AdviceSchema },
      { name: SafeZone.name, schema: SafeZoneSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
