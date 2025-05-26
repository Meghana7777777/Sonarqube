import { CutRmModel, PoMarkerModel, PoRatioSizeModel, PoSizeQtysModel } from "../../../../oes";
import { ActualMarkerModel } from "../../../docket-planning";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "../../../enum";
import { DocketNumberModel } from "../docket-number.model";

export class DocketGroupBasicInfoModel {
    mo: string;
    moLines: string[];
    poSerial: number;
    docketNumbers: DocketAndFabHelperModel[];
    docketGroup: string;
    plies: number;
    ratioId: number;
    docketGroupId: number;
    sizeRatios: PoRatioSizeModel[];
    ratioName: string;
    ratioDesc: string;
    markerInfo: PoMarkerModel;
    actualMarkerInfo: ActualMarkerModel; // added for requirement of capturing actual marker info
    totalMrCount: number;
    totalIssuedMrCount: number;
    allocatedQty: number;
    materialRequirement: number;
    isMainDoc: boolean;
    hasBinding: boolean; // this can never be true. because if the other comps fabric has binding, we are only capturing the binding cons
    bindingRequirement: number;
    originalDocQuantity: number; // Srinu add job qty
    layedPlies: number;
    cutWastage: number;
    bindingConsumption: number;
    completeBindingDocket: boolean; //  this is if the is-binding flag enabled for the fabric
    fabricInfo?: CutRmModel; //This will be only retrieved if we specify in the request
    reqWithOutWastage:number;// add for actual marker requirement material
    bindReqWithOutWastage:number;// add for actual marker requirement material
    actualMaterialRequirement:number;// add for table planning layreport total requirement to get by based on the actual marker length 
    remark:string;
}


// The helper sub model that actually consist of the sub dockets info
export class DocketAndFabHelperModel {
    docketNumber: string;
    cutNumber: number;
    cutSubNumber: number;
    totalBundles: number;
    components: string[];
    itemCode: string;
    itemDesc: string;
    productName: string;
    productDesc: string;
    fgColor: string;
    productType: string;
    fabricInfo?: CutRmModel;
}


export class DocketAndRequriementModel {
    requirement: number;
}