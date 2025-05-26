import { PKMSCartonAttrsModel } from "./pkms-carton-attribute-res-dto";

export class PKMSCartonInfoModel {
    packListId: number;
    packOrderId: number;
    qty: number; // total qty of the carton
    cartonId: number; // PK of the carton
    barcode: string; // barcode of the carton
    attrs: PKMSCartonAttrsModel[]; // should get only send if iNeedCartonAttrs is true
    isFgWhCartonId: boolean;
    style: string;
    netWeight: number;
    grossWeight: number;
    constructor(
        packListId: number,
        packOrderId: number,
        qty: number,
        cartonId: number,
        barcode: string,
        attrs: PKMSCartonAttrsModel[],
        isFgWhCartonId?: boolean,
        style?: string,
        netWeight?: number,
        grossWeight?: number,

    ) {
        this.packListId = packListId;
        this.packOrderId = packOrderId;
        this.qty = qty;
        this.cartonId = cartonId;
        this.barcode = barcode;
        this.attrs = attrs;
        this.isFgWhCartonId = isFgWhCartonId;
        this.style = style;
        this.netWeight = netWeight;
        this.grossWeight = grossWeight;
    }
}