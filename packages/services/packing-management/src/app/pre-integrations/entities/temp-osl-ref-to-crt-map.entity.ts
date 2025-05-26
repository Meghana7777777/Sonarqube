import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//at the time of carton map to map what are the external oslId's to get fg's 
@Entity('pkms_temp_osl_ref_to_crt_map')
export class TempOSLRefToCartonMapEntity{
    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number;

    @Column("bigint", { name: "crt_id", nullable: false, comment: '' })
    crtId: number;

    @Column("bigint", { name: "osl_id", nullable: false, comment: 'external osl ref id' })
    oslId: number;

    @Column("bigint", { name: "psl_id", nullable: false, comment: 'pack sub line id' })
    pslId: number;

    @Column("int", { name: "allocatedFgQty", nullable: false, comment: 'allocated fgs count' })
    allocatedFgQty: number;

    @Column("bigint", { name: "polybag_id", nullable: false, comment: 'polybag id' })
    polyBagId: number;

}