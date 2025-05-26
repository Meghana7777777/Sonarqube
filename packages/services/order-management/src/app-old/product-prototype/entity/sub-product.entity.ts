import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { ProductEntity } from "./product.entity";
import { SubProductFabricEntity } from "./sub-product-fabric.entity";

@Entity('sub_product')
export class SubProductEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 40, name: 'product_type', default: '' })
    productType: string;

    @Column({ type: 'varchar',  name: 'style', length: 20, nullable: true })
    style: string;

    @Column({ type: 'varchar', length: 50,  name: 'style_code', nullable: true  })
    styleCode: string;

    @Column({ type: 'varchar', length: 50,  name: 'style_desc', nullable: true  })
    styleDesc: string;

    @Column({ type: 'varchar', length: 50, name: 'color' })
    color: string;

    // Reference key
    @Column({ type: 'bigint', name: 'order_id', nullable: false  })
    orderId: number;

    @Column({ type: 'text', name: 'component_names', nullable: true })
    componentNames: string;

    @Column({ type: 'varchar', length: 50, name: 'sub_product_name', nullable: true })
    subProductName: string;

    // FK
    @ManyToOne(type => ProductEntity, sp => sp.subProducts, { nullable: false })
    @JoinColumn({ name: "product_id",  foreignKeyConstraintName: "PD" })
    productId: ProductEntity;

    @OneToMany(type => SubProductFabricEntity, sp => sp.subProductId, { cascade: true })
    subProductFabric: SubProductFabricEntity[];

}
