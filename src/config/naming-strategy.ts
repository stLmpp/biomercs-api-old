import { DefaultNamingStrategy } from 'typeorm';

export class YkNamingStategy extends DefaultNamingStrategy {
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return super.joinColumnName(referencedColumnName, relationName);
  }
}
