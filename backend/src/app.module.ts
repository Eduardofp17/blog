import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDbModule } from './database/mongoose.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { InteractionsModule } from './interactions/interactions.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'redis-16737.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
      port: 16737,
      ttl: 60000,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000,
          limit: 50,
        },
      ],
    }),
    MongoDbModule,
    AuthModule,
    PostModule,
    InteractionsModule,
    UserModule,
    MailModule,
    ImageModule,
  ],

  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
