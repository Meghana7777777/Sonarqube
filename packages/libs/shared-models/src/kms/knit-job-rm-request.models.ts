import { CommonRequestAttrs } from "../common";
import { ProcessTypeEnum } from "../oms";
import { KJ_MaterialStatusEnum } from "./knit-job-planning.models";
import { KC_KnitJobModel, KC_ProductSku } from "./knit-job.models";

// save only 1 workstation jobs info per API
export class KJ_KnitJobRmRequest extends CommonRequestAttrs{
    knitJobs: string[]; // knit job numbers array
    processingSerial: number;
    expectingMaterialBy: string; // datetime
    fromWH: string; // optional WH code
    processType: ProcessTypeEnum;
}

export class KJ_KnitJobRmAllocationModel {
    knitGroup: number;
    jobNumber: string;
    jobQty: number;
    productSpecs: KC_ProductSku;
    processingSerial: number;
    processType: ProcessTypeEnum;
}

export class KC_LocationKnitJobModel {
    knitGroup: number;
    jobNumber: string;
    jobQty: number;
    productSpecs: KC_ProductSku;
    processingSerial: number;
    barcodePrinted: boolean;
    materialStatus: KJ_MaterialStatusEnum;
    processType: ProcessTypeEnum;
}


export class KJ_LocationKnitJobsModel {
    locationId: string;
    knitJobs: KC_LocationKnitJobModel[];
}



export class KJ_LocationIdRequest extends CommonRequestAttrs {
    jobId: string;
    iNeedFeatures: boolean;
    iNeedColSizes: boolean;
    iNeedBarcode: boolean;
    iNeedBarcodeFeatures: boolean;
}



// only for 1 location
export class KJ_LocationKnitJobsResponse {
    data?: KJ_LocationKnitJobsModel[];
}








