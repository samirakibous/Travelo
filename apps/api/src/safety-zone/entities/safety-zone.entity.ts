import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SafeZoneDocument = SafeZone & Document;

export type RiskLevel = 'safe' | 'caution' | 'danger';
export type ZoneCategory = 'tourist' | 'transport' | 'accommodation' | 'food' | 'general';
export type ZoneType = 'point' | 'polygon';

@Schema({ timestamps: true })
export class SafeZone {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: ['safe', 'caution', 'danger'] })
  riskLevel!: RiskLevel;

  @Prop({ required: true, enum: ['tourist', 'transport', 'accommodation', 'food', 'general'] })
  category!: ZoneCategory;

  @Prop({ required: true, enum: ['point', 'polygon'] })
  type!: ZoneType;

  // Used when type === 'point'
  @Prop()
  lat?: number;

  @Prop()
  lng?: number;

  // Used when type === 'polygon'
  @Prop({ type: [{ lat: Number, lng: Number }] })
  coordinates?: { lat: number; lng: number }[];

  @Prop({ default: true })
  activeDay!: boolean;

  @Prop({ default: true })
  activeNight!: boolean;
}

export const SafeZoneSchema = SchemaFactory.createForClass(SafeZone);
