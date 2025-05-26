import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_ratio_attr')
export class PoRatioAttrEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("bigint", { name: "po_ratio_id", nullable: false, comment: '' })
    poRatioId: number;

    @Column("smallint", { name: "ratio_code", nullable: true, comment: ''})
    ratioCode: string;

    @Column("varchar", { length: "50", name: "ratio_name", nullable: true, comment: ''})
    ratioName: string;

    @Column("varchar", { length: "50", name: "ratio_desc", nullable: true, comment: ''})
    ratioDesc: string;
}
