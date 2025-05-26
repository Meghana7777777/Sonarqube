import { Entity, Column } from "typeorm";
import { OrderTypeEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('osl_info')
export class OslInfoEntity extends AbstractEntity {

    @Column("bigint", { name: "osl_id", nullable: false, comment: '' })
    oslId: number;

    @Column("varchar", { length: "50", name: "color", nullable: true, comment: '' })
    color: string;

    @Column("varchar", { length: "10", name: "size", nullable: true, comment: '' })
    size: string;

    @Column("date", { name: "del_date", nullable: true, comment: '' })
    delDate: string;

    @Column("varchar", { length: "15", name: "co", nullable: true, comment: '' })
    co: string;

    @Column("varchar", { length: "30", name: "destination", nullable: true, comment: '' })
    destination: string;

    @Column("varchar", { length: "30", name: "vpo", nullable: true, comment: '' })
    vpo: string;

    @Column("varchar", { length: "20", name: "mo_no", nullable: true, comment: '' })
    moNo: string;

    @Column("varchar", { length: "50", name: "prod_name", nullable: true, comment: '' })
    productName: string;

    @Column("varchar", { length: "50", name: "prod_code", nullable: true, comment: '' })
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

    @Column("mediumint", { name: "consumed_qty", nullable: false, comment: '', default: 0 })
    consumedQty: number;

    @Column("char", { name: "oq_type", length: 2, nullable: false, comment: '' })
    oqType: OrderTypeEnum;

}
