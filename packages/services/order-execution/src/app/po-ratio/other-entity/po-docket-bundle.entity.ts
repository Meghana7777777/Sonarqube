import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_docket_bundle')
export class PoDocketBundleEntity extends AbstractEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;
  
    @Column("varchar", { length: 100, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;
  
    @Column("varchar", { length: 100, name: "bundle_number", nullable: true,  comment: ''})
    bundleNumber: string;
  
    @Column("varchar", { length: 100, name: "color", nullable: true, comment: '' })
    color: string;
  
    @Column("varchar", { length: 100, name: "size", nullable: true, comment: '' })
    size: string;

    @Column("varchar", { length: 100, name: "quantity", nullable: true, comment: '' })
    quantity: string;
  
    @Column("varchar", { length: 100, name: "panel_start_number", nullable: true, comment: '' })
    panelStartNumber: string;

    @Column("varchar", { length: 100, name: "panel_end_number", nullable: true, comment: '' })
    panelEndNumber: string;


}