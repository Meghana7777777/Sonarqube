import { IsString, IsDate, IsInt, IsOptional, IsNumber, IsBoolean } from "class-validator";

export class ForecastPlanDto {
  @IsString()
  module: string;

  @IsString()
  workstationCode: string;

  @IsString()
  styleOrMo: string;

  @IsString()
  scheduleOrMoLine: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsDate()
  planCutDate?: Date;

  @IsOptional()
  @IsDate()
  planDelDate?: Date;

  @IsInt()
  planPcs: number;

  @IsOptional()
  @IsNumber()
  planSah?: number;

  @IsOptional()
  @IsNumber()
  smv?: number;

  @IsOptional()
  @IsNumber()
  planSmo?: number;

  @IsOptional()
  @IsNumber()
  planEff?: number;

  @IsOptional()
  @IsNumber()
  forecastQty: number

  @IsString()
  planType: string;

  @IsDate()
  date: Date;

  @IsString()
  companyCode: string;

  @IsString()
  unitCode: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  createdUser?: string;

  @IsOptional()
  @IsString()
  updatedUser?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
