import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { MaterialLockEnum } from "@xpparel/shared-models";

@Entity('po_material_lock')
export class PoMaterialLockEntity  extends AbstractEntity {

    @Column("varchar", { length: 100, name: "item_code", nullable: false, comment: '' })
    itemCode: string;

    @Column("varchar", { name: "lock_exp_time", nullable: false, comment: '' })
    lockExpiryTime: string;

    @Column("tinyint", { name: "lock_status", nullable: false, comment: '' })
    lockStatus: MaterialLockEnum;

}