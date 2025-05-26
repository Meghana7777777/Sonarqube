import { ApiProperty } from "@nestjs/swagger";

export class EscallationDTO{
    @ApiProperty()
    id: number
    
    @ApiProperty()
    escalationType: string;
    
    @ApiProperty()
    style: string;
    
    @ApiProperty()
    buyer: string;
    
    @ApiProperty()
    workOrder: string;
    
    @ApiProperty()
    qualityType: string;
    
    @ApiProperty()
    escalationPercentage: string;
    
    @ApiProperty()
    escalationPerson: string;
    
    @ApiProperty()
    createdAt: string;
    
    @ApiProperty()
    updatedAt: string;
    
    @ApiProperty()
    isActive: boolean;
    
}