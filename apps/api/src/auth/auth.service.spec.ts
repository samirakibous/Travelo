import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Role } from './enums/role.enum';

const mockUserModel = () => {
  const model: any = jest.fn();
  model.findOne = jest.fn();
  model.countDocuments = jest.fn();
  model.findByIdAndUpdate = jest.fn();
  model.findById = jest.fn();
  model.prototype.save = jest.fn();
  return model;
};

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('signed-token'),
});

const mockConfigService = () => ({
  get: jest.fn().mockImplementation((key) => {
    if (key === 'JWT_EXPIRES_IN') return '1h';
    if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
    if (key === 'JWT_SECRET') return 'secret';
    return undefined;
  }),
});

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockImplementation((a, b) => a === b),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken('User'), useFactory: mockUserModel },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw if email already exists', async () => {
      userModel.findOne.mockResolvedValue({ email: 'test@test.com' });
      await expect(
        service.register({ email: 'test@test.com', password: 'Password1!', firstName: 'John', lastName: 'Doe' })
      ).rejects.toThrow(ConflictException);
    });

    it('should register as ADMIN if first user', async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.countDocuments.mockResolvedValue(0);
      userModel.mockImplementation((data: any) => {
        const userObj = {
          ...data,
          _id: { toString: () => '507f1f77bcf86cd799439011' },
          email: 'a',
          firstName: 'b',
          lastName: 'c',
          role: Role.ADMIN,
          save: jest.fn().mockResolvedValue(undefined),
        };
        return userObj;
      });
      // Mock getTokens pour éviter l'appel à _id.toString()
      jest.spyOn(service, 'getTokens').mockResolvedValue({ accessToken: 'a', refreshToken: 'b' });
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      const result = await service.register({ email: 'a', password: 'Password1!', firstName: 'b', lastName: 'c' });
      expect(result.user.role).toBe(Role.ADMIN);
      expect(result.user.id).toBe('507f1f77bcf86cd799439011');
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);
      await expect(
        service.login({ email: 'notfound@test.com', password: 'Password1!' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getTokens', () => {
    it('should return access and refresh tokens', async () => {
      const tokens = await service.getTokens('1', 'test@test.com', Role.TOURIST);
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });
  });
});
