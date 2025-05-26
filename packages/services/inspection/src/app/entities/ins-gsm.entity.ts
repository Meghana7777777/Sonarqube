import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
@Entity('ins_gsm') 
export class InsGsmEntity extends AbstractEntity {
    @Column('bigint', { name: 'ref_id', comment: 'Pk of roll' })
    refId: string;

    @Column('bigint', { name: 'ins_req_item_id', comment: 'pk of the inspection items' })
    insReqItemId: number;

    @Column('integer', { name: 'a_gsm' })
    aGsm: number;

    @Column('integer', { name: 'tolerance_from' })
    toleranceFrom: number;

    @Column('integer', { name: 'tolerance_to' })
    toleranceTo: number;

    @Column('integer', { name: 'adjustment_value' })
    adjustmentValue: number;

    @Column('varchar',{ name:'adjustment', default: null, length: 10 })
    adjustment: string;

    @Column('varchar', { name: 'captured_by', default: null, length: 50 })
    capturedBy: string;

    @Column('timestamp', { name: 'captured_date', default: null })
    capturedDate: Date;
}