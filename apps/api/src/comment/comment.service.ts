import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async findByPost(postId: string) {
    return this.commentModel
      .find({ post: new Types.ObjectId(postId) })
      .populate('author', 'firstName lastName role')
      .sort({ createdAt: 1 })
      .lean();
  }

  async create(postId: string, userId: string, dto: CreateCommentDto) {
    const comment = new this.commentModel({
      post: new Types.ObjectId(postId),
      author: new Types.ObjectId(userId),
      content: dto.content,
    });
    await comment.save();
    return comment.populate('author', 'firstName lastName role');
  }

  async remove(commentId: string, userId: string, userRole: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Commentaire introuvable');

    const isAuthor = comment.author.toString() === userId;
    const isAdmin = userRole === Role.ADMIN;
    if (!isAuthor && !isAdmin) throw new ForbiddenException('Accès interdit');

    await comment.deleteOne();
    return { message: 'Commentaire supprimé' };
  }
}
