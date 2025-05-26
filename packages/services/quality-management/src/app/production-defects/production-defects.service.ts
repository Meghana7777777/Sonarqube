import { Injectable } from "@nestjs/common";
import { CommonResponse, PassFailCountModel, PoCreationModel, PoStatusEnum, SewingDefectFilterReq, SewingDefectInfoModel } from "@xpparel/shared-models";
import * as nodemailer from 'nodemailer';
import { OperationInfos } from "packages/libs/shared-models/src/qms/production-defects/sewing-defect-info.model";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoCreationEntity } from "../po-creation/entites/po-creation.entity";
// import { QualityConfigurationService } from "../quality-configuration/quality-configuration.service";
import { DateDTO } from "./dto/date-dto";
import { PoIdRequest } from "./dto/po-id.req";
import { PoNumberRequest } from "./dto/po-number-req";
import { ProductionDefectDto } from "./dto/production-defects-req";
import { SendOptions } from "./dto/sent-mail.req";
import { ProductionDefectEntity } from "./entites/production-defects.entity";
import { PoCreationRepository } from "./repo/po-creation-repo";
import { SewingDefectRepo } from "./repo/production-defects-repo";
import { SweingPlanningRepo } from "./repo/sweing-planning.repo";
const moment = require('moment');

@Injectable()
export class ProductionDefectService {
    private transporter: nodemailer.Transporter;
    constructor(
        private sweingRepo: SweingPlanningRepo,
        private readonly dataSource: DataSource,
        private readonly poRepo: PoCreationRepository,
        private readonly sewingDefectRepo: SewingDefectRepo,

    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'jayanthpappala3@gmail.com',
                pass: 'kuqz kelb rolr nnfb',
            },
        });
    }

    async sendMail(req: SendOptions) {
        try {
            await this.transporter.sendMail(req);
            return new CommonResponse(true, 1111, 'Mail sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            if (error.code === 'EENVELOPE' || error.code === 'ECONNECTION' || error.code === 'EMESSAGE') {
                return new CommonResponse(false, 500, 'Failed to send mail: Invalid email configuration');
            } else if (error.code === 'EPROTOCOL' || error.code === 'EAUTH') {
                return new CommonResponse(false, 500, 'Failed to send mail: Authentication or protocol error');
            } else {
                return new CommonResponse(false, 500, 'Failed to send mail: Unknown error');
            }
        }
    }


    async createSewingDefect(req: ProductionDefectDto): Promise<CommonResponse> {
        const transactionalEntityManager = new GenericTransactionManager(this.dataSource)
        try {
            await transactionalEntityManager.startTransaction()
            let flag = new Set<boolean>()
            const entity = new ProductionDefectEntity()
            entity.poNumber = req.poNumber
            entity.customerId = req.customerId
            entity.styleId = req.styleId
            entity.colorId = req.colorId
            entity.role = req.role
            entity.operationId = req.operationId
            entity.qualityTypeId = req.qualityTypeId
            entity.defectId = req.defectId
            entity.testResult = req.testResult
            entity.poId = req.poId
            entity.employeeId = req.employeeId
            entity.employeeName = req.employeeName
            entity.barcode = req.barcode
            const save = await this.dataSource.getRepository(ProductionDefectEntity).save(entity)
            if (save) {
                flag.add(true)
                const getPoStatus = await this.poRepo.find({ select: ['status'], where: { poId: save.poId } })
                if (getPoStatus[0].status == PoStatusEnum.OPEN) {
                    const updatePoStatus = await this.dataSource.getRepository(PoCreationEntity).update({ poId: save.poId }, { status: PoStatusEnum.PO_INPROGRESS })
                    if (updatePoStatus.affected) {
                        flag.add(true)
                        await transactionalEntityManager.completeTransaction()
                        return new CommonResponse(true, 1, 'Added successfully')
                    } else {
                        flag.add(false)
                        await transactionalEntityManager.releaseTransaction()
                        return new CommonResponse(false, 0, 'Something went wrong in po status update')
                    }
                } else {
                    const req = new PoNumberRequest(save.poNumber)
                    const getinspectedqty = await this.getPassFailCount(req)
                    const totalinspectedqty = Number(getinspectedqty.data[0].passCount) + Number(getinspectedqty.data[0].failCount) + Number(getinspectedqty.data[0].pwdCount)

                    const getSampleQty = await this.sweingRepo.find({ select: ['sweingQuantity'], where: { poNumberId: save.poId } })

                    if (totalinspectedqty == Number(getSampleQty[0].sweingQuantity)) {
                        const updatePoStatus = await this.dataSource.getRepository(PoCreationEntity).update({ poId: save.poId }, { status: PoStatusEnum.SEWING_COMPLETED })
                        if (updatePoStatus.affected) {
                            flag.add(true)
                            await transactionalEntityManager.completeTransaction()
                            return new CommonResponse(true, 1, 'Added successfully')
                        } else {
                            flag.add(false)
                            await transactionalEntityManager.releaseTransaction()
                            return new CommonResponse(false, 0, 'Something went wrong in po status update')
                        }
                    }
                    else {
                        const updatePoStatus = await this.dataSource.getRepository(PoCreationEntity).update({ poId: save.poId }, { status: PoStatusEnum.PO_INPROGRESS })
                        if (updatePoStatus.affected) {
                            await transactionalEntityManager.releaseTransaction()
                            return new CommonResponse(true, 1, 'Added successfully')
                        } else {
                            await transactionalEntityManager.releaseTransaction()
                            return new CommonResponse(false, 0, 'Something went wrong in adding sewing defect')
                        }

                    }
                }
            } else {
                await transactionalEntityManager.releaseTransaction()
                return new CommonResponse(false, 0, 'Something went wrong in adding sewing defect')
            }

        } catch (err) {
            await transactionalEntityManager.releaseTransaction()
            throw err
        }
    }

    async getPassFailCount(req: PoNumberRequest): Promise<CommonResponse> {
        try {
            const data = await this.sewingDefectRepo.passFailCount(req)
            const info = []
            if (data) {
                let passCount = 0
                let pwdCount = 0
                let failCount = 0
                for (const rec of data) {
                    if (rec.test_result == 'Pass') {
                        passCount = Number(rec.count)
                    }
                    if (rec.test_result == 'Pass With Defect') {
                        pwdCount = Number(rec.count)
                    }
                    if (rec.test_result == 'Fail') {
                        failCount = Number(rec.count)
                    }
                }
                info.push(new PassFailCountModel(passCount, pwdCount, failCount))
                return new CommonResponse(true, 1, 'Data retreived', info)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }

        } catch (err) {
            throw err
        }
    }

    async getSewingQtyAgainstPo(req: PoIdRequest): Promise<CommonResponse> {
        try {
            const data = await this.sweingRepo.find({ where: { poNumberId: Number(req.poId) } })
            if (data) {
                return new CommonResponse(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }

    async getSewingDefectInfo(req: SewingDefectFilterReq): Promise<CommonResponse> {
        try {
            let query = `SELECT
             pd.sewing_defect_id,
             pd.po_number,
             pd.employee_id,
             pd.employee_name,
             pd.test_result,
             pd.customer_id,
             pd.color_id,
             pd.style_id,
             pd.operation_id,
             pd.defect_id,
             po.quantity,
             sp.sweing_quantity,
             pd.po_id,
             pd.barcode,
             qt.quality_type AS qualityType,
             op.op_name AS operation,
             re.reason_name AS defect
            FROM production_defect pd
            LEFT JOIN po po ON po.po_id = pd.po_id
            LEFT JOIN sweing_planning sp ON sp.po_number_id = pd.po_id 
            LEFT JOIN quality_type qt ON qt.id = pd.quality_type_id 
            LEFT JOIN xpparel_ums.operation op ON op.id = pd.operation_id 
            LEFT JOIN xpparel_ums.reasons re ON re.id = pd.defect_id 
            where pd.sewing_defect_id > 0 `
            query += ` ORDER BY po.po_id`
            const data = await this.dataSource.query(query)
            const poMap = new Map<number, SewingDefectInfoModel>()
            if (data) {
                for (const rec of data) {
                    if (!poMap.has(rec.po_id)) {
                        poMap.set(rec.po_id, new SewingDefectInfoModel(rec.po_id, rec.po_number, rec.customer_id, rec.customer, rec.style_id, rec.style_name, rec.color_id, rec.color, rec.quantity, rec.sweing_quantity, [], rec.inpectedCount, rec.barcode))
                    }
                    poMap.get(rec.po_id).operationInfo.push(new OperationInfos(rec.employee_id, rec.employee_name, rec.operation_id, rec.operation, rec.test_result, rec.defect_id, rec.defect, rec.qualityType, rec.barcode))
                }
                const poModel: SewingDefectInfoModel[] = []
                poMap.forEach((e => {
                    e.inspectedCount = e.operationInfo.length
                    poModel.push(e)
                }))
                return new CommonResponse(true, 1, 'Data retrieved', poModel)
            }
            else {
                return new CommonResponse(false, 0, 'No data found')
            }

        } catch (err) {
            throw err
        }
    }

    async getByPoNumber(): Promise<CommonResponse> {
        try {
            const query = `SELECT 
            po_id AS poId,
            po_number AS poNumber,
            po.quantity AS quantity,
            po.estimated_close_date AS estimatedClosedDate,
            po.status ,
            po.buyer_id AS buyerId,
            po.color_id AS colorId,
            po.style_id AS styleId 
            FROM po `

            const data = await this.poRepo.query(query)
            const info = []
            if (data) {
                info.push(new PoCreationModel(data[0].poId, data[0].poNumber, data[0].buyer, data[0].color, data[0].style, data[0].quantity, data[0].estimatedClosedDate, data[0].isActive, data[0].versionFlag, data[0].buyerId, data[0].colorId, data[0].styleId, data[0].status))
                return new CommonResponse(true, 1, 'Data retrieved', info)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }


    /*----------  Dashboard ------------*/
    async getAllTotalDefects(req: DateDTO): Promise<CommonResponse> {
        try {
            const data = await this.sewingDefectRepo.getAllTotalDefects(req)
            if (data) {
                return new CommonResponse(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }

    async getAllPassCount(req: DateDTO): Promise<CommonResponse> {
        try {
            const data = await this.sewingDefectRepo.getAllPassCount(req)
            if (data) {
                return new CommonResponse(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }

    async getAllFailCount(req: DateDTO): Promise<CommonResponse> {
        try {
            const data = await this.sewingDefectRepo.getAllFailCount(req)
            if (data) {
                return new CommonResponse(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }

    async getAllBuyerWiseDefect(req: DateDTO): Promise<CommonResponse> {
        try {
            const data = await this.sewingDefectRepo.getAllBuyerWiseDefect(req)
            if (data) {
                return new CommonResponse(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }

    async getAllPOWiseDefect(req: DateDTO): Promise<CommonResponse> {
        try {
            const data = await this.sewingDefectRepo.getAllPOWiseDefect(req)
            if (data) {
                return new CommonResponse(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }

    async getAllTopTenDefects(req: DateDTO): Promise<CommonResponse> {
        try {
            const data = await this.sewingDefectRepo.getAllTopTenDefects(req)
            if (data) {
                return new CommonResponse(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }

    async getAllQualityTypeTopTenDefects(req: DateDTO): Promise<CommonResponse> {
        try {
            const data = await this.sewingDefectRepo.getAllQualityTypeTopTenDefects(req)
            if (data) {
                return new CommonResponse(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponse(false, 0, 'No data found')
            }
        } catch (err) {
            throw err
        }
    }

    // async createDefect(reqObj: QualityCheckRequest):Promise<GlobalResponseObject> {

    //     const qualityConfigInfoReq = new QualityConfigurationInfoRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, true, false)
    //     const qualityConfigInfo = await this.qualityConfigService.getQualityConfigurationInfo(qualityConfigInfoReq)

    //     const defectEntity = new ProductionDefectsNEntity()
    //     defectEntity.barcode = reqObj.barcode
    //     defectEntity.qualityConfigId = reqObj.qualityTypeId
    //     // defectEntity.inspectedQty = reqObj.inspectedQuantity
    //     // defectEntity.rejectedQty = reqObj.rejectedQuantity
    //     defectEntity.companyCode = reqObj.companyCode
    //     defectEntity.unitCode = reqObj.unitCode
    //     defectEntity.createdUser = reqObj.username
    //     defectEntity.companyCode = reqObj.companyCode
    //     // defectEntity.qualityConfigId = reqObj.qualityConfigId
    //     defectEntity.processType = qualityConfigInfo.data[0].processType
    //     defectEntity.styleCode = qualityConfigInfo.data[0].styleCode
    //     defectEntity.qualityTypeId = qualityConfigInfo.data[0].qualityTypeId
    //     const defectSaveRes = await this.defectsRepo.save(defectEntity)
    //     if(qualityConfigInfo.data[0].qualityEsclationsConfig.length > 0){
    //         await this.checkAndLogEsclations(reqObj, qualityConfigInfo.data[0].qualityEsclationsConfig)
    //     }
    //     // call PTS api to post defect 
    //     return new GlobalResponseObject(true,1,"Qulity check reported")
    // }



    // // helper method to check and create a esclation record in esclation log 
    // async checkAndLogEsclations(req:QualityCheckRequest,esclationInfo : QualityEsclationsConfigModel[]):Promise<GlobalResponseObject>{
    //         const reportedDefectQty = await this.defectsRepo.getReportedDefectQuantityForGiveBarcode(req) 
    //         if(!reportedDefectQty){
    //             return new GlobalResponseObject(false, 0, 'No reported defect quantity found')
    //         }
    //         for(const esclation of esclationInfo){
    //             if(esclation.quantity <= reportedDefectQty.rejectedQuantity){
    //                 const esclationLogEntity = new EsclationsLogEntity()
    //                 esclationLogEntity.companyCode = req.companyCode
    //                 esclationLogEntity.createdUser = req.username
    //                 esclationLogEntity.actionStatus = 'OPEN'
    //                 esclationLogEntity.unitCode = req.unitCode
    //                 esclationLogEntity.productionDefectIds = reportedDefectQty.productionDefectIds
    //                 esclationLogEntity.esclationId = esclation.id
    //                 // esclationLogEntity.qualityConfigId = req.qualityConfigId
    //                 esclationLogEntity.quantity = reportedDefectQty.rejectedQuantity
    //                 await this.esclationsLogRepo.save(esclationLogEntity)
    //             }
    //         }
    //         return new GlobalResponseObject(true,1,'Esclation log created sucessfully')
    //     }


}
