import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { FGItemCategoryEnum, InsInspectionRollSelectionTypeEnum, PhItemCategoryEnum } from "@xpparel/shared-models";


@Entity('ins_config')
export class InsConfigEntity extends AbstractEntity {
    @Column('varchar', { name: 'item_category' })
    itemCategoryType: PhItemCategoryEnum | FGItemCategoryEnum

    @Column('varchar', { name: 'ins_type_l1', length: 20, comment: 'storing FabricInspectionRequestCategoryEnum' })
    insTypeI1: string;

    @Column('varchar', { name: 'ins_type_l2', length: 20, default: null })
    insTypeI2: string;

    @Column("decimal", { name: "default_perc", precision: 5, scale: 2, default: 0, comment: 'default percentage of items selection' })
    defaultPerc: number;

    @Column('boolean', { name: 'material_ready', default: false, comment: '' })
    materialReady: boolean;

    @Column('boolean', { name: 'selected', default: false, comment: '' })
    selected: boolean;

    @Column('varchar', { name: 'supplier_code', comment: '' })
    supplierCode: string;

    @Column('varchar', { name: 'buyer_id', comment: '' })
    buyerCode: string;

    @Column('enum', { name: 'insspection_selection_type', enum: InsInspectionRollSelectionTypeEnum })
    insspectionSelectionType: InsInspectionRollSelectionTypeEnum
}