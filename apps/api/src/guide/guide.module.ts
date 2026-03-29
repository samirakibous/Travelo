import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuideService } from './guide.service';
import { GuideController } from './guide.controller';
import {
  GuideProfile,
  GuideProfileSchema,
} from './entities/guide-profile.entity';
import {
  Specialty,
  SpecialtySchema,
} from '../specialty/entities/specialty.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GuideProfile.name, schema: GuideProfileSchema },
      { name: Specialty.name, schema: SpecialtySchema },
    ]),
  ],
  controllers: [GuideController],
  providers: [GuideService],
})
export class GuideModule {}
