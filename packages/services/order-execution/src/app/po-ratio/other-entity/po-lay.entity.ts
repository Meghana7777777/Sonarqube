import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_lay')
export class PoLayEntity extends AbstractEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;
  
    @Column("varchar", { length: 100, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;

    @Column("varchar", { length: 100, name: "plies", nullable: true, comment: '' })
    plies: string;

    @Column('enum',{ name:"cut_status",
     // enum: RequiredEnum
     })
    cutStatus:string;

    @Column("varchar", { length: 100, name: "lay_start_time", nullable: true, comment: '' })
    layStartTime: string;
  
    @Column("varchar", { length: 100, name: "lay_end_time", nullable: true, comment: '' })
    layEndTime: string;

    @Column('enum',{ name:"lay_ins_status",
    // enum: RequiredEnum
    })
   layInsStatus:string;

    @Column("varchar", { length: 100, name: "lay_ins_person", nullable: true, comment: '' })
    layInsPreson: string;

    @Column("varchar", { length: 100, name: "lay_number", nullable: true, comment: '' })
    layNumber: string;

    @Column('enum',{ name:"lay_progress",
    // enum: RequiredEnum
    })
   layProgress:string;


}