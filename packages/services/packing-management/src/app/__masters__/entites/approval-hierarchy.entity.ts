import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ApprovalHierarchyEnum } from "@xpparel/shared-models";

@Entity('ins_approval_hierarchy')
export class ApprovalHierarchyEntity extends AbstractEntity {
    @Column({ name: 'ins_request_id', type: 'int' })
    insRequestId: number;

    @Column("varchar", { name: 'user_role', length: 40 })
    userRole: string;

    @Column('varchar', { name: 'order', length: 40 })
    order: string;

    @Column({ name: 'status', enum: ApprovalHierarchyEnum, type: 'enum', })
    status: ApprovalHierarchyEnum;

    @Column('varchar', { name: 'sub_feature', length: 40 })
    subFeature: string;
}