import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm';
import { removeNullObject } from '../../util/util';
import { allColumns, CommonColumns } from './common-columns';
import { isAnyObject, isArray } from 'is-what';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { FileType } from '../../file-upload/file-type.interface';
import { User } from '../../auth/user/user.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { LikeUppercase } from '../../util/query-operators';

export interface SuperServiceOptions<Entity extends CommonColumns> {
  idFileKey?: keyof Entity;
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
  ) {
    this.__hasOrder = allColumns<any>(entity).includes('order');
  }

  private readonly __hasOrder: boolean;

  async add(
    dto: AddDto,
    relations: (keyof Entity)[] | string[] = []
  ): Promise<Entity> {
    const entity = await this.__repository.save(
      new this.entity().extendDto(this.preAdd(dto)) as any
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
      dto.map(d => new this.entity().extendDto(this.preAdd(d))) as any[]
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
    await this.__repository.update(id, this.preUpdate(dto));
    return await this.findById(id, relations);
  }

  async delete(id: number): Promise<Entity[]>;
  async delete(ids: number[]): Promise<Entity[]>;
  async delete(dto: FindConditions<Entity>): Promise<Entity[]>;
  async delete(
    idOrIdsOrDto: number | number[] | FindConditions<Entity>
  ): Promise<Entity[]> {
    let entities: Entity[];
    if (isArray(idOrIdsOrDto)) {
      entities = await this.__repository.findByIds(idOrIdsOrDto);
    } else if (isAnyObject(idOrIdsOrDto)) {
      entities = await this.__repository.find({ where: idOrIdsOrDto });
    } else {
      entities = await this.__repository.find({ where: { id: idOrIdsOrDto } });
    }
    await this.__repository.delete(entities.map(entity => entity.id));
    if (this.options.idFileKey && this.__fileUploadService) {
      await this.__fileUploadService.deleteFile(
        entities.map(entity => entity[this.options.idFileKey as string])
      );
    }
    if (this.__hasOrder) {
      await this.reOrderAll();
    }
    return entities;
  }

  async exists(id?: number): Promise<boolean>;
  async exists(where?: FindConditions<Entity>): Promise<boolean>;
  async exists(where?: FindConditions<Entity>[]): Promise<boolean>;
  async exists(
    idOrWhere?: number | FindConditions<Entity> | FindConditions<Entity>[]
  ): Promise<boolean> {
    if (isAnyObject(idOrWhere)) {
      idOrWhere = removeNullObject(idOrWhere);
    }
    return await this.__repository.exists(idOrWhere);
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
    relations: (keyof Entity)[] | string[] = [],
    limit?: number
  ): Promise<Entity[]> {
    const options: FindManyOptions<Entity> = {
      where,
      relations: relations as string[],
    };
    if (limit) {
      options.take = limit;
    }
    return await this.__repository.find(options);
  }

  async findOneByParams(
    where: FindConditions<Entity>,
    relations: (keyof Entity)[] | string[] = []
  ): Promise<Entity> {
    const options: FindOneOptions<Entity> = {
      where,
      relations: relations as string[],
    };
    return await this.__repository.findOne(options);
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

  async countByParams(where: FindConditions<Entity>): Promise<number> {
    return await this.__repository.count(where);
  }

  async updateOrder(id: number, order: number): Promise<void>;
  async updateOrder(ids: number[]): Promise<void>;
  async updateOrder(ids: number[] | number, order?: number): Promise<void> {
    if (isArray(ids)) {
      await Promise.all(
        ids.map((id, index) => this.update(id, { order: index + 1 } as any))
      );
    } else {
      await this.update(ids, { order } as any);
    }
  }

  async reOrderAll(): Promise<void> {
    const ids = (
      await this.__repository.find({ select: ['id'], order: { order: 'ASC' } })
    ).map(entity => entity.id);
    return await this.updateOrder(ids);
  }

  preAdd(dto: AddDto): AddDto {
    return dto;
  }

  preUpdate(dto: UpdateDto): UpdateDto {
    return dto;
  }
}
