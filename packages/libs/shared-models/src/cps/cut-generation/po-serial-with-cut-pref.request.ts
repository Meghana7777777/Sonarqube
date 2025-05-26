import { CommonRequestAttrs } from "../../common";


export class PoSerialWithCutPrefRequest extends CommonRequestAttrs {
    poSerial: number;
    
    iNeedDockets: boolean; //true
    iNeedDocketSize: boolean;
    iNeedActualDockets: boolean; //true
    iNeedActualDocketSize: boolean;
    iNeedActualBundles: boolean;
    iNeedDocketBundles: boolean;

    productName?: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        iNeedDockets: boolean,
        iNeedActualDockets: boolean,
        iNeedDocketSize: boolean,
        iNeedActualDocketSize: boolean,
        iNeedActualBundles: boolean,
        iNeedDocketBundles: boolean,
        productName?: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.iNeedDockets = iNeedDockets;
        this.iNeedActualDockets = iNeedActualDockets;
        this.iNeedDocketSize = iNeedDocketSize;
        this.iNeedActualDocketSize = iNeedActualDocketSize;
        this.iNeedDocketBundles = iNeedDocketBundles;
        this.iNeedActualBundles = iNeedActualBundles;
        this.productName = productName
    }

}


// {
//     "username":"admin","unitCode":"B3","companyCode":"5000","userId":20,"poSerial":14,"iNeedDocketFabricInfo":true,
//     "iNeedDockets": true,
//     "iNeedDocketSize": true,
//     "iNeedActualDockets": true,
//     "iNeedActualDocketSize": true,
//     "iNeedActualBundles": true,
//     "iNeedDocketBundles": true
// }


