import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export abstract class CommonColumns extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @CreateDateColumn({ select: false })
  creationDate: Date;

  @ApiHideProperty()
  @UpdateDateColumn({ nullable: true, select: false })
  lastUpdateDate?: Date;

  @ApiHideProperty()
  @Column({ nullable: true, select: false })
  createdBy: number;

  @ApiHideProperty()
  @Column({ nullable: true, select: false })
  lastUpdatedBy: number;

  extendDto(dto: Partial<this>): this {
    Object.assign(this, dto);
    return this;
  }
}
