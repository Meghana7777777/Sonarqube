import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AbstractEntity } from "../../database/common-entities/abstract.entity";

@Entity('warehouse_unitmapping')
export class WarehouseUnitmappingEntity extends AbstractEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        name: 'warehouse_code',
        nullable: false
    })
    warehouseCode: string;

    @Column('varchar', {
        name: 'units_code',
        nullable: false
    })
    unitsCode: string;

    @Column('varchar', {
        name: 'companys_code',
        nullable: false
    })
    companysCode: string;

   
}








    
