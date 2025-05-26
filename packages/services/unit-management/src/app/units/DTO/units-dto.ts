import { ApiProperty } from "@nestjs/swagger";
import { CommonRequestAttrs } from "@xpparel/shared-models";
import { PrimaryGeneratedColumn } from "typeorm";

export class UnitsDto extends CommonRequestAttrs {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    unitName: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    companysCode: string;

    @ApiProperty()
    location: string;  

    @ApiProperty()
    address: string;


    @ApiProperty()
    latitude: string;

    @ApiProperty()
    longitude: string;


}