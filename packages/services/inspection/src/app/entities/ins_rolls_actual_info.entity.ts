import { InsUomEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('ins_rolls_actual_info')
export class InsRollsActualInfoEntity extends AbstractEntity {

    @Column('int', { name: 'ins_request_id' })
    insRequestId: number;
    
    @Column('integer',{ name: 'ins_req_items_id' })
    insRequestItemsId: number;

    @Column('integer', { name: 'ins_req_line_id' })
    insRequestLineId: number;
    
    // TODO
    @Column('integer', { name: 'grn_quantity' })
    grnQuantity: number;

    @Column('integer', { name: 'no_of_joins' })
    noOfJoins: number;

    @Column('numeric', { name: 'a_width' })
    aWidth: number;

    @Column('numeric', { name: 'four_points_width', default: 0 })
    fourPointsWidth: number;

    @Column("varchar", { name: "four_points_width_uom", length: 5, default: InsUomEnum.CM })
    fourPointsWidthUom: InsUomEnum;

    @Column('numeric', { name: 'four_points_length', default: 0 })
    fourPointsLength: number;

    @Column("varchar", { name: "four_points_length_uom", length: 5, default: InsUomEnum.YRD })
    fourPointsLengthUom: InsUomEnum;

    @Column('integer', { name: 'a_length' })
    aLength: number;

    @Column('varchar', { name: 'a_shade', default: null, length: 10 })
    aShade: string;

    @Column('varchar', { name: 'a_shade_group', default: null, length: 30 })
    aShadeGroup: string;

    @Column('integer', { name: 'a_gsm' })
    aGsm: number;

    @Column('integer', { name: 'tolerance_from' })
    toleranceFrom: number;

    @Column('integer', { name: 'tolerance_to' })
    toleranceTo: number;

    @Column('integer', { name: 'a_weight' })
    aWeight: number;

    @Column('varchar',{ name:'remarks' })
    remarks: string;

    @Column('integer', { name: 'adjustment_value' ,nullable: true})
    adjustmentValue: number;

    @Column('varchar',{ name:'adjustment', default: null, length: 10 })
    adjustment: string;

    @Column("decimal", { name: "gsm", nullable: false, precision: 8, scale: 2, default: 0 })
    gsm: number;
}