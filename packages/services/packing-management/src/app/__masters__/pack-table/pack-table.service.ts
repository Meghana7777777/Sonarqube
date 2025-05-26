import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, PackJobStatusEnum, PackTableCreateRequest, PackTableIdRequest, PackTableModel, PackTableResponse, PackTablesResponse } from "@xpparel/shared-models";
import { Not } from "typeorm";
import { TransactionalBaseService } from "../../../base-services";
import { ITransactionManager } from "../../../database/typeorm-transactions";
import { JobHeaderRepoInterface } from "../../packing-list/repositories/job-header-repo.interface";
import { PackTableEntity } from "./entities/pack-table.entity";
import { PackTableRepoInterface } from "./repositories/pack-table.repo.interface";
import { PTtoggleDto } from "./dto/pack-type-dto";
@Injectable()
export class PackTableService extends TransactionalBaseService {
  constructor(
    @Inject('PackTableRepoInterface')
    private readonly PackTableRepo: PackTableRepoInterface,
    @Inject('JobHeaderRepoInterface')
    private readonly PackJobRepository: JobHeaderRepoInterface,
    @Inject('LoggerService')
    logger: LoggerService,
    @Inject('TransactionManager')
    transactionManager: ITransactionManager,
  ) {
    super(transactionManager, logger)
  }

  async createPackTable(reqModel: PackTableCreateRequest): Promise<PackTableResponse> {
    const empty = []
    for (const rec of reqModel.cutTables) {
      const startSpaces = /^\s/;
      const endSpaces = /\s$/;
      if (startSpaces.test(rec.tableName)) {
        throw new ErrorResponse(36008, "Please Remove Spaces Before Table Name")
      }
      if (endSpaces.test(rec.tableName)) {
        throw new ErrorResponse(36009, "Please Remove Spaces After Table Name")
      }
      const entity = new PackTableEntity();
      if (!rec.id) {
        const existingTable = await this.PackTableRepo.findOne({ where: { tableName: rec.tableName } });
        if (existingTable) {
          throw new ErrorResponse(36010, `PackTable with name "${rec.tableName}" already exists.`);
        }
      }

      if (rec.id) {
        const existingTable = await this.PackTableRepo.findOne({ where: { tableName: rec.tableName, id: Not(rec.id) } });
        if (existingTable) {
          throw new ErrorResponse(36010, `PackTable with name "${rec.tableName}" already exists.`);
        }
        entity.id = rec.id;
        entity.updatedUser = reqModel.username;
      }
      entity.tableDesc = rec.tableDesc
      entity.tableName = rec.tableName
      entity.capacity = rec.capacity
      entity.extRefCode = rec.extRefCode
      entity.companyCode = reqModel.companyCode
      entity.createdUser = reqModel.username
      entity.unitCode = reqModel.unitCode;
      empty.push(entity)
    };
    return this.executeWithTransaction(async (transactionManager) => {
      await transactionManager.getRepository(PackTableEntity).save(empty);
      this.logMessage('PackTable data saved successfully');
      return new PackTableResponse(true,reqModel.cutTables[0]?.id ? 922 : 923, `packtabel ${reqModel.cutTables[0]?.id ? "Updated" : "Created"} Successfully`);    });


  }
  async deletePackTable(reqModel: PackTableIdRequest): Promise<GlobalResponseObject> {
    const deletePackTable = await this.PackJobRepository.findOne({ where: { jobNumber: reqModel.jobNumber, companyCode: reqModel.companyCode, unitCode: reqModel.unitCode } })
    if (!deletePackTable) {
      throw new ErrorResponse(36012, 'Job request is not created in the pack table')
    }
    if (deletePackTable.workStationId) {
      throw new ErrorResponse(36013, `The request ${reqModel.packTableId} is already planned to cut table ${deletePackTable.workStationDesc}`)
    }
    if (deletePackTable.status != PackJobStatusEnum.OPEN) {
      throw new ErrorResponse(36014, `The request ${reqModel.jobNumber} is already sent to the packTable. Please unPlan the jobNumber and try`);
    }
    const packTable = new PackTableEntity()
    packTable.id = reqModel.packTableId
    await this.PackTableRepo.delete({ companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.packTableId })
    return new GlobalResponseObject(true, 36015, 'PackTable Deleted Successfully');
  }

  async getPackTableById(reqData: PackTableIdRequest): Promise<PackTableResponse> {
    const record = await this.PackTableRepo.find({ where: { id: reqData.packTableId, companyCode: reqData.companyCode, unitCode: reqData.unitCode } })
    const tableData: PackTableModel[] = []
    if (record.length === 0) {
      throw new ErrorResponse(965, "Data not found")
    }

    record.forEach(data => {
      const eachRow = new PackTableModel(data.id, data.capacity, data.tableName, data.tableDesc, data.extRefCode,data.isActive)
      tableData.push(eachRow)
    })
    return new PackTablesResponse(true, 967, 'Data retrieved Successfully', tableData)

  }



  async getAllPackTables(reqData: CommonRequestAttrs): Promise<PackTablesResponse> {
    const records = await this.PackTableRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode }, order: { createdAt: 'DESC' } })
    const packTableData: PackTableModel[] = []
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data not found")
    }
    records.forEach(data => {
      const eachRow = new PackTableModel(data.id, data.capacity, data.tableName, data.tableDesc, data.extRefCode,data.isActive)
      packTableData.push(eachRow)
    })

    return new PackTablesResponse(true, 967, 'Data retrieved Successfully', packTableData)

  }


  async getPackTableRecordById(tableId: number, companyCode: string, unitCode: string): Promise<PackTableEntity> {
    return await this.PackTableRepo.findOne({ where: { id: tableId, companyCode: companyCode, unitCode: unitCode } })
  }
   
   async togglePackType(dto:PTtoggleDto ) {
          const togglePackType = await this.PackTableRepo.findOneById(dto.id)
          if (togglePackType) {
              const entity = new PackTableEntity()
              entity.id = dto.id
              entity.isActive = !togglePackType.isActive
              await this.PackTableRepo.save(entity)
              let message = togglePackType.isActive ? "Deactivated Successfully" : " Activated Successfully"
              return new CommonResponse(true,togglePackType.isActive ?920 : 921, message)
          } else {
              return new CommonResponse(false, 924, "No Data Found")
          }
      }

}
