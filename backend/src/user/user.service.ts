import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async editUser(userId: string, dto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(userId))
      throw new ForbiddenException('Invalid ID');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found.');

    const response = await this.userModel.findByIdAndUpdate(userId, dto);
    return response;
  }

  async deleteUser(userId: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new ForbiddenException('Invalid ID');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found.');

    await this.userModel.deleteOne({ _id: userId });
  }
}
