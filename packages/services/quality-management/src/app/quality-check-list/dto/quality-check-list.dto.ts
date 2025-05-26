import { ApiProperty } from "@nestjs/swagger"

export class QualityCheckListDto {
    @ApiProperty()
    qualityCheckListId: number

    @ApiProperty()
    qualityTypeId: number

    @ApiProperty()
    parameter: string
}