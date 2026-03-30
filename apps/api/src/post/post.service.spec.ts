import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';

const mockPostModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  populate: jest.fn(),
  save: jest.fn(),
});

describe('PostService', () => {
  let service: PostService;
  let postModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getModelToken('Post'), useFactory: mockPostModel },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postModel = module.get(getModelToken('Post'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      postModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
      });
      const result = await service.findAll();
      expect(result.data.length).toBe(2);
    });
  });

  describe('remove', () => {
    it('should throw if post not found', async () => {
      postModel.findById.mockResolvedValue(null);
      await expect(service.remove('id', 'user', Role.ADMIN)).rejects.toThrow(NotFoundException);
    });
    it('should throw if not author or admin', async () => {
      postModel.findById.mockResolvedValue({ author: { toString: () => 'other' }, deleteOne: jest.fn() });
      await expect(service.remove('id', 'user', Role.TOURIST)).rejects.toThrow(ForbiddenException);
    });
    it('should delete if author', async () => {
      const deleteOne = jest.fn();
      postModel.findById.mockResolvedValue({ author: { toString: () => 'user' }, deleteOne });
      const result = await service.remove('id', 'user', Role.TOURIST);
      expect(result).toHaveProperty('message');
      expect(deleteOne).toHaveBeenCalled();
    });
    it('should delete if admin', async () => {
      const deleteOne = jest.fn();
      postModel.findById.mockResolvedValue({ author: { toString: () => 'other' }, deleteOne });
      const result = await service.remove('id', 'admin', Role.ADMIN);
      expect(result).toHaveProperty('message');
      expect(deleteOne).toHaveBeenCalled();
    });
  });
});
