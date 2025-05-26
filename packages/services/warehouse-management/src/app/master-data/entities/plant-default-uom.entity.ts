import { FabricUOM, PhItemCategoryEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('plant_default_uom')
export class PlantDefaultUomEntity extends AbstractEntity {
    @Column({
        type: 'enum',
        name: 'item_category',
        enum: PhItemCategoryEnum
    })
    itemCategory: PhItemCategoryEnum;

    @Column({
        type: 'enum',
        name: 'plant_level_uom',
        enum: FabricUOM
    })
    plantLevelUom: FabricUOM;

    @Column({
        name: 'valid_from',
        type: 'timestamp',
        nullable: true
    })
    validFrom: Date;

    @Column({
        name: 'valid_to',
        type: 'timestamp',
        nullable: true
    })
    validTo: Date;
}