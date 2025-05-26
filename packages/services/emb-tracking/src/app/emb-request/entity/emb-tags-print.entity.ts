
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

// The bundle level records
@Entity('emb_tags_print')
export class EmbTagsPrintEntity extends AbstractEntity {

    @Column("bigint", { name: "emb_line_id", nullable: false, comment: 'The OK id of the Emb Line entity' })
    embLineId: number;

    @Column("tinyint", { name: "action", nullable: false, default: false, comment: 'The action .i.e print / release of the barcodes for the laying 0-released 1-printed' })
    action: boolean;

}


