import { ApiProperty } from "@nestjs/swagger";
import { CommonDto } from "../../../../base-services/dtos/common-dto";

export class PTCreateDto extends CommonDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    packTypeCode: string;
    @ApiProperty()
    packTypeDesc: string;
}