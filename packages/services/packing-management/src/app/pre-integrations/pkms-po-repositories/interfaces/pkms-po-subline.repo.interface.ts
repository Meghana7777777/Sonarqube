import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSPoSubLineEntity } from "../../pkms-po-entities/pkms-po-sub-line-entity";
import { PLSubLineQtyModel } from "@xpparel/shared-models";
import { ProductRefQryRes } from "../query-types/product-ref.qry.res";
import { ProductRefFgColorQryRes } from "../query-types/product-ref-fg-color.qry.res";



export interface PKMSPoSubLineRepoInterface extends BaseInterfaceRepository<PKMSPoSubLineEntity> {
    getPoSizeWiseQtys(pOrderId: number): Promise<any[]>;
    getSubLinesByPoLineIdAndProductColor(poLineId: number, productCode: string, color: string, unitCode: string, companyCode: string): Promise<PLSubLineQtyModel[]>;
    getPlGenQty(companyCode: string, unitCode: string, subLineId: number): Promise<{
        qty: number;
    }>
    getDistinctProductsForPoLine(processingSerial: number, poLineId: number, companyCode: string, unitCode: string): Promise<ProductRefQryRes[]>
    getDistinctColorProductsForPoLine(processingSerial: number, poLineId: number, companyCode: string, unitCode: string): Promise<ProductRefFgColorQryRes[]>
    getAlreadyCreatedSubLineIdQty(companyCode: string, unitCode: string, moProductSubLineId: number): Promise<{ qty: number; }>
}