import { CutRmModel, PoMarkerModel, PoRatioSizeModel, PoSizeQtysModel } from "../../../oes";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "../../enum";

export class DocketBasicInfoModel {
    mo: string;
    moLines: string[];
    poSerial: number;
    docketNumber: string; //docket num
    docketGroup: string;
    itemCode: string; //item
    plies: number; //plies
    bundleGenStatus: DocBundleGenerationStatusEnum;
    docConfirmationSatus: DocConfirmationStatusEnum;
    ratioId: number;
    productName: string;
    productType: string;
    cutNumber: number;
    docketGroupId: number;
    totalBundles: number;
    sizeRatios: PoRatioSizeModel[];
    ratioName: string;
    ratioDesc: string;
    fgColor: string;
    markerInfo: PoMarkerModel;
    totalMrCount: number;
    totalIssuedMrCount: number;
    allocatedQty: number;
    materialRequirement: number;
    isMainDoc: boolean;  //main doc
    hasBinding: boolean; // this can never be true. because if the other comps fabric has binding, we are only capturing the binding cons
    bindingRequirement: number;
    originalDocQuantity: number;
    components: string[];
    itemDesc: string;  //item desc
    layedPlies: number; 
    cutWastage: number;
    bindingConsumption: number;
    completeBindingDocket: boolean; //  this is if the is-binding flag enabled for the fabric
    fabricInfo?: CutRmModel; //This will be only retrieved if we specify in the request
    cutSubNumber: number;
}

