import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { getModelToken } from '@nestjs/mongoose';

const mockNotifModel = () => ({
  create: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  updateMany: jest.fn(),
  findOneAndUpdate: jest.fn(),
});

describe('NotificationService', () => {
  let service: NotificationService;
  let notifModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: getModelToken('Notification'), useFactory: mockNotifModel },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notifModel = module.get(getModelToken('Notification'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a notification', async () => {
    notifModel.create.mockResolvedValue({});
    const validUserId = '507f1f77bcf86cd799439011';
    await expect(service.create({ userId: validUserId, type: 'new_booking', title: 't', body: 'b', link: '/' })).resolves.toBeUndefined();
    expect(notifModel.create).toHaveBeenCalled();
  });

  it('should get notifications for user', async () => {
    notifModel.find.mockReturnValue({ sort: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue([]) });
    const validUserId = '507f1f77bcf86cd799439011';
    const result = await service.getForUser(validUserId);
    expect(result).toEqual([]);
  });

  it('should get unread count', async () => {
    notifModel.countDocuments.mockResolvedValue(3);
    const validUserId = '507f1f77bcf86cd799439011';
    const result = await service.getUnreadCount(validUserId);
    expect(result.count).toBe(3);
  });

  it('should mark all as read', async () => {
    notifModel.updateMany.mockResolvedValue({});
    const validUserId = '507f1f77bcf86cd799439011';
    const result = await service.markAllRead(validUserId);
    expect(result).toHaveProperty('message');
  });

  it('should mark one as read', async () => {
    notifModel.findOneAndUpdate.mockResolvedValue({});
    const validNotifId = '507f1f77bcf86cd799439014';
    const validUserId = '507f1f77bcf86cd799439011';
    const result = await service.markOneRead(validNotifId, validUserId);
    expect(result).toHaveProperty('message');
  });
});
