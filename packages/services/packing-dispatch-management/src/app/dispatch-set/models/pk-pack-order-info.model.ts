import { CommonRequestAttrs, FinalInspectionStatusEnum, GlobalResponseObject, PackFinalInspectionStatusEnum, PackingMethodsEnum } from "@xpparel/shared-models";

// Request
export class PackOrderIdRequest extends CommonRequestAttrs {
    packOrderIds: number[];

    iNeedPackLists: boolean;
    iNeedPackListAttrs: boolean;
    iNeedPackJobs: boolean;
    iNeedPackJobAttrs: boolean;
    iNeedCartons: boolean;
    iNeedCartonAttrs: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packOrderIds: number[],
        iNeedPackLists: boolean,
        iNeedPackListAttrs: boolean,
        iNeedPackJobs: boolean,
        iNeedPackJobAttrs: boolean,
        iNeedCartons: boolean,
        iNeedCartonAttrs: boolean
    ) {
        super(username, unitCode, companyCode, userId);
    }
}

export class PackListIdsReqeust extends CommonRequestAttrs {
    packListIds: number[];
    iNeedPackListAttrs: boolean;
    iNeedPackJobs: boolean;
    iNeedPackJobAttrs: boolean;
    iNeedCartons: boolean;
    iNeedCartonAttrs: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packListIds: number[],
        iNeedPackListAttrs: boolean,
        iNeedPackJobs: boolean,
        iNeedPackJobAttrs: boolean,
        iNeedCartons: boolean,
        iNeedCartonAttrs: boolean
    ) {
        super(username, unitCode, companyCode, userId);
    }
}

export class CartonIdsReqeust extends CommonRequestAttrs {
    cartonIds: number[];
    iNeedCartonAttrs: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cartonIds: number[],
        iNeedCartonAttrs: boolean
    ) {
        super(username, unitCode, companyCode, userId);
    }
}

// Response
export class PackOrderInfoResponse extends GlobalResponseObject{
    data: PackOrderInfoModel[];
}

export class PackListInfoResponse extends GlobalResponseObject{
    data: PackListInfoModel[];
}

export class CartonInfoResponse extends GlobalResponseObject{
    data: CartonInfoModel[];
}

// Models
export class PackOrderInfoModel {
    packListsInfo: PackListInfoModel[]; // should get only if iNeedPackLists is true
    packOrderId: number;
    packOrderDesc: string;
    moNo: string;
    vpo: string;
}

export  class PackListInfoModel {
    packJobs: PackJobsInfoModel[]; // should get only send if iNeedPackJobs is true
    packListId: number;
    packOrderId: number;
    packListDesc: string;
    packListNo: string;
    type: PackingMethodsEnum;
    packListAttrs: PackListAttrsModel; // should get only if iNeedPackListAttrs is true
}

export class PackListAttrsModel {
    prodNames: string[];
    moNos: string[];
    vpos: string[];
    destinations: string[];
    delDates: string[];
    styles: string[];
    buyers: string[];
    plantStyles: string[];
    molLines: string[];
}


export class PackJobsInfoModel {
    packListId: number;
    packOrderId: number;
    cartonsList: CartonInfoModel[]; // should get only send if iNeedCartons is true
    packJobNo: string;
    packJobId: number; // PK of the pack job
    attrs: PackJobAttrsModel; // should get only send if iNeedPackJobAttrs is true
}

export class PackJobAttrsModel {
    prodNames: string[];
    moNos: string[];
    vpos: string[];
    destinations: string[];
    delDates: string[];
    styles: string[];
    buyers: string[];
}

export class CartonInfoModel {
    packListId: number;
    packOrderId: number;
    cartonId: string; // PK of the carton
    barcode: string; // barcode of the carton
    quantity: number;
    cartonNo: string;
    preInsSel: boolean;
    postIndSel: boolean;
    insStatus: PackFinalInspectionStatusEnum;
    attrs: CartonAttrsModel[]; // should get only send if iNeedCartonAttrs is true
}

export class CartonAttrsModel {
    col: string;
    sz: string;
    pName: string;
    qty: number;
    moLine: number;
}

