import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmergencyContactDocument = EmergencyContact & Document;

@Schema({ timestamps: true })
export class EmergencyContact {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop()
  relationship?: string;
}

export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);
