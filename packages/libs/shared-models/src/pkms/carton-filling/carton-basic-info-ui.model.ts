import { FgContainerLocationStatusEnum } from "../masters";

export class CartonBasicInfoUIModel {
    cartonId: number;
    cartonProtoId: number;
    cartonNo: number;
    originalQty: number;
    inputQuantity: number;
    leftOverQuantity: number;
    scannedQuantity: number;
    packListId: number;
    packListCode: string;
    phLinesId: number;
    batch: string;
    inspectionPick: boolean;
    barcode: string;
    status: FgContainerLocationStatusEnum;
    width: number;
    length: number;
    height: number;
    grossWeight: number;
    netWeight: number;
}