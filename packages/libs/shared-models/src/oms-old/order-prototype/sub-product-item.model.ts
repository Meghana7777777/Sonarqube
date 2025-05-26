import { RmCompMapModel } from "./rm-comp-map.model";

export class SubProductItemModel {
    prodId: number;
    subProdId: number;
    orderNo: string;
    orderLineNo: string; // not used as of now
    subStyle: string; // not rquired in request
    subStyleCode: string; // not rquired in request
    substyleDesc: string; // not rquired in request
    subProductType: string; // not rquired in request
    subProdName: string; // not rquired in request
    fgColor: string; // not rquired in request
    components: string[];
    rmCompMapping: RmCompMapModel[];
    constructor(
        orderNo: string,
        orderLineNo: string,
        components: string[],
        rmCompMapping: RmCompMapModel[],
        subStyle: string,
        subStyleCode: string,
        substyleDesc: string,
        subProductType: string,
        subProdName: string,
        fgColor: string,
        prodId: number,
        subProdId: number
    ) {
        this.orderNo = orderNo;
        this.orderLineNo = orderLineNo;
        this.components = components;
        this.rmCompMapping = rmCompMapping;
        this.subStyle = subStyle;
        this.subStyleCode = subStyleCode;
        this.substyleDesc = substyleDesc;
        this.subProductType = subProductType;
        this.subProdName = subProdName;
        this.fgColor = fgColor;
        this.prodId = prodId;
        this.subProdId = subProdId;
    }
}
