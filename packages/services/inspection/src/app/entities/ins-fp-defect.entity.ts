import { InsFourPointPositionEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../warehouse-management/src/database/common-entities";

@Entity('ins_fp_defect_capture')
export class InsFpDefectEntity extends AbstractEntity {
    @Column('integer', { name: 'ph_items_id', nullable: false })
    phItemsId: number;

    @Column('integer', { name: 'ph_item_lines_id', nullable: false })
    phItemLinesId: number;

    @Column('integer', { name: 'point_length', nullable: false })
    pointLength: number;

    @Column('integer', { name: 'point_value', nullable: false })
    pointValue: number;

    @Column('varchar', { name: 'reason', nullable: false })
    reason: string;

    @Column('varchar', { name: 'point_position', length: 5, nullable: false })
    pointPosition: InsFourPointPositionEnum;

    @Column('bigint', { name: 'reason_id', nullable: false })
    reasonId: number;
}       