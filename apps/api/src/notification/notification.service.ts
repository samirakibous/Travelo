import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notifModel: Model<NotificationDocument>,
  ) {}

  async create(payload: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    link: string;
  }) {
    console.log('[NotifService] creating notification for userId:', payload.userId, 'type:', payload.type);
    await this.notifModel.create({
      user: new Types.ObjectId(payload.userId),
      type: payload.type,
      title: payload.title,
      body: payload.body,
      link: payload.link,
    });
  }

  async getForUser(userId: string) {
    return this.notifModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notifModel.countDocuments({
      user: new Types.ObjectId(userId),
      isRead: false,
    });
    return { count };
  }

  async markAllRead(userId: string) {
    await this.notifModel.updateMany(
      { user: new Types.ObjectId(userId), isRead: false },
      { isRead: true },
    );
    return { message: 'Notifications marquées comme lues' };
  }

  async markOneRead(notifId: string, userId: string) {
    await this.notifModel.findOneAndUpdate(
      { _id: new Types.ObjectId(notifId), user: new Types.ObjectId(userId) },
      { isRead: true },
    );
    return { message: 'Notification lue' };
  }
}
