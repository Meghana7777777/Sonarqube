
export class PkDSetModel {
    id: number; // PK of the d_set entity
    moNumber: string; 
    cutOrderDesc: string; 
    productName: string;
    dSetItems: PkDSetItemsModel[];
}

export class PkDSetItemsModel {
    id: number; // PK of the d_set_item
    cutNo: string;
    totalBundles: string;  //sum of it is quantity
    containers: string[];  
    containerPrintStatus: boolean;
    itemsPrintStatus: boolean;
    dSetSubItems: PkDSetSubItemsModel[];
}

export class PkDSetSubItemsModel {
    id: number; // PK of the d_set_item
    bundleNumber: string;
    bundleQty: number;
    color: string;
    shade: string;
    components: string[];
}


export class PkDSetItemsDetailedModel {
    id: number; // PK of the d_set_item
    cutNo: string;
    moNumber: string; 
    cutOrderDesc: string; 
    productName: string;
    totalSubItems: number;
    totalContainerPutSubItems: number;
    containers: PkContainerModel[];
    containerPrintStatus: boolean;
    subItemsPrintStatus: boolean;
    dSetSubItems: PkDSetSubItemsModel[];
}

export class PkContainerModel {
    id: number; // PK of the d_set_container
    barcode: number;
    containerNumber: string;
    totalSubItemsInContainer: number; // retrieve this only when detailed information is asked
    subItemsInContainer: PkContainerSubItemModel[];
}

export class PkContainerSubItemModel {
    subItemBarcode: string;
    subItemDisplayNo: string; 
}