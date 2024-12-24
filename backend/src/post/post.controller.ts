import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard, UsernameGuard } from '../guards';
import { CreatePostDto } from './dto';
import { GetUser } from '../auth/decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // POST /posts/ - It must create a new post
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, UsernameGuard)
  @Post()
  @ApiBody({ type: CreatePostDto, description: 'Post creation data' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'post_id' },
        title: { type: 'string', example: 'post title' },
        content: { type: 'string', example: 'post content' },
        author: { type: 'string', example: "author's id" },
        likes: { type: 'number', example: '0' },
        impressions: { type: 'number', example: '4' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-12-17T18:35:10.749Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-12-17T18:35:10.749Z',
        },
        __v: { type: 'number', example: '0' },
        likedBy: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
    example: {
      message: ['Title must be not empty', 'Title must be an string'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Could happens cause only the blog owner is allowed to create a post.',
    example: {},
  })
  createNewPost(@GetUser('id') authorId: string, @Body() dto: CreatePostDto) {
    return this.postService.createNewPost(authorId, dto);
  }

  // GET /posts/feed - It must show to the user all posts
  @ApiOperation({ summary: 'Retrieve all posts for the feed' })
  @HttpCode(HttpStatus.OK)
  @Get('/feed')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all posts.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: 'post_id' },
          title: { type: 'string', example: 'post title' },
          content: { type: 'string', example: 'post content' },
          author: { type: 'string', example: "author's id" },
          likes: { type: 'number', example: '0' },
          impressions: { type: 'number', example: '4' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-12-17T18:35:10.749Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-12-17T18:35:10.749Z',
          },
          __v: { type: 'number', example: '0' },
          likedBy: { type: 'array', items: { type: 'string' }, example: [] },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No posts found.',
    example: {
      message: 'No posts found.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  // GET /posts/:id - It must show a single post by the Unique Identifier
  @ApiOperation({ summary: 'Get a post by its Unique Identifier' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Unique Identifier of the post',
  })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'post_id' },
        title: { type: 'string', example: 'post title' },
        content: { type: 'string', example: 'post content' },
        author: { type: 'string', example: "author's id" },
        likes: { type: 'number', example: '0' },
        impressions: { type: 'number', example: '4' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-12-17T18:35:10.749Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-12-17T18:35:10.749Z',
        },
        __v: { type: 'number', example: '0' },
        likedBy: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'User sent a invalid post ID',
    example: {
      message: 'Invalid ID.',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No posts found.',
    example: {
      message: 'No posts found.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  // PATCH /posts/:id - It must update a post by Unique Identifier
  @ApiOperation({ summary: 'Update a post by its Unique Identifier' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, UsernameGuard)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Unique Identifier of the post to update',
  })
  @ApiBody({ type: UpdatePostDto, description: 'Post update data' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully.',
    schema: {
      type: 'object',
      properties: {
        acknowledged: { type: 'boolean', example: 'true' },
        modifiedCount: { type: 'number', example: '1' },
        upsertedId: { type: 'null', example: 'null' },
        upsertedCount: { type: 'number', example: '0' },
        matchedCount: { type: 'number', example: '1' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Could happens cause only the blog owner is allowed to create a post.',
    example: {},
  })
  @ApiResponse({
    status: 403,
    description: 'User sent a invalid post ID',
    example: {
      message: 'Invalid ID.',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    example: {
      message: 'Post not found.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  updatePostById(
    @GetUser('id') authorId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.updatePostById(authorId, id, dto);
  }

  // DELETE /posts/:id - It obviously must delete the post by the Unique Identifier. lmao
  @ApiOperation({ summary: 'Delete a post by its Unique Identifier' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, UsernameGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Unique Identifier of the post to delete',
  })
  @ApiResponse({ status: 204, description: 'Post deleted successfully.' })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Could happens cause only the blog owner is allowed to create a post.',
    example: {},
  })
  @ApiResponse({
    status: 403,
    description: 'User sent a invalid post ID',
    example: {
      message: 'Invalid ID.',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    example: {
      message: 'Post not found.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  deletePostById(@GetUser('id') authorId: string, @Param('id') id: string) {
    return this.postService.deletePostById(authorId, id);
  }
}
