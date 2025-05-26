import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class CompanyDto {


  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;


}