import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { RedefinePasswordDto, UpdateUserDto } from './dto';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import * as ejs from 'ejs';
import { MailService } from 'src/mail/mail.service';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from 'src/errors/http.error';
import { ErrorCode } from 'src/errors/error-codes.enum';
import { Post } from 'src/schemas/post.schema';
import { Replies } from 'src/schemas/replies.schema';
import { Comments } from 'src/schemas/comments.schema';
import { Images } from 'src/schemas/images.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(User.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly repliesModel: Model<Replies>,
    @InjectModel(User.name) private readonly commentsModel: Model<Comments>,
    @InjectModel(User.name) private readonly imagesModel: Model<Images>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async getUsernameAndId(userId: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundError(ErrorCode.USER_NOT_FOUND);
    const {
      _id,
      username,
      profilePic,
      name,
      lastname,
      email,
      createdAt,
      updatedAt,
    } = user;

    return {
      _id,
      username,
      profilePic,
      name,
      lastname,
      email,
      createdAt,
      updatedAt,
    };
  }

  async editUser(userId: string, dto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { ...dto },
      { new: true },
    );
    if (!user) {
      throw new NotFoundError(ErrorCode.USER_NOT_FOUND);
    }

    return user;
  }

  async redefinePassword(userId: string, dto: RedefinePasswordDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    }
    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );
    if (!user) {
      throw new NotFoundError(ErrorCode.USER_NOT_FOUND);
    }

    return user;
  }

  async deleteUser(userId: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundError(ErrorCode.USER_NOT_FOUND);

    const comments = await this.commentsModel.find({ author: userId });

    await this.commentsModel.deleteMany({ author: userId });
    await this.repliesModel.deleteMany({ author: userId });
    await this.postModel.deleteMany({ author: userId });
    await this.imagesModel.deleteMany({ authorId: userId });

    const postIds = comments.map((comment) => comment.postId);

    await this.postModel
      .updateMany({ _id: { $in: postIds } }, { $inc: { comments: -1 } })
      .exec();

    await this.postModel
      .updateMany({ likedBy: userId }, { $inc: { likes: -1 } })
      .exec();

    await this.commentsModel
      .updateMany({ likedBy: userId }, { $inc: { likes: -1 } })
      .exec();

    await this.commentsModel
      .updateMany({ dislikedBy: userId }, { $inc: { dislikes: -1 } })
      .exec();

    await this.repliesModel
      .updateMany({ likedBy: userId }, { $inc: { likes: -1 } })
      .exec();

    await this.repliesModel
      .updateMany({ dislikedBy: userId }, { $inc: { dislikes: -1 } })
      .exec();

    await this.userModel.deleteOne({ _id: userId });
  }

  async uploadProfilePic(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    if (!Types.ObjectId.isValid(userId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    if (!file || !file.buffer)
      throw new BadRequestError(ErrorCode.MISSING_FILE);

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundError(ErrorCode.USER_NOT_FOUND);

    const base64image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    user.profilePic = base64image;
    return user.save();
  }

  async deleteProfilePic(userId: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundError(ErrorCode.USER_NOT_FOUND);
    await user.updateOne({ profilePic: '' });
  }

  async forgotPassword(email: string, lang: 'pt-br' | 'en-us') {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundError(ErrorCode.USER_NOT_FOUND);
    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '30m',
    });

    const templates = {
      'pt-br': 'forgot-password(pt-br).ejs',
      'en-us': 'forgot-password(en-us).ejs',
    };
    const emailTitle = {
      'pt-br': 'Redefinição de senha',
      'en-us': 'Reset Your Password',
    };
    const template = templates[lang] || templates['en-us'];

    const name = user.name + ' ' + user.lastname;
    const base_front_url = this.config.get<string>('FRONT_URL');
    const resetLink = `${base_front_url}/recovery-password/?token=${token}`;

    const templatePath = path.join(__dirname, '..', '..', 'views', template);
    const html = await ejs.renderFile(templatePath, {
      name,
      email,
      resetLink,
      year: new Date().getFullYear(),
    });

    await this.mailService.sendMail(email, emailTitle[lang], html);

    return { message: 'Recovery password successfully sent.' };
  }
}
