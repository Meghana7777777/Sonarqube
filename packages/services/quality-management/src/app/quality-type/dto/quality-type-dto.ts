import { ApiProperty } from "@nestjs/swagger";

export class QualityTypeDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    qualityType: string

    @ApiProperty()
    isActive:boolean
}