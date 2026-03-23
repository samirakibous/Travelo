import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';
import { Specialty, SpecialtySchema } from './entities/specialty.entity';
import { GuideProfile, GuideProfileSchema } from '../guide/entities/guide-profile.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Specialty.name, schema: SpecialtySchema },
    { name: GuideProfile.name, schema: GuideProfileSchema },
  ])],
  controllers: [SpecialtyController],
  providers: [SpecialtyService],
  exports: [MongooseModule],
})
export class SpecialtyModule {}
