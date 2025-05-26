import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InsRequestItemRepo } from './repositories/ins-request-items.repository';
import { GlobalResponseObject, InsIrMaterialConfirmationRequest } from '@xpparel/shared-models';
import { ErrorResponse } from '@xpparel/backend-utils';
import { InsRequestEntityRepo } from './repositories/ins-request.repository';

@Injectable()
export class InspectionConfirmationService {
    
    constructor(
        private dataSource: DataSource,
        private insItemRepo: InsRequestItemRepo,
        private insReqRepo: InsRequestEntityRepo
    ) {

    }

    async checkIfRollSelectedForInspection(companyCode: string, unitCode: string, rollId: number): Promise<boolean> {
        // const rollInfo = await this.insItemRepo.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode: rollId, isActive: true}});
        // return rollInfo ? true : false; 
        return false;
    }

    // END POINT
    // UPDATE
    async confirmMaterialReceivedForIr(req: InsIrMaterialConfirmationRequest): Promise<GlobalResponseObject> {
        return new GlobalResponseObject(true, 6024, 'Materail receving status updated');
    }

    async confirmStartInspection(req: InsIrMaterialConfirmationRequest): Promise<GlobalResponseObject> {
        return new GlobalResponseObject(true, 6025, 'Inspection confirmed to start'); 
    }
}
