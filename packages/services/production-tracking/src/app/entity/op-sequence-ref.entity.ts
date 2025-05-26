import { Entity, Column } from "typeorm";
import { ProcessTypeEnum, ProcTypePrefixEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

@Entity('op_sequence_ref')
export class OpSequenceRefEntity extends AbstractEntity {

    @Column("varchar", { length: "20", name: "mo_no", nullable: true, comment: '' })
    moNo: string;

    @Column("varchar", { length: "30", name: "prod_name", nullable: false, comment: '' })
    prodName: string;

    @Column("varchar", { length: "30", name: "prod_code", nullable: false, comment: '' })
    prodCode: string;

    @Column("varchar", { length: "30", name: "fg_color", nullable: false, comment: '' })
    fgColor: string;

    @Column("varchar", { length: "20", name: "style", nullable: false, comment: '' })
    style: string;
}
