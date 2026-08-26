import { HttpStatus } from '@nestjs/common';
import { BusinessError } from './business.error';

export class ConflictError extends BusinessError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
