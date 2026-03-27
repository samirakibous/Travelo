import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SosController } from './sos.controller';
import { SosService } from './sos.service';
import { EmergencyContact, EmergencyContactSchema } from './entities/emergency-contact.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmergencyContact.name, schema: EmergencyContactSchema },
    ]),
    AuthModule,
  ],
  controllers: [SosController],
  providers: [SosService],
})
export class SosModule {}
