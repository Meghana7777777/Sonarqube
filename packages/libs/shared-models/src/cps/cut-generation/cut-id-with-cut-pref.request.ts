import { CommonRequestAttrs } from "../../common";


export class CutIdWithCutPrefRequest extends CommonRequestAttrs {
    cutIds: number[];
    
    iNeedDockets: boolean;
    iNeedDocketSize: boolean;
    iNeedActualDockets: boolean;
    iNeedActualDocketSize: boolean;
    iNeedActualBundles: boolean;
    iNeedDocketBundles: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cutIds: number[],
        iNeedDockets: boolean,
        iNeedActualDockets: boolean,
        iNeedDocketSize: boolean,
        iNeedActualDocketSize: boolean,
        iNeedActualBundles: boolean,
        iNeedDocketBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.cutIds = cutIds;
        this.iNeedDockets = iNeedDockets;
        this.iNeedActualDockets = iNeedActualDockets;
        this.iNeedDocketSize = iNeedDocketSize;
        this.iNeedActualDocketSize = iNeedActualDocketSize;
        this.iNeedDocketBundles = iNeedDocketBundles;
        this.iNeedActualBundles = iNeedActualBundles;
    }

}
