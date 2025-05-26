import { ApiProperty } from "@nestjs/swagger";

export class CommonDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    unitCode: string;
    @ApiProperty()
    companyCode: string;
    @ApiProperty()
    userId: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number) {
        this.username = username;
        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.userId = userId;
    }
}