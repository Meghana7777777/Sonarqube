import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, LayingStatusEnum, TaskStatusEnum, WhAckEnum } from "@xpparel/shared-models";

@Entity('po_adb_roll')
export class PoAdbRollEntity extends AbstractEntity {
    
    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // the laying id
    @Column("bigint", { name: "po_docket_lay_id", nullable: false, comment: 'The reference key of po_docket_lay' })
    poDocketLayId: number;

    // Actual Docket Bundle Id
    @Column("bigint", {name: "adb_id", nullable: false, comment: 'The actual docket bundle id' })
    adbId: number;

    @Column("bigint", {name: "roll_id", nullable: false, comment: '' })
    rollId: number;

    @Column("varchar", { length: 2, name: "shade", nullable: false, comment: 'The shade of the bundle' })
    shade: string;
    
    @Column("int", {name: "plies", nullable: false, comment: '' })
    plies: number;

    @Column("int", {name: "roll_seq", nullable: false, comment: '' })
    rollSeq: number;
    
}



