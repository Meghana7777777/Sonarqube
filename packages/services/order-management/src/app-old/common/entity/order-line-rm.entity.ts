import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PhItemCategoryEnum, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { OrderLineEntity } from "./order-line.entity";

@Entity('order_line_rm')
export class OrderLineRmEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 50, name: 'item_code', nullable: false })
    itemCode: string;

    @Column({ type: 'varchar', length: 50, name: 'item_name', nullable: false })
    itemName: string;

    @Column({ type: 'varchar', length: 200, name: 'item_desc', nullable: true })
    itemDesc: string;

    @Column({ type: 'int', name: 'sequence', nullable: true })
    sequence: number;

    @Column({ type: 'int', name: 'consumption', nullable: true })
    itemConsumption: number;

    @Column({ type: 'int', name: 'wastage', nullable: true })
    itemWastage: number;

    @Column({ type: 'varchar', length: 15, name: 'item_type', nullable: false })
    itemType: PhItemCategoryEnum;

    @Column({ type: 'varchar', length: 15, name: 'item_sub_type', nullable: true })
    itemSubType: any;

    @Column({ type: 'varchar', length: 50, name: 'item_color', nullable: true })
    itemColor: string;

    @Column({ type: 'varchar', length: 10, name: 'item_uom', nullable: true })
    itemUom: string;

    @Column({ type: 'boolean', name: 'is_original', nullable: true })
    isOriginal: boolean;

    @Column({ type: 'varchar', length: 100, name: 'supplier_code', nullable: true })
    supplierCode: string;

    @Column({ type: 'varchar', length: 255, name: 'supplier_name', nullable: true })
    supplierName: string;

    // Reference key
    @Column({ type: 'bigint', name: 'order_id' })
    orderId: number;
    
    @ManyToOne(type => OrderLineEntity, o => o.orderLineRm, { nullable: false })
    @JoinColumn({ name: "order_line_id", foreignKeyConstraintName: "OL_TO_RM" })
    orderLineId: OrderLineEntity;

    @Column ('varchar',{
        name:'fabric_meters',
        length:15,
    })
    fabricMeters : string;
}
