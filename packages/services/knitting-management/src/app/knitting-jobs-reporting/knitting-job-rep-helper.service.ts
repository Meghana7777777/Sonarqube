import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { KMS_C_KnitOrderBundlingConfirmationIdRequest, MOC_OpRoutingProcessTypeList, ProcessTypeEnum } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { PoKnitJobPslRepository } from '../common/repository/po-knit-job-psl.repo';
import { PoKnitJobRepLogRepository } from '../common/repository/po-knit-job-rep-log.repo';
import { PoJobPslMapEntity } from '../common/entities/po-job-psl-map-entity';
import { PoSubLineBundleRepository } from '../common/repository/po-sub-line-bundle.repo';
import { PoKnitGroupRepository } from '../common/repository/po-knit-group.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSubLineEntity } from '../common/entities/po-sub-line-entity';
import { KnittingConfigurationService } from '../knitting-configuration/knitting-configuration.service';
import { InvCreationService } from '@xpparel/shared-services';

@Injectable()
export class KnittingJobsReportingHelperService {

    constructor(
        private pslPropsRepo: PoSubLineRepository,
        private knitOrderProductRepo: PoProductRepository,
        @Inject(forwardRef(() => KnittingConfigurationService)) private knitConfigService: KnittingConfigurationService,
        private invCreationService: InvCreationService
    ) {

    }

    async getPslProsForPslIds(companyCode: string, unitCode: string, pslIds: number[]): Promise<Map<number, PoSubLineEntity>> {
        const pslRecs = await this.pslPropsRepo.find({select: ['productRef', 'fgColor', 'size', 'moProductSubLineId', 'productCode', 'productName'], where: { companyCode: companyCode, unitCode: unitCode, moProductSubLineId: In(pslIds)}});
        const pslInfoMap = new Map<number, PoSubLineEntity>();
        pslRecs.forEach(r => {
            pslInfoMap.set(r.moProductSubLineId, r);
        });
        return pslInfoMap;
    }

    async getProductsMapForProcSerial(companyCode: string, unitCode: string, procSerial: number, procType: ProcessTypeEnum): Promise<Map<string, {prodName: string, prodCode: string}>> {
        const productInfo = await this.knitOrderProductRepo.find({select: ['productCode', 'productName', 'productRef'], where: { companyCode: companyCode, unitCode: unitCode, processingSerial: procSerial }});
        const productInfoMap: Map<string, {prodName: string, prodCode: string}> = new Map<string,  {prodName: string, prodCode: string}>();
        productInfo.forEach(r => {
            productInfoMap.set(r.productRef, {prodCode: r.productCode, prodName: r.productName});
        });
        return productInfoMap;
    }

    async getKnitSubProcessesForProcSerial(companyCode: string, unitCode: string, procSerial: number, procType: ProcessTypeEnum, productCode: string, pslIds: number[], fgColor: string): Promise<MOC_OpRoutingProcessTypeList> {
        const knitOrderSubProcesses: string[] = [];
        const knitGroupsRes = await this.knitConfigService.getKnitGroupInfoForMOProductCodeAndFgColor(procType, pslIds, productCode, fgColor, unitCode, companyCode);
        return knitGroupsRes.processTypesList[0];
    }

    async sendBundlingConfirmationToInvSystem(companyCode: string, unitCode: string, username: string, confirmationId: number): Promise<boolean> {
        const req = new KMS_C_KnitOrderBundlingConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId, ProcessTypeEnum.KNIT);
        await this.invCreationService.createKnitInvInRequestByConfirmationId(req);
        return true;
    }
}
