import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('product_master')
export class ProductsEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'product_name',
        length: 50,
        nullable: false
    })
    productName: string;

    @Column('varchar', {
        name: 'code',
        length: 20,
        nullable: false
    })
    productCode: string;

    @Column('varchar', {
        name: 'description',
        length: 100,
        nullable: true
    })
    description: string;

    @Column('varchar', {
        name: 'image_name',
        length: 255,
        nullable: true
    })
    imageName: string;

    @Column('varchar', {
        name: 'image_path',
        length: 255,
        nullable: true
    })
    imagePath: string;
}