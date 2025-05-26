import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartonConfigParentHierarchyRepoInterface } from "./carton-config-parent-hierarchy-repo.interface";
import { CartonParentHierarchyEntity } from "../entities/carton-config-parent-hierarchy.entity";
import { ItemsEntity } from "../../__masters__/items/entities/items.entity";
import { CartonParentQurrey } from "../dto/carton-parent-qurrey.dto";

@Injectable()
export class CartonConfigParentHierarchyRepo extends BaseAbstractRepository<CartonParentHierarchyEntity> implements CartonConfigParentHierarchyRepoInterface
{
  constructor(
    @InjectRepository(CartonParentHierarchyEntity)
    private readonly  cartonEntity: Repository<CartonParentHierarchyEntity>,
  ) {
    super( cartonEntity);
  }

  async getCartonProto(configId:number):Promise<CartonParentQurrey[]>{
    const qurrey = await this.cartonEntity.createQueryBuilder('cph')
    .select(`cph.id AS carton_parent_hierarchy_id,cph.item_id,cph.box_map_id,cph.no_of_p_bags,cph.count,cph.net_weight,cph.gross_weight,cph.quantity`)
    .addSelect(`it.code`)
    .leftJoin (ItemsEntity ,'it','it.id=cph.item_id')
    .where('cph.pk_config_id = :configId', { configId })
    // .where(`'CartonParentHierarchyData'= ${ configId }`)
    .getRawMany()
    return qurrey;
  }
}