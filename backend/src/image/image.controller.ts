import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Post,
  UploadedFile,
  UseGuards,
  HttpCode,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard, JwtGuard } from 'src/guards';
import { GetUser } from 'src/auth/decorator';
import { UnsupportedMediaTypeError } from 'src/errors/http.error';
import { ErrorCode } from 'src/errors/error-codes.enum';

@Controller('/upload/images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/:postId')
  async getPostImages(@Param('postId') postId: string) {
    return await this.imageService.getPostImages(postId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard, AdminGuard)
  @Post('/:postId')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new UnsupportedMediaTypeError(ErrorCode.FILE_NOT_SUPPORTED),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @GetUser('id') userId: string,
    @Param('postId') postId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.imageService.uploadImage(userId, postId, file);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/:postId/:imageId')
  async deleteImage(
    @GetUser('id') userId: string,
    @Param('postId') postId: string,
    @Param('imageId') imageId: string,
  ) {
    return await this.imageService.deleteImage(userId, postId, imageId);
  }
}
