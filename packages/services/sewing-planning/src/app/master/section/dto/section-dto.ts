import { ApiProperty } from "@nestjs/swagger";
import {  DepartmentTypeEnumForMasters, ProcessTypeEnum } from "@xpparel/shared-models";
import { PrimaryGeneratedColumn } from "typeorm";

export class SectionDto {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    secCode: string;

    @ApiProperty()
    secName:string;

    @ApiProperty()
    secDesc:string;

    @ApiProperty()
    depType:DepartmentTypeEnumForMasters;

    @ApiProperty()
    secColor:string;

    @ApiProperty()
    secHeadName:string;

    @ApiProperty()
    secOrder:string;

    @ApiProperty()
    secType:ProcessTypeEnum;

}
