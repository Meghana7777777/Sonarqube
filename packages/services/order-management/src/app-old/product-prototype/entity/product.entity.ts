import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum, MoProductStatusEnum } from '@xpparel/shared-models';
import { SubProductEntity } from "./sub-product.entity";

@Entity('product')
export class ProductEntity extends AbstractEntity {
  
    @Column({ type: 'varchar', length: 40, name: 'product_type', default: '' })
    productType: string;
  
    @Column({ type: 'varchar', length: 20, name: 'style', nullable: true  })
    style: string;

    @Column({ type: 'varchar', length: 50, name: 'style_code',nullable: true  })
    styleCode: string;

    @Column({ type: 'varchar', length: 50, name: 'style_desc',nullable: true  })
    styleDesc: string;
  
    // Reference key
    @Column({ type: 'bigint', name: 'order_id', nullable: false  })
    orderId: number;
    
    // Reference key
    @Column({ type: 'tinyint', name: 'confirmation_status', nullable: false, comment: 'Confirmation status that the product is totaly finalized and can be proceeded for PO creations'  })
    confirmationStatus: MoProductStatusEnum;

    // order ref no
    @Column({ type: 'varchar', length: 20, name: 'order_ref_no' })
    orderRefNo: string

    @OneToMany(type => SubProductEntity, sp => sp.productId, { cascade: true })
    subProducts: SubProductEntity[];

}
