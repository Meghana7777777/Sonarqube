import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, ObjectId, ObjectLiteral, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: number): Promise<T>;
  findOne(filterCondition: FindOneOptions<T>): Promise<T>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  count(options?: FindManyOptions<T>): Promise<number>;
  update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult>;
  delete(criteria: string | number | Date | ObjectId | FindOptionsWhere<T> | string[] | number[] | Date[] | ObjectId[]): Promise<DeleteResult>;
  increment(conditions: FindOptionsWhere<T>, propertyPath: string, value: string | number): Promise<UpdateResult>
  insert(data: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]): Promise<InsertResult>;
}