import { ErrorCode } from './error-codes.enum';

export const ErrorMessages = {
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.POST_NOT_FOUND]: 'Post not found',
  [ErrorCode.MISSING_IMAGE]: 'Missing image',
  [ErrorCode.INVALID_ID]: 'Invalid ID',
  [ErrorCode.IMAGE_ALREADY_EXIST]: 'Already exists a image with this name',
  [ErrorCode.FILE_NOT_SUPPORTED]:
    'Only image files are allowed! Supported formats: jpg, jpeg, png,',
  [ErrorCode.IMAGE_NOT_FOUND]: 'Image not found',
  [ErrorCode.UNABLE_TO_DELETE_THIS_IMAGE]:
    "Unable to delete other's user image",
};
