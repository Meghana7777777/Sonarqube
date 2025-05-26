import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

// We will create records into this table when we do the issuance from the inventory system.
@Entity('fg_dep_bundle')
export class FgDepBundleEntity {

    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;
    
    @Column('boolean', { default: true, name: 'is_active' })
    isActive: boolean;
    
    @Column("bigint", { name: "osl_id", nullable: true, comment: '' })
    oslId: number;

    @Column("bigint", { name: "fg_number", nullable: true, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "proc_serial", nullable: true, comment: '' })
    procSerial: number;

    @Column("varchar", { length: "5", name: "proc_type", nullable: true, comment: '' })
    procType: ProcessTypeEnum;

    @Column("varchar", { length: "5", name: "op_code", nullable: true, comment: '' })
    opCode: number;

    @Column("varchar", { length: "5", name: "dep_op_code", nullable: true, comment: '' })
    depOpCode: number;

    @Column("bigint", { name: "dep_proc_serial", nullable: true, comment: '' })
    depProcSerial: number;

    @Column("bigint", { name: "osl_id", nullable: true, comment: 'Dep proc type' })
    depProcType: number;

    @Column("bigint", { name: "dep_fg_number", nullable: true, comment: 'Dep fg number' })
    depFg: number;

}
