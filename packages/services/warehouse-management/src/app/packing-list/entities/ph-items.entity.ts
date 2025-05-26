import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PhItemCategoryEnum, PhItemPrintStatus, SpoItemTypeEnum } from "@xpparel/shared-models";
import { PhLinesEntity } from "./ph-lines.entity";
import { PhItemLinesEntity } from "./ph-item-lines.entity";

@Entity('ph_items')
export class PhItemsEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'item_code',
    })
    itemCode: string;

    @Column('varchar', {
        name: 'item_name',
        nullable:true
    })
    itemName: string;

    @Column('text', {
        name: 'item_description',
        nullable:true
    })
    itemDescription: string;

    @Column('varchar', {
        name: 'actual_uom',
    })
    actualUom: string;

    @Column('varchar', {
        name: 'preferred_uom',
    })
    preferredUom: string;

    @Column('varchar', {
        name: 'item_category',
        length: 60
    })
    itemCategory: PhItemCategoryEnum;

    @Column('varchar', {
        name: 'item_color',
        default: null
    })
    itemColor: string;

    @Column('varchar', {
        name: 'item_style',
        default: null
    })
    itemStyle: string;

    @Column('varchar', {
        name: 'item_size',
        default: null
    })
    itemSize: string;


    @Column('enum', {
        name: 'print_status',
        enum: PhItemPrintStatus,
        default: null
    })
    printStatus: PhItemPrintStatus;

    @ManyToOne(type => PhLinesEntity, phLine => phLine.phItemInfo, { nullable: false, })
    @JoinColumn({ name: "ph_lines_id" })
    phLinesId: PhLinesEntity | null;


    @OneToMany(type => PhItemLinesEntity, phLines => phLines.phItemId, { cascade: true })
    phItemLinesInfo: PhItemLinesEntity[];

}
