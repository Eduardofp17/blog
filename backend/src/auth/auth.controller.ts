import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create account' })
  @ApiBody({ description: 'The user data to be created', type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'user_id' },
        username: { type: 'string', example: 'Eduardofp17' },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'Eduardo' },
        lastname: { type: 'string', example: 'Pinheiro' },
        createdAt: { type: 'string', example: '2024-12-19T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-12-19T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username is already in use.',
    examples: {
      emailIsAlreadyInUse: {
        summary: 'Email is already in use.',
        value: {
          message: 'Email is already in use.',
          error: 'Conflict',
          statusCode: 409,
        },
      },
      usernameIsAlreadyInUse: {
        summary: 'Username is already in use.',
        value: {
          message: 'Username is already in use.',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    },
  })
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user and return an authentication token' })
  @ApiBody({ description: 'User credentials to log in', type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'your.jwt.token' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Incorrect credentials.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Incorrect credentials.' },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Email and password are required.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Email and password are required.',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  signin(@Body() dto: LoginUserDto) {
    return this.authService.signin(dto);
  }

  @Post('signup/send-verification-code/:email')
  @HttpCode(HttpStatus.OK)
  sendVerificationCode(
    @Param('email') email: string,
    @Query('lang') lang: 'pt-br' | 'en-us',
  ) {
    return this.authService.sendVerificationCode(email, lang);
  }

  @UseInterceptors(CacheInterceptor)
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @Post('signup/verify-email/:email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(
    @Param('email') email: string,
    @Query('lang') lang: 'pt-br' | 'en-us',
    @Body('code') code: string,
  ) {
    return this.authService.verifyEmail(email, lang, code);
  }
}
