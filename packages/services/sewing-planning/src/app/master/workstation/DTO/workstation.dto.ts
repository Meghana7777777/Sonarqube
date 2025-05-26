import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class WorkstationDto {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty()
    wsCode: string;

    @ApiProperty()
    wsName: string;

    @ApiProperty()
    wsDesc:string;

    @ApiProperty()
    moduleCode:string;

   
}