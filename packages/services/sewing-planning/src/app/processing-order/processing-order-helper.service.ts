import { Injectable } from '@nestjs/common';
import { ProcessTypeEnum, ProcessingOrderInfoRequest } from '@xpparel/shared-models';
import { FgCreationService } from '@xpparel/shared-services';
import { ErrorResponse } from '@xpparel/backend-utils';
import { DataSource } from 'typeorm';

@Injectable()
export class ProcessingOrderHelperService {
    constructor(
        private dataSource: DataSource,
        private ptsFgCreationService: FgCreationService
    ) {

    }

    async triggerCreateProcSerialToPts(procSerial: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string, username: string ): Promise<boolean> {
        try {
            const m1 = new ProcessingOrderInfoRequest(username, unitCode, companyCode, 0, procSerial, procType, false, false, false, false, false, false, false, false, false);
            const res = await this.ptsFgCreationService.createProcOrderRef(m1);
            if(!res.status) {
                throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    async triggerDeleteProcSerialFromPts(procSerial: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string, username: string ): Promise<boolean> {
        try {
            const m1 = new ProcessingOrderInfoRequest(username, unitCode, companyCode, 0, procSerial, procType, false, false, false, false, false, false, false, false, false);
            const res = await this.ptsFgCreationService.deleteProcOrderRef(m1);
            if(!res.status) {
                throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}


