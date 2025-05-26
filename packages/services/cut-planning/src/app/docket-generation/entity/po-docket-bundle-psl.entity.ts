import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocPanelGenStatusEnum } from "@xpparel/shared-models";

// Dont maintain any foreign keys. Only maintain reference keys for optimal performance
@Entity('po_docket_bundle_psl')
export class PoDocketBundlePslEntity extends AbstractEntity {
    
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("bigint", { name: "docket_number", nullable: true, comment: '', default: null })
    docketNumber: string;
    
    // Auto inc number under a docket. .i.e irrespective of size, this will start from 1 and max will be equal to the SUM(ratios of all sizes)
    @Column("int", { name: "bundle_number", nullable: false,  comment: ' Auto inc number under a docket + component .i.e irrespective of size, this will start from 1 and max will be equal to the SUM(ratios of all sizes) for any component'})
    bundleNumber: number;

    @Column("bigint", { name: "psl_id", nullable: false,  comment: 'The PSL Id in oms'})
    pslId: number;

    @Column("int", { name: "quantity", nullable: false, comment: '' })
    quantity: number;
}
