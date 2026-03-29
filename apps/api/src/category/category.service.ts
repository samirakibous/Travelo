import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Post, PostDocument } from '../post/entities/post.entity';

const SEED_CATEGORIES = [
  { name: 'Sécurité', color: '#dc2626' },
  { name: 'Transport', color: '#2563eb' },
  { name: 'Arnaque', color: '#ea580c' },
  { name: 'Culture', color: '#9333ea' },
  { name: 'Incident', color: '#6b7280' },
];

@Injectable()
export class CategoryService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.categoryModel.countDocuments();
    if (count === 0) {
      await this.categoryModel.insertMany(SEED_CATEGORIES);
    }
  }

  findAll() {
    return this.categoryModel.find().sort({ name: 1 }).lean();
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.categoryModel.findOne({
      name: { $regex: `^${dto.name}$`, $options: 'i' },
    });
    if (exists)
      throw new ConflictException('Une catégorie avec ce nom existe déjà');
    return this.categoryModel.create({
      name: dto.name,
      color: dto.color ?? '#6b7280',
    });
  }

  async update(id: string, dto: Partial<CreateCategoryDto>) {
    const update: Partial<Category> = {};
    if (dto.name) update.name = dto.name;
    if (dto.color) update.color = dto.color;

    const updated = await this.categoryModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Catégorie introuvable');
    return updated;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Catégorie introuvable');

    const postsCount = await this.postModel.countDocuments({
      category: new Types.ObjectId(id),
    });
    if (postsCount > 0)
      throw new BadRequestException(
        `Impossible de supprimer : ${postsCount} post(s) utilisent cette catégorie`,
      );

    await this.categoryModel.findByIdAndDelete(id);
    return { success: true };
  }
}
