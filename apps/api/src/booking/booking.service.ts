import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './entities/booking.entity';
import { GuideProfile, GuideProfileDocument } from '../guide/entities/guide-profile.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(GuideProfile.name) private guideModel: Model<GuideProfileDocument>,
    private readonly notifService: NotificationService,
  ) {}

  // Tourist creates a booking request
  async create(touristId: string, guideId: string, dto: CreateBookingDto) {
    const guideOid = new Types.ObjectId(guideId);
    const touristOid = new Types.ObjectId(touristId);

    const guide = await this.guideModel.findById(guideOid);
    if (!guide) throw new NotFoundException('Guide introuvable');

    if (guide.availableDates.length > 0 && !guide.availableDates.includes(dto.date)) {
      throw new BadRequestException('Cette date n\'est pas disponible');
    }

    const existing = await this.bookingModel.findOne({
      guideId: guideOid,
      date: dto.date,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (existing) throw new BadRequestException('Cette date est déjà réservée');

    const booking = new this.bookingModel({
      guideId: guideOid,
      touristId: touristOid,
      date: dto.date,
      message: dto.message ?? '',
    });
    await booking.save();

    // Notify the guide
    await this.notifService.create({
      userId: guide.userId.toString(),
      type: 'new_booking',
      title: 'Nouvelle demande de réservation',
      body: `Un touriste souhaite vous réserver pour le ${dto.date}`,
      link: '/dashboard/bookings',
    });

    return booking
      .populate('touristId', 'firstName lastName profilePicture email')
      .then((b) => b.populate('guideId', 'userId hourlyRate'));
  }

  // Tourist: see their own bookings
  async findByTourist(touristId: string) {
    return this.bookingModel
      .find({ touristId: new Types.ObjectId(touristId) })
      .populate({
        path: 'guideId',
        select: 'userId hourlyRate location',
        populate: { path: 'userId', select: 'firstName lastName profilePicture' },
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  // Guide: see incoming booking requests
  async findByGuide(userId: string) {
    const guide = await this.guideModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!guide) return [];

    return this.bookingModel
      .find({ guideId: guide._id })
      .populate('touristId', 'firstName lastName profilePicture email')
      .sort({ createdAt: -1 })
      .lean();
  }

  async confirm(bookingId: string, userId: string) {
    return this.updateStatus(bookingId, userId, 'confirmed', 'guide');
  }

  async reject(bookingId: string, userId: string) {
    return this.updateStatus(bookingId, userId, 'rejected', 'guide');
  }

  async cancel(bookingId: string, userId: string) {
    return this.updateStatus(bookingId, userId, 'cancelled', 'tourist');
  }

  private async updateStatus(
    bookingId: string,
    userId: string,
    status: 'confirmed' | 'rejected' | 'cancelled',
    actor: 'guide' | 'tourist',
  ) {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate('guideId', 'userId');
    if (!booking) throw new NotFoundException('Réservation introuvable');

    if (actor === 'guide') {
      const guide = booking.guideId as any;
      if (guide.userId.toString() !== userId) throw new ForbiddenException('Accès interdit');
    } else {
      if (booking.touristId.toString() !== userId) throw new ForbiddenException('Accès interdit');
      if (booking.status !== 'pending') throw new BadRequestException('Seules les réservations en attente peuvent être annulées');
    }

    booking.status = status;
    await booking.save();

    // Send notification
    const guide = booking.guideId as any;
    if (actor === 'guide') {
      // Notify tourist
      const LABELS: Record<string, string> = {
        confirmed: 'confirmée',
        rejected: 'refusée',
      };
      await this.notifService.create({
        userId: booking.touristId.toString(),
        type: status === 'confirmed' ? 'booking_confirmed' : 'booking_rejected',
        title: `Réservation ${LABELS[status] ?? status}`,
        body: `Votre réservation a été ${LABELS[status] ?? status} par le guide`,
        link: '/dashboard/bookings',
      });
    } else {
      // Notify guide
      await this.notifService.create({
        userId: guide.userId.toString(),
        type: 'booking_cancelled',
        title: 'Réservation annulée',
        body: 'Un touriste a annulé sa réservation',
        link: '/dashboard/bookings',
      });
    }

    return booking;
  }
}
