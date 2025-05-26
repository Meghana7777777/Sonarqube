import { CommonRequestAttrs, GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { OrderTypeEnum } from "../../../enum";


export class OES_C_PoProdColorRequest extends CommonRequestAttrs {
    poSerial: number;
    prodName: string;
    color: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        prodName: string,
        color: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.prodName = prodName;
        this.color = color;
    }
}





export class OES_R_PoOrderQtysResponse extends GlobalResponseObject {
    data ?: OES_R_PoOrderQtysModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OES_R_PoOrderQtysModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class OES_R_PoOrderQtysModel {
    poSerial: number;
    prodName: string;
    color: string;
    sizeQtys: OES_R_PoOrderSizeQty[];

    constructor(
        poSerial: number,
        prodName: string,
        color: string,
        sizeQtys: OES_R_PoOrderSizeQty[]
    ) {
        this.poSerial = poSerial;
        this.prodName = prodName;
        this.color = color;
        this.sizeQtys = sizeQtys;
    }
}


export class OES_R_PoOrderSizeQty {
    oqType: OrderTypeEnum;
    size: string;
    orderQty: number;
    pslId: number;

    constructor(
        oqType: OrderTypeEnum,
        size: string,
        orderQty: number,
        pslId: number
    ) {
        this.oqType = oqType;
        this.size = size;
        this.orderQty = orderQty;
        this.pslId = pslId;
    }
}



