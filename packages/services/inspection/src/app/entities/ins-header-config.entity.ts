import { Column, Entity } from "typeorm";
import { InsInspectionRollSelectionTypeEnum, PhItemCategoryEnum } from "@xpparel/shared-models";
import { AbstractEntity } from "../../database/common-entities";

export enum InsTypeEnum {
    FABRIC = 'FABRIC',
    CARTON = 'CARTON',
}
@Entity('ins_header_config')
export class InsConfigHeaderEntity extends AbstractEntity {
    @Column('bigint', { name: 'ref_id', comment: 'Pk of pack-list' })
    refId: number;

    @Column('enum', { name: 'ins_activity_status', enum: InsTypeEnum })
    insActivityStatus: InsTypeEnum;

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

    @Column('varchar', { name: 'buyer_code',default: null, comment: '' })
    buyerCode: string;

    @Column('enum', { name: 'insspection_selection_type', enum: InsInspectionRollSelectionTypeEnum })
    insspectionSelectionType: InsInspectionRollSelectionTypeEnum
    @Column('varchar', { name: 'item__category' })
    itemCategoryType: string

}