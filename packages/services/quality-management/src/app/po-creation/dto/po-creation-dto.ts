import { ApiProperty } from "@nestjs/swagger";
import { PoStatusEnum } from "@xpparel/shared-models";

export class PoCreationDto {
    @ApiProperty()
    poId: number;

    @ApiProperty()
    poNumber: string;
    
    @ApiProperty()
    buyer: string;

    @ApiProperty()
    color: string;

    @ApiProperty()
    style: string;

    @ApiProperty()
    estimatedClosedDate: Date;

    @ApiProperty()
    buyerId: number;

    @ApiProperty()
    colorId: number;

    @ApiProperty()
    styleId: number;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    status: PoStatusEnum


}