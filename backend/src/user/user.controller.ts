import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
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
import { RedefinePasswordDto, UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Must get the user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User successfully found',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'userId' },
        username: { type: 'string', example: 'Eduardofp17' },
        profilePic: { type: 'string', example: 'base64image' },
        name: { type: 'string', example: 'Eduardo' },
        lastname: { type: 'string', example: 'Pinheiro' },
        email: { type: 'string', example: 'example@email.com' },
        createdAt: {
          type: 'string',
          example: '2024-12-19T00:00:00.000Z',
          format: 'Date',
        },
        updatedAt: {
          type: 'string',
          example: '2024-12-19T00:00:00.000Z',
          format: 'Date',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'User sent a invalid ID',
    example: {
      message: 'Invalid ID.',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    example: {
      message: 'User not found.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  async getUsernameAndId(@Param('userId') userId: string) {
    return await this.usersService.getUsernameAndId(userId);
  }

  @UseGuards(JwtGuard)
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
  async editUser(@GetUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.editUser(userId, dto);
  }

  @UseGuards(JwtGuard)
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
  async deleteUser(@GetUser('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }

  @UseGuards(JwtGuard)
  @Patch('/me/profile-pic')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadProfilePic(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.uploadProfilePic(userId, file);
  }

  @UseGuards(JwtGuard)
  @Delete('/me/profile-pic')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfilePic(@GetUser('id') userId: string) {
    return await this.usersService.deleteProfilePic(userId);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
    @Query('lang') lang: 'pt-br' | 'en-us',
  ) {
    return await this.usersService.forgotPassword(email, lang);
  }

  @Patch('me/redefine-password/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Must delete the user data' })
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
  async redefinePassword(
    @Param('id') userId: string,
    @Body() dto: RedefinePasswordDto,
  ) {
    return await this.usersService.redefinePassword(userId, dto);
  }
}
