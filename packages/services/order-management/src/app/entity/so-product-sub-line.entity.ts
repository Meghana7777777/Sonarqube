import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { OrderTypeEnum } from "@xpparel/shared-models";

@Entity('so_product_sub_line')
export class SoProductSubLineEntity extends AbstractEntity {

    @Column({ type: 'varchar', name: 'so_number', length: 25, nullable: false })
    soNumber: string;

    @Column({ type: 'varchar', name: 'so_line_number', length: 25, nullable: false })
    soLineNumber: string;

    @Column({ type: 'varchar', name: 'product_code', length: 25, nullable: false })
    productCode: string;

    @Column({ type: 'varchar', name: 'product_type', length: 25, nullable: false })
    productType: string;

    @Column({ type: 'varchar', name: 'product_name', length: 25, nullable: false })
    productName: string;

    @Column({ type: 'bigint', name: 'so_line_product_id', nullable: false })
    soLineProductId: number;

    @Column({ type: 'varchar', name: 'style_code', length: 50, nullable: true })
    styleCode: string;

    @Column({ type: 'varchar', name: 'fg_color', length: 25, nullable: false })
    fgColor: string;

    @Column({ type: 'varchar', name: 'size', length: 25, nullable: false })
    size: string;

    @Column({ type: 'int', name: 'quantity', nullable: false })
    quantity: number;

    @Column({ type: 'varchar', name: 'ext_ref_number1', length: 25, nullable: true })
    extRefNumber1: string;

    @Column({ type: 'varchar', name: 'ext_ref_number2', length: 25, nullable: true })
    extRefNumber2: string;

    @Column({ type: 'varchar', name: 'destination', length: 25, nullable: false })
    destination: string;

    @Column({ type: 'varchar', name: 'delivery_date', length: 25, nullable: false })
    deliveryDate: string;

    @Column({ type: 'varchar', name: 'z_feature', length: 25, nullable: false })
    zFeature: string;

    @Column({ type: 'varchar', name: 'buyer_po', length: 25, nullable: false })
    buyerPo: string;

    @Column({ type: 'varchar', name: 'oq_type', length: 25, nullable: false, default: OrderTypeEnum.ORIGINAL })
    oQType: OrderTypeEnum;
}
