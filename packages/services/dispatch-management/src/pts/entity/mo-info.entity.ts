import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('mo_info')
export class MoInfoEntity extends AbstractEntity {

    @Column("bigint", { name: "osl_id", nullable: true, comment: '' })
    oslId: number;

    @Column("varchar", { length: "255", name: "color", nullable: true, comment: '' })
    color: string;

    @Column("varchar", { length: "255", name: "size", nullable: true, comment: '' })
    size: string;

    @Column("varchar", { length: "255", name: "del_date", nullable: true, comment: '' })
    delDate: string;

    @Column("varchar", { length: "255", name: "co", nullable: true, comment: '' })
    co: string;

    @Column("varchar", { length: "255", name: "destination", nullable: true, comment: '' })
    destination: string;

    @Column("varchar", { length: "255", name: "vpo", nullable: true, comment: '' })
    vpo: string;

    @Column("varchar", { length: "255", name: "mo_no", nullable: true, comment: '' })
    moNo: string;

    @Column("varchar", { length: "255", name: "product_name", nullable: true, comment: '' })
    productName: string;

    @Column("varchar", { length: "255", name: "mo_number", nullable: true, comment: '' })
    moNumber: string;

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    style: string;
    pcd: string;
    moLineNo: string;
    buyerPo: string;
}
