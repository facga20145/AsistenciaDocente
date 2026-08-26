import { HttpStatus } from '@nestjs/common';
import { BusinessError } from './business.error';

export class NotFoundError extends BusinessError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
