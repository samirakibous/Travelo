import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockUserModel = () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
});

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockImplementation((a, b) => a === b),
}));

describe('UserService', () => {
  let service: UserService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken('User'), useFactory: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should throw if user not found', async () => {
      userModel.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
      await expect(service.getProfile('id')).rejects.toThrow(NotFoundException);
    });
    it('should return user if found', async () => {
      userModel.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ id: 'id', email: 'a' }) });
      const user = await service.getProfile('id');
      expect(user).toHaveProperty('id');
    });
  });

  describe('updateProfile', () => {
    it('should throw if email already used', async () => {
      userModel.findOne.mockResolvedValue({ _id: 'otherid' });
      await expect(service.updateProfile('id', { email: 'a' })).rejects.toThrow(ConflictException);
    });
    it('should throw if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
      await expect(service.updateProfile('id', { email: 'a' })).rejects.toThrow(NotFoundException);
    });
    it('should return updated user', async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue({ id: 'id', email: 'a' }) });
      const user = await service.updateProfile('id', { email: 'a' });
      expect(user).toHaveProperty('id');
    });
  });

  describe('changePassword', () => {
    it('should throw if user not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(service.changePassword('id', { currentPassword: 'a', newPassword: 'b' })).rejects.toThrow(NotFoundException);
    });
    it('should throw if current password is invalid', async () => {
      userModel.findById.mockResolvedValue({ password: 'notmatch', save: jest.fn() });
      await expect(service.changePassword('id', { currentPassword: 'wrong', newPassword: 'b' })).rejects.toThrow(UnauthorizedException);
    });
    it('should update password if valid', async () => {
      const save = jest.fn();
      userModel.findById.mockResolvedValue({ password: 'a', save });
      const result = await service.changePassword('id', { currentPassword: 'a', newPassword: 'b' });
      expect(result).toHaveProperty('message');
      expect(save).toHaveBeenCalled();
    });
  });

  describe('updateAvatar', () => {
    it('should throw if user not found', async () => {
      userModel.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
      await expect(service.updateAvatar('id', 'avatar.png')).rejects.toThrow(NotFoundException);
    });
    it('should return user with new avatar', async () => {
      userModel.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue({ id: 'id', profilePicture: 'avatar.png' }) });
      const user = await service.updateAvatar('id', 'avatar.png');
      expect(user).toHaveProperty('profilePicture', 'avatar.png');
    });
  });
});
