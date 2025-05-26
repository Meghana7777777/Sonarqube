import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PkDSetProceedingEnum, DispatchEntityEnum } from "@xpparel/shared-models";



@Entity('d_set')
export class DSetEntity extends AbstractEntity {

    @Column("varchar", { length: "25", name: "set_no", nullable: false, comment: 'The set id of the dispatch' })
    setNo: string;

    // PK of the pack order
    @Column("varchar", { length: "20", name: "l1", nullable: false, comment: 'The pack order related PK ' })
    l1: string;

    // mo number Single value ATM
    @Column("varchar", { length: "20", name: "l2", nullable: false, comment: 'Currenlty MO number' })
    l2: string;

    // vpo
    @Column("varchar", { length: "40", name: "l3", nullable: true, comment: 'The vpo number' })
    l3: string;

    // mo primary key
    @Column("varchar", { length: "40", name: "l4", nullable: true, comment: 'MO PK' })
    l4: string;

    @Column("varchar", { length: "20", name: "l5", nullable: true, comment: 'Not used atm' })
    l5: string;

    @Column("varchar", { length: "5", name: "dispatch_entity", nullable: false, comment: 'The entity type being dispatched (electronics/garment/etc)' })
    dispatchEntity: DispatchEntityEnum;

    @Column("varchar", { length: "5", name: "current_stage", nullable: false, comment: 'The current stage for  dispatch' })
    currentStage: PkDSetProceedingEnum;

    @Column("varchar", { length: "20", name: "current_location", nullable: true, comment: 'The current location for  dispatch' })
    currentLocation: string;

    @Column("tinyint", { name: "print_status", nullable: false, default: 0, comment: 'The print status for  dispatch' })
    printStatus: number;



}