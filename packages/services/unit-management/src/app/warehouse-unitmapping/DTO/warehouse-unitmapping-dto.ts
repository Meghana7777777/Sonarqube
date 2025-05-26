import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class WarehouseUnitmappingDto {
    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    warehouseCode: string;
    
    @ApiProperty()
    unitsCode: string;

    @ApiProperty()
    companysCode: string;

}

