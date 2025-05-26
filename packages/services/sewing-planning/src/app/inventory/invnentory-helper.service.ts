import { Injectable } from '@nestjs/common';
import { DataSource, In, IsNull } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { WsDowntimeEntity } from '../entities/ws-downtime';
import { WsDownTimeRepo } from '../entities/repository/ws-downtime.repository';
import { elementAt } from 'rxjs';
import { PoSubLineRepository } from '../entities/repository/po-sub-line.repo';
import { PoSubLineEntity } from '../entities/po-sub-line-entity';
import { InvCreationService, OpReportingService } from '@xpparel/shared-services';
import { ProcessTypeEnum, PTS_C_ProcTypeBundleBarcodeModel, PTS_C_ProcTypeBundleBarcodeRequest, PTS_R_ProcTypeBundleBarcodeCompletedQtyModel, SPS_C_BundleInvConfirmationIdRequest, SPS_C_SpsOrderConfirmedBundleModel } from '@xpparel/shared-models';
import { ErrorResponse } from '@xpparel/backend-utils';
import { ProductSubLineFeaturesRepository } from '../entities/repository/product-sub-line-features.repo';
import { ProductSubLineFeaturesEntity } from '../entities/product-sub-line-features-entity';


@Injectable()
export class InventoryHelperService {
    constructor(
        private dataSource: DataSource,
        private poSubLineRepo: PoSubLineRepository,
        private ptsOpRepService: OpReportingService,
        private invCreationService: InvCreationService,
        private pslRepo: ProductSubLineFeaturesRepository
    ) {

    }


    async getPslIdsForProdColorProcSerial(companyCode: string, unitCode: string, procSerial: number, prodName: string, fgColor: string): Promise<PoSubLineEntity[]> {
        const recs = await this.poSubLineRepo.find({select: ['processingSerial', 'productCode', 'productName', 'moProductSubLineId', 'size', 'fgColor', 'styleCode', 'quantity', 'productType'], where: {companyCode, unitCode, processingSerial: procSerial, productName: prodName, fgColor: fgColor}});
        return recs;
    }

    // ADD
    async getPslPropsForPslIds(companyCode: string, unitCode: string, pslIds: number[]): Promise<ProductSubLineFeaturesEntity[]> {
        const recs = await this.pslRepo.find({ select: ['fgColor', 'size', 'schedule', 'coNumber', 'deliveryDate', 'destination', 'styleCode', 'styleName', 'styleDescription', 'oqType', 'moProductSubLineId'], where: {companyCode, unitCode, moProductSubLineId: In(pslIds)}});
        return recs;
    }


    async getOutputQtyForBundlesFromPts(companyCode: string, unitCode: string, procSerial: number, prodName: string, fgColor: string, procType: ProcessTypeEnum, barcodes: PTS_C_ProcTypeBundleBarcodeModel[]): Promise<PTS_R_ProcTypeBundleBarcodeCompletedQtyModel[]> {
        const req = new PTS_C_ProcTypeBundleBarcodeRequest(null, unitCode, companyCode, 0, procSerial, procType, prodName, fgColor, barcodes);
        const res = await this.ptsOpRepService.getProcessTypeCompletedQtyForGivenPoProdColBundles(req);
        if(!res.status) {
            throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
        }
        if(!res.data?.length) {
            throw new ErrorResponse(0, `No output reported bundles were identified in PTS`);
        }
        return res.data;
    }

    async createSpsInvInRequestByConfirmationId(confirmationId: number, processType: ProcessTypeEnum, companyCode: string, unitCode: string, username: string): Promise<boolean> {
        const m1 = new SPS_C_BundleInvConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId, processType);
        this.invCreationService.createSpsInvInRequestByConfirmationId(m1);
        return true;
    }

    async deleteSpsInvInRequestByConfirmationId(confirmationId: number, processType: ProcessTypeEnum, companyCode: string, unitCode: string, username: string): Promise<boolean> {
        const m1 = new SPS_C_BundleInvConfirmationIdRequest(username, unitCode, companyCode, 0, confirmationId, processType);
        this.invCreationService.deleteSpsInvInRequestByConfirmationId(m1);
        return true;
    }
}

