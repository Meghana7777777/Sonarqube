import { GlobalResponseObject } from "../../../common";
import { AdBundleModel } from "../../../cps";
import { OpFormEnum } from "../../../oms";
import { EmbDispatchStatusEnum } from "../../enum";
import { PfEmbLinePropsModel } from "./pf-emb-line-props.model";

export class PoEmbLineModel {
    lineId: number; // PK of the emb line entity
    embJobNumber: string;
    moNo: string;
    moLines: string[];
    group: string;
    quantity: number;
    supplierId: number;
    barcodePrintStatus: boolean; // TRUE - barcodes printed

    embForm: OpFormEnum;
    panelFormEmbProps: PfEmbLinePropsModel;
    totalBundles: number;
    bundlesInfo: AdBundleModel[];
    dispatchReqNo: string; // The gatepass request number
    dispacthStatus: EmbDispatchStatusEnum;


    constructor(
        lineId: number, // PK of the emb line entity
        embJobNumber: string,
        moNo: string,
        moLines: string[],
        group: string,
        quantity: number,
        supplierId: number,
        barcodePrintStatus: boolean, // TRUE - barcodes printed
        embForm: OpFormEnum,
        panelFormEmbProps: PfEmbLinePropsModel,
        totalBundles: number,
        bundlesInfo: AdBundleModel[],
        dispatchReqNo: string,
        dispacthStatus: EmbDispatchStatusEnum
    ) {
        this.lineId = lineId;
        this.embJobNumber = embJobNumber; 
        this.moNo = moNo;
        this.moLines = moLines;
        this.group = group;
        this.quantity = quantity;
        this.supplierId = supplierId;
        this.barcodePrintStatus = barcodePrintStatus;
        this.embForm = embForm;
        this.panelFormEmbProps = panelFormEmbProps;
        this.totalBundles = totalBundles;
        this.bundlesInfo = bundlesInfo;
        this.dispatchReqNo = dispatchReqNo;
        this.dispacthStatus = dispacthStatus;
    }
}