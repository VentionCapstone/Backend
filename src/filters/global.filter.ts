import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { translateErrorMessage } from 'src/helpers/translateErrorMessage.helper';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly i18n: I18nService
  ) {}

  catch(exception: GlobalException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const defaultErrorMessage = translateErrorMessage(this.i18n, ErrorsTypes.DEFAULT);
    const defaultResponse = {
      success: false,
      error: { statusCode: defaultStatusCode, message: defaultErrorMessage },
    };

    try {
      const request = ctx.getRequest<Request>();
      const knownException = exception instanceof HttpException;

      let status = defaultStatusCode;
      let errorObj = exception;
      let key = ErrorsTypes.DEFAULT;
      let message = exception.message;

      if (knownException) {
        status = exception.getStatus();
        errorObj = exception.getResponse();
        key = errorObj?.key || errorObj?.message;
        message = translateErrorMessage(this.i18n, key);
      }

      this.logger.error(
        `method: ${request.method}, to: ${request.originalUrl}, status: ${status}, errorMessage: ${key}, cause: ${message}`
      );

      if (!knownException) return response.status(status).json(defaultResponse);

      response.status(status).json({
        success: false,
        error: { statusCode: status, message: message || defaultErrorMessage },
      });
    } catch (error) {
      response.status(defaultStatusCode).json(defaultResponse);
    }
  }
}
