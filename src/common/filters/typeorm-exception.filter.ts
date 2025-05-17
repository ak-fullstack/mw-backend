// common/filters/typeorm-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // MySQL: ER_DUP_ENTRY
    // PostgreSQL: 23505 (unique violation)
    const driverError: any = exception['driverError'];
    const errorCode = driverError?.code;

    if (errorCode === 'ER_DUP_ENTRY' || errorCode === '23505') {
      response.status(409).json({
        statusCode: 409,
        message: 'Duplicate entry',
        error: 'Conflict',
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: 'Unhandled database error',
      });
    }
  }
}
