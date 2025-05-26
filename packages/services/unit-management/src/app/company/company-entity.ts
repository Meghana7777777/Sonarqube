import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities/abstract.entity";

@Entity('company')
export class CompanyEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'company_name',
        nullable: false
    })
    companyName: string;

    @Column('varchar', {
        name: 'code',
        nullable: false
    })
    code: string;

    @Column('varchar', {
        name: 'location',
        nullable: false
    })
    location: string;

    @Column('varchar', {
        name: 'address',
        nullable: false
    })
    address: string;

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