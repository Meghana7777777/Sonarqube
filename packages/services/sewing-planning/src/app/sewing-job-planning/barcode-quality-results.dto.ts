import { IsString, IsOptional, IsInt, IsEnum } from "class-validator";
import { ProcessTypeEnum } from "@xpparel/shared-models";

export class BarcodeDetailsForQualityResultsDto {
  
  @IsString()
  barcode: string;

  @IsString()
  barcodeType: string;

  @IsString()
  operationCode: string;

  @IsEnum(ProcessTypeEnum)
  @IsOptional()
  processType?: ProcessTypeEnum;

  @IsInt()
  failCount: number;

  @IsString()
  resourceCode: string;

  @IsString()
  companyCode: string;

  @IsString()
  unitCode: string;

  @IsOptional()
  @IsString()
  createdUser?: string;

  @IsOptional()
  @IsString()
  updatedUser?: string;

}