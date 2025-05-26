import { ApiProperty } from "@nestjs/swagger";
import { WarehouseTypeEnum } from "@xpparel/shared-models";
import { CommonDto } from "../../../../base-services/dtos/common-dto";

export class WHCreateDto extends CommonDto {
    @ApiProperty()
    id:number;
    @ApiProperty()
    wareHouseCode: string;
    @ApiProperty()
    wareHouseDesc: string;
    @ApiProperty()
    wareHouseType: WarehouseTypeEnum;
    @ApiProperty()
    latitude: string;
    @ApiProperty()
    longitude: string;
    @ApiProperty()
    managerName: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    managerContact: string;
    @ApiProperty()
    noOfFloors: number;
}