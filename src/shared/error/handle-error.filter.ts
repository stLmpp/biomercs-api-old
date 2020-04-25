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

@Catch()
export class HandleErrorFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    if (exception?.sql) {
      const error = this.handleSqlError(exception);
      host
        .switchToHttp()
        .getResponse<Response>()
        .status(error.getStatus())
        .json(flattenObject(error, 'response'));
    } else {
      super.catch(exception, host);
    }
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
}

export function ErrorMessage(errorMessage: string): DecoratorFn {
  return (target, propertyKey, descriptor) => {
    const origin = descriptor.value;
    descriptor.value = async function(...args: any[]): Promise<any> {
      try {
        await origin.apply(this, args);
      } catch (err) {
        throw { ...err, customMessage: errorMessage };
      }
    };
  };
}
