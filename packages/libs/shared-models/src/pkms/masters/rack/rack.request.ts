import { CommonRequestAttrs } from "../../../common";
import { FabricUOM } from "../../../wms";
import { PreferredFGStorageMaterialEnum } from "../../enum";



export class FgRackCreateReq extends CommonRequestAttrs {
    id: number;
    name: string;
    code: string;
    levels: number;
    weightCapacity: number;
    weightUom: string;
    floor: number;
    whId: number;
    wareHouseDesc: string
    columns: number;
    preferredStorageMaterial: PreferredFGStorageMaterialEnum;
    priority: number;
    length: number;
    lengthUom: FabricUOM
    width: number;
    widthUom: FabricUOM
    height: number;
    heightUom: FabricUOM
    latitude: string;
    longitude: string;
    isActive: boolean;
    barcodeId: string;
    createLocations?: boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, names: string, code: string, levels: number, weightCapacity: number, weightUom: string, floor: number, whId: number, wareHouseDesc: string, columns: number, preferredStorageMaterial: PreferredFGStorageMaterialEnum, priority: number,
        length: number,
        lengthUom: FabricUOM,
        width: number,
        widthUom: FabricUOM,
        height: number,
        heightUom: FabricUOM,
        latitude: string,
        longitude: string, isActive: boolean, barcodeId: string, createLocations?: boolean) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.name = names;
        this.code = code;
        this.levels = levels;
        this.weightCapacity = weightCapacity;
        this.weightUom = weightUom;
        this.floor = floor;
        this.whId = whId;
        this.wareHouseDesc = wareHouseDesc
        this.columns = columns;
        this.length = length;
        this.width = width;
        this.height = height;
        this.lengthUom = lengthUom;
        this.weightUom = weightUom;
        this.heightUom = heightUom;
        this.latitude = latitude;
        this.longitude = longitude;
        this.preferredStorageMaterial = preferredStorageMaterial;
        this.priority = priority;
        this.isActive = isActive;
        this.barcodeId = barcodeId;
        this.createLocations = createLocations;
        this.widthUom = widthUom

    }
}