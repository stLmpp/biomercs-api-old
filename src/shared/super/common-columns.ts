import {
  Column,
  CreateDateColumn,
  DeepPartial,
  getMetadataArgsStorage,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export abstract class CommonColumns {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @CreateDateColumn()
  creationDate: Date;

  @ApiHideProperty()
  @UpdateDateColumn({ nullable: true })
  lastUpdateDate?: Date;

  @ApiHideProperty()
  @Column({ nullable: true })
  createdBy: number;

  @ApiHideProperty()
  @Column({ nullable: true })
  lastUpdatedBy: number;

  order?: number;

  extendDto(dto: DeepPartial<this>): this {
    Object.assign(this, dto);
    return this;
  }
}

export function allColumns<T>(
  target: any,
  exclude: (keyof T)[] = []
): (keyof T)[] {
  const metadata = getMetadataArgsStorage();
  return [
    ...metadata.filterColumns(CommonColumns),
    ...metadata
      .filterColumns(target as any)
      .filter(o => !(exclude as string[]).includes(o.propertyName)),
  ].map(o => o.propertyName) as (keyof T)[];
}
