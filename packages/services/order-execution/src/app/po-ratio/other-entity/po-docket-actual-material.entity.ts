import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('po_docket_actual_material')
export class PoDocketActualMaterialEntity{
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;
  
    @Column("varchar", { length: 100, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;

    @Column("varchar", { length: 100, name: "ite_code", nullable: true, comment: '' })
    itemCode: string;
  
    @Column("varchar", { length: 100, name: "material_received_quantity", nullable: true, comment: '' })
    materialReceivedQuantity: string;

    @Column("varchar", { length: 100, name: "roll_ref", nullable: true, comment: '' })
    rollRef: string;
  
    @Column("varchar", { length: 100, name: "roll_no", nullable: true, comment: '' })
    rollNo: string;

    @Column("varchar", { length: 100, name: "lot_ref", nullable: true, comment: '' })
    lotRef: string;
  
    @Column("varchar", { length: 100, name: "lot_no", nullable: true, comment: '' })
    lotNo: string;




}