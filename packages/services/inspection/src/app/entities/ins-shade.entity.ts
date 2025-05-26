import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('ins_shade')
export class InsShadeEntity extends AbstractEntity {
    @Column('bigint', { name: 'ref_id', comment: 'Pk of roll' })
    refId: string;

    @Column('bigint', { name: 'ins_item_id', comment: 'pk of the inspection items' })
    inItemId: number;

    @Column('varchar', { name: 'a_shade_group', default: null, length: 30 })
    aShadeGroup: string;

    @Column('varchar', { name: 'a_shade', default: null, length: 10 })
    aShade: string;

    @Column('varchar', { name: 'captured_by', default: null, length: 50 })
    capturedBy: string;

    @Column('timestamp', { name: 'captured_date', default: null })
    capturedDate: Date;


}
