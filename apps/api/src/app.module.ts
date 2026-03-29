import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { GuideModule } from './guide/guide.module';
import { AdviceModule } from './advice/advice.module';
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './category/category.module';
import { SpecialtyModule } from './specialty/specialty.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { MessagingModule } from './messaging/messaging.module';
import { SosModule } from './sos/sos.module';
import { CommentModule } from './comment/comment.module';
import { StatsModule } from './stats/stats.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(
          __dirname,
          `../.env.${process.env.NODE_ENV || 'development'}`,
        ),
        path.resolve(__dirname, '../.env'),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') || process.env.MONGODB_URI,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PostModule,
    GuideModule,
    AdviceModule,
    AdminModule,
    CategoryModule,
    SpecialtyModule,
    ReviewModule,
    BookingModule,
    MessagingModule,
    SosModule,
    CommentModule,
    StatsModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
