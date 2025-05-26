import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ShippingRequestItemLevelEnum, ShippingRequestProceedingEnum } from "@xpparel/shared-models";

@Entity('s_request_item')
export class SRequestItemEntity extends AbstractEntity {

    @Column("bigint", { name: "s_request_id", nullable: false, comment: 'PK of the s_request' })
    sRequestId: number;

    @Column("varchar", { length: 5, name: "current_stage", nullable: false, default: 0, comment: 'The attr name for  dispatch' })
    currentStage: ShippingRequestProceedingEnum;

    // NOTE: This shipping request item could be a set / item / sub item
    // So based on this criteria, the respective table need to be queried in the retreival process
    @Column("varchar", { length: "5", name: "item_level", nullable: false, comment: 'The level of the item against which the shipping request can be created.could be set,item,sub_item' })
    itemLevel: ShippingRequestItemLevelEnum;

    // This could be either PK of d_set or PK of d_set_item or PK of d_set_sub_item
    @Column("bigint", { name: "ref_id", nullable: false, comment: 'pk of the table as in item_level' })
    refId: number;

    // not used ATM
    @Column("varchar", { length: "15", name: "truck_no", nullable: true, comment: 'NOT USED' })
    truckNo: string;

    // PK of the Manufacturingal order
    @Column("varchar", { length: "20", name: "l1", nullable: false, comment: 'The Manufacturing number related PK ' })
    l1: string;

    // PK of the cut order
    @Column("varchar", { length: "20", name: "l2", nullable: true, comment: 'The cut order pk. cps.p_order PK ' })
    l2: string;

    // product name
    @Column("varchar", { length: "40", name: "l3", nullable: true, comment: 'The product name ' })
    l3: string;

    // Manufacturing number
    @Column("varchar", { length: "40", name: "l4", nullable: true, comment: 'The Manufacturing number' })
    l4: string;

    @Column("varchar", { length: "20", name: "l5", nullable: true, comment: 'The Po Serial' })
    l5: string;


}