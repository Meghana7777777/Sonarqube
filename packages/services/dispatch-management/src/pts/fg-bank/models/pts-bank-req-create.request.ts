import { ProcessTypeEnum } from "@xpparel/shared-models";

// Bank
export class PtsBankRequestCreateRequest {
    sewSerial: number;
    requestedBy: string;
    fulfillmentDateTime: string; // date time
    mainJobs: PtsBankRequestMainJobModel[]; // now size will be only 1
}

export class PtsBankRequestModel {
    sewSerial: number;
    requestedBy: string; 
    fulfillmentDateTime: string; // date time
    issuanceStatus: BankJobReqeustIssuanceStatusEnum; // not req during create
    mainJobs: PtsBankRequestMainJobModel[];
}

export class PtsBankRequestMainJobModel {
    mainJob: string;
    reqNo: string; // not req during create
    opCategory: ProcessTypeEnum; // to be changed to enum
    dependentJobs:  PtsBankRequestDepJobModel[];
    issuanceStatus: BankJobReqeustIssuanceStatusEnum; // not req during create
}

export class PtsBankRequestDepJobModel {
    reqNo: string; // always the job number of the bank header request. // not req during create
    depJobNumber: string; // could be the job/docket number based on the job/component dependency
    opCategory: ProcessTypeEnum;
    orgQty: number; // not req during create
    rQty: number; // not req during create
    iQty: number; // not req during create
    issuanceStatus: BankJobReqeustIssuanceStatusEnum; // not req during create
    bundles: PtsBankRequestBundleTrackModel[]; // the bundle wise requested qtys or issued qtys

    requestedByJobInfo?: PtsBankRequestMainJobModel[]; // used for retrieval purposes only
    jobProps: null; //
}



export class PtsBankRequestBundleTrackModel {
    brcd: string; // barcode of the bundle
    orgQty: number; // original qty // not req during create
    rQty: number; // requested qty 
    iQty: number; // issued qty // not req during create
    bundleProps: PtsBundelInfoBasicModel; // not req during create
}

export class PtsBundelInfoBasicModel {
    color: string;
    size: string;
    bundleNo: string;
    brcd: string;
    moNo: string;
    jobNo: string;
}



export class PtsBankRequestsResponse {
    data: PtsBankRequestModel[];
}

export enum BankJobReqeustIssuanceStatusEnum {
    OPEN = 0,
    ISSUED = 2,
    P_ISSUED = 1,
}




