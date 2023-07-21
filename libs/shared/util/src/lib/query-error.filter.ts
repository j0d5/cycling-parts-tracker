import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryErrorFilter extends BaseExceptionFilter {
  public override catch(exception: QueryFailedError, host: ArgumentsHost): any {
    Logger.debug(JSON.stringify(exception, null, 2));
    Logger.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception.message.includes('UNIQUE')) {
      const invalidKey = exception.message.split(':').pop()?.trim();
      if (response.status === 401) {
        console.error({
          error: `Unique constraint failed`,
          message: `Value for '${invalidKey}' already exists, try again`,
        });
      }
    } else {
      if (response.status === 500) {
        console.error({
          statusCode: 500,
          path: request.url,
        });
      }
    }
  }
}
