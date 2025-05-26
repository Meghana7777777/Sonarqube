import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";


@Entity('pm_m_packing_spec')
export class PackingSpecEntity extends AbstractEntity {

    @Column("varchar", { name: 'code', length: 40 })
    code: string;

    @Column("varchar", { name: 'desc', length: 40 })
    desc: string;

    @Column({ name: 'no_of_levels', type: 'int' })
    noOfLevels: number;

}
