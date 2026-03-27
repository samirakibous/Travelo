import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, maxlength: 100 })
  title!: string;

  @Prop({ required: true, maxlength: 1000 })
  description!: string;

  @Prop({ required: true })
  destination!: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author!: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  upvotes!: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  downvotes!: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  mediaUrls!: string[];

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        reason: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  reports!: Array<{ user: Types.ObjectId; reason: string; createdAt: Date }>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
