import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('po_lay_downtime')
export class PoLayDowntimeEntity{
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;
  
    @Column("varchar", { length: 100, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;

    @Column("varchar", { length: 100, name: "po_lay_id", nullable: true, comment: '' })
    poLayId: string;

    @Column("varchar", { length: 100, name: "break_start_at", nullable: true, comment: '' })
    breakStartAt: string;
  
    @Column("varchar", { length: 100, name: "break_end_at", nullable: true, comment: '' })
    breakEndAt: string;

    @Column("varchar", { length: 100, name: "reason", nullable: true, comment: '' })
    reason: string;


}