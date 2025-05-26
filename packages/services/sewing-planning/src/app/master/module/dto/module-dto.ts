import { ApiProperty } from "@nestjs/swagger";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { PrimaryGeneratedColumn } from "typeorm";

export class ModuleDto {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    moduleCode: string;

    @ApiProperty()
    moduleName: string;

    @ApiProperty()
    moduleDesc: string;

    @ApiProperty()
    moduleType: ProcessTypeEnum

    // @ApiProperty()
    // wsCategory:WsCategoryEnum;

    @ApiProperty()
    moduleExtRef: string;

    @ApiProperty()
    moduleCapacity: string;

    @ApiProperty()
    maxInputJobs: string;

    @ApiProperty()
    maxDisplayJobs: string;

    @ApiProperty()
    moduleHeadName: string;

    @ApiProperty()
    moduleHeadCount: string;

    @ApiProperty()
    moduleOrder: string;

    @ApiProperty()
    moduleColor: string;

    @ApiProperty()
    secCode: string;


}