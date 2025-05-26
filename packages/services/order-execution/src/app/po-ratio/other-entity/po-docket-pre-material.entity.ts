import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('po_docket-pre-material')
export class PoDocketPreMaterialEntity{
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;

    @Column("varchar", { length: 100, name: "docket_number", nullable: true, comment: '' })
    docketNumer: string;

    @Column("varchar", { length: 100, name: "item_code", nullable: true,  comment: ''})
    itemCode: string;

    @Column("varchar", { length: 100, name: "quantity", nullable: true, comment: '' })
    quantity: string;

    @Column("varchar", { length: 100, name: "roll_ref", nullable: true, comment: '' })
    roleRef: string;

    @Column("varchar", { length: 100, name: "roll_no", nullable: true, comment: '' })
    rollNo: string;


}