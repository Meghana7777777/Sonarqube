import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('ph_log')
export class PhLogEntity extends AbstractEntity {
    @Column('varchar', {
        name: 'description',
    })
    description: string;

    @Column('varchar', {
        nullable: false,
        length: 300,
        name: 'file_path'
    })
    filePath: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
        name: 'file_type'
    })
    fileType: string;
}