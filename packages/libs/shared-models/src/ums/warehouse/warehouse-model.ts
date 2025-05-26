import { CommonRequestAttrs } from "../../common";
import { WarehouseTypeEnum } from "../enum";

export class WarehouseModel  {
    id?: number;
    warehouseName: string;
    warehouseCode: string;
    companysCode: string;
    location: string;
    address: string;
    warehouseType: WarehouseTypeEnum;
    isActive: boolean;
    latitude?: string;
    longitude?: string;


    constructor(

        id: number,
        warehouseName: string,
        warehouseCode: string,
        companysCode: string,
        location: string,
        address: string,
        warehouseType: WarehouseTypeEnum,
        isActive: boolean,
        latitude?: string,
        longitude?: string
    ) {
        this.id = id;
        this.warehouseName = warehouseName;
        this.warehouseCode = warehouseCode;
        this.companysCode = companysCode;
        this.location = location;
        this.address = address;
        this.warehouseType = warehouseType;
        this.isActive = isActive;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}