import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { GlobalException } from 'src/exceptions/global.exception';
import ERRORS from 'src/errors/errors.config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: GlobalException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    try {
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();

      this.logger.error(
        `${request.method} ${request.originalUrl} ${status} error: ${exception.message}`
      );

      const key = exception.message;

      const errorObj = ERRORS[key] || (status === 404 && ERRORS['NOT_FOUND']) || ERRORS['DEFAULT'];

      response.status(errorObj.statusCode).json({
        success: false,
        error: { statusCode: errorObj.statusCode, message: errorObj.message },
      });
    } catch (error) {
      const errorObj = ERRORS['DEFAULT'];
      response.status(errorObj.statusCode).json({
        success: false,
        error: errorObj.message,
      });
    }
  }
}
