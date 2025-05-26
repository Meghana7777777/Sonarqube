import {
	DeepPartial,
	DeleteResult,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	ObjectId,
	Repository,
	UpdateResult
  } from 'typeorm';
  
  import { BaseInterfaceRepository } from './base.interface.repository';
  import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
  
  interface HasId {
	id: number;
  }
  
  export abstract class BaseAbstractRepository<T extends HasId>
	implements BaseInterfaceRepository<T>
  {
	private entity: Repository<T>;
	protected constructor(entity: Repository<T>) {
	  this.entity = entity;
	}
  
	public async save(data: DeepPartial<T>): Promise<T> {
	  return await this.entity.save(data);
	}
	public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
	  return await this.entity.save(data);
	}
	public create(data: DeepPartial<T>): T {
	  return this.entity.create(data);
	}
	public createMany(data: DeepPartial<T>[]): T[] {
	  return this.entity.create(data);
	}
  
	public async findOneById(id: any): Promise<T> {
	  const options: FindOptionsWhere<T> = {
		id: id,
	  };
	  return await this.entity.findOneBy(options);
	}
  
	public async findOne(filterCondition: FindOneOptions<T>): Promise<T> {
	  return await this.entity.findOne(filterCondition);
	}
  
	public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
	  return await this.entity.find(relations);
	}
  
	public async find(options?: FindManyOptions<T>): Promise<T[]> {
	  return await this.entity.find(options);
	}
  
	public async remove(data: T): Promise<T> {
	  return await this.entity.remove(data);
	}
  
	public async preload(entityLike: DeepPartial<T>): Promise<T> {
	  return await this.entity.preload(entityLike);
	}
  
	public async update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>) : Promise<UpdateResult>{
	  return await this.entity.update(criteria,partialEntity);
	}
  
	public async count(options?: FindManyOptions<T>): Promise<number> {
	  return await this.entity.count(options);
	}
  
	public async delete(
	  criteria: string | number | Date | ObjectId | FindOptionsWhere<T> | string[] | number[] | Date[] | ObjectId[]
	): Promise<DeleteResult> {
	  return await this.entity.delete(criteria);
	}
  }