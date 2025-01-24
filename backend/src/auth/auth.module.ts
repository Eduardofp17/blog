import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy, MailService],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
