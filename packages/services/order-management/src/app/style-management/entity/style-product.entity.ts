
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('style_product_type')
export class StyleProductTypeEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 50, name: 'style_code', nullable: false })
    styleCode: string;

    @Column({ type: 'varchar', length: 50, name: 'product_type', nullable: false })
    productType: string;

}
