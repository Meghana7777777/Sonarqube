import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");
import { OpVersionHelperService } from "./op-version-helper.service";
import { OpSeqRepository } from "./repository/op-seq.repository";
import { OpVersionRepository } from "./repository/op-version.repository";
import { OpVersion } from "./entity/op-version.entity";
import { OpGroupModel, OpVersionModel, OpVersionResponse, OperationModel, PoProductFgColorRequest, PoProdutNameRequest, PoSerialRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class OpVersionInfoService {
  constructor(
    private dataSource: DataSource,
    private opSeqRepo: OpSeqRepository,
    private opVerRepo: OpVersionRepository,
    @Inject(forwardRef(() => OpVersionHelperService)) private helperService: OpVersionHelperService,
  ) {

  }

  async getOpVersionForPoSerial(req: PoSerialRequest): Promise<OpVersionResponse>{
    const opVerRecords = await this.opVerRepo.find({where:{ companyCode:req.companyCode, unitCode:req.unitCode, poSerial:req.poSerial }});
    if(opVerRecords.length == 0) {
      throw new ErrorResponse(0, 'Op versions does not exist for the po');
    }
    const opVersionIds = opVerRecords.map(r => r.id);
    const opVersionModels = await this.getOpVersionModels(opVersionIds, opVerRecords[0].poSerial, req.companyCode, req.unitCode);
    return new OpVersionResponse(true, 1, 'opVersion data retrieved', opVersionModels);
  }

  /**
   * Service to get the operation version and operation sequence details for the product
   * @param req 
   * @returns 
  */
  async getOpVersionForPoProductName(req: PoProductFgColorRequest): Promise<OpVersionResponse>{
    //get all the data of operation sequence for the product under unit and company
    const opVerRecord = await this.opVerRepo.findOne({where:{ companyCode:req.companyCode, unitCode:req.unitCode, poSerial:req.poSerial, productName:req.productName, style: req.style, fgColor: req.fgColor }});
    if(!opVerRecord) {
      throw new ErrorResponse(0, 'Op versions does not exist for the po');
    }
    const opVersionModels = await this.getOpVersionModels([opVerRecord.id], opVerRecord.poSerial, req.companyCode, req.unitCode);
    return new OpVersionResponse(true, 1, 'opVersion data retrieved', opVersionModels);
  }

  async getOpVersionModels(opVersionIds: number[], poSerial: number, companyCode: string, unitCode: string): Promise<OpVersionModel[]> {
    const opVerRecords = await this.opVerRepo.find({where:{ companyCode: companyCode, unitCode:unitCode, poSerial: poSerial, id: In(opVersionIds) }});
    if(opVerRecords.length == 0) {
      throw new ErrorResponse(0, 'Op versions does not exist for the po');
    }
    const opVersionModels: OpVersionModel[] = [];
    for(const opVersion of opVerRecords) {
      const opGroupsdata = await this.opSeqRepo.getOpsequenceGroupsForProduct(unitCode, companyCode, opVersion.productName, poSerial.toString(), opVersion.id);
      const opSequenceData = await this.opSeqRepo.find({where:{companyCode: companyCode, unitCode: unitCode, poSerial: poSerial, productName: opVersion.productName, fgColor: opVersion.fgColor}});
      let operationsData:OperationModel[] = [];
      let operationGroupsData:OpGroupModel[] = [];
      for(const opSeqItem of opSequenceData) {
        // TODO replace this statement with proper constructor
        const opModel = new OperationModel(opSeqItem.iOpCode, opSeqItem.eOpCode, opSeqItem.opCategory, opSeqItem.opForm, opSeqItem.opName, opSeqItem.opSequence, opSeqItem.group?.toString(), opSeqItem.smv);
        // const opModel = null;
        operationsData.push(opModel)
      }
      for(const opGroup of opGroupsdata){
        operationGroupsData.push({group:String(opGroup.group), sequence:opGroup.opSequence,depGroups:opGroup.depGroup.split(','), operations: opGroup.operations?.split(',') ,components: opGroup.componentNames.split(',') , groupCategory:opGroup.opCategory})
      }
      const opVersionsInfo = new OpVersionModel(opVersion.id, opVersion.version, opVersion.description, operationsData, operationGroupsData, opVersion.productName, opVersion.poSerial);
      opVersionModels.push(opVersionsInfo);
    }
    return opVersionModels;
  }
  
  // HELPER
  async getPoOpVersionRecordsForPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<OpVersion[]> {
    return await this.opVerRepo.find({ where: { poSerial: poSerial, companyCode: companyCode, unitCode: unitCode, isActive: true } });
  }

  /**
   * Service to get the operation version and operation sequence details for the product
   * @param req 
   * @returns 
  */
  async getOpVersionIdForPoProductName(req: PoProdutNameRequest): Promise<number>{
    //get all the data of operation sequence for the product under unit and company
    const opVerRecord =  await this.opVerRepo.findOne({where:{ companyCode:req.companyCode, unitCode:req.unitCode, poSerial:req.poSerial, productName:req.productName, fgColor: req.fgColor }});
    return opVerRecord ? opVerRecord.id : null;
  }

  
}