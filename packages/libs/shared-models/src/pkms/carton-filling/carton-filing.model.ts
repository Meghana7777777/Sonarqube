import { PackingStatusEnum } from "../enum";
import { PolyBagPrototypeModel } from "../pack-list";

export class CartonFillingModel {
    cartonId: number;
    cartonProtoId: number;
    cartonNo: string;
    qty: number;
    scannedQy: number;
    noOfPBags: number;
    count: number;
    grossWeight: number;
    netWeight: number;
    dimensions: string;
    poNumber: string;
    poId: number;
    color: string[];
    exFactory: string;//Date
    packingStatus: PackingStatusEnum;
    plannedPolyBagDetails: PolyBagPrototypeModel[];
    scannedPolyBagDetails: PolyBagPrototypeModel[];

    constructor(
        cartonId: number,
        cartonProtoId: number,
        cartonNo: string,
        qty: number,
        scannedQy: number,
        noOfPBags: number,
        count: number,
        grossWeight: number,
        netWeight: number,
        dimensions: string,
        poNumber: string,
        poId: number,
        color: string[],
        exFactory: string,//Date
        packingStatus: PackingStatusEnum,
        plannedPolyBagDetails: PolyBagPrototypeModel[],
        scannedPolyBagDetails: PolyBagPrototypeModel[],
    ) {
        this.cartonId = cartonId;
        this.cartonNo = cartonNo;
        this.cartonProtoId = cartonProtoId;
        this.qty = qty;
        this.scannedQy = scannedQy;
        this.noOfPBags = noOfPBags;
        this.count = count;
        this.grossWeight = grossWeight;
        this.netWeight = netWeight;
        this.dimensions = dimensions;
        this.poNumber = poNumber;
        this.poId = poId;
        this.color = color;
        this.exFactory = exFactory;//Date
        this.packingStatus = packingStatus;
        this.plannedPolyBagDetails = plannedPolyBagDetails;
        this.scannedPolyBagDetails = scannedPolyBagDetails;
    }
}