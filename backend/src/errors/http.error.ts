import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.error';
import { ErrorCode } from './error-codes.enum';

export class HttpError extends BaseError {
  constructor(
    public readonly statusCode: HttpStatus,
    code: ErrorCode,
  ) {
    super(code);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(code: ErrorCode) {
    super(HttpStatus.BAD_REQUEST, code);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(code: ErrorCode) {
    super(HttpStatus.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends HttpError {
  constructor(code: ErrorCode) {
    super(HttpStatus.FORBIDDEN, code);
  }
}

export class NotFoundError extends HttpError {
  constructor(code: ErrorCode) {
    super(HttpStatus.NOT_FOUND, code);
  }
}

export class ConflictError extends HttpError {
  constructor(code: ErrorCode) {
    super(HttpStatus.CONFLICT, code);
  }
}

export class UnsupportedMediaTypeError extends HttpError {
  constructor(code: ErrorCode) {
    super(HttpStatus.UNSUPPORTED_MEDIA_TYPE, code);
  }
}
