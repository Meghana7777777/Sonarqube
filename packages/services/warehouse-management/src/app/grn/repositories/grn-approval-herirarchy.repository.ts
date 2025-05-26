import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { GrnApprovalHeirarchyEntity } from "../entities/grn-approval-heirarchy.entity";

@Injectable()
export class GrnApprovalHierarchyRepo extends Repository<GrnApprovalHeirarchyEntity>{
    constructor(private dataSource: DataSource) {
        super(GrnApprovalHeirarchyEntity, dataSource.createEntityManager());
    }
}