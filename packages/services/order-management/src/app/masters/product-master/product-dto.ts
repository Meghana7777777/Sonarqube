import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class ProductsMasterDto {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  productCode: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageName: string;

  @ApiProperty()
  imagePath: string;

}