import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { GlobalException } from 'src/exceptions/global.exception';
import ERRORS from 'src/errors/errors.config';
import ErrorsTypes from 'src/errors/errors.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    try {
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();

      this.logger.error(
        `method: ${request.method}, to: ${request.originalUrl}, status: ${status}, errorMessage: ${exception.message}`
      );

      if (!(exception instanceof GlobalException)) {
        response.status(exception.status).json({
          success: false,
          error: exception.response,
        });
        return;
      }

      const key = exception.message;
      const errorObj = ERRORS[key] || ERRORS[ErrorsTypes.DEFAULT];

      response.status(errorObj.statusCode).json({
        success: false,
        error: { statusCode: errorObj.statusCode, message: errorObj.message },
      });
    } catch (error) {
      const errorObj = ERRORS[ErrorsTypes.DEFAULT];
      response.status(errorObj.statusCode).json({
        success: false,
        error: { statusCode: errorObj.statusCode, message: errorObj.message },
      });
    }
  }
}
