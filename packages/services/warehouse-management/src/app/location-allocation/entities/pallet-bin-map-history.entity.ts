
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('pallet_bin_map_history')
export class PalletBinMapHistoryEntity extends AbstractEntity {

    @Column('int', {
        name: 'pallet_id',
        nullable:false,
    })
    palletId: number

    @Column('int', {
        name: 'from_bin_id',
        nullable:false,
    })
    fromBinId: number

    @Column('int', {
        name: 'to_bin_id',
        nullable:false,
    })
    toBinId: number
    
    @Column('varchar', {
        name: 'moved_by',
        nullable:false,
        length: 20
    })
    movedBy: string
}
