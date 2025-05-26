import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities/abstract.entity";
import { WarehouseTypeEnum } from "@xpparel/shared-models";

@Entity('warehouse')
export class WarehouseEntity extends AbstractEntity {

    @Column('varchar',{
        name: 'warehouse_name',
        nullable: false
    })
    warehouseName: string;

    @Column('varchar',{
        name: 'warehouse_code',
        nullable: false
    })
    warehouseCode: string;

    @Column('varchar',{
        name: 'companys_code',
        nullable: false
    })
    companysCode: string;

    @Column('varchar',{
        name: 'location',
        nullable: false
    })
    location: string;

    @Column('varchar',{
        name: 'address',
        nullable: false
    })
    address: string;

    @Column('varchar',{
        name: 'warehouse_type',
        nullable: false
    })
    warehouseType: WarehouseTypeEnum;


    @Column('varchar', {
        name: 'latitude',
        nullable: false
    })
    latitude: string;

    @Column('varchar', {
        name: 'longitude',
        nullable: false
    })
    longitude: string;
    
    
}
