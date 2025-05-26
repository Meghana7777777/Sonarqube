import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhApprovalHierarchyEntity } from "../entities/ph-approval-hierarchy.entity";

@Injectable()
export class PhApprovalHierarchyRepo extends Repository<PhApprovalHierarchyEntity>{
    constructor(dataSource: DataSource) {
        super(PhApprovalHierarchyEntity, dataSource.createEntityManager());
    }

}