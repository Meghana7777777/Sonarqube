import { ApiProperty } from "@nestjs/swagger";

export class PoNumberRequest{
    @ApiProperty()
    poNumber: string;
    constructor(poNumber:string){
        this.poNumber  = poNumber
    } 
}