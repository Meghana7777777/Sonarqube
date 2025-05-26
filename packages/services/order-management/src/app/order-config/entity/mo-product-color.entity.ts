
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { MoStatusEnum } from "@xpparel/shared-models";

@Entity('mo_product_fg_color')
export class MOProductFgColorEntity extends AbstractEntity {

    @Column({ type: 'varchar', name: 'mo_number', length: 25, nullable: false })
    moNumber: string;

    @Column({ type: 'varchar', length: 50, name: 'style_code', nullable: false })
    styleCode: string;

    @Column({ type: 'varchar', length: 50, name: 'product_type', nullable: false })
    productType: string;

    @Column({ type: 'varchar', name: 'product_code', length: 25, nullable: false })
    productCode: string;

    @Column({ type: 'varchar', name: 'fg_color', length: 25, nullable: false })
    fgColor: string;

}
