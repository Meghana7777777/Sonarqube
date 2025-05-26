import { CommonRequestAttrs } from "../../../common";
import { FGWarehouseTypeEnum } from "../../enum";

export class WareHouseModel extends CommonRequestAttrs {
    id: number;
    wareHouseCode: string;
    wareHouseDesc: string;
    wareHouseType: FGWarehouseTypeEnum;
    latitude:string;
    longitude:string;
    noOfFloors:number;
    managerName: string;
    managerContact: string;
    address:string;

    constructor(
        wareHouseCode: string,
        wareHouseDesc: string,
        wareHouseType: FGWarehouseTypeEnum,
        latitude:string,
        longitude:string,
        noOfFloors:number,
        managerName: string,
        managerContact: string,
        address:string,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id?: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.wareHouseCode = wareHouseCode;
        this.wareHouseDesc = wareHouseDesc;
        this.wareHouseType = wareHouseType;                
        this.noOfFloors=noOfFloors;     
        this.latitude=latitude;
        this.longitude=longitude;
        this.managerName = managerName
        this.managerContact = managerContact
        this.address = address
    }
}