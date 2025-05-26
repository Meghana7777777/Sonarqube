import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { InsApprovalHierarchyEntity } from "../../entities/ins-approval-hierarchy.entity";


@Injectable()
export class InsApprovalHierarchyRepo extends Repository<InsApprovalHierarchyEntity>{
    constructor(private dataSource: DataSource) {
        super(InsApprovalHierarchyEntity, dataSource.createEntityManager());
    }
}