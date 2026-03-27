import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './entities/conversation.entity';
import { Message, MessageDocument } from './entities/message.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async findOrCreate(userId: string, participantId: string) {
    const uid = new Types.ObjectId(userId);
    const pid = new Types.ObjectId(participantId);

    const existing = await this.conversationModel
      .findOne({ participants: { $all: [uid, pid], $size: 2 } })
      .populate('participants', 'firstName lastName profilePicture role')
      .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'firstName lastName' } })
      .lean();

    if (existing) return existing;

    const conv = new this.conversationModel({ participants: [uid, pid] });
    await conv.save();
    return conv.populate('participants', 'firstName lastName profilePicture role');
  }

  async getConversations(userId: string) {
    return this.conversationModel
      .find({ participants: new Types.ObjectId(userId) })
      .populate('participants', 'firstName lastName profilePicture role')
      .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'firstName lastName' } })
      .sort({ updatedAt: -1 })
      .lean();
  }

  async getMessages(conversationId: string, userId: string) {
    const conv = await this.conversationModel.findById(conversationId);
    if (!conv) throw new NotFoundException('Conversation introuvable');

    const isParticipant = conv.participants.some((p) => p.equals(new Types.ObjectId(userId)));
    if (!isParticipant) throw new ForbiddenException('Accès interdit');

    return this.messageModel
      .find({ conversation: new Types.ObjectId(conversationId) })
      .populate('sender', 'firstName lastName profilePicture')
      .sort({ createdAt: 1 })
      .lean();
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const conv = await this.conversationModel.findById(conversationId);
    if (!conv) throw new NotFoundException('Conversation introuvable');

    const isParticipant = conv.participants.some((p) => p.equals(new Types.ObjectId(senderId)));
    if (!isParticipant) throw new ForbiddenException('Accès interdit');

    const msg = new this.messageModel({
      conversation: new Types.ObjectId(conversationId),
      sender: new Types.ObjectId(senderId),
      content,
    });
    await msg.save();

    conv.lastMessage = msg._id as Types.ObjectId;
    (conv as any).updatedAt = new Date();
    await conv.save();

    return this.messageModel
      .findById(msg._id)
      .populate('sender', 'firstName lastName profilePicture')
      .lean();
  }

  async markAsRead(conversationId: string, userId: string) {
    const conv = await this.conversationModel.findById(conversationId);
    if (!conv) throw new NotFoundException('Conversation introuvable');

    const isParticipant = conv.participants.some((p) => p.equals(new Types.ObjectId(userId)));
    if (!isParticipant) throw new ForbiddenException('Accès interdit');

    await this.messageModel.updateMany(
      {
        conversation: new Types.ObjectId(conversationId),
        sender: { $ne: new Types.ObjectId(userId) },
        isRead: false,
      },
      { isRead: true },
    );
    return { message: 'Messages marqués comme lus' };
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const conversations = await this.conversationModel
      .find({ participants: new Types.ObjectId(userId) })
      .select('_id')
      .lean();

    const checks = await Promise.all(
      conversations.map((conv) =>
        this.messageModel.countDocuments({
          conversation: conv._id,
          sender: { $ne: new Types.ObjectId(userId) },
          isRead: false,
        }),
      ),
    );

    const count = checks.filter((n) => n > 0).length;
    return { count };
  }

  getRecipientId(conv: { participants: Types.ObjectId[] }, senderId: string): string | null {
    const recipient = conv.participants.find((p) => !p.equals(new Types.ObjectId(senderId)));
    return recipient ? recipient.toString() : null;
  }
}
