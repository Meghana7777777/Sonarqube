import { PackingListIdRequest, PackJobPlanningRequest } from "@xpparel/shared-models";
import { BaseInterfaceRepository } from "../../../database/common-repositories";
import { JobHeaderEntity } from "../entities/job-header.entity";
import { PackJobsQueryRes } from "./query-response/pack-jobs-query.res";
import { JobHeaderQurrrey } from "../dto/job-header-qurrey-dto";

export interface JobHeaderRepoInterface extends BaseInterfaceRepository<JobHeaderEntity> {
    getPackJobData(req: PackingListIdRequest): Promise<PackJobsQueryRes[]>;
    getPlannedPackJobDataByTableId(req: PackJobPlanningRequest): Promise<PackJobsQueryRes[]>;
    getMaxPriorityForWorkstationId(workstationId: number, companyCode: string, unitCode: string): Promise<number>;
    getYetToPlanPackJobs(poNo: number, companyCode: string, unitCode: string): Promise<JobHeaderQurrrey[]>;
}
