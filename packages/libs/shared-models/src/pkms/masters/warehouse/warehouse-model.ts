export class WareHouseResponseDto {
    id: number;
    wareHouseCode: string;
    wareHouseDesc: string;
    latitude: string;
    longitude: string;
    managerName: string;
    managerContact: string;
    noOfFloors: number;
    constructor(
        id: number,
        wareHouseCode: string,
        wareHouseDesc: string,
        latitude: string,
        longitude: string,
        managerName: string,
        managerContact: string,
        noOfFloors: number
    ) {
        this.id = id
        this.wareHouseCode = wareHouseCode
        this.wareHouseDesc = wareHouseDesc
        this.latitude = latitude
        this.longitude = longitude
        this.managerName = managerName
        this.managerContact = managerContact
        this.noOfFloors = noOfFloors;
    }

}