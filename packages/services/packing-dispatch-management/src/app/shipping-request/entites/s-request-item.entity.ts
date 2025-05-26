import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PkShippingRequestItemLevelEnum, PkShippingRequestProceedingEnum } from "@xpparel/shared-models";

@Entity('s_request_item')
export class SRequestItemEntity extends AbstractEntity {

    @Column("bigint", { name: "s_request_id", nullable: false, comment: 'PK of the s_request' })
    sRequestId: number;

    @Column("varchar", { length: 5, name: "current_stage", nullable: false, default: 0, comment: 'The attr name for  dispatch' })
    currentStage: PkShippingRequestProceedingEnum;

    // NOTE: This shipping request item could be a set / item / sub item
    // Mo based on this criteria, the respective table need to be queried in the retreival process
    @Column("varchar", { length: "5", name: "item_level", nullable: false, comment: 'The level of the item against which the shipping request can be created.could be set,item,sub_item' })
    itemLevel: PkShippingRequestItemLevelEnum;

    // This could be either PK of d_set or PK of d_set_item or PK of d_set_sub_item
    @Column("bigint", { name: "ref_id", nullable: false, comment: 'pk of the table as in item_level' })
    refId: number;

    // PK of the pack order
    @Column("varchar", { length: "20", name: "l1", nullable: false, comment: 'The pack order related PK ' })
    l1: string;

    // mo number
    @Column("varchar", { length: "20", name: "l2", nullable: true, comment: 'The Mo number' })
    l2: string;

    // vpo
    @Column("varchar", { length: "40", name: "l3", nullable: true, comment: 'The VPO' })
    l3: string;

    // MO PK
    @Column("varchar", { length: "40", name: "l4", nullable: true, comment: 'PK of the Manufacturing order' })
    l4: string;

    // DR request no
    @Column("varchar", { length: "20", name: "l5", nullable: true, comment: 'DR request no' })
    l5: string;

    @Column('boolean', { name: 'fg_out_req_created', nullable: false, default: false })
    fgOutReqCreated: boolean;

    @Column("varchar", { length: "40", name: "fg_out_req_id", nullable: true, comment: 'Fg Out Req' })
    fgOutReqId: string;
}