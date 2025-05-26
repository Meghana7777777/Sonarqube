import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { MaterialConsumptionEnum, RequestTypeEnum } from "@xpparel/shared-models";

@Entity('ph_item_lines_ai')
export class PhItemLinesAIEntity extends AbstractEntity {

    @Column("varchar", { length: 10, name: "consumption_type", nullable: false, comment: '' })
    consumptionType: MaterialConsumptionEnum;

    @Column("decimal", { precision: 8, scale: 2, name: "consumed_quantity", default: 0 })
    quantity: number;

    @Column("datetime", { name: "consumed_on", nullable: false, comment: 'The date on which the fab is comsumed by the docket' })
    consumedOn: string;

    @Column('varchar', { length: 20, name: "barcode", nullable: false, comment: 'The roll barcode' })
    barcode: string;

    @Column('bigint', { name: "ph_items_id", nullable: false, comment: 'The roll PK' })
    phItemId: number;

    @Column('varchar', { length: 11, name: "request_number", nullable: false, comment: 'The request Number' })
    requestNumber: string;

    @Column('varchar', { length: 20, name: "request_type", nullable: false, comment: 'The request type' })
    requestType: RequestTypeEnum;
}
