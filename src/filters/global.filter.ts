import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { GlobalException } from 'src/exceptions/global.exception';
import ERRORS from 'src/errors/errors.config';
import ErrorsTypes from 'src/errors/errors.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: GlobalException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    try {
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();

      const errorObj = exception.getResponse();

      this.logger.error(
        `method: ${request.method}, to: ${request.originalUrl}, status: ${status}, errorMessage: ${errorObj.key}, cause: ${errorObj.message}`
      );

      if (!(exception instanceof GlobalException)) {
        response.status(exception.status).json({
          success: false,
          error: exception.response,
        });
        return;
      }

      const key = errorObj.key;
      const { statusCode, message } = ERRORS[key] || ERRORS[ErrorsTypes.DEFAULT];

      response.status(statusCode).json({
        success: false,
        error: { statusCode, message },
      });
    } catch (error) {
      const { statusCode, message } = ERRORS[ErrorsTypes.DEFAULT];
      response.status(statusCode).json({
        success: false,
        error: { statusCode, message },
      });
    }
  }
}
