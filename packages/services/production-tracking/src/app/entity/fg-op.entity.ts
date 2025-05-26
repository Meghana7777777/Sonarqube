import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('fg_op_old')
export class FgOpEntity_OLD extends AbstractEntity {

    @Column("bigint", { name: "fg_number", nullable: false, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "fg_sub_number", nullable: false, comment: '' })
    fgSubNumber: number;

    @Column("bigint", { name: "osl_id", nullable: false, comment: '' })
    oslId: number;

    @Column("bigint", { name: "proc_serial", nullable: false, comment: 'Will update whenever a proc serial is generated for the process type' })
    procSerial: number;

    @Column("varchar", { length: "5", name: "proc_type", nullable: true, comment: '' })
    procType: ProcessTypeEnum;

    @Column("smallint", { name: "op_code", nullable: false, comment: 'This is the input and output operation of an op group' })
    opCode: number;

    @Column("varchar", { length: "5", name: "op_group", nullable: true, comment: '' })
    opGroup: string;

    @Column("boolean", { name: "op_completed", default: false, comment: '' })
    opCompleted: boolean;

    @Column("tinyint", { name: "op_order", nullable: true, comment: '' })
    opOrder: number;
    
    @Column("tinyint", { name: "op_group_order", default: 0, comment: '' })
    opGroupOrder: number;
    
    @Column("boolean", { name: "is_rejected", default: false, comment: '' })
    isRejected: boolean;

    @Column("bigint", { name: "allocation_id", default: 0, comment: 'The allocation id from the INVS that gets updated' })
    allocationId: number;
}
