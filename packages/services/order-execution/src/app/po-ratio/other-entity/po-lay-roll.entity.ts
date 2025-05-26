import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('po_lay_roll')
export class PoLayRollEntity{
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;
  
    @Column("varchar", { length: 100, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;

    @Column("varchar", { length: 100, name: "plies", nullable: true, comment: '' })
    plies: string;

    @Column("varchar", { length: 100, name: "roll_no", nullable: true, comment: '' })
    rollNo: string;
  
    @Column("varchar", { length: 100, name: "item_code", nullable: true, comment: '' })
    itemCode: string;

    @Column("varchar", { length: 100, name: "shade", nullable: true, comment: '' })
    shade: string;

    @Column("varchar", { length: 100, name: "lay_start_time", nullable: true, comment: '' })
    layStartTime: string;
  
    @Column("varchar", { length: 100, name: "lay_end_time", nullable: true, comment: '' })
    layEndTime: string;

    @Column("varchar", { length: 100, name: "end_bits", nullable: true, comment: '' })
    endBits: string;

    @Column("varchar", { length: 100, name: "po_lay_id", nullable: true, comment: '' })
    poLayId: string;
  
    @Column("varchar", { length: 100, name: "po_docket_actual_material", nullable: true, comment: '' })
    poDocketActualMaterial: string;



}