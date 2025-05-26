import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhJobMaterialEntity } from "../po-wh-job-material-entity";
import { BomItemTypeEnum, PhItemCategoryEnum, SewJobMaterialModel } from "@xpparel/shared-models";

@Injectable()
export class PoWhJobMaterialRepository extends Repository<PoWhJobMaterialEntity> {
  constructor(private dataSource: DataSource) {
    super(PoWhJobMaterialEntity, dataSource.createEntityManager());
  }

  async getPoWhMaterialDataByJobNumber(jobNumber: string, iNeedInventory: boolean, companyCode: string, unitCode: string): Promise<SewJobMaterialModel[]> {
    const query = this.createQueryBuilder("pwjm")
      .select(["pwjm.jobNumber AS jobNumber", "pwjm.fgColor AS fgColor", "pwjm.size AS size", "pwjm.itemCode AS itemCode", "pwjm.productRef AS productRef", "pwjm.consumption AS consumption", "pwjm.requiredQty AS requiredQty"])
      .where("pwjm.jobNumber = :jobNumber", { jobNumber })
      .andWhere("pwjm.is_request_needed = :isRequestNeeded", { isRequestNeeded: '1' })
      .andWhere("pwjm.companyCode = :companyCode", { companyCode })
      .andWhere("pwjm.unitCode = :unitCode", { unitCode });
    if (iNeedInventory === true) {
      query.andWhere("pwjm.bom_item_type IN (:...bomItemTypes)", {
        bomItemTypes: [BomItemTypeEnum.SFG, BomItemTypeEnum.PANEL]
      });
    } else {
      query.andWhere("pwjm.bom_item_type = :bomItemType", {
        bomItemType: BomItemTypeEnum.RM
      });
    }
    const results = await query.getRawMany();
    return results.map((entity) => ({ jobNumber: entity.jobNumber, fgColor: entity.fgColor, size: entity.size, itemCode: entity.itemCode, productRef: entity.productRef, consumption: entity.consumption, requiredQty: entity.requiredQty }));
  }



}