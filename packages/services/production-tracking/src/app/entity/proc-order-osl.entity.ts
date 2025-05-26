import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

/**
 * Here we have the osl ids for a proc serial.
 * 1 osl  can have multiple records here based on the FG ranges
 * 
 */
@Entity('proc_order_osl')
export class ProcOrderOslEntity extends AbstractEntity {

    @Column("bigint", { name: "osl_id", nullable: false, comment: '' })
    oslId: number;

    @Column("bigint", { name: "proc_serial", nullable: false, comment: '' })
    procSerial: number;

    @Column("varchar", { name: "proc_type", nullable: false, comment: '' })
    procType: ProcessTypeEnum;

    @Column("bigint", { name: "quantity", nullable: false, comment: 'qty of the osl for this specific processing order. Usually its the complete osl qty' })
    quantity: number;

    @Column("boolean", { name: "fg_op_updated", nullable: false, comment: 'Turns to true after the fg dep table is updated for the  osl and proc serial' })
    fgOpUpdated: boolean;

    @Column("boolean", { name: "fg_dep_updated", nullable: false, comment: 'Turns to true after the fg dep table is updated for the  osl and proc serial' })
    fgDepUpdated: boolean;

    @Column("boolean", { name: "mo_bundle_updated", nullable: false, comment: 'Turns to true after the mo bundle table is updated for the  osl and proc serial' })
    moBundleUpdated: boolean;

    @Column("boolean", { name: "job_mapped", nullable: true, comment: 'Will turn to true if the jobs for the proc serial and osl are mapped' })
    jobMapped: boolean;
}


