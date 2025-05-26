import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { ConfigLeastAggregatorEntity } from "./config-least-aggregator.entity";
import { ConfigLeastChildEntity } from "./config-least-child.entity";
import { PLConfigEntity } from "./pack-list.entity";

@Entity('pm_t_pl_config_parent_hierarchy')
export class CartonParentHierarchyEntity extends AbstractEntity {

    @Column({ name: 'pk_spec_id', type: 'int' })
    pkSpecId: number;

    @Column({ name: 'box_map_id', type: 'int' })
    boxMapId: number;

    @Column({ name: 'gross_weight', type: 'int', nullable: true })
    grossWeight: number;

    @Column({ name: 'net_weight', type: 'int', nullable: true })
    netWeight: number;

    @Column({ name: 'count', type: 'int', nullable: true })
    count: number;

    @Column({ name: 'no_of_p_bags', type: 'int', nullable: true })
    noOfPBags: number;

    @Column({ name: 'quantity', type: 'int', nullable: false })
    quantity: number;

    @Column({ name: 'level', type: 'int', nullable: true })
    level: number;

    @Column('varchar', { name: 'is_barcode', length: 20, nullable: true })
    isBarcode: string;

    @Column({ name: 'item_id', type: 'int', nullable: false })
    itemId: number;

    @Column({ name: 'pk_config_id', type: 'int', nullable: false })
    pkConfigId: number;

    @Column('varchar', { name: 'exfactory', length: 40, nullable: false })
    exfactory: string;

    @Column('varchar', { name: 'delivery_date', length: 40, nullable: false })
    deliveryDate: string;

    @Column('text', { name: 'buyer_address' })
    buyerAddress: string;
}