import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_docket_group')
export class PoDocketGroupEntity extends AbstractEntity {
    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("bigint", { name: "po_ratio_id", nullable: false, comment: '' })
    poRatioId: number;

    // Ratio ID + auto inc number within a raito while generating the dockets for a Ratio
    @Column("varchar", { name: "docket_group", nullable: false, comment: ''})
    docketGroup: string; 
}

// ratio plies: 20

// R1 F1 15
//    F2 15


// DG1 -> D1 
//     -> D2
// DG2
