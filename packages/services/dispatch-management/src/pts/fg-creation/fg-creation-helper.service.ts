import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { JobBundleFgInfoModel, JobBundleFgInfoResponse, OslIdFgsSpsModel, OslIdFgsSpsResponse, OslIdInfoModel, OslIdInfoResponse } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';

@Injectable()
export class FgCreationHelperService {
    constructor(
        private dataSource: DataSource,
    ) {
        
    }

    async getFgsForOslRefIdFromSps(oslRefId: number, companyCode: string, unitCode: string): Promise<OslIdFgsSpsModel> {
        const res: OslIdFgsSpsResponse = null;
        return res.data[0];
    }

    async getOslRefIdInfoFromOms(oslRefId: number, companyCode: string, unitCode: string): Promise<OslIdInfoModel[]> {
        const res: OslIdInfoResponse= null; // put an api call to OMS
        return res.data;
    }

    async getJobDetailsForJobNumber(jobNumber: string, sewSerial: number, companyCode: string, unitCode: string): Promise<JobBundleFgInfoModel> {
        const res: JobBundleFgInfoResponse = null;
        return res.data[0];
    }
}



