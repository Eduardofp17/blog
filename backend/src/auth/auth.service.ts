import {
  Injectable,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignTokenReturn, UserCreated } from './auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(dto: CreateUserDto): Promise<UserCreated> {
    const { email, name, lastname, password, username } = dto;
    const userEmail = await this.userModel.findOne({ email });
    if (userEmail) throw new ConflictException('Email is already in use.');

    const userUsername = await this.userModel.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    });
    if (userUsername)
      throw new ConflictException('Username is already in use.');

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
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return userCreated;
  }

  async signin(dto: LoginUserDto) {
    const { email, password } = dto;
    if (!email) {
      throw new BadRequestException('Email password are required.');
    }
    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new ForbiddenException('Incorrect credentials.');
    const pwMatches = await argon2.verify(user.password, password);
    if (!pwMatches) throw new ForbiddenException('Incorrect credentials.');
    delete user.password;
    return this.signToken(user.id, user.email);
  }

  async signToken(sub: string, email: string): Promise<SignTokenReturn> {
    const payload = { sub, email };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_DURATION'),
    });

    return { access_token: token };
  }
}
