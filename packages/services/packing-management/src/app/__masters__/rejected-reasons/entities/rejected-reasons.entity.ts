import { AbstractEntity } from "packages/services/packing-management/src/database/common-entities";
import { Column, Entity, OneToMany, Unique } from "typeorm";
import { PackInsRequestItemEntity } from "../../entites/ins-request-items.entity";

@Unique(['reasonCode'])
@Entity('pm_m_rejected_reasons')
export class RejectedReasonsEntity extends AbstractEntity {
    @Column('varchar', { name: 'reason_code' })
    reasonCode: string

    @Column('varchar', { name: 'reason_name' })
    reasonName: string

    @Column('varchar', { name: 'reason_desc' })
    reasonDesc: string;




    // @OneToMany(() => PackInsRequestItemEntity, (item) => item.insRequestId)
    // insItems: PackInsRequestItemEntity[]
 

}