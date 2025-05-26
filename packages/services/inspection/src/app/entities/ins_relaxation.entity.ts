import { MeasuredRefEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('ins_relaxation')
export class InsRelaxationEntity extends AbstractEntity{
    @Column('bigint', { name: 'ref_id', comment: 'Pk of roll' })
    refId: number;

    @Column('bigint', { name: 'ins_req_item_id', comment: 'pk of the inspection items' })
    insReqItemId: number;

    @Column('integer', { name: 'width', nullable: false })
    width: number;

    @Column('varchar', { name: 'measured_ref', nullable: false })
    measuredRef: MeasuredRefEnum;

    @Column('integer', { name: 'measured_at', nullable: false })
    measuredAt: number;

    @Column('integer', { name: 'measured_order', nullable: false })
    order: number;
}