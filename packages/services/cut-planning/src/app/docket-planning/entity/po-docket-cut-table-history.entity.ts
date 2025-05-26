import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "@xpparel/shared-models";

@Entity('po_docket_cut_table_history')
export class PoDocketCutTableHistoryEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;

    // Ref request number
    @Column("varchar", { length: 20, name: "request_number", nullable: false, comment: '' })
    requestNumber: string;

    @Column("varchar", { length: 20, name: "docket_number", nullable: false, comment: '' })
    docketNumber: string;

    @Column("varchar", { length: 20, name: "from_resource_id", nullable: false, comment: '' })
    formResourceId: string;

    @Column("varchar", { length: 20, name: "to_resource_id", nullable: false, comment: '' })
    toResourceId: string;

}