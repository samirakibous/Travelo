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
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '10', 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.destination) {
      filter.destination = { $regex: query.destination, $options: 'i' };
    }
    if (query.category) {
      filter.category = query.category;
    }

    const [data, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate('author', 'firstName lastName role')
        .sort(query.sort === 'popular' ? {} : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.postModel.countDocuments(filter),
    ]);

    // Tri par popularité côté application si besoin
    if (query.sort === 'popular') {
      data.sort((a, b) => (b.upvotes?.length ?? 0) - (a.upvotes?.length ?? 0));
    }

    return { data, total, page, limit };
  }

  async create(createPostDto: CreatePostDto, userId: string) {
    const post = new this.postModel({
      ...createPostDto,
      author: new Types.ObjectId(userId),
    });
    await post.save();
    return post.populate('author', 'firstName lastName role');
  }

  async update(postId: string, userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post introuvable');

    if (post.author.toString() !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier ce post");
    }

    Object.assign(post, updatePostDto);
    await post.save();
    return post.populate('author', 'firstName lastName role');
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

  async report(postId: string, userId: string, reason: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post introuvable');

    const userObjectId = new Types.ObjectId(userId);
    const alreadyReported = post.reports.some((r) => r.user.equals(userObjectId));
    if (alreadyReported) {
      throw new ForbiddenException('Vous avez déjà signalé ce post');
    }

    post.reports.push({ user: userObjectId, reason, createdAt: new Date() });
    await post.save();
    return { message: 'Post signalé' };
  }
}
