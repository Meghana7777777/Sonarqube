import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { FabricUOM } from "@xpparel/shared-models";

@Entity('uom_conversion')
export class UomConversionEntity extends AbstractEntity {

    @Column({
        type: 'enum',
        name: 'from_uom',
        enum: FabricUOM
    })
    fromUom: FabricUOM;

    @Column({
        type: 'enum',
        name: 'to_uom',
        enum: FabricUOM
    })
    toUom: FabricUOM;

    @Column({
        name: 'conversion_factor',
        nullable: false
    })
    conversionFactor: number;

    @Column({
        name: 'valid_from',
        type: 'timestamp',
        nullable: true
    })
    validFrom: Date;

    @Column({
        name: 'valid_to',
        type: 'timestamp',
        nullable: true
    })
    validTo: Date;
}