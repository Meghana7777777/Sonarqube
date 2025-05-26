import { ProcessTypeEnum } from "../../oms";

export class EsclationsInfo {
    esclationName:string;
    styleCode : string;
    processType:ProcessTypeEnum;
    qualityType:string;
    barcode:string;
    inspectedBy:string;
    quantity : string;
    actionStatus:string;
    
}