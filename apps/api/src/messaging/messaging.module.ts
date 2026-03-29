import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';
import { MessagingGateway } from './messaging.gateway';
import {
  Conversation,
  ConversationSchema,
} from './entities/conversation.entity';
import { Message, MessageSchema } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    AuthModule,
    NotificationModule,
  ],
  controllers: [MessagingController],
  providers: [MessagingService, MessagingGateway],
})
export class MessagingModule {}
