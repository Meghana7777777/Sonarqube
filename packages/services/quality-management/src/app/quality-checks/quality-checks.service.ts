import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { QualityChecksRepository } from './repository/quality-checks.repository';
import { EsclationsLogRepository } from './repository/esclations-log.repo';
import { CommonRequestAttrs, CommonResponse, DateRequest, GlobalResponseObject, ProcessTypeEnum, PTS_C_QmsBarcodeNumberRequest, QMS_BarcodeAttributes, QMS_BarcodeInfoModel, QMS_BarcodeInfoOpGroupsModel, QMS_BarcodeInfoResponse, QMS_BarcodeReq, QMS_CommonDatesReq, QMS_DefectRatesReqDto, QMS_DefectRatesResponse, QMS_LocVsQualitytypeDefectsModel, QMS_LocVsQualitytypeDefectsResponse, QMS_ReporitngStatsInfoModel, QMS_ReportingStatsResponse, QualityCheckCreationRequest, QualityChecksInfoModel, QualityChecksInfoReq, QualityChecksInfoResponse, QualityConfigurationInfoModel, QualityConfigurationInfoRequest, QualityEsclationsConfigModel, StyleProcessTypeReq } from '@xpparel/shared-models';
import { EsclationsLogEntity } from './entities/esclations-log.entity';
import { QualityChecksEntity } from './entities/quality-checks.entity';
import { ErrorResponse } from '@xpparel/backend-utils';
import { BarcodeLevelEnum, BundleTrackingService, OpReportingService, PTS_C_QmsCheckQtysModel, PTS_C_QmsInspectionLogRequest } from '@xpparel/shared-services';
import { QualityConfigurationService } from '../quality-configuration/quality-configuration.service';
import { QualityTypeRepository } from '../quality-type/quality-type-repo';
import * as nodemailer from 'nodemailer';
import { SendOptions } from '../production-defects/dto/sent-mail.req';

@Injectable()
export class QualityChecksService {
    private transporter: nodemailer.Transporter;

    constructor(
        private readonly qualityChecksRepository: QualityChecksRepository,
        private readonly esclationsLogRepository: EsclationsLogRepository,
        private readonly bundleTrackingService: BundleTrackingService,
        private readonly qualityTypesRepo: QualityTypeRepository,
        @Inject(forwardRef(() => QualityConfigurationService)) private qualityConfigService: QualityConfigurationService,
        private readonly ptsOpReportingService: OpReportingService
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

    /**
     * 
     * @param req TODO : Location need to be added
     * @returns 
     */

    async createQualityCheck(req: QualityCheckCreationRequest): Promise<GlobalResponseObject> {
        const barcodeInfoReq = new QMS_BarcodeReq(req.username, req.unitCode, req.companyCode, req.userId, req.barcode, true, true)
        const reportingTime = new Date().toISOString().slice(0, 10)
        const barcodeInfoRes = await this.getBarCodeInfoForBarcode(barcodeInfoReq)
        console.log('barcodeInfoRes', barcodeInfoRes)
        if (!barcodeInfoRes.status) {
            throw new ErrorResponse(barcodeInfoRes.errorCode, barcodeInfoRes.internalMessage)
        }
        if (!barcodeInfoRes.data) {
            throw new ErrorResponse(0, 'No barcode data found')
        }
        const barcodeInfo = barcodeInfoRes.data
        const { qualityConfigurationInfo, barcodeAttributes, opGroups } = barcodeInfo
        const qualityConfiguration = qualityConfigurationInfo.find((config: any) => config.qualityConfigId === req.qualityConfigId);
        if (!qualityConfiguration) {
            throw new ErrorResponse(0, 'No quality configuration found for the given barcode')
        }

        if (req.reasonQtys.length === 0) {
            throw new ErrorResponse(0, 'Please add at least one reason and quantity')

        }
        const currentOpGroup = opGroups[opGroups.length - 1]
        console.log(currentOpGroup, 'current op group')
        const alreadyReportedQtyRes = await this.qualityChecksRepository.find({ where: { qualityConfigId: req.qualityConfigId, qualityTypeId: req.qualityTypeId, barcode: req.barcode, unitCode: req.unitCode, companyCode: req.companyCode }, select: ['reportedQuantity'] })

        const alreadyReportedQty = alreadyReportedQtyRes?.reduce((total, item) => total + item?.reportedQuantity || 0, 0)
        const currentReportingQty = req.reasonQtys?.reduce((total, item) => total + item.quantity, 0)
        if (alreadyReportedQty + currentReportingQty > currentOpGroup.barcodeQty) {
            throw new ErrorResponse(0, `Reporting quantity cannot exceed the original barcode  quantity : ${currentOpGroup.barcodeQty},Existing reported quantity : ${alreadyReportedQty},Current reporting quantity : ${currentReportingQty}`)
        }
        const qualityCheckEntityArr: QualityChecksEntity[] = []
        for (const eachRec of req.reasonQtys) {

            const qualityCheckEntity = new QualityChecksEntity()
            qualityCheckEntity.barcode = req.barcode
            qualityCheckEntity.companyCode = req.companyCode
            qualityCheckEntity.createdUser = req.username;
            qualityCheckEntity.fgSku = currentOpGroup.fgSku
            qualityCheckEntity.jobNumber = currentOpGroup.jobNumber
            qualityCheckEntity.processType = qualityConfiguration.processType
            // qualityCheckEntity.processingSerial = barcodeAttributes.processingSerial
            qualityCheckEntity.qualityConfigId = qualityConfiguration.qualityConfigId
            qualityCheckEntity.qualityStatus = req.qualityStatus
            qualityCheckEntity.qualityTypeId = qualityConfiguration.qualityTypeId
            qualityCheckEntity.reason = eachRec.reason
            qualityCheckEntity.reportedBy = req.username
            qualityCheckEntity.reportedOn = new Date().toISOString().slice(0, 10)
            qualityCheckEntity.reportedQuantity = eachRec.quantity
            qualityCheckEntity.styleCode = qualityConfiguration.styleCode
            qualityCheckEntity.unitCode = req.unitCode
            qualityCheckEntity.barcode = req.barcode
            qualityCheckEntity.location = "TEMP_LOC"
            qualityCheckEntity.operationCode = currentOpGroup.opGroup
            qualityCheckEntity.barcodeQty = currentOpGroup.barcodeQty
            qualityCheckEntity.barcodeLevel = BarcodeLevelEnum.BUNDLE
            qualityCheckEntityArr.push(qualityCheckEntity)
        }
        const save = await this.qualityChecksRepository.save(qualityCheckEntityArr)
        const checkRes = await this.checkAndCreateEsclationLog(req)


        // log quality repprting transaction to PTS
        const reasons: PTS_C_QmsCheckQtysModel[] = req.reasonQtys
        const ptsQmsLogReq = new PTS_C_QmsInspectionLogRequest(req.username, req.unitCode, req.companyCode, req.userId, req.barcode, reportingTime, String(qualityConfiguration.qualityTypeId), reasons, req.reasonQtys[0].reason, req.username, "TEMP_LOC", BarcodeLevelEnum.BUNDLE, currentOpGroup.opGroup, qualityConfiguration.processType)
        const logRes = await this.ptsOpReportingService.logQualityReporting(ptsQmsLogReq)
        return new GlobalResponseObject(true, 1, 'Qulaity check reported sucessfully')
    }

    /**
     * 
     * @param req TODO : Add notification mechanism,add status enum
     * @returns 
     */
    async checkAndCreateEsclationLog(req: QualityCheckCreationRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, barcode, qualityConfigId, username, userId } = req
        const reportedDefectQty = await this.qualityChecksRepository.getReportedDefectQuantityForGiveBarcode(req)

        const { defectQuantity, qualityCheckIds } = reportedDefectQty
        const totalDefectQty = Number(defectQuantity)
        const qualityConfigurationInfoRequest = new QualityConfigurationInfoRequest(username, unitCode, companyCode, userId, true, false, qualityConfigId)
        const esclationConfigRes = await this.qualityConfigService.getQualityConfigurationInfo(qualityConfigurationInfoRequest)
        if (!esclationConfigRes.status) {
            throw new ErrorResponse(esclationConfigRes.errorCode, esclationConfigRes.internalMessage)

        }
        const qualityEsclationsConfigs = esclationConfigRes.data[0].qualityEsclationsConfig

        if (qualityEsclationsConfigs.length === 0) {
            return new GlobalResponseObject(true, 0, 'No esclation config found')
        }
        const qualityConfigInfo = esclationConfigRes.data[0]
        const qualityTypeData = await this.qualityTypesRepo.find()
        const qualityTypeMap = new Map<number, string>()
        for (const res of qualityTypeData) {
            qualityTypeMap.set(res.id, res.qualityType)
        }
        const qualityType = qualityTypeMap.get(qualityConfigInfo.qualityTypeId)
        for (const esclationConfig of qualityEsclationsConfigs) {
            if (totalDefectQty >= Number(esclationConfig.quantity)) {
                const esclationLogEntity = new EsclationsLogEntity()
                esclationLogEntity.actionStatus = 'PENDING'
                esclationLogEntity.companyCode = companyCode
                esclationLogEntity.createdUser = username
                esclationLogEntity.esclationId = esclationConfig.id
                esclationLogEntity.qualityConfigId = esclationConfig.qualityConfigId
                esclationLogEntity.quantity = esclationConfig.quantity
                esclationLogEntity.unitCode = unitCode
                esclationLogEntity.qualityCheckIds = qualityCheckIds
                const esclattionLog = await this.esclationsLogRepository.find({ where: { esclationId: esclationConfig.id, qualityConfigId: esclationConfig.qualityConfigId } })

                // const emailRequest = {
                //     from: 'jayanthpappala3@gmail.com',
                //     cc:'',
                //     to: 'dileepraghumajji88@gmail.com',
                //     subject: `Escalation Alert: Quality Type :  ${qualityType} for Style : ${qualityConfigInfo.styleCode}`,
                //     text: `Dear ${esclationConfig.responsibleUser},\n\nBarcode : ${req.barcode}\nFail  :  ${esclationLogEntity.quantity}\nEscalation Qty : ${esclationLogEntity.quantity}\nPlease review the issue.\n\nBest regards,\nYour System`
                // };
                // await this.sendMail(emailRequest)
                await this.esclationsLogRepository.save(esclationLogEntity)

            }

        }
        return new GlobalResponseObject(true, 0, 'Esclation log created sucessfully')

        // add notifcation mechanism 
    }

    /**
     * TODO :  move getEsclationLog from quality config serrvice to here
     * @param req 
     * @returns 
     */
    async getEsclationLog(req: CommonRequestAttrs): Promise<GlobalResponseObject> {
        return new GlobalResponseObject(true, 0, 'Success')
    }

    async getQualityChecksInfo(req: QualityChecksInfoReq): Promise<QualityChecksInfoResponse> {
        // create a dynamic where obj if there is req.barcode value the it should add where condition else not
        const whereObj: Partial<QualityChecksEntity> = {}
        if (req.barcode) {
            whereObj['barcode'] = req.barcode
        }

        const qualiCheckData = await this.qualityChecksRepository.find({ where: { ...whereObj } })
        const qualityTypeData = await this.qualityTypesRepo.find()
        const qualityTypeMap = new Map<number, string>()
        for (const res of qualityTypeData) {
            qualityTypeMap.set(res.id, res.qualityType)
        }
        const data: QualityChecksInfoModel[] = []
        if (qualiCheckData.length) {
            for (const res of qualiCheckData) {
                data.push(new QualityChecksInfoModel(res.styleCode, res.processType, qualityTypeMap.get(res.qualityTypeId), true, res.barcode, res.jobNumber, res.fgSku, res.reportedBy, res.reportedOn, res.reportedQuantity, res.reason, res.qualityStatus))
            }
            return new QualityChecksInfoResponse(true, 0, 'Success', data)
        } else {
            return new QualityChecksInfoResponse(false, 1, 'No Data Found', [])
        }
    }

    async getBarCodeInfoForBarcode(req: QMS_BarcodeReq): Promise<QMS_BarcodeInfoResponse> {

        const ptscBarcodeReq = new PTS_C_QmsBarcodeNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, req.barcode)
        //----barcode info from pts,bundletracking info service
        const bundleBarcodeInfo = await this.bundleTrackingService.getBundleTrackingInfoForBundleBarcode(ptscBarcodeReq)

        if (!bundleBarcodeInfo.status) {
            throw new ErrorResponse(bundleBarcodeInfo.errorCode, bundleBarcodeInfo.internalMessage)
        }

        const { opGroups, barcodeNumber, barcodeAttributes } = bundleBarcodeInfo.data[0]
        console.log(opGroups)
        const processTypesOpGroupsMap = new Map<ProcessTypeEnum, string[]>()
        for (const opGroup of opGroups) {
            if (processTypesOpGroupsMap.has(opGroup.processType)) {
                processTypesOpGroupsMap.get(opGroup.processType)?.push(opGroup.opGroup)
            } else {
                processTypesOpGroupsMap.set(opGroup.processType, [opGroup.opGroup])
            }
        }
        const distinctProcessTypes = Array.from(processTypesOpGroupsMap.keys());
        const styleProcesTypeReq = new StyleProcessTypeReq(req.username, req.unitCode, req.companyCode, req.userId, barcodeAttributes.style, distinctProcessTypes)
        const qualityConfigurationInfoRes = await this.qualityConfigService.getQualityConfigInfoForStyleAndProcessType(styleProcesTypeReq)
        console.log(qualityConfigurationInfoRes)
        if (!qualityConfigurationInfoRes.status) {
            throw new ErrorResponse(0, `Quality Configuration not found for the barcode style " ${barcodeAttributes.style} and process type: ${distinctProcessTypes.join(',')}`)
        }
        const qualityConfigInfoArr: QualityConfigurationInfoModel[] = []
        for (const qualityConfigRec of qualityConfigurationInfoRes.data) {
            const qualityEsclationsConfigModelArr: QualityEsclationsConfigModel[] = []
            for (const esclationConfig of qualityConfigRec.qualityEsclationsConfig) {
                const esclationConfigModel = new QualityEsclationsConfigModel(esclationConfig.name, esclationConfig.quantity, esclationConfig.responsibleUser, esclationConfig.level, esclationConfig.qualityConfigId, esclationConfig.id)
                qualityEsclationsConfigModelArr.push(esclationConfigModel)
            }
            const qualityConfigInfo = new QualityConfigurationInfoModel(qualityConfigRec.qualityType, qualityConfigRec.qualityTypeId, qualityConfigRec.styleCode, qualityConfigRec.processType, qualityConfigRec.qualityPercentage, qualityConfigRec.isMandatory, qualityConfigRec.qualityConfigId, qualityEsclationsConfigModelArr)
            qualityConfigInfoArr.push(qualityConfigInfo)

        }

        const barcodeQualityInfo = await this.qualityChecksRepository.findOne({ where: { barcode: req.barcode } })
        const reporetedON = barcodeQualityInfo ? barcodeQualityInfo.reportedOn : null
        const qmsBarcodeAttributes = new QMS_BarcodeAttributes()
        Object.assign(qmsBarcodeAttributes, barcodeAttributes)
        console.log(...opGroups, 'op groups')
        const qmsOPGroups: QMS_BarcodeInfoOpGroupsModel[] = opGroups

        const qmsBarcodeInfoModel = new QMS_BarcodeInfoModel(barcodeNumber, reporetedON, qmsBarcodeAttributes, qualityConfigInfoArr, qmsOPGroups)
        return new QMS_BarcodeInfoResponse(true, 1, 'Barcode info retreived sucessfully', qmsBarcodeInfoModel)

    }

    async getDefectRates(req: QMS_DefectRatesReqDto): Promise<QMS_DefectRatesResponse> {
        const res = await this.qualityChecksRepository.getDefectRates(req)
        res.forEach((v) => v.defectiveRate = Number(v.defectiveRate))
        if (res.length === 0) {
            throw new ErrorResponse(0, "No data found")
        }
        return new QMS_DefectRatesResponse(true, 1, "Data retreived", res)
    }

    async getDashboardHeaderStats(req: QMS_CommonDatesReq): Promise<QMS_ReportingStatsResponse> {

        const { totalBarcodeQty } = await this.qualityChecksRepository.getTotalBarcodeQty(req)
        const statusWiseQty = await this.qualityChecksRepository.getStatusWiseQtyAndPercent(req)
        const { failQty, totalReportedQty } = statusWiseQty
        // give correct formula for pass and fail percent
        const passQty = totalBarcodeQty - failQty
        const passPercent = (Number(passQty) / Number(totalBarcodeQty)) * 100;
        const failPercent = (Number(failQty) / Number(totalBarcodeQty)) * 100;
        const defectiveRate = (Number(failQty) / Number(totalBarcodeQty)) * 100;

        const data = new QMS_ReporitngStatsInfoModel(totalBarcodeQty, passQty, Number(passPercent.toFixed(2)), failQty, Number(failPercent.toFixed(2)), Number(defectiveRate.toFixed(2)))
        return new QMS_ReportingStatsResponse(true, 1, "Data retreived", data)
    }

    async getLocationAndQualityTypeWiseDefectQty(req: QMS_CommonDatesReq): Promise<QMS_LocVsQualitytypeDefectsResponse> {
        const data = await this.qualityChecksRepository.getLocationAndQualityTypeWiseDefectQty(req)
        if (data.length === 0) {
            throw new ErrorResponse(0, 'No data found')
        }
        const locVsQualitytypeDefectsArr:QMS_LocVsQualitytypeDefectsModel[] = []
        data.forEach((v) => {
            const locVsQualitytypeDefects = new QMS_LocVsQualitytypeDefectsModel(v.location, v.qualityType,Number(v.defectiveQty))
            locVsQualitytypeDefectsArr.push(locVsQualitytypeDefects)
        })
        return new QMS_LocVsQualitytypeDefectsResponse(true, 1, 'Data retreived', locVsQualitytypeDefectsArr)

    }


}









