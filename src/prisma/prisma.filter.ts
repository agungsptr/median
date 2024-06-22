import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaFilter
  implements ExceptionFilter<PrismaClientKnownRequestError>
{
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();

    let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        break;
      case 'P2025':
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      default:
        console.error(exception);
        break;
    }

    res.status(statusCode).json({
      statusCode,
      errors: exception.name,
      message: exception.message,
    });
  }
}
