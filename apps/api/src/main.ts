import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // fallback base

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Fichiers statiques (avatars) accessibles via /uploads/avatars/filename
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Travelo API')
    .setDescription('Documentation de l\'API Travelo — plateforme de voyage connectant touristes et guides locaux')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('Auth', 'Authentification et gestion de session')
    .addTag('Users', 'Profil utilisateur et paramètres')
    .addTag('Guides', 'Profils de guides locaux')
    .addTag('Posts', 'Publications de la communauté')
    .addTag('Comments', 'Commentaires sur les publications')
    .addTag('Advices', 'Conseils de voyage par les guides')
    .addTag('Bookings', 'Réservations de guides')
    .addTag('Reviews', 'Avis sur les guides')
    .addTag('Safety Zones', 'Zones de sécurité géolocalisées')
    .addTag('Categories', 'Catégories de contenu')
    .addTag('Specialties', 'Spécialités des guides')
    .addTag('Messaging', 'Messagerie privée')
    .addTag('Notifications', 'Notifications utilisateur')
    .addTag('SOS', 'Contacts d\'urgence et numéros SOS')
    .addTag('Stats', 'Statistiques publiques')
    .addTag('Admin', 'Administration (accès restreint)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application running on: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`Swagger docs: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
