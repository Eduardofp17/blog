import { ErrorCode } from './error-codes.enum';

export const ErrorMessages = {
  // Bad Request [400]
  [ErrorCode.MISSING_IMAGE]: 'Missing image',
  [ErrorCode.MISSING_FILE]: 'Missing file',
  [ErrorCode.MISSING_EMAIL]: 'Missing email',
  [ErrorCode.MISSING_PASSWORD]: 'Missing password',
  [ErrorCode.MISSING_VERIFICATION_CODE]: 'Missing verification code',

  //Unauthorized [401]
  [ErrorCode.ONLY_ADMINS_ALLOWED]: 'Only admins can access this route',

  //Forbidden [403]
  [ErrorCode.INVALID_ID]: 'Invalid ID',
  [ErrorCode.UNABLE_TO_DELETE_THIS_IMAGE]:
    "Unable to delete another user's image",
  [ErrorCode.UNABLE_TO_DELETE_THIS_COMMENT]:
    "Unable to delete another user's comment",
  [ErrorCode.UNABLE_TO_EDIT_THIS_COMMENT]:
    "Unable to edit another user's comment",
  [ErrorCode.UNABLE_TO_DELETE_THIS_REPLY]:
    "Unable to delete another user's reply",
  [ErrorCode.UNABLE_TO_EDIT_THIS_POST]: "Unable to edit another user's post",
  [ErrorCode.UNABLE_TO_DELETE_THIS_POST]:
    "Unable to delete another user's post",
  [ErrorCode.INCORRECT_CREDENTIALS]: 'Incorrect credentials',
  [ErrorCode.USER_SENT_INVALID_VERIFICATION_CODE]:
    'User sent invalid verification code',
  //Not Found [404]
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.POST_NOT_FOUND]: 'Post not found',
  [ErrorCode.IMAGE_NOT_FOUND]: 'Image not found',
  [ErrorCode.COMMENT_NOT_FOUND]: 'Comment not found',
  [ErrorCode.REPLY_NOT_FOUND]: 'Reply not found',
  [ErrorCode.VERIFICATION_CODE_NOT_FOUND]:
    'Verification code expired or was just not found',
  [ErrorCode.USER_HAVE_NOT_LIKED_THIS_POST]: "User haven't liked this post",
  [ErrorCode.USER_HAVE_NOT_LIKED_THIS_COMMENT]:
    "User haven't liked this comment",
  [ErrorCode.USER_HAVE_NOT_DISLIKED_THIS_COMMENT]:
    "User haven't disliked this comment",
  [ErrorCode.USER_HAVE_NOT_LIKED_THIS_REPLY]: "User haven't liked this reply",
  [ErrorCode.USER_HAVE_NOT_DISLIKED_THIS_REPLY]:
    "User haven't disliked this reply",

  //Conflic [409]
  [ErrorCode.IMAGE_ALREADY_EXIST]: 'Already exists a image with this name',
  [ErrorCode.USER_ALREADY_LIKED_THIS_POST]: 'User already liked this post',
  [ErrorCode.USER_ALREADY_LIKED_THIS_COMMENT]:
    'User already liked this comment',
  [ErrorCode.USER_ALREADY_DISLIKED_THIS_COMMENT]:
    'User already disliked this comment',
  [ErrorCode.USER_ALREADY_LIKED_THIS_REPLY]: 'User already liked this reply',
  [ErrorCode.USER_ALREADY_DISLIKED_THIS_REPLY]:
    'User already disliked this reply',
  [ErrorCode.EMAIL_IS_ALREADY_IN_USE]: 'Email is already in use',
  [ErrorCode.USERNAME_IS_ALREADY_IN_USE]: 'Username is already in use',

  //Unsupported Media [415]
  [ErrorCode.FILE_NOT_SUPPORTED]:
    'Only image files are allowed! Supported formats: jpg, jpeg and png',
};
