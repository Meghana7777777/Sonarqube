import { ApiProperty } from "@nestjs/swagger";
import { WarehouseTypeEnum } from "@xpparel/shared-models";
import { PrimaryGeneratedColumn } from "typeorm";

export class WarehouseDto {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    warehouseName: string;

    @ApiProperty()
    warehouseCode: string;

    @ApiProperty()
    companysCode: string;

    @ApiProperty()
    location: string;  

    @ApiProperty()
    address: string;

    @ApiProperty()
    warehouseType: WarehouseTypeEnum;

    @ApiProperty()
    latitude: string;

    @ApiProperty()
    longitude: string;


}