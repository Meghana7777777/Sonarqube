import { Column, Entity, Unique } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Unique(['packOrderId', 'bomId'])
@Entity('pack_order_bom')
export class PackOrderBomEntity extends AbstractEntity {
    @Column('bigint', { name: 'pack_order_id', nullable: false })
    packOrderId: number//pack order

    @Column('bigint', { name: 'bom_id', nullable: false })
    bomId: number//item table
}