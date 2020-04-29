import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MySqlError } from './my-sql-error';
import { flattenObject } from '../../util/util';
import { Response } from 'express';
import { isError } from 'is-what';
import { getUseHandleError } from '../../util/env';

@Catch()
export class HandleErrorFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    if (!getUseHandleError()) {
      super.catch(exception, host);
      return;
    }
    let error: HttpException;
    if (this.isSqlError(exception)) {
      error = this.handleSqlError(exception);
    } else if (this.isLogicError(exception)) {
      error = this.handleLogicError(exception);
    } else {
      super.catch(exception, host);
      return;
    }
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(error?.getStatus?.() ?? 500)
      .json(
        (error as any)?.response ? flattenObject(error, 'response') : error
      );
  }

  handleSqlError(exception: MySqlError): HttpException {
    const { message, errno } = exception;
    const errorObj = {
      sqlMessage: message,
      sqlErrno: errno,
    };
    switch (errno) {
      case 1452:
        return new NotFoundException(errorObj);
      case 1169:
      case 1557:
      case 1062:
        return new ConflictException(errorObj);
      case 1451:
        return new ConflictException({
          ...errorObj,
          error: `Can't finish operation because of relationship`,
        });
      case 1048:
      case 1054:
      case 1265:
      case 1364:
        return new BadRequestException(errorObj);
      default:
        return new InternalServerErrorException(errorObj);
    }
  }

  isSqlError(exception: any): exception is MySqlError {
    return !!exception?.sql;
  }

  isLogicError(exception: any): exception is Error {
    return !(exception instanceof HttpException) && isError(exception);
  }

  handleLogicError({ name, message, stack, ...rest }: Error): HttpException {
    const errorObj = {
      error: message,
      stack: this.handleStack(stack),
      ...rest,
    };
    switch (name) {
      case 'EntityNotFound':
        return new NotFoundException(errorObj);
      default:
        return new InternalServerErrorException(errorObj);
    }
  }

  handleStack(stack: string): string {
    const root = process.cwd();
    const regexpRoot = new RegExp(root.split('\\').join('\\\\'), 'g');
    const regexpDistRoot = new RegExp(
      `${root}\\dist\\src`.split('\\').join('\\\\'),
      'g'
    );
    return (
      stack
        ?.replace?.(regexpDistRoot, '**DIST_ROOT**')
        ?.replace?.(regexpRoot, '**ROOT**') ?? 'NO STACK'
    );
  }
}
