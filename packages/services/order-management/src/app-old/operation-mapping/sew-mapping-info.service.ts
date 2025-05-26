import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");

import { ErrorResponse } from "@xpparel/backend-utils";
import { OperationModel, PoProdutNameRequest, SewSerialRequest, SewGroupModel, SewVersionModel, SewVersionResponse, JobGroupVersionInfoForSewSerial, JobGroupVersionInfoResp, OperationInfo, MaterialInfo, TrimGroupInfo, JobGroupOpsInfo, SewSerialBundleGroupReq, OpFormEnum, ProcessTypeEnum, DependentJobGroupInfo, ManufacturingOrderProductName, GlobalOpsRawMaterial, GlobalOpsSequence, GlobalOpsVersion, OpsWorkFlowResponse, } from "@xpparel/shared-models";
import { SewVersion } from "./entity/sew-version.entity";
import { SewVersionHelperService } from "./sew-mapping-helper.service";
import { SewSeqRepository } from "./repository/sew-seq.repository";
import { SewVersionRepository } from "./repository/sew-version-repository";
import { SewRawMaterialRepository } from "./repository/sew-raw-material.repository";
import { SewRawMaterial } from "./entity/sew-raw-material-entity";
import { SewSequence } from "./entity/sew-seq.entity";

@Injectable()
export class SewVersionInfoService {
  constructor(
    private dataSource: DataSource,
    private opSeqRepo: SewSeqRepository,
    private opVerRepo: SewVersionRepository,
    @Inject(forwardRef(() => SewVersionHelperService)) private helperService: SewVersionHelperService,
    private opRawMaterial: SewRawMaterialRepository
  ) {

  }

  async getSewVersionForPoSerial(req: SewSerialRequest): Promise<SewVersionResponse> {
    const opVerRecords = await this.opVerRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, sewSerial: req.poSerial } });
    if (opVerRecords.length == 0) {
      throw new ErrorResponse(0, 'Op versions does not exist for the po');
    }
    const opVersionIds = opVerRecords.map(r => r.id);
    const opVersionModels = await this.getSewVersionModels(opVersionIds, opVerRecords[0].sewSerial, req.companyCode, req.unitCode);
    return new SewVersionResponse(true, 1, 'opVersion data retrieved', opVersionModels);
  }

  /**
   * Service to get the operation version and operation sequence details for the product
   * @param req 
   * @returns 
  */
  async getSewVersionForPoProductName(req: PoProdutNameRequest): Promise<SewVersionResponse> {
    //get all the data of operation sequence for the product under unit and company
    const opVerRecord = await this.opVerRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, saleOrder: req.manufacturingOrder, productName: req.productName } });
    if (!opVerRecord) {
      throw new ErrorResponse(0, 'Op versions does not exist for the po');
    }
    const opVersionModels = await this.getSewVersionModels([opVerRecord.id], opVerRecord.sewSerial, req.companyCode, req.unitCode);
    return new SewVersionResponse(true, 1, 'opVersion data retrieved', opVersionModels);
  }

  async getSewVersionModels(opVersionIds: number[], poSerial: number, companyCode: string, unitCode: string): Promise<SewVersionModel[]> {
    const opVerRecords = await this.opVerRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, sewSerial: poSerial, id: In(opVersionIds) } });
    if (opVerRecords.length == 0) {
      throw new ErrorResponse(0, 'Op versions does not exist for the po');
    }
    const opVersionModels: SewVersionModel[] = [];
    for (const opVersion of opVerRecords) {
      const opGroupsdata = await this.opSeqRepo.getOpsequenceGroupsForProduct(unitCode, companyCode, opVersion.productName, poSerial.toString(), opVersion.id);
      const opSequenceData = await this.opSeqRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, sewSerial: poSerial, productName: opVersion.productName } });
      let operationsData: OperationModel[] = [];
      let operationGroupsData: SewGroupModel[] = [];
      for (const opSeqItem of opSequenceData) {
        // TODO replace this statement with proper constructor
        const opModel = new OperationModel(opSeqItem.iOpCode, opSeqItem.eOpCode, opSeqItem.opCategory, opSeqItem.opForm, opSeqItem.opName, opSeqItem.opSequence, opSeqItem.group?.toString(), opSeqItem.smv);
        operationsData.push(opModel)
      }
      for (const opGroup of opGroupsdata) {
        operationGroupsData.push({
          group: String(opGroup.group), sequence: opGroup.opSequence, depGroups: opGroup.depGroup.split(','), operations: opGroup.operations?.split(','), components: opGroup.componentNames.split(','), groupCategory: opGroup.opCategory, jobtype: opGroup.jobType, warehouse: opGroup.toWarehouse, extProcessing: opGroup.toExtProcessing, itemCode: opGroup.itemCode,
          processTypeSequence: 0
        })
      }
      const opVersionsInfo = new SewVersionModel(opVersion.id, opVersion.version, opVersion.description, operationsData, operationGroupsData, opVersion.productName, opVersion.sewSerial);
      opVersionModels.push(opVersionsInfo);
    }
    return opVersionModels;
  }

  // HELPER
  async getSewVersionRecordsForPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<SewVersion[]> {
    return await this.opVerRepo.find({ where: { sewSerial: poSerial, companyCode: companyCode, unitCode: unitCode, isActive: true } });
  }

  /**
   * Service to get the operation version and operation sequence details for the product
   * @param req 
   * @returns 
  */
  async getSewVersionIdForPoProductName(req: PoProdutNameRequest): Promise<number> {
    //get all the data of operation sequence for the product under unit and company
    const opVerRecord = await this.opVerRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, sewSerial: req.poSerial, productName: req.productName } });
    return opVerRecord ? opVerRecord.id : null;
  }


  async getJobGroupVersionInfo(reqObj: SewSerialRequest): Promise<JobGroupVersionInfoResp> {
    try {
      // Query the SewVersion table
      const sewVersions = await this.opVerRepo.find({ where: { sewSerial: reqObj.poSerial, unitCode: reqObj.unitCode, companyCode: reqObj.companyCode } });
      // Prepare the response data
      const jobGroupVersionInfoList: JobGroupVersionInfoForSewSerial[] = [];
      for (const sewVersion of sewVersions) {
        const jobGroupInfo: JobGroupOpsInfo[] = [];
        const { sewSerial, id: sewOrderId, productName } = sewVersion;
        // Query operations (SewSequence)
        const jobGroupOps = new Map<number, OperationInfo[]>();
        const jobGroupMaterials = new Map<number, MaterialInfo[]>();
        const operations = await this.opSeqRepo.find({ where: { sewSerial: reqObj.poSerial, productName } });
        for (const eachOperation of operations) {
          if (!jobGroupOps.has(eachOperation.group)) {
            jobGroupOps.set(eachOperation.group, []);
          }
          jobGroupOps.get(eachOperation.group).push(new OperationInfo(eachOperation.iOpCode, eachOperation.opCategory, eachOperation.smv));
          // Query materials (SewRawMaterial)

        }
        for (const eachOps of operations) {
          if (!jobGroupMaterials.has(eachOps.group)) {
            jobGroupMaterials.set(eachOps.group, []);
          }
          const rawMaterials = await this.opRawMaterial.find({ where: { iOpCode: eachOps.eOpCode, opVersionId: sewVersion.id } });
          const materialInfos: MaterialInfo[] = rawMaterials.reduce((groupedMaterials, material) => {
            const existingGroup = groupedMaterials.find((group) => group.trimGroup === material.productType);

            const trimGroupInfo = new TrimGroupInfo(material.product, parseFloat(material.consumption), material.uom);

            if (existingGroup) {
              existingGroup.trimGroupInfo.push(trimGroupInfo);
            } else {
              groupedMaterials.push(new MaterialInfo(material.productType, [trimGroupInfo]));
            }
            return groupedMaterials;
          }, [] as MaterialInfo[]);
          jobGroupMaterials.get(eachOps.group).push(...materialInfos);
        }
        // Combine operations and materials into JobGroupOpsInfo
        for (const [jobGroup, operations] of jobGroupOps) {
          const jobGroupOpsMaterial = new JobGroupOpsInfo(jobGroup, operations[0].operationType, operations, jobGroupMaterials.get(jobGroup));
          jobGroupInfo.push(jobGroupOpsMaterial);
        }
        // Create JobGroupVersionInfoForSewSerial instance
        const jobGroupVersionInfo = new JobGroupVersionInfoForSewSerial();
        jobGroupVersionInfo.sewSerial = sewSerial;
        jobGroupVersionInfo.sewOrderId = sewOrderId;
        jobGroupVersionInfo.productName = productName;
        jobGroupVersionInfo.jobGroupInfo = jobGroupInfo;
        jobGroupVersionInfoList.push(jobGroupVersionInfo);
      }
      // Return the final response
      return new JobGroupVersionInfoResp(true, 0, "Data fetched successfully", jobGroupVersionInfoList);
    } catch (error) {
      console.error("Error fetching job group version info:", error);
      return new JobGroupVersionInfoResp(false, 1, "Failed to fetch data", []);
    }
  }

  async getDistinctComponentsOfSerialProduct(sewSerial: number, productName: string, unitCode: string, companyCode: string, group: number) {
    return await this.opSeqRepo.getComponentsBySewSerial(sewSerial, productName, unitCode, companyCode, group);
  }


  async getProcessTypeAndGroupInfoByBundleGroup(sewSerial: number, productName: string, unitCode: string, companyCode: string, bundleGroup: number) {
    const sewSeq = await this.opSeqRepo.find({ where: { sewSerial: sewSerial, unitCode: unitCode, companyCode: companyCode, bundleGroup, isActive: true } });
    if (!sewSeq.length) {
      throw new ErrorResponse(0, 'Operation version details not found for the given details');
    }
    const jobGroupOpsInfo: {
      jobGroup: number;
      operations: string[]
    }[] = [];
    for (const eachOps of sewSeq) {
      const jobGroupInfo = jobGroupOpsInfo.find(jg => jg.jobGroup == eachOps.group);
      if (!jobGroupInfo) {
        jobGroupOpsInfo.push({
          jobGroup: eachOps.group,
          operations: [eachOps.iOpCode]
        });
      } else {
        jobGroupInfo.operations.push(eachOps.iOpCode);
      }
    }
    return {
      processingType: sewSeq[0].jobType,
      jobGroupInfo: jobGroupOpsInfo
    }

  }

  async getJobGroupVersionInfoForBundleGroup(reqObj: SewSerialBundleGroupReq): Promise<JobGroupVersionInfoResp> {
    try {
      // Query the SewVersion table
      const sewVersions = await this.opVerRepo.find({ where: { sewSerial: reqObj.sewSerial, unitCode: reqObj.unitCode, companyCode: reqObj.companyCode } });
      // Prepare the response data
      const jobGroupVersionInfoList: JobGroupVersionInfoForSewSerial[] = [];
      for (const sewVersion of sewVersions) {
        const jobGroupInfo: JobGroupOpsInfo[] = [];
        const { sewSerial, id: sewOrderId, productName } = sewVersion;
        // Query operations (SewSequence)
        const jobGroupOps = new Map<number, OperationInfo[]>();
        const jobGroupMaterials = new Map<number, MaterialInfo[]>();
        const operations = await this.opSeqRepo.find({ where: { sewSerial: reqObj.sewSerial, productName, bundleGroup: reqObj.bundleGroup } });
        for (const eachOperation of operations) {
          if (!jobGroupOps.has(eachOperation.group)) {
            jobGroupOps.set(eachOperation.group, []);
          }
          jobGroupOps.get(eachOperation.group).push(new OperationInfo(eachOperation.iOpCode, eachOperation.opCategory, eachOperation.smv));
          // Query materials (SewRawMaterial)

        }
        for (const eachOps of operations) {
          if (!jobGroupMaterials.has(eachOps.group)) {
            jobGroupMaterials.set(eachOps.group, []);
          }
          const rawMaterials = await this.opRawMaterial.find({ where: { iOpCode: eachOps.eOpCode, opVersionId: sewVersion.id } });
          const materialInfos: MaterialInfo[] = rawMaterials.reduce((groupedMaterials, material) => {
            const existingGroup = groupedMaterials.find((group) => group.trimGroup === material.productType);

            const trimGroupInfo = new TrimGroupInfo(material.product, parseFloat(material.consumption), material.uom);

            if (existingGroup) {
              existingGroup.trimGroupInfo.push(trimGroupInfo);
            } else {
              groupedMaterials.push(new MaterialInfo(material.productType, [trimGroupInfo]));
            }
            return groupedMaterials;
          }, [] as MaterialInfo[]);
          jobGroupMaterials.get(eachOps.group).push(...materialInfos);
        }
        // Combine operations and materials into JobGroupOpsInfo
        for (const [jobGroup, operations] of jobGroupOps) {
          const jobGroupOpsMaterial = new JobGroupOpsInfo(jobGroup, operations[0].operationType, operations, jobGroupMaterials.get(jobGroup));
          jobGroupInfo.push(jobGroupOpsMaterial);
        }
        // Create JobGroupVersionInfoForSewSerial instance
        const jobGroupVersionInfo = new JobGroupVersionInfoForSewSerial();
        jobGroupVersionInfo.sewSerial = sewSerial;
        jobGroupVersionInfo.sewOrderId = sewOrderId;
        jobGroupVersionInfo.productName = productName;
        jobGroupVersionInfo.jobGroupInfo = jobGroupInfo;
        jobGroupVersionInfoList.push(jobGroupVersionInfo);
      }
      // Return the final response
      return new JobGroupVersionInfoResp(true, 0, "Data fetched successfully", jobGroupVersionInfoList);
    } catch (error) {
      console.error("Error fetching job group version info:", error);
      return new JobGroupVersionInfoResp(false, 1, "Failed to fetch data", []);
    }
  }

  async getDependentComponentsForJobGroup(sewSerial: number, jobGroup: number, unitCode: string, companyCode: string, productName: string): Promise<DependentJobGroupInfo[]> {
    // Fetch job group details in one query
    const jobGroupDetails = await this.opSeqRepo.find({ where: { sewSerial, productName, group: jobGroup, unitCode, companyCode }, select: ['depGroup', 'iOpCode'] });
    if (!jobGroupDetails || jobGroupDetails.length === 0) {
      throw new ErrorResponse(0, `Job Group details not found in the operation sequence ${jobGroup}`);
    }
    // Collect dependent groups into a Set
    const depGroupSet = new Set<number>(jobGroupDetails.flatMap((ops) => ops.depGroup?.split(',').map(Number) || []));
    if (depGroupSet.size === 0) {
      return []; // Early exit if no dependent groups
    }
    // Fetch all dependent job group information in one query
    const depJobGroupInfo = await this.opSeqRepo.find({ where: { sewSerial, productName, group: In(Array.from(depGroupSet)), unitCode, companyCode, opForm: OpFormEnum.PF } });
    // Collect all required components into a Set

    const result = [];
    depJobGroupInfo.forEach((entity) => {
      return entity.componentNames.split(',').forEach((eachComp) => {
        result.push(new DependentJobGroupInfo(
          entity.group, // depJobGroup
          entity.opCategory, // operationCategory
          eachComp, // dependentComp
          0, // eligibleToReportQty,
          0,
          0
        ));
      })
    });
    return result;

    // const requiredComponentsForTheJob = new Set<string>(depJobGroupInfo.flatMap((depJob) => depJob.componentNames?.split(',') || []));
    // // Convert Set to Array and return
    // return Array.from(requiredComponentsForTheJob);
  }


  async getGlobalOpsVersionForSoAndProduct(req: ManufacturingOrderProductName): Promise<OpsWorkFlowResponse> {
    console.log(req);
    const { unitCode, companyCode } = req;
    const opVersionInfo = await this.opVerRepo.find({ where: { saleOrder: req.manufacturingOrderName, unitCode, companyCode, productName: req.productName } });
    if (!opVersionInfo.length) {
      throw new ErrorResponse(0, 'Operation version does not exists. Please check and try again')
    }
    const actVersion = opVersionInfo[0];
    const globalVersion = this.convertToGlobalOpsVersion(actVersion);
    const opsSeq = await this.opSeqRepo.find({ where: { opVersionId: actVersion.id } });
    for (const eachOp of opsSeq) {
      const globalVersionSeq = this.convertToGlobalOpsSequence(eachOp);
      const rmDetails = await this.opRawMaterial.find({ where: { opVersionId: actVersion.id, iOpCode: eachOp.iOpCode } });
      for (const eachRm of rmDetails) {
        const globalMaterialInfo = this.convertToGlobalOpsRawMaterial(eachRm);
        globalVersionSeq.sewRawMaterials.push(globalMaterialInfo);
      }
      globalVersion.sewSequences.push(globalVersionSeq);
    }
    return new OpsWorkFlowResponse(true, 0, 'Global Version retrieved successfully', globalVersion)
  }


  convertToGlobalOpsVersion(sewVersion: SewVersion): GlobalOpsVersion {
    const globalOpsVersion: GlobalOpsVersion = {
      version: sewVersion.version,
      description: sewVersion.description,
      productName: sewVersion.productName,
      sewSerial: sewVersion.sewSerial,
      manufacturingOrder: sewVersion.saleOrder,
      sewSequences: []
    };
    return globalOpsVersion;
  }

  convertToGlobalOpsSequence(sewSequence: SewSequence): GlobalOpsSequence {
    const globalOpsSequence: GlobalOpsSequence = {
      iOpCode: sewSequence.iOpCode,
      eOpCode: sewSequence.eOpCode,
      opName: sewSequence.opName,
      opCategory: sewSequence.opCategory,
      opForm: sewSequence.opForm,
      opSequence: sewSequence.opSequence,
      group: sewSequence.group,
      depGroup: sewSequence.depGroup,
      smv: sewSequence.smv,
      componentNames: sewSequence.componentNames,
      opVersionId: sewSequence.opVersionId,
      productName: sewSequence.productName,
      sewSerial: sewSequence.sewSerial,
      jobType: sewSequence.jobType || null,
      warehouse: sewSequence.warehouse || null,
      extProcessing: sewSequence.extProcessing || null,
      bundleGroup: sewSequence.bundleGroup,
      itemCode: sewSequence.itemCode || null,
      sewRawMaterials: [],
    };
    return globalOpsSequence;
  }

  convertToGlobalOpsRawMaterial(sewRawMaterial: SewRawMaterial): GlobalOpsRawMaterial {
    const globalOpsRawMaterial: GlobalOpsRawMaterial = {
      iOpCode: sewRawMaterial.iOpCode,
      product: sewRawMaterial.product,
      productType: sewRawMaterial.productType,
      consumption: sewRawMaterial.consumption,
      uom: sewRawMaterial.uom,
      opVersionId: sewRawMaterial.opVersionId,
      sewSerial: sewRawMaterial.sewSerial
    };
    return globalOpsRawMaterial;
  }

}