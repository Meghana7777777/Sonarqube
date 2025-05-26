import { ApiProperty } from "@nestjs/swagger";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { PrimaryGeneratedColumn } from "typeorm";

export class LocationDto {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    locationCode: string;

    @ApiProperty()
    locationName: string;

    @ApiProperty()
    locationDesc: string;

    @ApiProperty()
    locationType: ProcessTypeEnum

      // @ApiProperty()
    // wsCategory:WsCategoryEnum;


    @ApiProperty()
    locationExtRef: string;

    @ApiProperty()
    locationCapacity: string;

    @ApiProperty()
    maxInputJobs: string;

    @ApiProperty()
    maxDisplayJobs: string;

    @ApiProperty()
    locationHeadName: string;

    @ApiProperty()
    locationHeadCount: string;

    @ApiProperty()
    locationOrder: string;

    @ApiProperty()
    locationColor: string;

    @ApiProperty()
    secCode: string;


}