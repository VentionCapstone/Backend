import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { GlobalException } from 'src/exceptions/global.exception';
import ERRORS from 'src/errors/errors.config';

@Catch(GlobalException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: GlobalException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `${request.method} ${request.originalUrl} ${status} error: ${exception.message}`
    );

    const key = exception.message;
    const errorObj = ERRORS[key] || ERRORS['DEFAULT'];

    response.status(errorObj.statusCode).json({
      success: false,
      error: { statusCode: errorObj.statusCode, message: errorObj.message },
    });
  }
}
