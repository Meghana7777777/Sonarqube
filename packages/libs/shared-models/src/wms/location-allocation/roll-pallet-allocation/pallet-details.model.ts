import { CommonRequestAttrs } from "../../../common";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBinStatusEnum, PalletGroupTypeEnum } from "../../enum";
import { BinDetailsModel } from "../bin-pallet-confirmation";

export class PalletDetailsModel extends CommonRequestAttrs {
    barcode: string;
    palletId: number;
    palletCode: string;
    palletCapacity: number;
    uom: string;
    maxItems: number;

    status: PalletBinStatusEnum;
    palletCurrentLoc: CurrentPalletLocationEnum; // describes where the pallet is
    palletCureentState: CurrentPalletStateEnum; // describes what the pallet current status is


    totalConfirmedRolls: number; // calculation from the pallet_roll_map entity
    confirmedQty: number; // calculation from the pallet_roll_map entity i.e based on the roll_id and its pending quantity

    totalAllocatedRolls: number; // calculation from the pallet_roll_map entity
    allocatedQty: number; // calculation from the pallet_roll_map entity i.e based on the roll_id and its pending quantity

    suggestedBinInfo: BinDetailsModel;
    confimredBinInfo: BinDetailsModel;
    palletGroupType?: PalletGroupTypeEnum[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, barcode: string, palletId: number, palletCode: string, palletCapacity: number, uom: string, maxItems: number, status: PalletBinStatusEnum, palletCurrentLoc: CurrentPalletLocationEnum, palletCureentState: CurrentPalletStateEnum, totalConfirmedRolls: number, confirmedQty: number, totalAllocatedRolls: number, allocatedQty: number, suggestedBinInfo: BinDetailsModel, confimredBinInfo: BinDetailsModel, palletGroupType?: PalletGroupTypeEnum[]) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.palletId = palletId;
        this.palletCode = palletCode;
        this.palletCapacity = palletCapacity;
        this.uom = uom;
        this.maxItems = maxItems;
        this.status = status;
        this.palletCurrentLoc = palletCurrentLoc;
        this.palletCureentState = palletCureentState;
        this.totalConfirmedRolls = totalConfirmedRolls;
        this.confirmedQty = confirmedQty;
        this.totalAllocatedRolls = totalAllocatedRolls;
        this.allocatedQty = allocatedQty;
        this.suggestedBinInfo = suggestedBinInfo;
        this.confimredBinInfo = confimredBinInfo;
        this.palletGroupType = palletGroupType
    }



}