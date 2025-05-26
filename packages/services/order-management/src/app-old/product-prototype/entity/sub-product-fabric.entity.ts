import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum, InsUomEnum } from '@xpparel/shared-models';
import { SubProductEntity } from "./sub-product.entity";

@Entity('sub_product_fabric')
export class SubProductFabricEntity extends AbstractEntity {
   
    @Column({ type: 'varchar', length: 50, name: 'item_code' })
    itemCode: string;
  
    @Column({ type: 'varchar', length: 50, name: 'item_name' })
    itemName: string;
  
    @Column({ type: 'varchar', length: 200, name: 'item_desc' })
    itemDesc: string;
  
    @Column({ type: 'varchar', length: 50, name: 'item_color', default: '', nullable: true })
    itemColor: string;

    @Column({ type: 'int', name: 'sequence', default: 0 })
    squence: number;
  
    @Column({ type: 'varchar', length: 10, name: 'uom', default: '' })
    uom: InsUomEnum;
  
    @Column({ type: 'text', name: 'component_names', nullable: true })
    componentNames: string;  

    // Reference key
    @Column({ type: 'bigint', name: 'order_id', nullable: false  })
    orderId: number;
    
    // FK
    @ManyToOne(type => SubProductEntity, sp => sp.subProductFabric, { nullable: false })
    @JoinColumn({ name: "sub_product_id", foreignKeyConstraintName: "SPD" })
    subProductId: SubProductEntity;
}
