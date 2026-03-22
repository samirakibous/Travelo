import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuideService } from './guide.service';
import { GuideController } from './guide.controller';
import { GuideProfile, GuideProfileSchema } from './entities/guide-profile.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GuideProfile.name, schema: GuideProfileSchema }]),
  ],
  controllers: [GuideController],
  providers: [GuideService],
})
export class GuideModule {}
