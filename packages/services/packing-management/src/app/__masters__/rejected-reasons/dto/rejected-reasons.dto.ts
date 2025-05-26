import { ApiProperty } from "@nestjs/swagger";
import { CommonRequestAttrs } from "@xpparel/shared-models";

export class RejectedReasonsDto extends CommonRequestAttrs {

    @ApiProperty()
    id: number
    
    @ApiProperty()
    reasonCode: string

    @ApiProperty()
    reasonName: string

    @ApiProperty()
    reasonDesc: string
}