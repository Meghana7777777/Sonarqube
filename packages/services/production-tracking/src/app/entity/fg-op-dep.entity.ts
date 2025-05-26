import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum, ProcTypePrefixEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('fg_op_dep')
export class FgOpDepEntity {

    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;
    
    @Column('boolean', { default: true, name: 'is_active' })
    isActive: boolean;

    @Column("mediumint", { name: "fg_number", nullable: false, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "osl_id", nullable: false, comment: 'PK of the order sub line' })
    oslId: number;

    @Column("varchar", { length: "12", name: "op_group", nullable: false, comment: '' })
    opGroup: string;

    @Column("smallint", { name: "op_code", nullable: false, comment: 'This is the input and output operation of an op group' })
    opCode: number;

    @Column("boolean", { name: "r_from_inv", default: false, comment: 'Updated to true after we have received this FG from the inventory' })
    rFromInv: boolean;

    @Column("boolean", { name: "op_completed", default: false, comment: '' })
    opCompleted: boolean;

    @Column("boolean", { name: "is_rejected", default: false, comment: '' })
    isRejected: boolean;

    @Column("varchar", { length: 4, name: "proc_type", default: false, comment: 'The processing type prefix' })
    procType: ProcessTypeEnum;

    @Column("bigint", { name: "proc_serial", nullable: false, comment: 'Will update whenever a job is generated for the process type' })
    procSerial: number;

    @Column("int", { name: "op_seq_ref_id", nullable: false, comment: 'The PK of the OpSequenceRefEntity' })
    opSeqRefId: number;
}

