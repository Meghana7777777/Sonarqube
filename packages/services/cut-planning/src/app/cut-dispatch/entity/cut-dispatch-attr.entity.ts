import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutDispatchAttrEnum, CutDispatchStatusEnum } from "@xpparel/shared-models";

@Entity('cut_dispatch_attr')
export class CutDispatchAttrEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('mediumint', { name: 'cut_dr_id', nullable: false })
    cutDrId: number;

    @Column('varchar', { name: 'name', length: 10, nullable: false })
    name: CutDispatchAttrEnum;

    @Column('text', { name: 'value', nullable: false })
    value: string;
}

