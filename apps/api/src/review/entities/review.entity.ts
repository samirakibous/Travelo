import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'GuideProfile', required: true })
  guideId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  touristId!: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating!: number;

  @Prop({ required: true, maxlength: 1000 })
  comment!: string;

  @Prop({ type: [String], default: [] })
  photos!: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// One review per tourist per guide
ReviewSchema.index({ guideId: 1, touristId: 1 }, { unique: true });
