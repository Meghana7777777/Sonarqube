
export class DSetModel {
    id: number; // PK of the d_set entity
    moNumber: string; 
    cutOrderDesc: string; 
    productName: string;
    dSetItems: DSetItemsModel[];
}

export class DSetItemsModel {
    id: number; // PK of the d_set_item
    cutNo: string;
    totalBundles: string;  //sum of it is quantity
    containers: string[];  
    containerPrintStatus: boolean;
    itemsPrintStatus: boolean;
    dSetSubItems: DSetSubItemsModel[];
}

export class DSetSubItemsModel {
    id: number; // PK of the d_set_item
    bundleNumber: string;
    bundleQty: number;
    color: string;
    shade: string;
    components: string[];
}


export class DSetItemsDetailedModel {
    id: number; // PK of the d_set_item
    cutNo: string;
    moNumber: string; 
    cutOrderDesc: string; 
    productName: string;
    totalSubItems: number;
    totalContainerPutSubItems: number;
    containers: ContainerModel[];
    containerPrintStatus: boolean;
    subItemsPrintStatus: boolean;
    dSetSubItems: DSetSubItemsModel[];
}

export class ContainerModel {
    id: number; // PK of the d_set_container
    barcode: number;
    containerNumber: string;
    totalSubItemsInContainer: number; // retrieve this only when detailed information is asked
    subItemsInContainer: ContainerSubItemModel[];
}

export class ContainerSubItemModel {
    subItemBarcode: string;
    subItemDisplayNo: string; 
}