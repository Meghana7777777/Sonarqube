import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('ins_request_attributes')
export class RequestAttributesEntity extends AbstractEntity {
    @Column({ name: 'ins_request_id', type: 'int' })
    insRequestId: number;

    @Column('varchar', { name: 'attribute_name', length: 40 })
    attribute_name: string;

    @Column({ name: 'attribute_value', type: 'int' })
    attributeValue: number;
}