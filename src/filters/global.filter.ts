import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
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
    const defaultErrorMessage = translateErrorMessage(this.i18n, ErrorsTypes.DEFAULT);
    const defaultResponse = {
      success: false,
      error: { statusCode: 500, message: defaultErrorMessage },
    };

    try {
      const knownException = exception instanceof HttpException;
      const request = ctx.getRequest<Request>();

      const status = knownException ? exception.getStatus() : 500;
      const errorObj = knownException ? exception.getResponse() : exception;
      const key = knownException ? errorObj?.key || errorObj?.message : ErrorsTypes.DEFAULT;
      const message = knownException ? translateErrorMessage(this.i18n, key) : exception.message;

      this.logger.error(
        `method: ${request.method}, to: ${request.originalUrl}, status: ${status}, errorMessage: ${key}, cause: ${message}`
      );

      if (!knownException) return response.status(500).json(defaultResponse);

      response.status(status).json({
        success: false,
        error: { statusCode: status, message: message || defaultErrorMessage },
      });
    } catch (error) {
      response.status(500).json(defaultResponse);
    }
  }
}
