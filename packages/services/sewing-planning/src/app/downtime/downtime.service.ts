import { Injectable } from '@nestjs/common';
import {  DowntimeData, DowntimeRequest, DowntimeResponseModel, DowntimeUpdateRequest, GlobalResponseObject, WsDowntimeStatusEnum } from '@xpparel/shared-models';
import { DataSource, IsNull } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { WsDowntimeEntity } from '../entities/ws-downtime';
import { WsDownTimeRepo } from '../entities/repository/ws-downtime.repository';
import { elementAt } from 'rxjs';


@Injectable()
export class DowntimeService {
    constructor(
        private dataSource: DataSource,
        private wsDownTimeRepo: WsDownTimeRepo
    ) {

        console.log('DowntimeService constructor');
    }

    /**
     * 
     * @param reqModel 
     * @returns 
    */
    async createDownTime(reqModel: DowntimeRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            await transManager.startTransaction();
            if (reqModel.startTime && !reqModel.endTime){
                const entity = new WsDowntimeEntity();
                entity.wsId = reqModel.wsId,
                    entity.wsCode = reqModel.wsCode,
                    entity.moduleCode=reqModel.moduleCode,
                    entity.dReason = reqModel.dReason,
                    entity.startTime = reqModel.startTime,
                    entity.endTime = null,
                    entity.opsCode = reqModel.opsCode,
                    entity.status = WsDowntimeStatusEnum.ACTIVE,
                    entity.companyCode = reqModel.companyCode,
                    entity.createdUser = reqModel.username,
                    entity.unitCode = reqModel.unitCode;
                    entity.remarks = reqModel.remarks
                await transManager.getRepository(WsDowntimeEntity).save(entity);

            }
            if(reqModel.endTime){
                await this.wsDownTimeRepo.update({wsCode:reqModel.wsCode,endTime:IsNull()},{endTime:reqModel.endTime, status: WsDowntimeStatusEnum.IN_ACTIVE})
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 26001, "Down Time created successfully");
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

// todo:DateRangeRequest
    async getDownTimeByDateRange(body: any): Promise<DowntimeResponseModel> {
        try {
            const { startDate, endDate, unitCode, companyCode } = body;
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
                throw new Error('Invalid date format');
            }
            const startDateFormatted = startDateObj.toISOString().slice(0, 19).replace('T', ' ');
            const endDateFormatted = endDateObj.toISOString().slice(0, 19).replace('T', ' ');

            console.log(
                `Querying downtime records between ${startDateFormatted} and ${endDateFormatted}`
            );
            const downTimeEntityData: WsDowntimeEntity[] = await this.wsDownTimeRepo.getDownTimeDetailsByDateRange(startDateFormatted, endDateFormatted, unitCode, companyCode);
            const downTimeData = downTimeEntityData.map((eachRecord) => {
                return new DowntimeData(eachRecord.wsId, eachRecord.wsCode, eachRecord.dReason, eachRecord.startTime, eachRecord.endTime, eachRecord.opsCode, eachRecord.status, eachRecord.id,eachRecord.moduleCode)
            })
            return new DowntimeResponseModel(true, 26002, 'Downtime record not found', downTimeData);
        } catch (error) {
            return error;
        }
    }





  /**
     * Update downtime record's end time by ID
     * @param body - the update request
     * @returns - the response object
     */
  async updateDownTime(body: DowntimeUpdateRequest): Promise<GlobalResponseObject> {
    try {
        const endTimeString = body.endTime
        const updatedUser = body.username

        


        const endTimeDate = new Date(endTimeString);
        console.log(endTimeDate,"fghjkl;")
        
        if (isNaN(endTimeDate.getTime())) {
            throw new Error('Invalid endDate format');
        }
       const  endTimeFormatted= endTimeDate.toISOString()

        const description = body.description
        await this.wsDownTimeRepo.updateDownTimeById(body.id, endTimeFormatted,updatedUser,body?.description?description:null);
   
        return new GlobalResponseObject(true, 26003, "Down Time updated successfully");
    } catch (error) {
        console.log(error);

        return new GlobalResponseObject(false, 26004, `Error updating downtime: ${error.message}`);
    }
}


}