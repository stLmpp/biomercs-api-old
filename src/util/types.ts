import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type Entity<T = any> = {
  [ID in string | number]: T;
};

export type DecoratorFn = (
  target: any,
  key: string,
  propertyDescriptor: PropertyDescriptor
) => any;

export class UpdateResultRaw {
  @ApiProperty() fieldCount: number;
  @ApiProperty() affectedRows: number;
  @ApiProperty() insertId: number;
  @ApiProperty() serverStatus: number;
  @ApiProperty() warningCount: number;
  @ApiProperty() message: string;
  @ApiProperty() protocol41: boolean;
  @ApiProperty() changedRows: number;
}

export class UpdateResult {
  @ApiProperty() raw: UpdateResultRaw;
  @ApiPropertyOptional() affected?: number;
  @ApiProperty() generatedMaps: any[];
}

export class DeleteResultRaw {
  @ApiProperty() fieldCount: number;
  @ApiProperty() affectedRows: number;
  @ApiProperty() insertId: number;
  @ApiProperty() serverStatus: number;
  @ApiProperty() warningCount: number;
  @ApiProperty() message: string;
  @ApiProperty() protocol41: boolean;
  @ApiProperty() changedRows: number;
}

export class DeleteResult {
  @ApiProperty() raw: DeleteResultRaw;
  @ApiPropertyOptional() affected?: number;
}
