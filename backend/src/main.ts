import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // ── Security ──────────────────────────────────────────────────────────────
  app.use(helmet());
  const corsOrigins = configService
    .get<string>('FRONTEND_URL', 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server, curl, and same-origin tools
      if (!origin) {
        callback(null, true);
        return;
      }
      if (corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      // Vercel production + preview deployments
      if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // ── Global prefix ─────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Validation ────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strip unknown props
      forbidNonWhitelisted: true,
      transform: true,          // auto-transform to DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Serialization ─────────────────────────────────────────────────────────
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ── Exception filter ──────────────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Logging interceptor ───────────────────────────────────────────────────
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ── Swagger (disabled in production) ──────────────────────────────────────
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Beleqet API')
      .setDescription(
        'Beleqet Hiring Platform — Jobs Board, Freelance Marketplace, BeleqetSafe Escrow',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication & session management')
      .addTag('users', 'User profile management')
      .addTag('jobs', 'Job listings & search')
      .addTag('applications', 'Job applications & workflow')
      .addTag('freelance', 'Freelance gigs, bids & contracts')
      .addTag('escrow', 'BeleqetSafe escrow & payments')
      .addTag('wallet', 'Freelancer wallet & withdrawals')
      .addTag('notifications', 'Notification management')
      .addTag('analytics', 'Platform analytics')
      .addTag('contact', 'Contact & sales inquiries')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    logger.log(`Swagger UI → http://localhost:${port}/api/docs`);
  }

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Beleqet API running on http://localhost:${port}/api/v1`);
  logger.log(`   Environment: ${nodeEnv}`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err?.message ?? err);
  if (err?.stack) console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  const msg = String(reason);
  if (msg.includes('Redis') || msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND')) {
    console.warn('Redis queue warning (non-fatal):', msg);
    return;
  }
  console.error('Unhandled rejection:', reason);
});
