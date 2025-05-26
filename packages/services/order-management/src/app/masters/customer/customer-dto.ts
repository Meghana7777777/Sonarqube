import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class CustomerDto {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerCode: string;

  @ApiProperty()
  customerDescription: string;

  @ApiProperty()
  imageName: string;

  @ApiProperty()
  imagePath: string;

  @ApiProperty()
  customerLocation: string;
}