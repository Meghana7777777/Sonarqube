import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('wh_mat_iss_header')
export class WhMatIssLogHeaderEntity  extends AbstractEntity {

    @Column('varchar', { nullable: false, length: 20, name: 'issuance_no', unique: true })
    issuanceNo: string;//unique no

    @Column('varchar', { nullable: false, length: 40, name: 'issuance_by' })
    issuedBy: string;

    @Column("datetime", { name: "issued_on", comment: 'the datetime at which the material was issued' })
    issuedOn: string;

    @Column('boolean', {
        nullable: false,
        default: false,
        name: 'reported_by_ext_sys_',
    })
    reportedByExtSys: boolean;
}