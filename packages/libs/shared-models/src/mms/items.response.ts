export class ItemsInfoModel{
    itemId?:number;
    itemCode?: string;
    itemCategoryId?:number;
    itemSubCategoryId?:number;
    itemName: string;
    packingCategory:string;
    isActive: boolean;
    createdAt : Date | any;
    createdUser : string;
    updatedAt : Date | any;
    updatedUser : string;
    versionFlag : number;
    assetType?: string;
    assetSla?:number;
    assetPriority?:string;
    frequency?:string;
    depreciationPercentage?:string;
    approxServiceTime?:Date;
    constructor(
        
        itemName: string,
        packingCategory:string,
        isActive: boolean,
        createdAt : Date | any,
        createdUser : string,
        updatedAt : Date | any,
        updatedUser : string,
        versionFlag : number,
        assetType?: string,
        assetSla?:number,
        assetPriority?:string,
        frequency?:string,
        depreciationPercentage?:string,
        approxServiceTime?:Date,
        itemId?:number,
        itemCode?: string,
        itemCategoryId?:number,
        itemSubCategoryId?:number,
    ){
        this.itemId = itemId;
        this.itemCode = itemCode;
        this.itemCategoryId = itemCategoryId;
        this.itemSubCategoryId = itemSubCategoryId;
        this.itemName = itemName;
        this.packingCategory = packingCategory;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.updatedAt = updatedAt;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;
        this.assetType = assetType;
        this.assetSla = assetSla;
        this.assetPriority = assetPriority;
        this.frequency = frequency;
        this.depreciationPercentage = depreciationPercentage;
        this.approxServiceTime = approxServiceTime;
       
    }
}