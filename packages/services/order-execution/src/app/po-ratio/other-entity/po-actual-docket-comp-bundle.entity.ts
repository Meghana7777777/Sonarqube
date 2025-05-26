import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('po_actual_docket_comp_bundle')
export class PoActualDocketCompBundleEntity{
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "inventory_quantity", nullable: true, comment: '' })
    inventoryQuantity: string;
  
    @Column("varchar", { length: 100, name: "component_name", nullable: true, comment: '' })
    componentName: string;

    @Column("varchar", { length: 100, name: "po_actual_docket_bundle", nullable: true, comment: '' })
    poActualDocketBundle: string;


}