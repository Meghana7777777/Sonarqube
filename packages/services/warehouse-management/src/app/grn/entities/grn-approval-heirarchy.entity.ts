import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import {GrnStatusEnum, GrnSubFeatureEnum, NotificationStatusEnum } from '@xpparel/shared-models';


@Entity('grn_approval_heirarchy')
export class GrnApprovalHeirarchyEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'user_role',
        length:20,
        nullable:false,
    })
    userRole: string

    @Column('varchar', {
        name: 'order',
        length:20,
        nullable:false,
    })
    order: string

    @Column('enum', {
        name: 'status',
        enum: GrnStatusEnum
    })
    status: GrnStatusEnum

    @Column('enum', {
        name: 'sub_feature',
        enum: GrnSubFeatureEnum
    })
    subFeature: GrnSubFeatureEnum

    @Column('varchar', {
        name: 'grn_id',
        length:20,
        nullable:false,
    })
    grnId: string 
    
    @Column('varchar', {
        name: 'batch_id',
        length:20,
        nullable:false,
    })
    batchId: string 
}
