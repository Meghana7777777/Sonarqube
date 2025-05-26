import { Entity, Column } from "typeorm";
import { ProcessTypeEnum, ProcTypePrefixEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('op_sequence_opg')
export class OpSequenceOpgEntity extends AbstractEntity {

    @Column("varchar", { length: "20", name: "mo_no", nullable: true, comment: '' })
    moNo: string;
    
    @Column("int", { name: "op_seq_ref_id", nullable: false, comment: 'The PK of the OpSequenceRefEntity' })
    opSeqRefId: number;

    @Column("varchar", { length: "40", name: "op_codes", nullable: false, comment: '' })
    opCodes: string;

    @Column("varchar", { length: "12", name: "op_group", nullable: false, comment: '' })
    opGroup: string;

    @Column("varchar", { length: "30", name: "pre_op_groups", nullable: false, comment: '' })
    preOpGroups: string;

    @Column("varchar", { length: "30", name: "next_op_groups", nullable: true, comment: '' })
    nextOpGroups: string;

    @Column("varchar", { length: "5", name: "routing_group", nullable: false, comment: '' })
    routingGroup: string;

    @Column("varchar", { length: "4", name: "proc_type", nullable: true, comment: '' })
    procType: ProcessTypeEnum;

    @Column("varchar", { length: "15", name: "sub_proc_name", nullable: true, comment: '' })
    subProcName: string;

    @Column("varchar", { length: "15", name: "p_fg_sku", nullable: true, comment: '' })
    pFgSku: string;

    @Column("varchar", { length: "15", name: "sp_fg_sku", nullable: true, comment: '' })
    spFgSku: string;

    @Column("boolean", { name: "qms_check", default: false, comment: '' })
    qmsCheck: boolean;

    @Column("bigint", { name: "smv", default: 0, comment: '' })
    smv: number;

    @Column("tinyint", { name: "op_group_order", default: 0, comment: '' })
    opGroupOrder: number;
}
