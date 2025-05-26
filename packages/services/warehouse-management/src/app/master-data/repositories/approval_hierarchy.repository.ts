import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { ApprovalHierarchyEntity } from "../entities/approval_hierarchy.entity";


@Injectable()
export class PhGrnApprovalHierarchyRepo extends Repository<ApprovalHierarchyEntity>{
    constructor(private dataSource: DataSource) {
        super(ApprovalHierarchyEntity, dataSource.createEntityManager());
    }
}