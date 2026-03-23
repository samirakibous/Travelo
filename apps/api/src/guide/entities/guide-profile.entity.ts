import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExpertiseLevel } from '../enums/expertise-level.enum';

export type GuideProfileDocument = GuideProfile & Document;

@Schema({ timestamps: true })
export class GuideProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, maxlength: 500 })
  bio!: string;

  @Prop({ required: true })
  location!: string;

  @Prop({ type: Number, default: 0, min: 0 })
  hourlyRate!: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Specialty' }], default: [] })
  specialties!: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  languages!: string[];

  @Prop({ type: String, enum: ExpertiseLevel, default: ExpertiseLevel.LOCAL })
  expertiseLevel!: ExpertiseLevel;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating!: number;

  @Prop({ type: Number, default: 0 })
  reviewCount!: number;

  @Prop({ default: false })
  isCertified!: boolean;
}

export const GuideProfileSchema = SchemaFactory.createForClass(GuideProfile);
