import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: String, enum: Role, default: Role.TOURIST })
  role!: Role;

  @Prop({ type: String, default: null })
  currentHashedRefreshToken!: string | null;

  @Prop({ type: String, default: null })
  profilePicture!: string | null;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'GuideProfile' }], default: [] })
  savedGuides!: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
