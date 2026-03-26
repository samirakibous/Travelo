import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdviceDocument = Advice & Document;

export type AdviceCategory = 'safety' | 'health' | 'transport' | 'culture' | 'emergency';
export type AdviceType = 'danger' | 'prudence' | 'recommandation';

@Schema({ timestamps: true })
export class Advice {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true, enum: ['safety', 'health', 'transport', 'culture', 'emergency'] })
  category!: AdviceCategory;

  @Prop({ required: true, enum: ['danger', 'prudence', 'recommandation'], default: 'prudence' })
  adviceType!: AdviceType;

  @Prop({ required: true, type: Number })
  lat!: number;

  @Prop({ required: true, type: Number })
  lng!: number;

  @Prop()
  address?: string;

  @Prop({ type: [String], default: [] })
  mediaUrls!: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  usefulVotes!: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  notUsefulVotes!: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author!: Types.ObjectId;

  // Denormalized at creation time — avoids an extra join on every read
  @Prop({ default: false })
  isCertifiedGuide!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'SafeZone' })
  linkedZone?: Types.ObjectId;
}

export const AdviceSchema = SchemaFactory.createForClass(Advice);
