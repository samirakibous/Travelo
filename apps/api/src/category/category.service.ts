import { Injectable, ConflictException, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

const SEED_CATEGORIES = [
  { name: 'Sécurité',  slug: 'sécurité',  color: '#dc2626' },
  { name: 'Transport', slug: 'transport', color: '#2563eb' },
  { name: 'Arnaque',   slug: 'arnaque',   color: '#ea580c' },
  { name: 'Culture',   slug: 'culture',   color: '#9333ea' },
  { name: 'Incident',  slug: 'incident',  color: '#6b7280' },
];

@Injectable()
export class CategoryService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.categoryModel.countDocuments();
    if (count === 0) {
      await this.categoryModel.insertMany(SEED_CATEGORIES);
    }
  }

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  findAll() {
    return this.categoryModel.find().sort({ name: 1 }).lean();
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.toSlug(dto.name);
    const exists = await this.categoryModel.findOne({ slug });
    if (exists) throw new ConflictException('Une catégorie avec ce nom existe déjà');
    return this.categoryModel.create({ name: dto.name, slug, color: dto.color ?? '#6b7280' });
  }

  async update(id: string, dto: Partial<CreateCategoryDto>) {
    const update: Partial<Category> = {};
    if (dto.name) {
      update.name = dto.name;
      update.slug = this.toSlug(dto.name);
    }
    if (dto.color) update.color = dto.color;

    const updated = await this.categoryModel.findByIdAndUpdate(id, update, { new: true });
    if (!updated) throw new NotFoundException('Catégorie introuvable');
    return updated;
  }

  async remove(id: string) {
    const result = await this.categoryModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Catégorie introuvable');
    return { success: true };
  }
}
