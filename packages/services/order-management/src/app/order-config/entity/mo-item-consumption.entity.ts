
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ProcessTypeEnum, OpFormEnum, BomItemTypeEnum, PhItemCategoryEnum } from '@xpparel/shared-models';

@Entity('mo_item_consumption')
export class MoItemConsumptionEntity extends AbstractEntity {

    @Column({ type: 'bigint', name: 'mo_product_fg_color_id', nullable: false })
    moProductFgColorId: number;

    @Column('varchar', { length: 30, name: 'item_code', nullable: false })
    itemCode: string;

    @Column({ type: 'varchar', name: 'size', length: 25, nullable: false })
    size: string;

    @Column({ type: 'decimal', name: 'consumption', nullable: true, precision: 10, scale: 2, })
    consumption: number;

    @Column('varchar', { length: 20, name: 'op_code', nullable: false })
    componentName: string;
}

