import { Injectable } from "@nestjs/common";
import { PlantDefaultUomRepo } from "../../repositories/plant-default-uom.repository";
import { UomConversionRepo } from "../../repositories/uom-conversion.repository";
import { CommonRequestAttrs, PlantDefaultUOMResponse, UOMConversionRequest, UOMConversionResponse } from "@xpparel/shared-models";
import { In, LessThan, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

@Injectable()
export class UOMConversionService {
  constructor(
    private uomConversionRepo: UomConversionRepo,
    private planDefaultUOMRepo: PlantDefaultUomRepo
  ) { }

  async getAllUOMConversion(req: UOMConversionRequest): Promise<UOMConversionResponse> {
    const uomConversion = await this.uomConversionRepo.getAllUOMConversion(req);
    return new UOMConversionResponse(true, 0, "Data retrieved successfully", uomConversion);
  }

  async getPlantDefaultUOMForGivenItem(req: UOMConversionRequest): Promise<any> {
    const plantDefaultUOM = await this.planDefaultUOMRepo.getPlantDefaultUOMForGivenItem(req);
    return new PlantDefaultUOMResponse(true, 0, "Data retrieved successfully", plantDefaultUOM);
  }
}