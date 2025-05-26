import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestMaterialItemEntity } from "../po-wh-request-material-item-entity";
import { BomItemTypeEnum, PhItemCategoryEnum, SewJobBundleSheetModel } from "@xpparel/shared-models";

@Injectable()
export class PoWhRequestMaterialItemRepository extends Repository<PoWhRequestMaterialItemEntity> {
    constructor(dataSource: DataSource) {
        super(PoWhRequestMaterialItemEntity, dataSource.createEntityManager());
    }

    async getBundleBarcodeDetailsByPoWhRequestLineId(poWhRequestLineId: number, iNeedInventory: boolean, companyCode: string, unitCode: string): Promise<SewJobBundleSheetModel[]> {
        const bundleData = this.createQueryBuilder("pwri")
            .select(["pwri.itemCode AS itemCode", "pwri.itemType AS itemType", "pwri.itemColor AS itemColor", "pwri.objectCode AS objectCode", "pwri.locationCode AS locationCode", "pwri.requiredQty AS requiredQty", "pwri.allocatedQty AS allocatedQty", "pwri.issuedQty AS issuedQty"])
            .where("pwri.poWhRequestLineId = :poWhRequestLineId", { poWhRequestLineId })
            .andWhere("pwri.companyCode = :companyCode", { companyCode })
            .andWhere("pwri.unitCode = :unitCode", { unitCode })
        if (iNeedInventory === true) {
            bundleData.andWhere("pwri.bom_item_type IN (:...bomItemTypes)", {
                bomItemTypes: [BomItemTypeEnum.SFG, BomItemTypeEnum.PANEL]
            });
        } else {
            bundleData.andWhere("pwri.bom_item_type = :bomItemType", {
                bomItemType: BomItemTypeEnum.RM
            });
        }
        const results = await bundleData.getRawMany();
        return results.map(row => new SewJobBundleSheetModel(row.itemCode, row.itemType, row.itemColor, row.objectCode, row.locationCode, Number(row.requiredQty), Number(row.allocatedQty), Number(row.issuedQty)));
    }
}

