import { InsShrinkageTypeEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('ins_shrinkage')
export class InsShrinkageEntity extends AbstractEntity {

    @Column('bigint', { name: 'ref_id', comment: 'Pk of roll' })
    refId: number;

    @Column('bigint', { name: 'ins_req_item_id', comment: 'pk of the inspection items' })
    insReqItemId: number;

    @Column({ name: 'shrinkage_type', type: 'enum', enum: InsShrinkageTypeEnum })
    shrinkageType: InsShrinkageTypeEnum;

    @Column('varchar', { name: 'uom', length: 10 })
    uom: string;

    @Column('integer', { name: 'a_sk_length', nullable: false })
    aSkLength: number;

    @Column('integer', { name: 'a_sk_width', nullable: false })
    aSkWidth: number;

    @Column('integer', { name: 'width_after_sk', nullable: false })
    widthAfterSk: number;

    @Column('integer', { name: 'length_after_sk', nullable: false })
    lengthAfterSk: number;

    @Column('varchar', { name: 'sk_group', length: 30, nullable: true })
    skGroup: string;
} 

//net wi
//gross w
//uom n,g
