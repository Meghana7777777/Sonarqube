import { OpFormEnum } from "../../../oms";
import { OperationModel } from "../../../ums";
import { PoEmbLineModel } from "./po-emb-line.model";

export class PoEmbHeaderModel {
    headerId: number; // PK of the emb header
    embJobNumber: string;
    docketGroup: string;
    // operations: OperationModel[]; // the operations associated with the emb job. in the ASC order of the op sequence
    operations: string[];
    dockets: string[];
    embForm: OpFormEnum;
    moNo: string;
    moLines: string[];
    opGroup: string;
    plannedJobQty: number;
    productName: string;
    embLines: PoEmbLineModel[];
    plantRefStyle : string;
    garmentPo : string;
    garmentPoItem : string;


    constructor( 
        headerId: number, // PK of the emb header
        embJobNumber: string,
        docketGroup: string,
        operations: string[], // the operations associated with the emb job. in the ASC order of the op sequence
        dockets: string[],
        embForm: OpFormEnum,
        moNo: string,
        moLines: string[],
        opGroup: string,
        plannedJobQty: number,
        productName: string,
        embLines: PoEmbLineModel[],
        plantRefStyle: string,
        garmentPo: string,
        garmentPoItem: string,
    ) {
        this.headerId = headerId;
        this.embJobNumber = embJobNumber;
        this.docketGroup = docketGroup;
        this.operations = operations;
        this.dockets = dockets;
        this.embForm = embForm;
        this.moNo = moNo;
        this.moLines = moLines;
        this.opGroup = opGroup;
        this.plannedJobQty = plannedJobQty;
        this.productName = productName;
        this.embLines = embLines;
        this.plantRefStyle = plantRefStyle;
        this.garmentPo = garmentPo;
        this.garmentPoItem = garmentPoItem;
    }
}