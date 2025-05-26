import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum } from "@xpparel/shared-models";

@Entity('bank_req_bun_track')
export class BankRequestBundleTrackEntity extends AbstractEntity {

    @Column("bigint", { name: "sew_serial", nullable: true, comment: '' })
    sewSerial: number;

    @Column("bigint", { name: "br_id", nullable: true, comment: '' })
    brId: number;

    @Column("bigint", { name: "brl_id", nullable: true, comment: '' })
    brlId: number;

    @Column("bigint", { name: "brj_id", nullable: true, comment: '' })
    brjId: number;

    @Column("varchar", { length: "255", name: "curr_job", nullable: true, comment: '' })
    currJob: string;

    @Column("varchar", { length: "255", name: "bundle", nullable: true, comment: '' })
    bundle: string;

    @Column("bigint", { name: "r_qty", nullable: true, comment: '' })
    rQty: number;

    @Column("bigint", { name: "pre_jg", nullable: true, comment: '' })
    preJg: number;

    @Column("varchar", { length: "255", name: "component", nullable: true, comment: '' })
    component: string;

    @Column("boolean", { name: "is_panel", nullable: true, comment: '' })
    isPanel: boolean;

}
