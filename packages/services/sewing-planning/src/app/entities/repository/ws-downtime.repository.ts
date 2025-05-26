import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WsDowntimeEntity } from "../ws-downtime";
import { ModuleDowntimeDataModel, WsDowntimeStatusEnum } from "@xpparel/shared-models";
import { WorkstationEntity } from "../../master/workstation/workstation.entity";

@Injectable()
export class WsDownTimeRepo extends Repository<WsDowntimeEntity> {
    constructor(private dataSource: DataSource) {
        super(WsDowntimeEntity, dataSource.createEntityManager());
    }


    

    async getDownTimeDetailsByDateRange(startDateFormatted: string, endDateFormatted: string, unitCode: string, companyCode: string) {
        const queryBuilder = this.createQueryBuilder('downtime')
            .where(
                'downtime.start_time >= :startDate AND downtime.start_time <= :endDate',
                {
                    startDate: startDateFormatted,
                    endDate: endDateFormatted,
                }
            );
        queryBuilder.andWhere('downtime.unit_code = :unitCode', { unitCode });
        queryBuilder.andWhere('downtime.company_code = :companyCode', { companyCode });
        return queryBuilder.getMany();
    }


    async updateDownTimeById(id: number, endTime: string, updatedUser: string, description?: string,): Promise<WsDowntimeEntity> {
        const downtimeEntity = await this.findOne({ where: { id } });

        if (!downtimeEntity) {
            throw new Error('Downtime record not found');
        }
        if (description) {
            downtimeEntity.remarks = description;
        }
        downtimeEntity.endTime = endTime;
        downtimeEntity.updatedUser = updatedUser;
        downtimeEntity.updatedAt = new Date();
        downtimeEntity.status = WsDowntimeStatusEnum.IN_ACTIVE

        const updatedDowntime = await this.save(downtimeEntity);

        return updatedDowntime;
    }

}

