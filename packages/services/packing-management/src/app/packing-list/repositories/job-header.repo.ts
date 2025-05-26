import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PackingListIdRequest, PackJobPlanningRequest, PackJobStatusEnum } from "@xpparel/shared-models";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { PackMaterialRequestEntity } from "../../packing-material-request/entities/material-request.entity";
import { JobHeaderEntity } from "../entities/job-header.entity";
import { JobHeaderRepoInterface } from "./job-header-repo.interface";
import { PackJobsQueryRes } from "./query-response/pack-jobs-query.res";
import { CrtnEntity } from "../entities/crtns.entity";
import { CartonParentHierarchyEntity } from "../entities/carton-config-parent-hierarchy.entity";
import { ItemsEntity } from "../../__masters__/items/entities/items.entity";
import { PLConfigEntity } from "../entities/pack-list.entity";
import { JobHeaderQurrrey } from "../dto/job-header-qurrey-dto";
import { PKMSProcessingOrderEntity } from "../../pre-integrations/pkms-po-entities/pkms-processing-order-entity";

@Injectable()
export class JobHeaderRepo extends BaseAbstractRepository<JobHeaderEntity> implements JobHeaderRepoInterface {
    constructor(
        @InjectRepository(JobHeaderEntity)
        private readonly jobHeaderEntity: Repository<JobHeaderEntity>,
    ) {
        super(jobHeaderEntity);
    }
    async getPackJobData(req: PackingListIdRequest): Promise<PackJobsQueryRes[]> {
        const { companyCode, unitCode } = req;
        const query: PackJobsQueryRes[] = await this.jobHeaderEntity.createQueryBuilder('job')
            .select(`job.id as pack_job_id, job.job_number, job.job_qty as cartons,job.priority,pack_mat_req.request_no,job.work_station_id,job.work_station_desc,pack_mat_req.mat_request_on,job.planned_date_time,pack_mat_req.request_status,job.po_id`)
            .leftJoin(PackMaterialRequestEntity, 'pack_mat_req', 'pack_mat_req.company_code = job.company_code AND pack_mat_req.unit_code = job.unit_code AND pack_mat_req.id = job.pk_mat_req_id ')
            .where(`job.company_code = '${companyCode}' AND job.unit_code = '${unitCode}' AND job.pk_config_id ='${req.packListId}'`)
            .groupBy(`job.job_number`)
            .getRawMany();

        return query;
    }

    async getPlannedPackJobDataByTableId(req: PackJobPlanningRequest): Promise<PackJobsQueryRes[]> {
        const { companyCode, unitCode } = req;
        const query: PackJobsQueryRes[] = await this.jobHeaderEntity.createQueryBuilder('job')
            .select(`job.id as pack_job_id, job.job_number, job.job_qty as cartons,job.priority,pack_mat_req.request_no,job.work_station_id,job.work_station_desc,pack_mat_req.mat_request_on,job.planned_date_time,pack_mat_req.request_status,job.po_id as po_id,job.pk_config_id,pack_mat_req.mat_status,pack_mat_req.id as mat_id`)
            .leftJoin(PackMaterialRequestEntity, 'pack_mat_req', 'pack_mat_req.company_code = job.company_code AND pack_mat_req.unit_code = job.unit_code AND pack_mat_req.id = job.pk_mat_req_id')
            .where(`job.company_code = '${companyCode}' AND job.unit_code = '${unitCode}' AND job.work_station_id ='${req.workStationsId}'`)
            .groupBy(`job.job_number`)
            .getRawMany();

        return query;
    }

    async getMaxPriorityForWorkstationId(workstationId: number, companyCode: string, unitCode: string) {
        const maxPriority: { priority: number } = await this.jobHeaderEntity.createQueryBuilder('job')
            .select(`MAX(priority) as priority`)
            .where(`work_station_id = ${workstationId} AND company_code = '${companyCode}' AND unit_code = '${unitCode}' `)
            .getRawOne();
        return Number(maxPriority.priority);
    }

    // async getYetToPlanPackJobs(poNo: number, companyCode: string, unitCode: string) {
    //     return await this.jobHeaderEntity.createQueryBuilder('job')
    //         .leftJoinAndSelect('job.packList', 'packList')
    //         .leftJoinAndSelect('packList.po', 'po')
    //         .where(`job.company_code = '${companyCode}' AND job.unit_code = '${unitCode}' AND po.id='${poNo}' AND job.status='${PackJobStatusEnum.OPEN}'`)
    //         .getMany();
    // }
    async getYetToPlanPackJobs(poNo: number, companyCode: string, unitCode: string): Promise<JobHeaderQurrrey[]> {
        const query = await this.jobHeaderEntity.createQueryBuilder('job')
            .select(`job.po_id,job.pk_config_id,job.pk_mat_req_id,job.id,job.job_number,job.job_qty,job.priority,job.pk_mat_req_id,job.planned_date_time`)
            .addSelect(`mt.request_no,mt.mat_request_on,mt.mat_status`)
            .leftJoin(PLConfigEntity, 'pc', 'pc.id=job.packList')
            .leftJoin(PKMSProcessingOrderEntity, 'po', 'po.id=pc.po_id')
            .leftJoin(PackMaterialRequestEntity, 'mt', 'mt.id = job.pk_mat_req_id')
            .where(`job.company_code = '${companyCode}' AND job.unit_code = '${unitCode}' AND po.id='${poNo}' AND job.status='${PackJobStatusEnum.OPEN}'`)
            .getRawMany();
        return query
    }




    async getPackJobDataForGivenPlId(req: PackingListIdRequest) {
        const query = await this.jobHeaderEntity.createQueryBuilder('pj')
            .select(`pj.pk_config_id,pj.job_number,pj.id,pj.status,pj.planned_date_time,pj.completed_date_time,item_data.code,count(crtn_data.id)`)
            .leftJoin(CrtnEntity, 'carton', 'carton.pk_job_id=pj.id')
            .leftJoin(CartonParentHierarchyEntity, 'crtn_data', 'crtn_data.id=carton.carton_proto_id')
            .leftJoin(ItemsEntity, 'item_data', 'item_data.id=crtn_data.item_id')
            .where(`pj.pk_config_id='${req.packListId}' and pj.company_code='${req.companyCode}' and pj.unit_code='${req.unitCode}`)
        return query.getRawMany()
    }

}

