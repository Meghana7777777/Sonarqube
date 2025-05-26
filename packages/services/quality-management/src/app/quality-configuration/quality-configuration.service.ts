import { Injectable } from '@nestjs/common';
import { CommonRequestAttrs, EsclationsInfoResponse, GlobalResponseObject, ProcessTypeEnum, PTS_C_QmsBarcodeNumberRequest, QMS_BarcodeInfoModel, QMS_BarcodeInfoResponse, QMS_BarcodeReq, QualityConfigurationCreationReq, QualityConfigurationInfoModel, QualityConfigurationInfoRequest, QualityConfigurationInfoResponse, QualityEsclationsConfigModel, StyleProcessTypeReq } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { QualityConfigurationEntity } from './entities/quality-configuration.entity';
import { QualityEsclationsConfigEntity } from './entities/quality-esclations-config.entity';
import { QualityChecklistConfigRepository } from './repositories/quality-checklist-config.repo';
import { QualityConfigurationRepository } from './repositories/quality-configuration.repo';
import { QualityEsclationsConfigRepository } from './repositories/quality-esclations-config.repo';
import { BundleTrackingService } from '@xpparel/shared-services';
import { ErrorResponse } from '@xpparel/backend-utils';

@Injectable()
export class QualityConfigurationService {
    constructor(
        private readonly qualityConfigurationRepository: QualityConfigurationRepository,
        private readonly qualityEsclationsConfigRepository: QualityEsclationsConfigRepository,
        private readonly dataSource: DataSource,
    ) { }


    async validateQualityConfiguration(reqObj: QualityConfigurationCreationReq): Promise<boolean> {
        const esixtingRecord = await this.qualityConfigurationRepository.findOne({ where: { styleCode: reqObj.styleCode, processType: reqObj.processType, qualityTypeId: reqObj.qualityTypeId, companyCode: reqObj.companyCode, unitCode: reqObj.unitCode } });
        return esixtingRecord ? true : false;

    }
    /**
     * styleCode + processType + qualityTypeId must be unique
     * @param reqObj 
     * @returns 
     */
    async createQualityConfiguration(reqObj: QualityConfigurationCreationReq): Promise<GlobalResponseObject> {
        const validation = await this.validateQualityConfiguration(reqObj)
        if (validation) {
            throw new ErrorResponse(0, `Quality Configuration already exists for selected style , qulaity type and process type`);
        }
        const qualityConfig = new QualityConfigurationEntity()
        qualityConfig.companyCode = reqObj.companyCode;
        qualityConfig.createdUser = reqObj.username;
        qualityConfig.isMandatory = reqObj.isMandatory;
        qualityConfig.processType = reqObj.processType;
        qualityConfig.qualityPercentage = reqObj.qualityPercentage;
        qualityConfig.styleCode = reqObj.styleCode;
        qualityConfig.qualityTypeId = reqObj.qualityTypeId;
        qualityConfig.unitCode = reqObj.unitCode;
        const qualityConfigSave = await this.qualityConfigurationRepository.save(qualityConfig);
        const qualtiyEsclationsArr: QualityEsclationsConfigEntity[] = []
        for (const esclationConfig of reqObj.qualityEsclationsConfig) {
            console.log(esclationConfig)
            const esclationConfigEntity = new QualityEsclationsConfigEntity();
            esclationConfigEntity.name = esclationConfig.name;
            esclationConfigEntity.quantity = esclationConfig.quantity;
            esclationConfigEntity.responsibleUser = esclationConfig.responsibleUser;
            esclationConfigEntity.level = esclationConfig.level;
            esclationConfigEntity.createdUser = reqObj.username;
            esclationConfigEntity.unitCode = reqObj.unitCode;
            esclationConfigEntity.companyCode = reqObj.companyCode;
            esclationConfigEntity.qualityConfigId = qualityConfigSave.id;
            qualtiyEsclationsArr.push(esclationConfigEntity);
        }
        const res = await this.qualityEsclationsConfigRepository.save(qualtiyEsclationsArr);
        console.log(res)
        return new GlobalResponseObject(true, 1, 'Quality Configuration created successfully');
    }


    async getQualityConfigurationInfo(reqObj: QualityConfigurationInfoRequest): Promise<QualityConfigurationInfoResponse> {
        const qualityConfig = await this.qualityConfigurationRepository.getQualityConfigurationInfo(reqObj.companyCode, reqObj.unitCode, reqObj.qualityConfigId);
        const qualityConfigInfoArr: QualityConfigurationInfoModel[] = []
        for (const rec of qualityConfig) {
            const qualityEsclationsInfoArr: QualityEsclationsConfigModel[] = []
            if (reqObj.iNeedQualityEsclations) {
                const qualityEsclationsInfo = await this.qualityEsclationsConfigRepository.find({ where: { qualityConfigId: rec.qualityConfigId } });
                for (const esclationConfig of qualityEsclationsInfo) {
                    const esclationConfigModel = new QualityEsclationsConfigModel(esclationConfig.name, esclationConfig.quantity, esclationConfig.responsibleUser, esclationConfig.level, rec.qualityConfigId, esclationConfig.id);
                    qualityEsclationsInfoArr.push(esclationConfigModel);
                }
            }
            const qualityConfigInfo = new QualityConfigurationInfoModel(rec.qualityType, rec.qualityTypeId, rec.styleCode, rec.processType, rec.qualityPercentage, rec.isMandatory, rec.qualityConfigId, qualityEsclationsInfoArr);
            qualityConfigInfoArr.push(qualityConfigInfo);
        }

        if (qualityConfigInfoArr.length === 0) {
            return new QualityConfigurationInfoResponse(false, 0, 'No Quality Configuration found', []);
        }

        return new QualityConfigurationInfoResponse(true, 1, 'Quality Configuration found', qualityConfigInfoArr);
    }



    async getAllEsclations(req: CommonRequestAttrs): Promise<EsclationsInfoResponse> {
        try {
            const result = await this.qualityConfigurationRepository.getAllEsclationsRepo(req)
            if (result) {
                return new EsclationsInfoResponse(true, 1, 'Data retrieved', result)
            } else {
                return new EsclationsInfoResponse(false, 2, 'Failed', [])
            }

        } catch (err) {
            console.log(err);
            throw err

        }
    }


    async getQualityConfigInfoForStyleAndProcessType(req: StyleProcessTypeReq): Promise<QualityConfigurationInfoResponse> {
        const qualityConfigRes = await this.qualityConfigurationRepository.getQualityConfigInfoForStyleAndProcessType(req)
        if (qualityConfigRes.length === 0) {
            throw new ErrorResponse(0, `Quality Configuration not found for the barcode style " ${req.styleCode} and process type: ${req.processType.join(',')}`)
        }
        console.log(qualityConfigRes, 'quality config res')
        const qualityConfigInfoArr: QualityConfigurationInfoModel[] = []
        for (const rec of qualityConfigRes) {
            const qualityEsclationsInfoArr: QualityEsclationsConfigModel[] = []
            const qualityEsclationsInfo = await this.qualityEsclationsConfigRepository.find({ where: { qualityConfigId: rec.qualityConfigId } });
            for (const esclationConfig of qualityEsclationsInfo) {
                const esclationConfigModel = new QualityEsclationsConfigModel(esclationConfig.name, esclationConfig.quantity, esclationConfig.responsibleUser, esclationConfig.level, rec.qualityConfigId, esclationConfig.id);
                qualityEsclationsInfoArr.push(esclationConfigModel);
            }
            const qualityConfigInfo = new QualityConfigurationInfoModel(rec.qualityType, rec.qualityTypeId, rec.styleCode, rec.processType, rec.qualityPercentage, rec.isMandatory, rec.qualityConfigId, qualityEsclationsInfoArr);
            console.log(qualityConfigInfo, 'qualityConfigInfo')
            qualityConfigInfoArr.push(qualityConfigInfo);
        }
        return new QualityConfigurationInfoResponse(true, 1, 'Quality Configuration found', qualityConfigInfoArr);

    }
}

