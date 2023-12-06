import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
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

      const errorObj = ERRORS[key] || ERRORS['DEFAULT'];

      if (!ERRORS[key] && status === 404) {
        response.status(404).json({
          success: false,
          error: ` Error in ${request.method} method to ${request.originalUrl}, ${status}. We dont have this endpoint ${request.method} ${request.originalUrl}`,
        });
        return;
      }
      if (!ERRORS[key] && status === HttpStatus.BAD_REQUEST) {
        response.status(status).json({
          success: false,
          error: exception.getResponse(),
        });
        return;
      }

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
