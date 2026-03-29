import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;
export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'GuideProfile', required: true })
  guideId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  touristId!: Types.ObjectId;

  // Format: 'YYYY-MM-DD'
  @Prop({ required: true })
  date!: string;

  @Prop({ maxlength: 500, default: '' })
  message!: string;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'pending',
  })
  status!: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
