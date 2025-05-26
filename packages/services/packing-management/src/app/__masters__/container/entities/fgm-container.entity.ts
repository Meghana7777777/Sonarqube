import { FgContainerTypeEnum, FgCurrentContainerStateEnum, FgCurrentContainerLocationEnum, FgContainerBehaviorEnum, FabricUOM } from "@xpparel/shared-models";
import { AbstractEntity } from "packages/services/packing-management/src/database/common-entities";
import { Entity, Column } from "typeorm";

@Entity('fg_m_container')
export class FgMContainerEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'container_code',
        length: 10,
        nullable: false,
    })
    containerCode: string

    @Column('varchar', {
        name: 'container_name',
        length: 20,
        nullable: false,
    })
    containerName: string

    @Column('int', {
        name: 'max_items',
        nullable: false,
    })
    maxItems: number;

    @Column({
        name: "type",
        type: "enum",
        enum: FgContainerTypeEnum,
        nullable: false,
    })
    containerType: FgContainerTypeEnum;

    @Column("decimal", { precision: 8, scale: 2,
        name: 'weight_capacity',
        nullable: false,
    })
    weightCapacity: number

    @Column('varchar', {
        name: 'weight_uom',
        length: 50,
        nullable: false,
    })
    weightUom: string

    @Column('enum', {
        name: 'current_container_state',
        enum: FgCurrentContainerStateEnum
    })
    currentContainerState: FgCurrentContainerStateEnum

    @Column('enum', {
        name: 'current_container_location',
        enum: FgCurrentContainerLocationEnum,
        default: FgCurrentContainerLocationEnum.NONE
    })
    currentContainerLocation: FgCurrentContainerLocationEnum

    @Column('enum', {
        name: 'container_behavior',
        enum: FgContainerBehaviorEnum
    })
    containerBehavior: FgContainerBehaviorEnum


    @Column('varchar', {
        name: 'freeze_status',
        length: 50,
        nullable: false,
    })
    freezeStatus: string;

    @Column('varchar', {
        name: 'barcode_id',
        length: 50,
        nullable: false,
    })
    barcodeId: string


    @Column('int', {
        name: 'length',
        nullable: false,
    })
    length: number

    @Column('enum', {
        name: 'length_uom',
        enum: FabricUOM,
        nullable: false,
    })
    lengthUom: FabricUOM

    @Column('int', {
        name: 'width',
        nullable: false,
    })
    width: number


    @Column('enum', {
        name: 'width_uom',
        enum: FabricUOM,
        nullable: false,
    })
    widthUom: FabricUOM


    @Column('int', {
        name: 'height',
        nullable: false,
    })
    height: number

    @Column('enum', {
        name: 'height_uom',
        enum: FabricUOM,
        nullable: false,
    })
    heightUom: FabricUOM

    @Column('int', {
        name: 'rack_id',
        nullable: true,
    })
    rackId: number;

    @Column('int', {
        name: 'current_location_id',
        nullable: true,
    })
    currentLocationId: number;

    @Column('int', {
        name: 'wh_id',
        nullable: true,
    })
    whId: number;
}
