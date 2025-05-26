import { CommonRequestAttrs } from "@xpparel/shared-models";
import { BaseInterfaceRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSPoLineEntity } from "../../pkms-po-entities/pkms-po-line-entity";



export interface PKMSPoLineRepoInterface extends BaseInterfaceRepository<PKMSPoLineEntity> {
    getPKMSPSLTotalOrdQtyForMoNumbers(moNumbers: string[], unitCode: string, companyCode: String): Promise<{ quantity: string; poslId: string; }[]>;
    getProcessingOrderFeatures(processingSerial: number, moId?: number, moLineId?: number, poLineId?: number, pslId?: number): Promise<any[]>;
    findDistinctMoNumbers(req: CommonRequestAttrs): Promise<{ moNumber: string; }[]>
    getMoInfoForGivenPo(poId: number): Promise<{ moId: number,moNumber:string,poId:number }[]>
}

