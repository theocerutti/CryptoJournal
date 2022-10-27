import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import HttpErrorException from '../exceptions/http-error.exception';

@Catch(HttpErrorException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.getClientMessage(),
      serverMessage: exception.message,
    });
  }
}
