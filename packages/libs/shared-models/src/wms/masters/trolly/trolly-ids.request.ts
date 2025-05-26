import { CommonRequestAttrs } from "../../../common";


export class TrollyIdsRequest extends CommonRequestAttrs {
    
    ids: number[];
    iNeedBinInfoAlso: boolean;
    iNeedTrayIdsInTrolly: boolean;
    iNeedTraysDetailedInfoInTrolly: boolean;
    dontThrowException?: boolean;

    constructor(username: string, unitCode: string, companyCode: string, userId: number,ids: number[],iNeedBinInfoAlso: boolean, iNeedTrayIdsInTrolly: boolean, iNeedTraysDetailedInfoInTrolly: boolean, dontThrowException?: boolean){
        super(username,unitCode,companyCode,userId);
        this.ids=ids;
        this.iNeedBinInfoAlso = iNeedBinInfoAlso;
        this.iNeedTrayIdsInTrolly = iNeedTrayIdsInTrolly;
        this.iNeedTraysDetailedInfoInTrolly = iNeedTraysDetailedInfoInTrolly;
        this.dontThrowException = dontThrowException;
    }
}
