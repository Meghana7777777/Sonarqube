import { OrderTypeEnum } from "../../oes";
import { MC_BundleCountModel } from "../../oms";



export class ProcessingOrderCreationInfoModel {
    moNumber: string;
    moLine: string;
    productName: string;
    color: string;
    destination: string;
    delDate: string;
    coVpo: string;
    refNo: string;
    orginalQty: number;
    balanceQty: number;
    size: string;
    moProductSubLineId: number;
    moId: number;
    moLineId: number;
    oqType: OrderTypeEnum;
    pslBundleCountDetail?: MC_BundleCountModel[];
    

    constructor(
        moNumber: string,
        moLine: string,
        productName: string,
        color: string,
        destination: string,
        delDate: string,
        coVpo: string,
        refNo: string,
        orginalQty: number,
        balanceQty: number,
        size: string,
        moProductSubLineId: number,
        moId: number,
        moLineId: number,
        oqType: OrderTypeEnum,
        pslBundleCountDetail?: MC_BundleCountModel[],
    ) {
        this.moNumber = moNumber;
        this.moLine = moLine;
        this.productName = productName;
        this.color = color;
        this.destination = destination;
        this.delDate = delDate;
        this.coVpo = coVpo;
        this.refNo = refNo;
        this.orginalQty = orginalQty;
        this.balanceQty = balanceQty;
        this.size = size;
        this.moProductSubLineId = moProductSubLineId;
        this.moId = moId;
        this.moLineId = moLineId;
        this.oqType = oqType;
        this.pslBundleCountDetail = pslBundleCountDetail;
    }
}