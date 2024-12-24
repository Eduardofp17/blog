import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../guards';
import { UpdateUserDto } from './dto';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Must edit the user data' })
  @ApiBody({ description: 'Data that could be updated', type: UpdateUserDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User successfully edited' })
  @ApiResponse({
    status: 401,
    description: 'User successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: '401' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User was not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found.' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: '404' },
      },
    },
  })
  editUser(@GetUser('id') userId: string, dto: UpdateUserDto) {
    return this.usersService.editUser(userId, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Must delete the user data' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  @ApiResponse({
    status: 401,
    description: 'User successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: '401' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User was not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found.' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: '404' },
      },
    },
  })
  deleteUser(@GetUser('id') userId: string) {
    this.usersService.deleteUser(userId);
  }
}
