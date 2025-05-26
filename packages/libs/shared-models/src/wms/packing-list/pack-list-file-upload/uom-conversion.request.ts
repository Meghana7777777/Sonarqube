import { CommonRequestAttrs, GlobalResponseObject, PhItemCategoryEnum } from "../../../common";
import { FabricUOM } from "../../enum";

export class UOMConversionRequest extends CommonRequestAttrs {
    date: Date;//mandatory
    phItemCategoryEnum: PhItemCategoryEnum;//Mandatory for Plant Default UOM
    fromUOM: FabricUOM[];
    toUOM: FabricUOM[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, date: Date, fromUOM: FabricUOM[], toUOM: FabricUOM[], phItemCategoryEnum: PhItemCategoryEnum) {
        super(username, unitCode, companyCode, userId);
        this.fromUOM = fromUOM;
        this.toUOM = toUOM;
        this.date = date;
        this.phItemCategoryEnum = phItemCategoryEnum
    }
}

export class UomConversionModel {
    fromUom: FabricUOM;
    toUom: FabricUOM;
    conversionFactor: number;
    validFrom: Date;
    validTo: Date;
    constructor(fromUom: FabricUOM, toUom: FabricUOM, conversionFactor: number, validFrom: Date, validTo: Date) {
        this.fromUom = fromUom;
        this.toUom = toUom;
        this.conversionFactor = conversionFactor;
        this.validFrom = validFrom;
        this.validTo = validTo;
    }
}

export class PlantDefaultUOMModel{
    itemCategory: PhItemCategoryEnum;
    plantLevelUom: FabricUOM;
    validFrom: Date;
    validTo: Date
    constructor(itemCategory: PhItemCategoryEnum, plantLevelUom: FabricUOM, validFrom: Date, validTo: Date) {
        this.itemCategory = itemCategory;
        this.plantLevelUom = plantLevelUom;
        this.validFrom = validFrom;
        this.validTo = validTo
    }
}

export class UOMConversionResponse extends GlobalResponseObject {
    data: UomConversionModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: UomConversionModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PlantDefaultUOMResponse extends GlobalResponseObject {
    data: PlantDefaultUOMModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PlantDefaultUOMModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}