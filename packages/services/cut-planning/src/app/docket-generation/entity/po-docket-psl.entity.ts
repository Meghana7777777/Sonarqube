import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocPanelGenStatusEnum } from "@xpparel/shared-models";

@Entity('po_docket_psl')
export class PoDocketPslEntity extends AbstractEntity {
    
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("varchar", { name: "docket_number", nullable: false, comment: '', default: null })
    docketNumber: string;
    
    @Column("bigint", { name: "psl_id", nullable: false,  comment: 'The PSL Id in oms'})
    pslId: number;
    
    @Column("smallint", { name: "quantity", nullable: false, comment: '' })
    quantity: number;

    @Column("smallint", { name: "bundled_quantity", nullable: false, comment: 'This will update after the bundling operation' })
    bundleQuantity: number;

    @Column("varchar", { name: "sub_process_name", nullable: false, comment: '', default: null })
    subProcessName: string;
    
}
