import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdviceService } from './advice.service';
import { AdviceController } from './advice.controller';
import { Advice, AdviceSchema } from './entities/advice.entity';
import {
  GuideProfile,
  GuideProfileSchema,
} from '../guide/entities/guide-profile.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Advice.name, schema: AdviceSchema },
      { name: GuideProfile.name, schema: GuideProfileSchema },
    ]),
  ],
  controllers: [AdviceController],
  providers: [AdviceService],
})
export class AdviceModule {}
