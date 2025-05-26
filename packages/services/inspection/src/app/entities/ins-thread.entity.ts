import { InsUomEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('ins_thread')
export class InsThreadEntity extends AbstractEntity {

    @Column('integer', { name: 'ins_req_id' })
    insReqId: number;

    @Column('integer', { name: 'ins_req_items_id' })
    insReqItemsId: number;

    @Column({ name: 'count', type: 'int', nullable: true })
    count: number;

    @Column({ name: 'qunatity', type: 'int', nullable: true })
    qunatity: number;

    @Column({ name: 'net_weight', type: 'int', nullable: true })
    netWeight: number;

    @Column({ name: 'gross_weight', type: 'int', nullable: true })
    grossWeight: number;

    @Column({ name: 'tpi', type: 'int', nullable: true })
    tpi: number;

    @Column({ name: 'moisture', type: 'int', nullable: true })
    moisture: number;

    @Column({ name: 'tensile_strength', type: 'int', nullable: true })
    tensileStrength: number;

    @Column({ name: 'elongation', type: 'int', nullable: true })
    elongation: number;

}