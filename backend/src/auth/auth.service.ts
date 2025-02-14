import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignTokenReturn, UserCreated } from './auth';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailService } from 'src/mail/mail.service';
import * as path from 'path';
import * as ejs from 'ejs';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from 'src/errors/http.error';
import { ErrorCode } from 'src/errors/error-codes.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
  ) {}

  async signup(dto: CreateUserDto): Promise<UserCreated> {
    const { email, name, lastname, password, username } = dto;
    const emailInUse = await this.userModel.findOne({ email });
    if (emailInUse) throw new ConflictError(ErrorCode.EMAIL_IS_ALREADY_IN_USE);

    const usernameInUse = await this.userModel.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    });
    if (usernameInUse)
      throw new ConflictError(ErrorCode.USERNAME_IS_ALREADY_IN_USE);

    const newUser = new this.userModel({
      email,
      name,
      lastname,
      password,
      username,
    });
    newUser.save();
    delete newUser.password;

    const userCreated: UserCreated = {
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      lastname: newUser.lastname,
      email_verified: newUser.email_verified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return userCreated;
  }

  async signin(dto: LoginUserDto) {
    const { email, password } = dto;
    if (!email) {
      throw new BadRequestError(ErrorCode.MISSING_EMAIL);
    }
    if (!password) {
      throw new BadRequestError(ErrorCode.MISSING_PASSWORD);
    }

    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new ForbiddenError(ErrorCode.INCORRECT_CREDENTIALS);

    const pwMatches = await argon2.verify(user.password, password);
    if (!pwMatches) throw new ForbiddenError(ErrorCode.INCORRECT_CREDENTIALS);

    delete user.password;
    return this.signToken({
      _id: String(user._id),
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      email_verified: user.email_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async signToken(user: UserCreated): Promise<SignTokenReturn> {
    const payload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_DURATION'),
    });

    return { access_token: token, user };
  }

  async sendVerificationCode(email: string, lang: 'pt-br' | 'en-us') {
    if (!email) throw new BadRequestError(ErrorCode.MISSING_EMAIL);

    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundError(ErrorCode.USER_NOT_FOUND);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = 300;
    await this.cacheManager.set(
      `verification:${email}`,
      code,
      expiresIn * 1000,
    );
    const templates = {
      'pt-br': 'email-verification(pt-br).ejs',
      'en-us': 'email-verification(en-us).ejs',
    };
    const emailTitle = {
      'pt-br': 'Verifique seu email',
      'en-us': 'Verify your email',
    };
    const template = templates[lang] || templates['en-us'];
    const name = user.name + ' ' + user.lastname;

    const templatePath = path.join(__dirname, '..', '..', 'views', template);
    const html = await ejs.renderFile(templatePath, {
      name,
      email,
      verificationCode: code,
      year: new Date().getFullYear(),
    });
    await this.mailService.sendMail(email, emailTitle[lang], html);

    return { message: 'Verification code successfully sent' };
  }

  async verifyEmail(email: string, lang: 'pt-br' | 'en-us', code: string) {
    if (!email) throw new BadRequestError(ErrorCode.MISSING_EMAIL);

    if (!code) throw new BadRequestError(ErrorCode.MISSING_VERIFICATION_CODE);

    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundError(ErrorCode.USER_NOT_FOUND);

    const storedCode = await this.cacheManager.get(`verification:${email}`);
    if (!storedCode)
      throw new NotFoundError(ErrorCode.VERIFICATION_CODE_NOT_FOUND);

    if (code !== storedCode)
      throw new ForbiddenError(ErrorCode.USER_SENT_INVALID_VERIFICATION_CODE);

    await this.userModel.findByIdAndUpdate(user._id, {
      email_verified: true,
    });

    return { message: 'Email successfully verified' };
  }
}
