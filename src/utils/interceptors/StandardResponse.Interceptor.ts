import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StandardResponse } from '../interfaces/StandardResponse.Interface';

export interface Response<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable()
export class StandardResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res: any) => {
        return this.responseHandler(res, context);
      }),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: (exception as HttpException)?.message || 'Internal Server Error',
    });
  }

  responseHandler(res: StandardResponse<T>, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    return {
      status: context.switchToHttp().getResponse().statusCode,
      path: request.url,
      statusCode,
      message: res?.message,
      data: res?.result,
    };
  }
}
