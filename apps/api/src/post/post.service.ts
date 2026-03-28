import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAll(query: QueryPostDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.category) {
      filter.category = new Types.ObjectId(query.category);
    }

    const [data, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate('author', 'firstName lastName role')
        .populate('category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.postModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async create(createPostDto: CreatePostDto, userId: string, mediaUrls: string[] = []) {
    const post = new this.postModel({
      ...createPostDto,
      author: new Types.ObjectId(userId),
      mediaUrls,
    });
    await post.save();
    return post.populate(['author', 'category']);
  }

  async update(postId: string, userId: string, updatePostDto: UpdatePostDto, mediaUrls: string[] = []) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post introuvable');

    if (post.author.toString() !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier ce post");
    }

    Object.assign(post, updatePostDto);
    if (mediaUrls.length > 0) post.mediaUrls = mediaUrls;
    await post.save();
    return post.populate(['author', 'category']);
  }

  async remove(postId: string, userId: string, userRole: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post introuvable');

    const isAuthor = post.author.toString() === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer ce post");
    }

    await post.deleteOne();
    return { message: 'Post supprimé' };
  }

  async vote(postId: string, userId: string, type: 'up' | 'down') {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post introuvable');

    const userObjectId = new Types.ObjectId(userId);
    const hasUpvoted = post.upvotes.some((id) => id.equals(userObjectId));
    const hasDownvoted = post.downvotes.some((id) => id.equals(userObjectId));

    if (type === 'up') {
      if (hasUpvoted) {
        post.upvotes = post.upvotes.filter((id) => !id.equals(userObjectId));
      } else {
        post.downvotes = post.downvotes.filter((id) => !id.equals(userObjectId));
        post.upvotes.push(userObjectId);
      }
    } else {
      if (hasDownvoted) {
        post.downvotes = post.downvotes.filter((id) => !id.equals(userObjectId));
      } else {
        post.upvotes = post.upvotes.filter((id) => !id.equals(userObjectId));
        post.downvotes.push(userObjectId);
      }
    }

    await post.save();
    return {
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
      userVote: type === 'up' && !hasUpvoted ? 'up' : type === 'down' && !hasDownvoted ? 'down' : null,
    };
  }

}
