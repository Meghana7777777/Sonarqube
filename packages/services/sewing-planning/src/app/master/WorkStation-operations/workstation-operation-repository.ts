import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { OperationEntity } from "../../../../../unit-management/src/app/operation/entity/operation.entity";
import { WorkstationEntity } from "../workstation/workstation.entity";
import { WorkstationOperationEntity } from "./workstation-operation-entity";

@Injectable()
export class WorkstationOperationRepository extends Repository<WorkstationOperationEntity> {
    constructor(
        @InjectRepository(WorkstationOperationEntity)
        private repo: Repository<WorkstationOperationEntity>, private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }

    async getWorkstationOperation(): Promise<any[]> {
        const query = await this.createQueryBuilder('wo')
            .select(`wo.ws_code AS wsCode,ws.ws_Name AS wsName,wo.op_Code AS iOpCode, op.op_name AS opName`)
            .leftJoin(WorkstationEntity, 'ws', 'ws.ws_code = wo.ws_code')
            .leftJoin(OperationEntity, 'op', 'op.i_op_Code = wo.op_code')
            .getRawMany()
        return query;
    }

}










