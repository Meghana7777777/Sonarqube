// import { PackMethodEnum } from "../../../oms-old";
import { PackMethodEnum } from "../../../oms";
import { OqPercentageModel } from "../../oq-update";
import { PoLinesModel } from "./po-line.model";

export class PoSummaryModel {
    poId: number;
    poDesc: string;
    poSerial: number;
    orderRefNo: string; // the manufacturing order no
    orderRefId: number; // the manufacturing order PK of OMS
    poName: string;
    productType: string;
    style: string;
    styleDesc: string;
    packMethod: PackMethodEnum;
    moLines: string[];
    poLines: PoLinesModel[];
    oqUpdateSelections: OqPercentageModel[]; // the main po level order qty type and percentages selected
    sizes: string[];
    constructor(
        poId: number,
        poDesc: string,
        poSerial: number,
        poName: string,
        productType: string,
        orderRefNo: string,
        orderRefId: number,
        style: string,
        styleDesc: string,
        packMethod: PackMethodEnum,
        moLines: string[],
        poLines: PoLinesModel[],
        oqUpdateSelections: OqPercentageModel[],
        sizes: string[]
    ) {
        this.poId = poId;
        this.poDesc = poDesc;
        this.poSerial = poSerial;
        this.poName = poName;
        this.productType = productType;
        this.orderRefId = orderRefId;
        this.orderRefNo = orderRefNo;
        this.style = style;
        this.styleDesc = styleDesc;
        this.packMethod = packMethod;
        this.poLines = poLines;
        this.oqUpdateSelections = oqUpdateSelections;
        this.sizes = sizes;
        this.moLines = moLines;
    }
}