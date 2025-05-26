import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocPanelGenStatusEnum } from "@xpparel/shared-models";

// Dont maintain any foreign keys. Only maintain reference keys for optimal performance
@Entity('po_docket_bundle')
export class PoDocketBundleEntity extends AbstractEntity {
    
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("bigint", { name: "docket_number", nullable: true, comment: '', default: null })
    docketNumber: string;
    
    // Auto inc number under a docket. .i.e irrespective of size, this will start from 1 and max will be equal to the SUM(ratios of all sizes)
    @Column("int", { name: "bundle_number", nullable: false,  comment: ' Auto inc number under a docket + component .i.e irrespective of size, this will start from 1 and max will be equal to the SUM(ratios of all sizes) for any component'})
    bundleNumber: number;
    
    @Column("varchar", { length: '20', name: "component", nullable: false, comment: '' })
    component: string;

    @Column("varchar", { length: 100, name: "product_name", nullable: true, comment: '' })
    productName: string;

    @Column("varchar", { length: 100, name: "color", nullable: true, comment: '' })
    color: string;
    
    @Column("varchar", { length: 15, name: "size", nullable: false, comment: '' })
    size: string;

    @Column("int", { name: "quantity", nullable: false, comment: '' })
    quantity: number;

    @Column("tinyint", { name: "panel_gen_status", nullable: false, default: DocPanelGenStatusEnum.OPEN, comment: '' })
    panelGenStatus: DocPanelGenStatusEnum;
    
    @Column("int", { name: "panel_start_number", nullable: true, default: 0, comment: '' })
    panelStartNumber: number;

    @Column("int", { name: "panel_end_number", nullable: true, default: 0, comment: '' })
    panelEndNumber: number;

    // This will only hold OPEN and INPROGRESS
    @Column("tinyint", { name: "cut_status", nullable: false, default: CutStatusEnum.OPEN, comment: 'This will only hold 0=OPEN and 1=INPROGRESS' })
    cutStatus: CutStatusEnum;
}