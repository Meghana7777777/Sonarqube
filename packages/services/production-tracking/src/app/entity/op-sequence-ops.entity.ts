import { Entity, Column } from "typeorm";
import { ProcessTypeEnum, ProcTypePrefixEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('op_sequence_ops')
export class OpSequenceOpsEntity extends AbstractEntity {

    @Column("varchar", { length: "20", name: "mo_no", nullable: true, comment: '' })
    moNo: string;
    
    @Column("int", { name: "op_seq_ref_id", nullable: false, comment: 'The PK of the OpSequenceRefEntity' })
    opSeqRefId: number;

    @Column("varchar", { length: "20", name: "op_codes", nullable: false, comment: '' })
    opCode: string;

    @Column("varchar", { length: "15", name: "op_group", nullable: true, comment: '' })
    opGroup: string;
    
    @Column("bigint", { name: "smv", default: 0, comment: '' })
    smv: number;

    @Column("tinyint", { name: "op_order", default: 0, comment: '' })
    opOrder: number;
}
