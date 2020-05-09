import {
  Column,
  CreateDateColumn,
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

  extendDto(dto: Partial<this>): this {
    Object.assign(this, dto);
    return this;
  }
}
