import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ContainerSubItemReadinessEnum } from "@xpparel/shared-models";


@Entity('d_set_sub_item_container_map')
export class DSetSubItemContainerMapEntity extends AbstractEntity {

    @Column("bigint", { name: "d_set_id", nullable: false, comment: 'PK of the d_set_sub_item' })
    dSetId: number;

    @Column("bigint", { name: "d_set_item_id", nullable: false, comment: 'PK of the d_set_item_id' })
    dSetItemId: number;

    @Column("bigint", { name: "d_set_sub_item_id", nullable: false, comment: 'PK of the d_set_sub_item' })
    dSetSubItemId: number;

    @Column("varchar", { name: "barcode", length: "30", nullable: false, comment: 'Barcode of the d_set_sub_item' })
    barcode: string;

    @Column("bigint", { name: "d_set_container_id", nullable: false, comment: 'PK of the d_set_container' })
    dSetContainerId: number;

    // TODO
    @Column("varchar", { name: "current_stage", length: 5, nullable: false, comment: 'The current stage for  dispatch' })
    currentStage: ContainerSubItemReadinessEnum;

}