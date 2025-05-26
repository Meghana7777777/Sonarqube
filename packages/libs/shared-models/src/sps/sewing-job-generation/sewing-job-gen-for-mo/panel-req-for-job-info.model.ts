import { CommonRequestAttrs } from "../../../common";
import { ProcessTypeEnum } from "../../../oms";
import { PtsBankRequestBundleTrackModel, ResourceInfoModel } from "../../../pts";

export class PanelReqForJobModel {
    jobNumber: string; // MAIN JOB NUMBER
    productColorSizeCompWiseInfo: ColorSizeCompModel[];
    resourceDetails: ResourceInfoModel;
    jobGroup: number;
    processType: ProcessTypeEnum
    constructor(jobNumber: string, productColorSizeCompWiseInfo: ColorSizeCompModel[], resourceDetails: ResourceInfoModel, jobGroup: number, processType: ProcessTypeEnum) {
        this.jobNumber = jobNumber;
        this.productColorSizeCompWiseInfo = productColorSizeCompWiseInfo;
        this.resourceDetails = resourceDetails;
        this.jobGroup = jobGroup;
        this.processType = processType;
    }
}

export class ColorSizeCompModel {
    productName: string;
    fgColor: string;
    size: string;
    componentWiseBundleInfo: CompWiseBundleInfo[]
    constructor(productName: string, fgColor: string, size: string, componentWiseBundleInfo: CompWiseBundleInfo[]) {
        this.productName = productName;
        this.fgColor = fgColor;
        this.size = size;
        this.componentWiseBundleInfo = componentWiseBundleInfo;
    }

}

export class CompWiseBundleInfo {
    component: string;
    bundleInfo: PtsBankRequestBundleTrackModel[]
    constructor(component: string, bundleInfo: PtsBankRequestBundleTrackModel[]) {
        this.component = component;
        this.bundleInfo = bundleInfo;
    }
}


export class PanelRequestCreationModel extends CommonRequestAttrs {
    requestedBy: string;
    fulfillmentDateTime: string; // date time
    requestBundleDetails: PanelReqForJobModel[];
    sewSerial: number;
    jobNumber: string;
    constructor(username: string, userId: number, unitCode: string, companyCode: string, requestedBy: string, fulfillmentDateTime: string, requestBundleDetails: PanelReqForJobModel[], sewSerial: number, jobNumber: string) {
        super(username, unitCode, companyCode, userId);
        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.requestedBy = requestedBy;
        this.fulfillmentDateTime = fulfillmentDateTime;
        this.requestBundleDetails = requestBundleDetails;
        this.sewSerial = sewSerial;
        this.jobNumber = jobNumber;
    }
}

