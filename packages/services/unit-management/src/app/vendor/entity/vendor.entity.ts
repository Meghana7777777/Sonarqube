
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('vendor')
export class VendorEntity extends AbstractEntity {

    @Column('varchar', { length: 20, name: 'v_code', nullable: false })
    vCode: string;

    @Column('varchar', { length: 50, name: 'v_name', nullable: false })
    vName: string;

    @Column('varchar', { length: 50, name: 'v_description', nullable: false })
    vDescription: string;

    @Column('varchar', { length: 30, name: 'v_country', nullable: false })
    vCountry: string;

    // The city/village/province of the vendor
    @Column('varchar', { length: 20, name: 'v_place', nullable: false, comment: 'The city/village/province of the vendor' })
    vPlace: string;

    @Column('text', { name: 'v_address' })
    vAdddress: string;

    @Column('varchar', { length: 12, name: 'v_contact', nullable: false, comment: 'The contact number of the vendor' })
    vContact: string;

}
