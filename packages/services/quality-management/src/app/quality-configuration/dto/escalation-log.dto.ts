import { ApiProperty } from "@nestjs/swagger";

export class EscallationLogDto {
    @ApiProperty()
    unitCode: string

    @ApiProperty()
    companyCode: string

    @ApiProperty()
    userName: string

    @ApiProperty()
    userId: string
}