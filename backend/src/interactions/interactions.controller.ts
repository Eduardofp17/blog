import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../guards';
import { InteractionsService } from './interactions.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
@Controller('posts')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post('/:postId/likes')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a like to a specified post' })
  @ApiParam({
    name: 'postId',
    description: 'The unique identifier of the post to like',
  })
  @ApiResponse({
    status: 201,
    description: 'The like was successfully added.',
    example: { msg: 'liked', success: true },
  })
  @ApiResponse({
    status: 400,
    description: 'The request failed due to an invalid post ID.',
  })
  addLike(@Param('postId') postId: string, @GetUser('id') userId: string) {
    return this.interactionsService.addLike(userId, postId);
  }

  // Unlike
  @Delete('/:postId/likes')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a like from a specified post' })
  @ApiParam({
    name: 'postId',
    description: 'The unique identifier of the post to remove the like from.',
  })
  @ApiResponse({
    status: 204,
    description: 'The like was successfully removed.',
  })
  @ApiResponse({
    status: 400,
    description: 'The request failed due to an invalid post ID.',
  })
  removeLike(@Param('postId') postId: string, @GetUser('id') userId: string) {
    return this.interactionsService.removeLike(userId, postId);
  }

  // Comments
  @Get('/:postId/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve comments for a given post' })
  @ApiParam({
    name: 'postId',
    description:
      'The unique identifier (ID) of the post whose comments are to be retrieved',
  })
  @ApiResponse({
    status: 200,
    description: 'Comments of the specified post.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: 'comment_id' },
          content: { type: 'string', example: 'my first comment' },
          author: { type: 'string', example: 'user_id' },
          postId: { type: 'string', example: 'post_id' },
          likes: { type: 'number', example: 1 },
          dislikes: { type: 'number', example: 0 },
          impressions: { type: 'number', example: 4 },
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
          __v: { type: 'number', example: 0 },
          likedBy: {
            type: 'array',
            items: { type: 'string' },
            example: ['user_id'],
          },
          dislikedBy: { type: 'array', items: { type: 'string' }, example: [] },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid post ID.',
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
  @ApiResponse({
    status: 404,
    description: 'No comments found.',
    example: {
      message: 'No comments yet.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  getComments(@Param('postId') postId: string) {
    return this.interactionsService.getComments(postId);
  }

  @Get('/:postId/comments/:commentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to get',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully get',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: 'reply_id' },
          content: { type: 'string', example: 'this is a reply' },
          author: { type: 'string', example: 'author_id' },
          postId: { type: 'string', example: 'post_id' },
          likes: { type: 'number', example: '0' },
          dislikes: { type: 'number', example: '0' },
          impression: { type: 'number', example: '0' },
          createdAt: {
            type: 'string',
            format: 'date-format',
            example: '2024-12-17T18:38:16.840Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-format',
            example: '2024-12-17T18:38:16.840Z',
          },
          likedBy: {
            type: 'array',
            items: {
              example: 'id of the user that liked the reply (user_id)',
            },
          },
          dislikedBy: {
            type: 'array',
            items: {
              example: 'id of the user that disliked the reply (user_id)',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Could happens when a user sent a bad ID.',
    example: {
      invalidId: {
        summary: 'Invalid ID.',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment not found',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  getCommentById(
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
  ) {
    return this.interactionsService.getCommentById(postId, commentId);
  }

  @Post('/:postId/comments')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a comment to a specific post' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The unique identifier (ID) of the post to comment on',
  })
  @ApiBody({
    description: 'The data of the comment to be created',
    type: CreateCommentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully added.',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'comment_id' },
        content: { type: 'string', example: 'my first comment' },
        author: { type: 'string', example: 'user_id' },
        postId: { type: 'string', example: 'post_id' },
        likes: { type: 'number', example: 1 },
        dislikes: { type: 'number', example: 0 },
        impressions: { type: 'number', example: 4 },
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
        __v: { type: 'number', example: 0 },
        likedBy: {
          type: 'array',
          items: { type: 'string' },
          example: ['user_id'],
        },
        dislikedBy: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid post ID.',
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
  addComment(
    @GetUser('id') userId: string,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.interactionsService.addComment(userId, postId, dto);
  }

  @Patch('/:postId/comments/:commentId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit a comment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be edited',
  })
  @ApiBody({
    description: 'The data for the comment to be updated',
    type: CreateCommentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully updated',
    schema: {
      type: 'object',
      properties: {
        acknowledged: { type: 'boolean', example: true },
        modifiedCount: { type: 'number', example: 1 },
        upsertedId: {
          oneOf: [
            { type: 'null', example: null },
            { type: 'string', example: 'someId' },
          ],
        },
        upsertedCount: { type: 'number', example: 0 },
        matchedCount: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid ID',
    example: {
      message: 'Invalid ID',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be the post or the comment.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment not found',
        value: {
          message: 'Comment not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  editComment(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.interactionsService.editComment(userId, postId, commentId, dto);
  }

  @Delete('/:postId/comments/:commentId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to be deleted',
  })
  @ApiResponse({
    status: 204,
    description: 'Comment successfully deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: "Invalid ID or attempting to delete another user's comment",
    examples: {
      invalidId: {
        summary: 'Occurs when the user provides an invalid ID',
        value: {
          message: 'Invalid ID',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      userTryingToDeleteOthersComment: {
        summary: "Occurs when a user attempts to delete another user's comment",
        value: {
          message: 'Forbidden action',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be the post or the comment.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment not found',
        value: {
          message: 'Comment not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  deleteComment(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
  ) {
    return this.interactionsService.deleteComment(userId, postId, commentId);
  }

  @Post('/:postId/comments/:commentId/like')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Like a comment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to like',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully liked',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid ID.',
    examples: {
      invalidId: {
        summary: 'Invalid ID.',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      alreadyLiked: {
        summary: 'User already liked this comment',
        value: {
          message: 'You can not like this comment again.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment not found',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  likeAComment(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
  ) {
    return this.interactionsService.likeAComment(userId, postId, commentId);
  }

  @Delete('/:postId/comments/:commentId/like')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a like in an comment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to delete',
  })
  @ApiResponse({
    status: 204,
    description: 'Like successfully removed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Could happens when a user sent a bad ID, have't liked the comment or tried to remove other user like.",
    examples: {
      invalidId: {
        summary: 'Invalid ID.',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      haveNotLiked: {
        summary: "User haven't liked this comment",
        value: {
          message: "You haven't liked this comment.",
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      userTriedToRemoveOtherUserLike: {
        summary: 'User tried to remove other user like',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment not found',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  removeLikeInAComment(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
  ) {
    return this.interactionsService.removeLikeInAComment(
      userId,
      postId,
      commentId,
    );
  }

  @Post('/:postId/comments/:commentId/dislike')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Dislike a comment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to dislike',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully disliked',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid ID.',
    examples: {
      invalidId: {
        summary: 'Invalid ID.',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      alreadyLiked: {
        summary: 'User already disliked this comment',
        value: {
          message: 'You can not dislike this comment again.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment not found',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  dislikeAComment(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
  ) {
    return this.interactionsService.dislikeAComment(userId, postId, commentId);
  }

  @Delete('/:postId/comments/:commentId/dislike')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove dislike in an comment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to remove the dislike',
  })
  @ApiResponse({
    status: 204,
    description: 'Disliked sucessfully removed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Could happens when a user sent a bad ID, haven't disliked the comment or tried to remove other user dislike",
    examples: {
      invalidId: {
        summary: 'Invalid ID.',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      haveNotDisliked: {
        summary: "User haven't disliked this post",
        value: {
          message: "You haven't disliked this comment.",
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      userTriedToRemoveOtherUserDislike: {
        summary: 'Happens when a user tried to remove other user dislike',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment not found',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  removeDislikeInAComment(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
  ) {
    return this.interactionsService.removeDislikeInAComment(
      userId,
      postId,
      commentId,
    );
  }
  // Replies
  @Get('/:postId/comments/:commentId/replies')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get replies of an comment' })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to get replies',
  })
  @ApiResponse({
    status: 200,
    description: 'Replies successfully get',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: 'reply_id' },
          content: { type: 'string', example: 'this is a reply' },
          author: { type: 'string', example: 'author_id' },
          commentId: { type: 'string', example: 'comment_id' },
          mention: {
            type: 'string',
            example: 'id of the author of the comment or reply',
          },
          likes: { type: 'number', example: '0' },
          dislikes: { type: 'number', example: '0' },
          impression: { type: 'number', example: '0' },
          createdAt: {
            type: 'string',
            format: 'date-format',
            example: '2024-12-17T18:38:16.840Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-format',
            example: '2024-12-17T18:38:16.840Z',
          },
          likedBy: {
            type: 'array',
            items: {
              example: 'id of the user that liked the reply (user_id)',
            },
          },
          dislikedBy: {
            type: 'array',
            items: {
              example: 'id of the user that disliked the reply (user_id)',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description:
      'Could happens when a user sent a bad ID or tried to remove other user dislike.',
    examples: {
      invalidId: {
        summary: 'Invalid ID.',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      userTriedToRemoveOtherUserDislike: {
        summary: 'Happens when a user tried to remove other user dislike',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentDoesNotHaveReplies: {
        summary: 'Comment does not have replies',
        value: {
          message: 'Comment does not have replies.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  getReplies(
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
  ) {
    return this.interactionsService.getReplies(postId, commentId);
  }

  @Get('/:postId/comments/:commentId/replies/:replyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reply by ID' })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment that reply belongs to',
  })
  @ApiParam({
    name: 'replyId',
    description: 'The ID of the reply to get',
  })
  @ApiResponse({
    status: 200,
    description: 'Reply successfully get',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: 'reply_id' },
          content: { type: 'string', example: 'this is a reply' },
          author: { type: 'string', example: 'author_id' },
          commentId: { type: 'string', example: 'comment_id' },
          mention: {
            type: 'string',
            example: 'id of the author of the comment or reply',
          },
          likes: { type: 'number', example: '0' },
          dislikes: { type: 'number', example: '0' },
          impression: { type: 'number', example: '0' },
          createdAt: {
            type: 'string',
            format: 'date-format',
            example: '2024-12-17T18:38:16.840Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-format',
            example: '2024-12-17T18:38:16.840Z',
          },
          likedBy: {
            type: 'array',
            items: {
              example: 'id of the user that liked the reply (user_id)',
            },
          },
          dislikedBy: {
            type: 'array',
            items: {
              example: 'id of the user that disliked the reply (user_id)',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Could happens when a user sent a bad ID.',
    example: {
      invalidId: {
        summary: 'Invalid ID.',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post, a comment or a reply.',
    examples: {
      postNotFound: {
        summary: 'Post not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment not found',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      replyNotFound: {
        summary: 'Reply was not found',
        value: {
          message: 'Reply not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  getReplyById(
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @Param('replyId') replyId: string,
  ) {
    return this.interactionsService.getReplyById(postId, commentId, replyId);
  }

  @Post('/:postId/comments/:commentId/replies')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reply a comment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that the comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to add a reply',
  })
  @ApiQuery({
    name: 'mention',
    description: "The ID of the comment's or reply's author (optional)",
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'Reply successfully created',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'reply_id' },
        content: { type: 'string', example: 'this is a reply' },
        author: { type: 'string', example: 'author_id' },
        commentId: { type: 'string', example: 'comment_id' },
        mention: { type: 'string', example: 'author_id' },
        likes: { type: 'number', example: 0 },
        dislikes: { type: 'number', example: 0 },
        impression: { type: 'number', example: 0 },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-12-17T18:38:16.840Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-12-17T18:38:16.840Z',
        },
        likedBy: {
          type: 'array',
          items: { type: 'string', example: 'user_id' },
        },
        dislikedBy: {
          type: 'array',
          items: { type: 'string', example: 'user_id' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid ID.',
    example: {
      message: 'Invalid ID.',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post was not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment was not found.',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  replyComment(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @Query('mention') mentionId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.interactionsService.replyComment(
      userId,
      postId,
      commentId,
      mentionId,
      dto,
    );
  }

  @Delete('/:postId/comments/:commentId/replies/:replyId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a reply' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that the comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: "The ID of the comment that reply's belongs to",
  })
  @ApiResponse({
    status: 204,
    description: 'Reply successfully deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'User sent a bad ID or tried to delete other user reply',
    examples: {
      invalidId: {
        summary: 'Happens when a user sent a bad ID',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      userTryingToDeleteOthersReply: {
        summary: 'Happens when a user try to delete other user reply',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post was not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment was not found.',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      replyNotFound: {
        summary: 'Reply was not found.',
        value: {
          message: 'Reply not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  deleteReply(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @Param('replyId') replyId: string,
  ) {
    return this.interactionsService.deleteReply(
      userId,
      postId,
      commentId,
      replyId,
    );
  }

  @Post('/:postId/comments/:commentId/replies/:replyId/like')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Like a reply' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that the comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: "The ID of the comment that reply's belongs to",
  })
  @ApiParam({
    name: 'replyId',
    description: 'The ID of the reply',
  })
  @ApiResponse({
    status: 201,
    description: 'Reply successfully liked',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'User sent a bad ID or already like the reply',
    examples: {
      invalidId: {
        summary: 'Happens when a user sent a bad ID',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      likeAlreadyExist: {
        summary: 'Happens when a user already liked the reply',
        value: {
          message: 'You can not like this reply again',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post or a comment.',
    examples: {
      postNotFound: {
        summary: 'Post was not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment was not found.',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      replyNotFound: {
        summary: 'Reply was not found.',
        value: {
          message: 'Reply not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  likeAReply(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @Param('replyId') replyId: string,
  ) {
    return this.interactionsService.likeAReply(
      userId,
      postId,
      commentId,
      replyId,
    );
  }

  @Delete('/:postId/comments/:commentId/replies/:replyId/like')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a like in a reply' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that the comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: "The ID of the comment that reply's belongs to",
  })
  @ApiParam({
    name: 'replyId',
    description: 'The ID of the reply',
  })
  @ApiResponse({
    status: 204,
    description: 'Like successfully removed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "User sent a bad ID, haven't liked the reply or tried to remove other's like",
    examples: {
      invalidId: {
        summary: 'Happens when a user sent a bad ID',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      likeAlreadyExist: {
        summary: "Happens when a user haven't liked the reply",
        value: {
          message: "You haven't liked this reply",
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      userTryingToRemoveOthersLike: {
        summary: 'Happens when a user tried to remove others like',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post, comment or a reply.',
    examples: {
      postNotFound: {
        summary: 'Post was not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment was not found.',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      replyNotFound: {
        summary: 'Reply was not found.',
        value: {
          message: 'Reply not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  removeLikeInAReply(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @Param('replyId') replyId: string,
  ) {
    return this.interactionsService.removeLikeInAReply(
      userId,
      postId,
      commentId,
      replyId,
    );
  }

  @Post('/:postId/comments/:commentId/replies/:replyId/dislike')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Dislike a reply' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that the comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: "The ID of the comment that reply's belongs to",
  })
  @ApiParam({
    name: 'replyId',
    description: 'The ID of the reply',
  })
  @ApiResponse({
    status: 201,
    description: 'Reply successfully disliked',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'User sent a bad ID or alreadu disliked the reply',
    examples: {
      invalidId: {
        summary: 'Happens when a user sent a bad ID',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      dislikeAlreadyExist: {
        summary: 'Happens when a user already disliked the reply',
        value: {
          message: 'You can not dislike this reply again',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post, comment or a reply.',
    examples: {
      postNotFound: {
        summary: 'Post was not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment was not found.',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      replyNotFound: {
        summary: 'Reply was not found.',
        value: {
          message: 'Reply not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  dislikeAReply(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @Param('replyId') replyId: string,
  ) {
    return this.interactionsService.dislikeAReply(
      userId,
      postId,
      commentId,
      replyId,
    );
  }

  @Delete('/:postId/comments/:commentId/replies/:replyId/dislike')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a dislike in a reply' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post that the comment belongs to',
  })
  @ApiParam({
    name: 'commentId',
    description: "The ID of the comment that reply's belongs to",
  })
  @ApiParam({
    name: 'replyId',
    description: 'The ID of the reply',
  })
  @ApiResponse({
    status: 204,
    description: 'Dislike successfully removed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "User sent a bad ID, haven't disliked the reply or tried to remove a other's dislike",
    examples: {
      invalidId: {
        summary: 'Happens when a user sent a bad ID',
        value: {
          message: 'Invalid ID.',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      likeAlreadyExist: {
        summary: "Happens when a user haven't disliked the reply",
        value: {
          message: "You haven't disliked this reply",
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      userTryingToRemoveOthersDislike: {
        summary: 'Happens when a user tried to remove others dislike',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found. Could be a post, comment or a reply.',
    examples: {
      postNotFound: {
        summary: 'Post was not found',
        value: {
          message: 'Post not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      commentNotFound: {
        summary: 'Comment was not found.',
        value: {
          message: 'Comment not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
      replyNotFound: {
        summary: 'Reply was not found.',
        value: {
          message: 'Reply not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  removeDislikeInAReply(
    @GetUser('id') userId: string,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @Param('replyId') replyId: string,
  ) {
    return this.interactionsService.removeDislikeInAReply(
      userId,
      postId,
      commentId,
      replyId,
    );
  }
}
