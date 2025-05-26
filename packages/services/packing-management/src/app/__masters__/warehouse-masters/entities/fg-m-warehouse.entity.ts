import { WarehouseTypeEnum } from "@xpparel/shared-models";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('fg_m_warehouse')
export class FGMWareHouseEntity extends AbstractEntity {
    @Column("varchar", { name: 'code', length: 20 })
    wareHouseCode: string;

    @Column("varchar", { name: 'desc', length: 40 })
    wareHouseDesc: string;

     @Column({
        name: "ware_house_type",
        type: "enum",
        enum: WarehouseTypeEnum,
        nullable: false,
    })
    wareHouseType: WarehouseTypeEnum;

    @Column('varchar', {
        name: 'latitude',
        nullable: false,
        length: 12
    })
    latitude: string

    @Column('varchar', {
        name: 'longitude',
        nullable: false,
        length: 12
    })
    longitude: string;

    
    @Column('int', {
        name: 'no_of_floors',
        nullable: false,
    })
    noOfFloors: number

    @Column('varchar', { name: 'manager_name', length: 50, nullable: true })
    managerName: string;

    @Column('varchar', { name: 'manager_contact', length: 15, nullable: true })
    managerContact: string;

    @Column('text', { name: 'address',  nullable: false })
    address:string
}