import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('psl_info')
export class PslInfoEntity extends AbstractEntity {

    @Column("bigint", { name: "psl_id", nullable: false, comment: '' })
    pslId: number;

    @Column("varchar", { length: "50", name: "color", nullable: true, comment: '' })
    color: string;

    @Column("varchar", { length: "10", name: "size", nullable: true, comment: '' })
    size: string;

    @Column("varchar", { length: "15", name: "del_date", nullable: true, comment: '' })
    delDate: string;

    @Column("varchar", { length: "15", name: "co", nullable: true, comment: '' })
    co: string;

    @Column("varchar", { length: "30", name: "destination", nullable: true, comment: '' })
    destination: string;

    @Column("varchar", { length: "30", name: "vpo", nullable: true, comment: '' })
    vpo: string;

    @Column("varchar", { length: "20", name: "mo_no", nullable: true, comment: '' })
    moNo: string;

    @Column("varchar", { length: "50", name: "product_name", nullable: true, comment: '' })
    productName: string;

    @Column("varchar", { length: "50", name: "product_code", nullable: true, comment: '' })
    productCode: string;

    @Column("varchar", { length: "10", name: "ref_number", nullable: true, comment: '' })
    refNumber: string;

    @Column("varchar", { length: "50", name: "style", nullable: true, comment: '' })
    style: string;

    @Column("varchar", { length: "15", name: "pcd", nullable: true, comment: '' })
    pcd: string;

    @Column("varchar", { length: "20", name: "mo_line_no", nullable: true, comment: '' })
    moLineNo: string;

    @Column("varchar", { length: "50", name: "buyer_po", nullable: true, comment: '' })
    buyerPo: string;

    @Column("mediumint", { name: "quantity", nullable: false, comment: '' })
    quantity: number;
}
