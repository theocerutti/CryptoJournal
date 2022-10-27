import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import HttpError from '../exceptions/http.error';

@Catch(HttpError)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.getClientMessage(),
      serverMessage: exception.message,
      id: exception.getId(),
    });
  }
}
