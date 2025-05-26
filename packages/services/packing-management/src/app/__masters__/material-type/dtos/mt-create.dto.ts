import { ApiProperty } from "@nestjs/swagger";
import { CommonDto } from "../../../../base-services/dtos/common-dto";

export class MTCreateDto extends CommonDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    materialTypeCode: string;
    
    @ApiProperty()
    materialTypeDesc: string;
 

}