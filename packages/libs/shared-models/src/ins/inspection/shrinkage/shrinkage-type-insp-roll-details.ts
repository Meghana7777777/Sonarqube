import { InsShrinkageTypeEnum } from "../../enum";

export class InsShrinkageTypeInspectionRollDetails {
    shrinkageType: InsShrinkageTypeEnum;
    measurementWidth: number;
    measurementLength: number;
    widthAfterSk: number;
    lengthAfterSk: number;
    remarks: string;
    skGroup: string;
    uom: string;
    skWidthPercentage: number;
    skLengthPercentage: number;

    constructor(
        shrinkageType: InsShrinkageTypeEnum,
        measurementWidth: number,
        measurementLength: number,
        lengthAfterSk: number,
        widthAfterSk: number,
        remarks: string,
        skGroup: string,
        uom: string) {
        this.shrinkageType = shrinkageType;
        this.measurementLength = measurementLength;
        this.measurementWidth = measurementWidth;
        this.widthAfterSk = widthAfterSk;
        this.lengthAfterSk = lengthAfterSk;
        this.remarks = remarks;
        this.skGroup = skGroup;
        this.uom = uom;
    }

}