import { CommonRequestAttrs, FGItemCategoryEnum, InsFabricInspectionRequestCategoryEnum, InsInspectionRollSelectionTypeEnum, InsTypesEnumType, PackFabricInspectionRequestCategoryEnum, PhItemCategoryEnum, ThreadTypeEnum, TrimTypeEnum, YarnTypeEnum } from "@xpparel/shared-models";

export class InsConfigValModel {
    id: number;
    insType: InsTypesEnumType;
    pickPerc: number;
    requiredForMaterialReady: boolean;
    selected: boolean;
    supplierCode: string;
    buyerCode: string;
    insSelectionType: InsInspectionRollSelectionTypeEnum
    insConfigItems: InsConfigItemsModel[];
    //packListId
    plRefId: number;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum
    isCreatedInSelfModule?: boolean;

/**
 * 
 * @param id 
 * @param insType 
 * @param pickPerc 
 * @param requiredForMaterialReady 
 * @param selected 
 * @param supplierCode 
 * @param buyerCode 
 * @param insSelectionType 
 * @param insConfigItems 
 * @param plRefId 
 * @param itemCategory 
 * @param isCreatedInSelfModule 
 */

    constructor(id: number, insType: InsTypesEnumType, pickPerc: number, requiredForMaterialReady: boolean, selected: boolean, supplierCode: string, buyerCode: string, insSelectionType: InsInspectionRollSelectionTypeEnum, insConfigItems: InsConfigItemsModel[], plRefId: number, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum, isCreatedInSelfModule?: boolean) {
        this.id = id;
        this.insType = insType;
        this.pickPerc = pickPerc;
        this.requiredForMaterialReady = requiredForMaterialReady;
        this.selected = selected;
        this.supplierCode = supplierCode;
        this.buyerCode = buyerCode;
        this.insSelectionType = insSelectionType;
        this.insConfigItems = insConfigItems;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory;
        this.isCreatedInSelfModule = isCreatedInSelfModule;
    }
}

export class InsConfigItemsModel {
    refId: number;
    refBarcode: string;
    constructor(refId: number, refBarcode: string) {
        this.refId = refId;
        this.refBarcode = refBarcode;
    }
}

export class INSConfigTransferReqModel extends CommonRequestAttrs {
    insType: InsTypesEnumType;
    plRefId: number;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;
    supplierCode: string;
    buyerCode: string;
    insConfigItems: InsConfigItemsModel[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, insType: InsTypesEnumType, plRefId: number, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum, supplierCode: string, buyerCode: string,
        insConfigItems?: InsConfigItemsModel[]

    ) {
        super(username, unitCode, companyCode, userId);
        this.insType = insType;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory;
        this.supplierCode = supplierCode;
        this.buyerCode = buyerCode;
        this.insConfigItems = insConfigItems;
    }
}

export class InsConfigFabValModel {
    id: number;
    insType: InsTypesEnumType;
    pickPerc: number;
    requiredForMaterialReady: boolean;
    selected: boolean;
    supplierCode: string;
    buyerCode: string;
    insSelectionType: InsInspectionRollSelectionTypeEnum;
    insConfigItems: InsConfigItemsModel[];
    plRefId: number;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;

    constructor(id: number, insType: InsTypesEnumType, pickPerc: number, requiredForMaterialReady: boolean, selected: boolean, supplierCode: string, buyerCode: string, insSelectionType: InsInspectionRollSelectionTypeEnum, insConfigItems: InsConfigItemsModel[], plRefId: number, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum) {
        this.id = id;
        this.insType = insType;
        this.pickPerc = pickPerc;
        this.requiredForMaterialReady = requiredForMaterialReady;
        this.selected = selected;
        this.supplierCode = supplierCode;
        this.buyerCode = buyerCode;
        this.insSelectionType = insSelectionType;
        this.insConfigItems = insConfigItems;
        this.plRefId = plRefId;
        this.itemCategory = itemCategory;
    }
}


export class InsConfigThreadValModel {
    id: number;
    insType: ThreadTypeEnum;
    pickPerc: number;
    requiredForMaterialReady: boolean;
    selected: boolean;
    supplierCode: string;
    buyerCode: string;
    insSelectionType: InsInspectionRollSelectionTypeEnum
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;

    constructor(id: number, insType: ThreadTypeEnum, pickPerc: number, requiredForMaterialReady: boolean, selected: boolean, supplierCode: string, buyerCode: string, insSelectionType: InsInspectionRollSelectionTypeEnum, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum) {
        this.id = id;
        this.insType = insType;
        this.pickPerc = pickPerc;
        this.requiredForMaterialReady = requiredForMaterialReady;
        this.selected = selected;
        this.supplierCode = supplierCode;
        this.buyerCode = buyerCode;
        this.insSelectionType = insSelectionType;
        this.itemCategory = itemCategory
    }
}

export class InsConfigYarnValModel {
    id: number;
    insType: YarnTypeEnum;
    pickPerc: number;
    requiredForMaterialReady: boolean;
    selected: boolean;
    supplierCode: string;
    buyerCode: string;
    insSelectionType: InsInspectionRollSelectionTypeEnum;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;

    constructor(id: number, insType: YarnTypeEnum, pickPerc: number, requiredForMaterialReady: boolean, selected: boolean, supplierCode: string, buyerCode: string, insSelectionType: InsInspectionRollSelectionTypeEnum, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum) {
        this.id = id;
        this.insType = insType;
        this.pickPerc = pickPerc;
        this.requiredForMaterialReady = requiredForMaterialReady;
        this.selected = selected;
        this.supplierCode = supplierCode;
        this.buyerCode = buyerCode;
        this.insSelectionType = insSelectionType;
        this.itemCategory = itemCategory
    }
}


export class InsConfigTrimValModel {
    id: number;
    insType: TrimTypeEnum;
    pickPerc: number;
    requiredForMaterialReady: boolean;
    selected: boolean;
    supplierCode: string;
    buyerCode: string;
    insSelectionType: InsInspectionRollSelectionTypeEnum;
    itemCategory: PhItemCategoryEnum | FGItemCategoryEnum;

    constructor(insType: TrimTypeEnum, pickPerc: number, requiredForMaterialReady: boolean, selected: boolean, supplierCode: string, buyerCode: string, insSelectionType: InsInspectionRollSelectionTypeEnum, itemCategory: PhItemCategoryEnum | FGItemCategoryEnum) {
        this.insType = insType;
        this.pickPerc = pickPerc;
        this.requiredForMaterialReady = requiredForMaterialReady;
        this.selected = selected;
        this.supplierCode = supplierCode;
        this.buyerCode = buyerCode;
        this.insSelectionType = insSelectionType;
        this.itemCategory = itemCategory;
    }
}

