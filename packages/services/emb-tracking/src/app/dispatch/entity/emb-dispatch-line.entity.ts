import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

// The dispacth request will be created against to the emb lines (i.e layings)
@Entity('emb_dispatch_line')
export class EmbDispatchLineEntity extends AbstractEntity {

    // PK of the emb dispatch request
    @Column("bigint", { name: "emb_dr_id", nullable: false, comment: 'The emb dispatch request id' })
    embDrId: number;

    @Column("varchar", { length: 20, name: "emb_job_number", nullable: false, comment: 'The emb job number' })
    embJobNumber: string;

    // docket number
    @Column("varchar", { length: 10, name: "emb_parent_job_ref", nullable: false, comment: 'The docket number for which this emb is created' })
    embParentJobRef: string;

    // the laying id
    @Column("varchar", { length: 10, name: "emb_actual_job_ref", nullable: false, comment: 'The actual docket number (lay id) for which this emb is created' })
    embActualJobRef: string;

    // The PK of the emb-line entity
    @Column("bigint", { name: "emb_line_id", nullable: false, comment: 'The emb line id' })
    embLineId: number;
}
