import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PLConfigEntity } from "./pack-list.entity";
import { ConfigLeastChildEntity } from "./config-least-child.entity";
import { CartonParentHierarchyEntity } from "./carton-config-parent-hierarchy.entity";

@Entity('pm_t_pl_config_least_aggregator')
export class ConfigLeastAggregatorEntity extends AbstractEntity {

    @Column({ name: 'pk_spec_id', type: 'int' })
    pkSpecId: number;

    @Column({ name: 'item_id', type: 'int' })
    itemId: number;

    @Column({ name: 'box_map_id', type: 'int' })
    boxMapId: number;

    @Column({ name: 'gross_weight', type: 'int', nullable: true })
    grossWeight: number;

    @Column({ name: 'net_weight', type: 'int', nullable: true })
    netWeight: number;

    @Column({ name: 'quantity', type: 'int' })
    quantity: number;

    @Column({ name: 'count', type: 'int' })
    count: number;

    
    @Column({ name: 'parent_hierarchy_id', type: 'int' })
    parentHierarchyId: number;

    @Column({ name: 'pk_config_id', type: 'int' })
    pkConfigId: number;
}