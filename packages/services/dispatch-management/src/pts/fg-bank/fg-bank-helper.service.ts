import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ErrorResponse, returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, ProcessTypeEnum, PtsBankRequestCreateRequest } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { BankRequestHeaderRepository } from './repository/bank-request.repository';
import { BankRequestLineRepository } from './repository/bank-request-line.repository';
import { BankRequestDepJobRepository } from './repository/bank-request-dep-job.repository';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { FgOpDepRepository } from '../repository/fg-op-dep.repository';
import { JobOpEntity } from '../entity/job-op.entity';
import { FgOpRepository } from '../repository/fg-op.repository';
import { OpSequenceRepository } from '../repository/op-sequence.repository';
import { FgRepository } from '../repository/fg.repository';
import { JobOpRepository } from '../repository/job-op.repository';
import { JobDepRepository } from '../repository/job-dep.repository';
import { BundleFgRepository } from '../repository/bundle-fg.repository';
import { FgOpDepEntity } from '../entity/fg-op-dep.entity';
import { MoInfoRepository } from '../repository/mo-info.repository';



@Injectable()
export class FgBankHelperService {
    constructor(
        private dataSource: DataSource,
        private bankHeaderRepo: BankRequestHeaderRepository,
        private bankLineRepo: BankRequestLineRepository,
        private bankDepJobRepo: BankRequestDepJobRepository,
        private fgDepRepo: FgOpDepRepository,
        private fgRepo: FgRepository,
        private fgOpRepo: FgOpRepository,
        private opSeqRepo: OpSequenceRepository,
        private jobOpRepo: JobOpRepository,
        private jobDepRepo: JobDepRepository,
        private bundleFgRepo: BundleFgRepository,
        private moInfoRepo: MoInfoRepository,
    ) {
        
    }

    async getFgsCompletedForCutBundle(cutBundle: string, opCode: string, companyCode: string, unitCode: string): Promise<number[]> {
        return [];
    }
}

