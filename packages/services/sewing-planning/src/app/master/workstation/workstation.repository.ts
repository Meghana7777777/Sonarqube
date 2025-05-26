import { Injectable } from "@nestjs/common";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { WorkstationEntity } from "./workstation.entity";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { WsDowntimeEntity } from "../../entities/ws-downtime";
import { ModuleDowntimeDataModel, WsDowntimeStatusEnum } from "@xpparel/shared-models";

@Injectable()
export class WorkstationRepository extends Repository<WorkstationEntity> {
    constructor(
        @InjectRepository(WorkstationEntity)
        private repo: Repository<WorkstationEntity>,
        private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }

    async getWorkStationsByModuleCode(moduleCode: string, unitCode: string, companyCode: string): Promise<WorkstationEntity[]> {
        return this.createQueryBuilder('ws')
            .select(['ws.wsCode', 'ws.wsName', 'ws.wsDesc', 'ws.moduleCode'])
            .where('ws.moduleCode = :moduleCode', { moduleCode })
            .andWhere("ws.unit_code = :unitCode", { unitCode })
            .andWhere("ws.company_code = :companyCode", { companyCode })
            .getMany();
    }

    async getModuleDowntimeDataByModuleCode(moduleCode: string, unitCode: string, companyCode: string): Promise<any[]> {
        return this.createQueryBuilder("ws")
            .select(["ws.wsCode AS wsCode", "ws.moduleCode AS moduleCode", "wsd.dReason AS dReason", "wsd.startTime AS startTime", "wsd.endTime AS endTime",
            ])
            .leftJoin(WsDowntimeEntity, "wsd", "wsd.wsCode = ws.wsCode AND wsd.status = :status", { status: WsDowntimeStatusEnum.ACTIVE })
            .where("ws.moduleCode = :moduleCode", { moduleCode })
            .andWhere("ws.unit_code = :unitCode", { unitCode })
            .andWhere("ws.company_code = :companyCode", { companyCode })
            .getRawMany();
    }

    async getModuleDowntimeData(moduleCode: string, unitCode: string, companyCode: string): Promise<ModuleDowntimeDataModel> {
        const query = await this
            .createQueryBuilder("ws")
            .select(["ws.wsCode AS wsCode", "ws.moduleCode AS moduleCode", "wsd.dReason AS dReason", "wsd.startTime AS startTime", "wsd.endTime AS endTime"])
            .leftJoin(WsDowntimeEntity, "wsd", "ws.wsCode = wsd.wsCode AND wsd.status = :status", { status: WsDowntimeStatusEnum.ACTIVE })
            .where("ws.moduleCode = :moduleCode", { moduleCode })
            .andWhere("ws.unit_code = :unitCode", { unitCode })
            .andWhere("ws.company_code = :companyCode", { companyCode })
        const results = await query.getRawMany();
        let dReason = '';
        let totalDowntimeMinutes = 0;
        results.forEach((row) => {
            const { dReason: currentReason, startTime, endTime } = row;
            if (!dReason && currentReason) {
                dReason = currentReason;
            }
            const downtimeImpactOnWork = startTime && endTime ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)) : 0;
            totalDowntimeMinutes += downtimeImpactOnWork;
        });

        const downtimeImpactSummary = totalDowntimeMinutes ? `${totalDowntimeMinutes} minutes` : "";

        return new ModuleDowntimeDataModel( !!dReason, dReason, downtimeImpactSummary );
    }

} 
