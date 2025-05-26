import { Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PackListLoadingStatus, RollSelectionTypeEnum } from '@xpparel/shared-models';

@Entity('ph_grn')
export class PhGrnEntity extends AbstractEntity {

    @Column('integer', {
        name: 'ph_id',
        nullable: false
    })
    phID: number

    @Column('varchar', {
        name: 'grn_number',
        length: 20,
        nullable: true,
    })
    grnNumber: string

    @CreateDateColumn({
        name: "grn_date",
        default: null,
    })
    grnDate: Date

    @Column('varchar', {
        name: 'grn_status',
        length: 20,
        nullable: false,
    })
    grnStatus: string
    
    @Column('enum', {
        name: 'status',
        enum: PackListLoadingStatus,
        default: PackListLoadingStatus.IN
    })
    status: PackListLoadingStatus


    @Column('varchar', {
        name: 'grn_invoice_number',
        length: 20,
        nullable: true,
    })
    grnInvoiceNumber: string

    @Column('varchar', {
        name: 'grn_code',
        length: 20,
        nullable: true,
    })
    grnCode: string

    @Column('integer', {
        name: 'rolls_pick_perc',
        nullable: true,
    })
    rollsPickPerc: number

    @Column('enum', {
        name: 'roll_selection_type',
        enum: RollSelectionTypeEnum,
        nullable: true
    })
    rollSelectionType: RollSelectionTypeEnum

}
