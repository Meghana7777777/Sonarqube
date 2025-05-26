import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PhApprovalHierarchyStatusEnum, PhApprovalSubFeatureEnum } from "@xpparel/shared-models";

@Entity('ph_approval_hierarchy')
export class PhApprovalHierarchyEntity extends AbstractEntity{
    @Column('varchar',{
        name:'user_role',
    })
    userRole: string;

    @Column('varchar',{
        name:'order',
    })
    order: string;

    @Column({
        type:'enum',
        name:'status',
        enum:PhApprovalHierarchyStatusEnum,
    })
    status:PhApprovalHierarchyStatusEnum;

    @Column({
        type:'enum',
        name:'sub_feature',
        enum:PhApprovalSubFeatureEnum,
    })
    subFeature:PhApprovalSubFeatureEnum;

    @Column('varchar',{
        name:'sub_feature_id'
    })
    subFeatureId: string;
}
