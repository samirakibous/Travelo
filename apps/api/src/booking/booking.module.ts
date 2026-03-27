import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking, BookingSchema } from './entities/booking.entity';
import { GuideProfile, GuideProfileSchema } from '../guide/entities/guide-profile.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: GuideProfile.name, schema: GuideProfileSchema },
    ]),
    NotificationModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
