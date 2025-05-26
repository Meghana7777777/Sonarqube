import { ApiProperty } from "@nestjs/swagger";

export class DateDTO {
    @ApiProperty()
    fromDate?: any;
    @ApiProperty()
    toDate?: any;

}