import { FindConditions, In, Repository, SelectQueryBuilder } from 'typeorm';
import { DeleteResult } from '../../util/types';
import { removeNullObject } from '../../util/util';
import { CommonColumns } from './common-columns';
import { isNumber } from 'is-what';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { FileType } from '../../file-upload/file-type.interface';
import { User } from '../../auth/user/user.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { LikeUppercase } from '../../util/query-operators';

export type WithExistsFn = (
  subQuery: SelectQueryBuilder<any>,
  dto: any
) => SelectQueryBuilder<any>;

export interface SuperServiceOptions<Entity extends CommonColumns> {
  idFileKey?: keyof Entity;
  returnAddWithRelations?: boolean;
  withExistsLogic?: WithExistsFn;
}

export class SuperService<
  Entity extends CommonColumns,
  AddDto = any,
  UpdateDto = any
> {
  constructor(
    private entity: { new (): Entity },
    private __repository: Repository<Entity>,
    private __fileUploadService?: FileUploadService,
    private options: SuperServiceOptions<Entity> = {}
  ) {}

  async add(
    dto: AddDto,
    relations: (keyof Entity)[] | string[] = []
  ): Promise<Entity> {
    const entity = await this.__repository.save(
      new this.entity().extendDto(dto) as any
    );
    if (relations?.length) {
      return await this.findById(entity.id, relations);
    } else {
      return entity;
    }
  }

  async addMany(
    dto: AddDto[],
    relations: (keyof Entity)[] | string[] = []
  ): Promise<Entity[]> {
    const entities = await this.__repository.save(
      dto.map(d => new this.entity().extendDto(d)) as any[]
    );
    if (relations?.length) {
      return await this.__repository.find({
        where: { id: In(entities.map(entity => entity.id)) },
        relations: relations as string[],
      });
    } else {
      return entities;
    }
  }

  async update(
    id: number,
    dto: UpdateDto,
    relations: (keyof Entity)[] | string[] = []
  ): Promise<Entity> {
    await this.__repository.update(id, dto);
    return await this.findById(id, relations);
  }

  async delete(id: number): Promise<DeleteResult>;
  async delete(ids: number[]): Promise<DeleteResult>;
  async delete(idOrIds: number | number[]): Promise<DeleteResult> {
    return await this.__repository.delete(idOrIds);
  }

  async exists(id: number): Promise<boolean>;
  async exists(where: FindConditions<Entity>): Promise<boolean>;
  async exists(idOrWhere: number | FindConditions<Entity>): Promise<boolean> {
    const where = isNumber(idOrWhere) ? { id: idOrWhere } : idOrWhere;
    return await this.__repository.exists(removeNullObject(where));
  }

  async findAll(
    relations: (keyof Entity)[] | string[] = []
  ): Promise<Entity[]> {
    return await this.__repository.find({ relations: relations as string[] });
  }

  async uploadFile(
    id: number,
    file: FileType,
    user: User
  ): Promise<FileUpload> {
    if (!this.__fileUploadService) {
      throw new Error('FileUploadService not defined');
    }
    return await this.__fileUploadService.uploadImageToEntity(
      this.__repository,
      [id, this.options.idFileKey],
      file,
      user
    );
  }

  async findById(
    id: number,
    relations: (keyof Entity)[] | string[] = []
  ): Promise<Entity> {
    return await this.__repository.findOneOrFail(id, {
      relations: relations as string[],
    });
  }

  async findByParams(
    where: FindConditions<Entity>,
    relations: (keyof Entity)[] | string[] = []
  ): Promise<Entity[]> {
    return await this.__repository.find({
      where,
      relations: relations as string[],
    });
  }

  async search(
    term: string,
    fields: (keyof Entity)[],
    relations: (keyof Entity)[] | string[]
  ): Promise<Entity[]> {
    const where = fields.map(key => ({ [key]: LikeUppercase(`%${term}%`) }));
    return await this.__repository.find({
      where,
      relations: relations as string[],
    });
  }
}
