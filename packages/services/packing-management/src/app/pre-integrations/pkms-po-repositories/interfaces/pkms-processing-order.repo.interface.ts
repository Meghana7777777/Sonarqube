import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSProcessingOrderEntity } from "../../pkms-po-entities/pkms-processing-order-entity";
import { PLGenQtyInfoModel, StyleMoRequest } from "@xpparel/shared-models";



export interface PKMSProcessingOrderRepoInterface extends BaseInterfaceRepository<PKMSProcessingOrderEntity> {
    getPoData(companyCode: string, unitCode: string, packSerial: number): Promise<PLGenQtyInfoModel>
    getMaxPoSerialForUnitCode(unitCode: string, companyCode: string): Promise<number>;
    getPoOrderDes(poIds: number[], unitCode: string, companyCode: string): Promise<{ id: number, description: string, poNumber: string }[]>;
    getPackOrderIds(ManufacturingOrderIds: number[], unitCode: string, companyCode: string): Promise<{ id: string }>;
    getPKMSPoSerialsForGivenStyleAndMONumbers(req: StyleMoRequest): Promise<{
        processing_serial: number;
    }[]>
}