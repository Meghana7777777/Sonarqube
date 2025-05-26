import { CommonRequestAttrs } from "../../../common";


export class TrollyBarcodesRequest extends CommonRequestAttrs {
    
    barcodes: string[];
    iNeedBinInfoAlso: boolean;
    iNeedTrayIdsInTrolly: boolean;
    iNeedTraysDetailedInfoInTrolly: boolean;
    dontThrowException?: boolean;

    constructor(username: string, unitCode: string, companyCode: string, userId: number,barcodes: string[],iNeedBinInfoAlso: boolean, iNeedTrayIdsInTrolly: boolean, iNeedTraysDetailedInfoInTrolly: boolean, dontThrowException?: boolean){
        super(username,unitCode,companyCode,userId);
        this.barcodes=barcodes;
        this.iNeedBinInfoAlso = iNeedBinInfoAlso;
        this.iNeedTrayIdsInTrolly = iNeedTrayIdsInTrolly;
        this.iNeedTraysDetailedInfoInTrolly = iNeedTraysDetailedInfoInTrolly;
        this.dontThrowException = dontThrowException;
    }
}
