import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('fg')
export class FgEntity extends AbstractEntity {

    @Column("bigint", { name: "fg_number", nullable: true, comment: '' })
    fgNumber: number;

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "osl_id", nullable: true, comment: '' })
    oslId: number;

}
