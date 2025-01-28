import { ErrorCode } from './error-codes.enum';
import { ErrorMessages } from './error-messages';

export class BaseError extends Error {
  constructor(public readonly code: ErrorCode) {
    super(ErrorMessages[code]);
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
