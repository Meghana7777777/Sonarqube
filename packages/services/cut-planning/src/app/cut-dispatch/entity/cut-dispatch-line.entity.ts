import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

// The dispacth request will be created against to the emb lines (i.e layings)
@Entity('cut_dispatch_line')
export class CutDispatchLineEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    // PK of the cut dispatch request
    @Column("bigint", { name: "cut_dr_id", nullable: false, comment: 'The cut dispatch request id' })
    cutDrId: number;

    // docket number
    @Column("smallint", { name: "cut_number", nullable: false, comment: 'The cut number' })
    cutNumber: number;

    @Column("varchar", { name: "bag_number", nullable: false, comment: 'The bag number in the form of a CSV' })
    bagNumber: string;
}

