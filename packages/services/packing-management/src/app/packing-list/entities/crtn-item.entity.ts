
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


//barcode scanning entity
@Entity('pm_t_crtn_items')
export class CrtnItemsEntity extends AbstractEntity {

    @Column({ name: 'pm_t_crtn_id', type: 'bigint' })
    pmTCrtnId: number;

    @Column({ name: 'least_child_id', type: 'bigint' })
    leastChildId: number;

    @Column({ name: "least_aggregator_id", type: 'bigint' })
    leastAggregator: number;

    @Column({ name: "parent_hierarchy_id", type: 'bigint' })
    parentHierarchyId: number;

    @Column({ name: 'required_qty', type: 'int' })
    requiredQty: number;

    @Column({ name: 'completed_qty', type: 'int' })
    completedQty: number;

    @Column('varchar', { name: 'color', length: 40 })
    color: string;

    @Column('varchar', { name: 'size', length: 10 })
    size: string;

    @Column("varchar", { name: 'upc_barcode', length: 15 })
    upcBarcode: string;

    @Column({ name: 'ratio', type: 'int' })
    ratio: number;

    @Column({ name: "po_line_id", type: 'bigint' })
    poLineId: number;

    @Column('varchar', { name: 'product_ref', length: 15, nullable: false })
    productRef: string;

    @Column('varchar', { name: 'product_code', length: 50, nullable: false })
    productCode: string;

    @Column('varchar', { name: 'product_name', length: 50, nullable: false })
    productName: string;

    @Column('varchar', { name: 'product_type', length: 50, nullable: false })
    productType: string;

    @Column({ name: "po_id", type: 'bigint', nullable: false })
    poId: number;

    @Column({ name: "po_order_sub_line_id", type: 'bigint', nullable: false })
    poOrderSubLineId: number;

}