import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class ItemDto {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemDescription: string;

  @ApiProperty()
  itemSku: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  rmItemType: string;

  @ApiProperty()
  bomItemType: string;

  @ApiProperty()
  itemColor: string;


}