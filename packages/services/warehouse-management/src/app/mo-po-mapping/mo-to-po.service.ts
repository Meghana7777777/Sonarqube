import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommonIdReqModal, CommonResponse, GlobalResponseObject, ManufacturingOrderNumberRequest, MOToPOMappingReq } from '@xpparel/shared-models';
import { MOToMapRepo } from './repo/mo_to_po_map.repo';
import { In } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';

@Injectable()
export class MoToPoMapService {
  constructor(
    private readonly moToPoMapRepository: MOToMapRepo,
  ) { }

  async mapMoToRMPo(req: MOToPOMappingReq): Promise<GlobalResponseObject> {
    if (!req.companyCode || !req.unitCode) {
      throw new BadRequestException('companyCode and unitCode are required');
    }
    const newMappings = [];
    for (const mapping of req.mappingData) {
      if (!mapping.moRefId || !mapping.plHeadRefId || !mapping.poNumber || !mapping.moNumber) {
        throw new BadRequestException(`poNumber, moNumber, and phRefId are required`);
      }
      const isRecordExist = await this.moToPoMapRepository.findOne({ where: { moRefId: mapping.moRefId, phRefId: mapping.plHeadRefId, poNumber: mapping.poNumber } });
      const newMapping = this.moToPoMapRepository.create({
        id: isRecordExist?.id,
        moRefId: mapping.moRefId,
        phRefId: mapping.plHeadRefId,
        poNumber: mapping.poNumber,
        companyCode: req.companyCode,
        unitCode: req.unitCode,
        createdUser: req.username,
        moNo: mapping.moNumber,
        packListCode: mapping.packLisNo
      });
      newMappings.push(newMapping);
    }
    await this.moToPoMapRepository.save(newMappings, { reload: false });
    return new GlobalResponseObject(true, 0, 'Mapping added successfully');
  }


  async getPONumbersMappedToGivenMo(reqObj: ManufacturingOrderNumberRequest): Promise<string[]> {
    return await this.moToPoMapRepository.getPONumbersMappedToGivenMo(reqObj);
  }

  async getMoToRmPoMapData(reqObj: ManufacturingOrderNumberRequest): Promise<CommonResponse> {
    const moRmMapData = await this.moToPoMapRepository.find({ where: { moNo: In(reqObj.manufacturingOrderNos) } });
    return new CommonResponse(true, 0, 'Mapping data retrieved successfully', moRmMapData);
  }

  async deleteMapping(reqObj: CommonIdReqModal): Promise<CommonResponse> {
    const moRmMapData = await this.moToPoMapRepository.delete({ id: reqObj.id, companyCode: reqObj.companyCode, unitCode: reqObj.unitCode });
    if (!moRmMapData.affected) throw new ErrorResponse(123, 'Failed to delete mapping');
    return new CommonResponse(true, 0, 'Mapping deleted successfully');
  }
}  