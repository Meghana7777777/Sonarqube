import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_docket')
export class PoDocketEntity extends AbstractEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;
  
    @Column("varchar", { length: 100, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;
  
    @Column("varchar", { length: 100, name: "plies", nullable: true,  comment: ''})
    plies: string;
  
    @Column("varchar", { length: 100, name: "plan_bundles", nullable: true, comment: '' })
    ratioDesc: string;
  
    @Column("varchar", { length: 100, name: "cg_name", nullable: true, comment: '' })
    cgName: string;

    @Column("varchar", { length: 100, name: "item_code", nullable: true, comment: '' })
    itemCode: string;
  
    @Column("varchar", { length: 100, name: "fabric_category", nullable: true, comment: '' })
    fabricCategory: string;

    @Column("varchar", { length: 100, name: "material_requirement", nullable: true, comment: '' })
    materialRequirement: string;
  
    @Column("varchar", { length: 100, name: "docket_sequence", nullable: true, comment: '' })
    docketSequence: string;

    @Column("varchar", { length: 100, name: "po_ratio_fabric_id", nullable: true, comment: '' })
    poRatioFabricId: string;
    
    @Column({ type: 'bigint', name: 'p_order_line_id', nullable: false  })
    pOrderLineId: number;


}