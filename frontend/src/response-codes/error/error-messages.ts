import { ErrorCode } from './error-codes.enum';

export const ErrorMessages = {
  // Bad Request [400]
  [ErrorCode.MISSING_IMAGE]: 'Missing image', // Not translated
  [ErrorCode.MISSING_FILE]: 'Missing file', // Not translated
  [ErrorCode.MISSING_EMAIL]: 'Missing email', // Not translated
  [ErrorCode.MISSING_PASSWORD]: 'Missing password', // Not translated
  [ErrorCode.MISSING_VERIFICATION_CODE]: 'Missing verification code', // Not translated

  //Unauthorized [401]
  [ErrorCode.ONLY_ADMINS_ALLOWED]: 'Only admins can access this route', // Not translated

  //Forbidden [403]
  [ErrorCode.INVALID_ID]: 'Invalid ID', // Not translated
  [ErrorCode.UNABLE_TO_DELETE_THIS_IMAGE]:
    "Unable to delete another user's image", // Not translated
  [ErrorCode.UNABLE_TO_DELETE_THIS_COMMENT]:
    "Unable to delete another user's comment", // Not translated
  [ErrorCode.UNABLE_TO_EDIT_THIS_COMMENT]:
    "Unable to edit another user's comment", // Not translated
  [ErrorCode.UNABLE_TO_DELETE_THIS_REPLY]:
    "Unable to delete another user's reply", // Not translated
  [ErrorCode.UNABLE_TO_EDIT_THIS_POST]: "Unable to edit another user's post", // Not translated
  [ErrorCode.UNABLE_TO_DELETE_THIS_POST]:
    "Unable to delete another user's post", // Not translated
  [ErrorCode.INCORRECT_CREDENTIALS]: 'Incorrect credentials', // Not translated
  [ErrorCode.USER_SENT_INVALID_VERIFICATION_CODE]:
    'User sent invalid verification code', // Not translated
  //Not Found [404]
  [ErrorCode.USER_NOT_FOUND]: 'User not found', // Not translated
  [ErrorCode.POST_NOT_FOUND]: 'Post not found', // Not translated
  [ErrorCode.IMAGE_NOT_FOUND]: 'Image not found', // Not translated
  [ErrorCode.COMMENT_NOT_FOUND]: 'Comment not found', // Not translated
  [ErrorCode.REPLY_NOT_FOUND]: 'Reply not found', // Not translated
  [ErrorCode.VERIFICATION_CODE_NOT_FOUND]:
    'Verification code expired or was just not found', // Not translated
  [ErrorCode.USER_HAVE_NOT_LIKED_THIS_POST]: "User haven't liked this post", // Not translated
  [ErrorCode.USER_HAVE_NOT_LIKED_THIS_COMMENT]:
    "User haven't liked this comment", // Not translated
  [ErrorCode.USER_HAVE_NOT_DISLIKED_THIS_COMMENT]:
    "User haven't disliked this comment", // Not translated
  [ErrorCode.USER_HAVE_NOT_LIKED_THIS_REPLY]: "User haven't liked this reply", // Not translated
  [ErrorCode.USER_HAVE_NOT_DISLIKED_THIS_REPLY]:
    "User haven't disliked this reply", // Not translated

  //Conflic [409]
  [ErrorCode.IMAGE_ALREADY_EXIST]: 'Already exists a image with this name', // Not translated
  [ErrorCode.USER_ALREADY_LIKED_THIS_POST]: 'User already liked this post', // Not translated
  [ErrorCode.USER_ALREADY_LIKED_THIS_COMMENT]:
    'User already liked this comment', // Not translated
  [ErrorCode.USER_ALREADY_DISLIKED_THIS_COMMENT]:
    'User already disliked this comment', // Not translated
  [ErrorCode.USER_ALREADY_LIKED_THIS_REPLY]: 'User already liked this reply', // Not translated
  [ErrorCode.USER_ALREADY_DISLIKED_THIS_REPLY]:
    'User already disliked this reply', // Not translated
  [ErrorCode.EMAIL_IS_ALREADY_IN_USE]: 'Email is already in use', // Not translated
  [ErrorCode.USERNAME_IS_ALREADY_IN_USE]: 'Username is already in use', // Not translated

  //Unsupported Media [415]
  [ErrorCode.FILE_NOT_SUPPORTED]:
    'Only image files are allowed! Supported formats: jpg, jpeg and png', // Not translated
};
