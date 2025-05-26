import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('roll_attr')
export class RollAttrEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("varchar", { length: 20, name: "roll_barcode", nullable: false, comment: '' })
    rollBarcode: string;

    @Column("varchar", { length: 20, name: "roll_no", nullable: true, comment: ''})
    rollNo: string;

    @Column("varchar", { length: "20", name: "lot_no", nullable: true, comment: ''})
    lotNo: string;

    @Column("varchar", { length: "5", name: "shade", nullable: true, comment: ''})
    shade: string;

    @Column("varchar", { length: "10", name: "shrinkage", nullable: true, comment: ''})
    shrinkage: string;

    @Column("varchar", { length: "5", name: "width", nullable: true, comment: ''})
    width: string;
}
