import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDbModule } from './database/mongoose.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { InteractionsModule } from './interactions/interactions.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoDbModule,
    AuthModule,
    PostModule,
    InteractionsModule,
    UserModule,
    MailModule,
  ],
})
export class AppModule {}
