import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Post, PostDocument } from '../post/entities/post.entity';
import { Advice, AdviceDocument } from '../advice/entities/advice.entity';
import { SafeZone, SafeZoneDocument } from '../safety-zone/entities/safety-zone.entity';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Advice.name) private adviceModel: Model<AdviceDocument>,
    @InjectModel(SafeZone.name) private safeZoneModel: Model<SafeZoneDocument>,
  ) {}

  async getStats() {
    const [totalUsers, activeUsers, totalPosts, reportedPosts, totalAdvices, totalZones] =
      await Promise.all([
        this.userModel.countDocuments(),
        this.userModel.countDocuments({ isActive: true }),
        this.postModel.countDocuments(),
        this.postModel.countDocuments({ 'reports.0': { $exists: true } }),
        this.adviceModel.countDocuments(),
        this.safeZoneModel.countDocuments(),
      ]);

    return {
      users: { total: totalUsers, active: activeUsers, banned: totalUsers - activeUsers },
      posts: totalPosts,
      reportedPosts,
      advices: totalAdvices,
      zones: totalZones,
    };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password -currentHashedRefreshToken')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(query),
    ]);

    return { data, total, page, limit };
  }

  async updateUserRole(userId: string, role: Role) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).select('-password -currentHashedRefreshToken');
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async toggleUserActive(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    user.isActive = !user.isActive;
    await user.save();
    return { id: userId, isActive: user.isActive };
  }

  async deleteUser(userId: string) {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) throw new NotFoundException('Utilisateur introuvable');
    return { success: true };
  }

  async getPosts(page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.postModel
        .find()
        .populate('author', 'firstName lastName email')
        .populate('category')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.postModel.countDocuments(),
    ]);
    return { data, total, page, limit };
  }

  async deletePost(postId: string) {
    const result = await this.postModel.findByIdAndDelete(postId);
    if (!result) throw new NotFoundException('Publication introuvable');
    return { success: true };
  }

  async getAdvices(page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.adviceModel
        .find()
        .populate('author', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.adviceModel.countDocuments(),
    ]);
    return { data, total, page, limit };
  }

  async deleteAdvice(adviceId: string) {
    const result = await this.adviceModel.findByIdAndDelete(adviceId);
    if (!result) throw new NotFoundException('Conseil introuvable');
    return { success: true };
  }
}
