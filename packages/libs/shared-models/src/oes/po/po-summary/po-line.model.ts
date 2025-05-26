import { OqPercentageModel } from "../../oq-update";
import { PoSubLineModel } from "./po-sub-line.model";

export class PoLinesModel {
    id: number;
    productType: string;
    productName: string; // the product name what user enters during the pack method definition in OMS
    color: string;
    style: string; // not usaully required
    plantStyle: string; // The user entered style ref
    orderLineNo: string; // the manufacturing order line no
    orderLineId: number; // the manufacturing order PK of OMS
    subLines: PoSubLineModel[];
    oqUpdateSelections: OqPercentageModel[]; // the po line level order qty type and percentages selected

    constructor(
        id: number,
        productType: string,
        productName: string,
        color: string,
        style: string,
        plantStyle: string,
        orderLineNo: string,
        orderLineId: number,
        subLines: PoSubLineModel[],
        oqUpdateSelections: OqPercentageModel[]
    ) {
        this.id = id;
        this.productType = productType;
        this.productName = productName;
        this.color = color;
        this.style = style;
        this.plantStyle = plantStyle;
        this.orderLineId = orderLineId;
        this.orderLineNo = orderLineNo;
        this.subLines = subLines;
        this.oqUpdateSelections = oqUpdateSelections;
    }
}