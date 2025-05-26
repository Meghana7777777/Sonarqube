import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class StyleMasterDto {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  styleName: string;

  @ApiProperty()
  styleCode: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageName: string;

  @ApiProperty()
  imagePath: string;

}