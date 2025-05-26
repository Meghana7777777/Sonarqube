import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('supplier')
export class SupplierEntity extends AbstractEntity {
    @Column('varchar', {
        name: 'supplier_code',
        length: 40,
        nullable: false,
        unique: true
    })
    supplierCode: string;

    @Column('varchar', {
        name: 'supplier_name',
        length: 250,
        nullable: false
    })
    supplierName: string;

    @Column("varchar", {
        name: 'phone_number', length: 15,
        nullable: true
    })
    phoneNumber: string;

    @Column("text", {
        name: 'address',
        nullable: true
    })
    supplierAddress: string;
}


