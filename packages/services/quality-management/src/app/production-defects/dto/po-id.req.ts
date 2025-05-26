import { ApiProperty } from "@nestjs/swagger";

export class PoIdRequest{
    @ApiProperty()
    poId: string;
    constructor(poId:string){
        this.poId  = poId
    } 
}