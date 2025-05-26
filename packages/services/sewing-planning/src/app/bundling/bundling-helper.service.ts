import { Injectable } from '@nestjs/common';
import {  DowntimeData, DowntimeRequest, DowntimeResponseModel, DowntimeUpdateRequest, GlobalResponseObject, SPS_ELGBUN_C_SewProcSerialRequest, WsDowntimeStatusEnum } from '@xpparel/shared-models';
import { DataSource, IsNull } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { WsDowntimeEntity } from '../entities/ws-downtime';
import { WsDownTimeRepo } from '../entities/repository/ws-downtime.repository';
import { elementAt } from 'rxjs';


@Injectable()
export class BundlingHelperService {
    constructor(
        private dataSource: DataSource,
    ) {

    }

    // async getImmediateNextProcessTypeFor(req: SPS_ELGBUN_C_SewProcSerialRequest): Promise<> {
    //     // get the eligible bundles for the proc serial
    //     const { companyCode, unitCode, procSerial, processingType, username } = req;
    //     // check if the proc serial exists
    //     // const 
    // }

    

}


