import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const SELECTED_FIELDS = '-password -currentHashedRefreshToken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User & { _id: any }>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select(SELECTED_FIELDS);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing && existing._id.toString() !== userId) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }
    const user = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .select(SELECTED_FIELDS);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new UnauthorizedException('Mot de passe actuel incorrect');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();
    return { message: 'Mot de passe modifié avec succès' };
  }

  async updateAvatar(userId: string, avatarPath: string) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { profilePicture: avatarPath }, { new: true })
      .select(SELECTED_FIELDS);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async getSavedGuideIds(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).select('savedGuides').lean();
    if (!user) return [];
    return ((user as any).savedGuides ?? []).map((id: Types.ObjectId) => id.toString());
  }

  async toggleSavedGuide(userId: string, guideProfileId: string): Promise<{ saved: boolean }> {
    const user = await this.userModel.findById(userId).select('savedGuides');
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const gid = new Types.ObjectId(guideProfileId);
    const isSaved = (user as any).savedGuides.some((id: Types.ObjectId) => id.equals(gid));

    if (isSaved) {
      await this.userModel.findByIdAndUpdate(userId, { $pull: { savedGuides: gid } });
    } else {
      await this.userModel.findByIdAndUpdate(userId, { $addToSet: { savedGuides: gid } });
    }

    return { saved: !isSaved };
  }
}
