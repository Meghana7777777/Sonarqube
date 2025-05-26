import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class ProcessTypeDto {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  processTypeName: string;

  @ApiProperty()
  processTypeCode: string;

  @ApiProperty()
  processTypeDescription: string;

  @ApiProperty()
  imageName: string;

  @ApiProperty()
  imagePath: string;

  @ApiProperty()
  remarks: string;
}