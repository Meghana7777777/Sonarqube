import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('fg_op')
export class FgOpEntity extends AbstractEntity {

    @Column("bigint", { name: "fg_number", nullable: true, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "fg_sub_number", nullable: true, comment: '' })
    fgSubNumber: number;

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "osl_id", nullable: true, comment: '' })
    oslId: number;

    @Column("varchar", { length: "255", name: "op_code", nullable: true, comment: '' })
    opCode: string;

    @Column("boolean", { name: "op_completed", nullable: true, comment: '', default: false })
    opCompleted: boolean;

    @Column("boolean", { name: "is_rejected", nullable: true, comment: '', default: false })
    isRejected: boolean;
}
