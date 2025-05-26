import { ApiProperty } from "@nestjs/swagger";

export class ApproverDTO {
    @ApiProperty()
    id: number

    @ApiProperty()
    approverName: string;

    @ApiProperty()
    emailId: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    isActive: boolean;

}