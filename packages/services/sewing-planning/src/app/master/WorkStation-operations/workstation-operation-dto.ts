import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class WorkStationOpeartionDto {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    wsCode: string;

    @ApiProperty()
    iOpCode: number;

    @ApiProperty()
    opName:string;

    @ApiProperty()
    externalRefCode: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    unitCode: string;

    @ApiProperty()
    companyCode: string;

    @ApiProperty()
    userId: number;

    @ApiProperty()
   isActive: boolean;

}