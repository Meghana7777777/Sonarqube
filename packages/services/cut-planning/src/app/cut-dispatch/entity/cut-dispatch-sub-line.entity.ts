import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

// This is as of now is just a helper table that stores all the docket, cut and lay information in one table for easy reference for the dispatches.
// NEVER BUILD ANY LOGICS USING THIS TABLE
@Entity('cut_dispatch_sub_line')
export class CutDispatchSubLineEntity extends AbstractEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: 'The ref id of the PO' })
    poSerial: number;

    // PK of the cut dispatch request
    @Column("bigint", { name: "cut_dr_id", nullable: false, comment: 'The cut dispatch request id' })
    cutDrId: number;

    // Ref key of the po serial
    @Column("mediumint", { name: "cut_dl_id", nullable: false, comment: 'The PK of the Cut dispacth line' })
    cutDispatchLineId: number;

    // docket number
    @Column("smallint", { name: "cut_number", nullable: false, comment: 'The cut number' })
    cutNumber: number;

    // docket number
    @Column("varchar", { length: 20, name: "docket_number", nullable: false, comment: 'The docket number' })
    docketNumber: string;
    
    @Column("varchar", { length: 10, name: "po_docket_lay_id", nullable: false, comment: 'The laying id' })
    poDocketLayId: number;

    @Column("smallint", { name: "main_doc", nullable: false, comment: 'The boolean for the main docket' })
    mainDoc: boolean;

    @Column("smallint", { name: "total_shade_bundles", nullable: false, comment: 'The shade bundles under the lay' })
    totalShadeBundles: number;

    @Column("int", { name: "quantity", nullable: false, comment: 'The total quantity of the lay' })
    quantity: number;

}

