import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SafeZoneService } from './safety-zone.service';
import { SafeZoneController } from './safety-zone.controller';
import { SafeZone, SafeZoneSchema } from './entities/safety-zone.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SafeZone.name, schema: SafeZoneSchema }]),
  ],
  controllers: [SafeZoneController],
  providers: [SafeZoneService],
})
export class SafeZoneModule {}
