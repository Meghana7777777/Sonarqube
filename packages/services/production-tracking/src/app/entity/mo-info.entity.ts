import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('mo_info')
export class MoInfoEntity extends AbstractEntity {

    @Column("varchar", { length: "30", name: "mo_number", nullable: true, comment: '' })
    moNumber: string;

    @Column("boolean", { name: "fgs_created", nullable: true, comment: 'Will turn to true if the FGs are created for this osl' })
    fgsCreated: string;

    @Column("boolean", { name: "fg_ops_created", nullable: true, comment: 'Will turn to true if the FG OPs are created for this osl' })
    fgOpsCreated: string;

    @Column("boolean", { name: "fg_dep_created", nullable: true, comment: 'Will turn to true if the FG OP DEPs are created for this osl' })
    fgDepCreated: string;
}
