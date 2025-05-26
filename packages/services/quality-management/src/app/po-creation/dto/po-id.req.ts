import { ApiProperty } from "@nestjs/swagger";

export class PoIdRequest{
    @ApiProperty()
    poId: number;
    constructor(poId:number){
        this.poId  = poId
    } 
}