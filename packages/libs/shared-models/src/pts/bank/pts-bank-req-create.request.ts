import { CommonRequestAttrs, MoPropsModel, ProcessTypeEnum } from "@xpparel/shared-models";

// Bank
export class PtsBankRequestCreateRequest extends CommonRequestAttrs{
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
    dependentJobs: PtsBankRequestDepJobModel[];
    issuanceStatus: BankJobReqeustIssuanceStatusEnum; // not req during create
    resourceInfo: ResourceInfoModel;
    jobProps: MoPropsModel;
}

export class ResourceInfoModel {
    moduleCode: string;
    sectionCode: string;
}

// {
 
//     "sewSerial": 112,
//     "requestedBy": "Rajesh",
//     "fulfillmentDateTime": "2025-02-25",
//     "mainJobs": [
//         {
//             "mainJob": "",
//             "opCategory": "LINK",
//             "dependentJobs": [
//                 {
//                     "depJobGroup": "",
//                     "bundles"
//                 }
//             ]
//         }
//     ]
// }

export class PtsBankRequestDepJobModel {
    reqNo: string; // always the job number of the bank header request. // not req during create
    depJobNumber: string; // could be the job/docket number based on the job/component dependency
    opCategory: ProcessTypeEnum;
    depJobGroup: number;
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
    componentName: string; // mandatory only in case of the knit dependency
    bundleProps: PtsBundelInfoBasicModel; // not req during create
    fgNumbers: number[]; 
}

export class PtsBundelInfoBasicModel {
    color: string;
    size: string;
    bundleNo: string;
    brcd: string;
    moNo: string;
    jobNo: string;
    component: string; // Required only if the bundle is component bundle
    poSerial: number // Required only if the bundle is component bundle
    jobGroup: number // required only for the get
}



export class PtsBankRequestsResponse {
    data: PtsBankRequestModel[];
}

export enum BankJobReqeustIssuanceStatusEnum {
    OPEN = 0,
    ISSUED = 2,
    P_ISSUED = 1,
}





export class PtsJobNumberDepJgRequest extends CommonRequestAttrs {
    jobNumber: string;
    depJg: number;
    sewSerial: number;

    /**
     * Constructor for PtsJobNumberDepJgRequest
     * @param username - The username of the requester
     * @param unitCode - The unit code
     * @param companyCode - The company code
     * @param userId - The ID of the user
     * @param date - (Optional) The request date
     * @param jobNumber - The job number
     * @param depJg - The department job group ID
     * @param sewSerial - The sewing serial number
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        jobNumber: string,
        depJg: number,
        sewSerial: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.jobNumber = jobNumber;
        this.depJg = depJg;
        this.sewSerial = sewSerial;
    }
}
