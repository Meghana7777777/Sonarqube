import { CommonRequestAttrs } from "../../../common";
import { PreferredFGStorageMaterialEnum } from "../../enum";



export class FgRackCreationModel extends CommonRequestAttrs {
    id: number;
    name: string;
    code: string;
    levels: number;
    weightCapacity: number;
    weightUom: string;
    wareHouse: number;
    wareHouseCode: string;
    columns: number;
    length: number;
    width: number;
    height: number;
    latitude: string;
    longitude: string
    preferredStorageMaterial: PreferredFGStorageMaterialEnum;
    priority: number;
    
    barcodeId: string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, name: string, code: string, levels: number,weightCapacity: number, weightUom: string, wareHouse: number, columns: number, length: number,
        width: number,
        height: number,
        latitude: string,
        longitude: string, preferredStorageMaterial: PreferredFGStorageMaterialEnum, priority: number, barcodeId: string, wareHouseCode?: string) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.name = name;
        this.code = code;
        this.levels = levels;
        this.weightCapacity = weightCapacity;
        this.weightUom= weightUom;
        this.wareHouse = wareHouse;
        this.wareHouseCode = wareHouseCode;
        this.columns = columns;
        this.length = length;
        this.width = width;
        this.height = height;
        this.latitude = latitude;
        this.longitude = longitude;
        this.preferredStorageMaterial = preferredStorageMaterial;
        this.priority = priority;
        this.barcodeId = barcodeId;
    }
}