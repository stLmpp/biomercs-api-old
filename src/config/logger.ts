import { AdvancedConsoleLogger, QueryRunner } from 'typeorm';
import { access, mkdir, readFile, writeFile } from 'fs';
import { format } from 'date-fns';

export class CustomLogger extends AdvancedConsoleLogger {
  constructor(
    options?:
      | boolean
      | 'all'
      | ('log' | 'info' | 'warn' | 'query' | 'schema' | 'error' | 'migration')[]
      | undefined
  ) {
    super(options);
  }

  async createdFolder(path: string): Promise<void> {
    return new Promise(resolve => {
      access(path, err => {
        if (err) {
          mkdir(process.cwd() + '/log/' + path, err => {
            if (err) throw err;
            else resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  async writeLog(path: string, log: string): Promise<void> {
    return new Promise(resolve => {
      readFile(path, (err, data) => {
        if (err) {
          writeFile(path, log, () => {
            resolve();
          });
        } else {
          writeFile(path, data.toString() + '\n' + log, () => {
            resolve();
          });
        }
      });
    });
  }

  resolveFilename(): string {
    return format(new Date(), 'YYYY-MM-DD') + '.log';
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    super.logQuery(query, parameters, queryRunner);
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner
  ): void {
    super.log(level, message, queryRunner);
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    super.logMigration(message, queryRunner);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): void {
    super.logQueryError(error, query, parameters, queryRunner);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): void {
    super.logQuerySlow(time, query, parameters, queryRunner);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    super.logSchemaBuild(message, queryRunner);
  }
}
