import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { OrderTypeEnum } from "@xpparel/shared-models";

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

    @Column("char", { name: "oq_type", length: 2, nullable: false, comment: '' })
    oqType: OrderTypeEnum;

    @Column("mediumint", { name: "fg_start_no", nullable: false, comment: '' })
    fgStartNo: number;

    @Column("mediumint", { name: "fg_end_no", nullable: false, comment: '' })
    fgEndNo: number;

    @Column("boolean", { name: "fg_created", default: false, comment: 'Will turn to true if the FGs are created for this osl' })
    fgCreated: boolean;

    @Column("boolean", { name: "fg_ops_created", default: false, comment: 'Will turn to true if the FG OPs are created for this osl' })
    fgOpsCreated: boolean;

    @Column("boolean", { name: "fg_dep_created", default: false, comment: 'Will turn to true if the FG OP DEPs are created for this osl' })
    fgDepCreated: boolean;

    @Column("boolean", { name: "bun_created", default: false, comment: 'Will turn to true if the bundles are created for this osl' })
    bunCreated: boolean;

    @Column("boolean", { name: "bun_fg_created", default: false, comment: 'Will turn to true if the bundles FG are created for this osl' })
    bunFgCreated: boolean;
}
