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
import { DecoratorFn } from '../../util/types';
import { isError } from 'is-what';

@Catch()
export class HandleErrorFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
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
      .status(error.getStatus())
      .json(flattenObject(error, 'response'));
  }

  handleSqlError(exception: MySqlError): HttpException {
    const { message, errno, customMessage } = exception;
    const errorObj = {
      sqlMessage: message,
      sqlErrno: errno,
      error: customMessage,
    };
    switch (errno) {
      case 1452:
        return new NotFoundException(errorObj);
      case 1169:
      case 1557:
      case 1062:
        return new ConflictException(errorObj);
      case 1048:
      case 1054:
      case 1265:
        return new BadRequestException(errorObj);
      default:
        return new InternalServerErrorException(errorObj);
    }
  }

  isSqlError(exception: any): exception is MySqlError {
    return !!exception?.sql;
  }

  isLogicError(exception: any): exception is Error {
    return isError(exception);
  }

  handleLogicError({ name, message, stack }: Error): HttpException {
    const errorObj = {
      error: message,
      stack: this.handleStack(stack),
    };
    switch (name) {
      case 'TypeError':
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

export function ErrorMessage(errorMessage: string): DecoratorFn {
  return (target, propertyKey, descriptor) => {
    const origin = descriptor.value;
    descriptor.value = async function(...args: any[]): Promise<any> {
      try {
        if (origin.then) {
          return await origin.apply(this, args);
        } else {
          return origin.apply(this, args);
        }
      } catch (err) {
        throw { ...err, customMessage: errorMessage };
      }
    };
  };
}
