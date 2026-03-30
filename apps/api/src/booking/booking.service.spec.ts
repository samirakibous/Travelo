import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationService } from '../notification/notification.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockBookingModel = () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
});
const mockGuideModel = () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
});
const mockNotifService = () => ({
  create: jest.fn(),
});

describe('BookingService', () => {
  let service: BookingService;
  let bookingModel: any;
  let guideModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: getModelToken('Booking'), useFactory: mockBookingModel },
        { provide: getModelToken('GuideProfile'), useFactory: mockGuideModel },
        { provide: NotificationService, useFactory: mockNotifService },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingModel = module.get(getModelToken('Booking'));
    guideModel = module.get(getModelToken('GuideProfile'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if guide not found', async () => {
      guideModel.findById.mockResolvedValue(null);
      // Utiliser des ObjectId valides (24 caractères hex)
      const validTouristId = '507f1f77bcf86cd799439011';
      const validGuideId = '507f1f77bcf86cd799439012';
      await expect(service.create(validTouristId, validGuideId, { date: '2026-01-01' })).rejects.toThrow(NotFoundException);
    });
    it('should throw if date already booked', async () => {
      guideModel.findById.mockResolvedValue({ userId: 'u' });
      bookingModel.findOne.mockResolvedValue({});
      const validTouristId = '507f1f77bcf86cd799439011';
      const validGuideId = '507f1f77bcf86cd799439012';
      await expect(service.create(validTouristId, validGuideId, { date: '2026-01-01' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByTourist', () => {
    it('should call bookingModel.find', async () => {
      bookingModel.find.mockReturnValue({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue([]) });
      const validTouristId = '507f1f77bcf86cd799439011';
      const result = await service.findByTourist(validTouristId);
      expect(result).toEqual([]);
    });
  });

  describe('findByGuide', () => {
    it('should return [] if guide not found', async () => {
      guideModel.findOne.mockResolvedValue(null);
      const validUserId = '507f1f77bcf86cd799439013';
      const result = await service.findByGuide(validUserId);
      expect(result).toEqual([]);
    });
  });
});
