import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RmwRollStatusEnum, RmwStatusEnum } from "@xpparel/shared-models";

@Entity('w_roll_data')
export class WRollDataEntity extends AbstractEntity {
    @Column('int', { name: 'roll_no' })
    rollNo:number;

    @Column('int', { name: 'supp_roll_no' })
    suppRollNo: number;

    @Column('int', { name: 'qty_rec' })
    qtyRec: number;

    @Column('int', { name: 'qty_allocated' })
    qtyAllocated: number;

    @Column('int', { name: 'qty_issued' })
    qtyIssued: number;

    @Column('int', { name: 'qty_returned' })
    qtyReturned: number;

    @Column('enum', {
        name: 'roll_status',
        enum: RmwRollStatusEnum
    })
    rollStatus: RmwRollStatusEnum;

    @Column('varchar', { name: 'inspection_status', length: 50 })
    inspectionStatus: string;

    @Column('varchar', { name: 'shade_inpsection_status', length: 50 })
    shadeInspectionStatus: string;

    @Column('varchar', { name: 'relaxation_status', length: 50 })
    relaxationStatus: string;

    @Column('varchar', { name: 'gsm_status', length: 50 })
    gsmStatus: string;    

    @Column('int', { name: 'w_pick_list_id' })
    wPickListId: number;

    @Column('varchar', { name: 'location_code', length: 50 })
    locationCode: string;

    @Column('varchar', { name: 'QR_code', length: 100 })
    QRCode: string;

    @Column('enum', {
        name: 'status',
        enum: RmwStatusEnum
    }) 
    status: RmwStatusEnum;
}
