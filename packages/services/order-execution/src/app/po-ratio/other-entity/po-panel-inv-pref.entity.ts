import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_panel_inv_pref')
export class PoPanelInvPrefEntity extends AbstractEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;

    @Column({ type: 'tinyint', width: 4, name: 'order', nullable: true, comment: '' })
    order: number;

    @Column("varchar", { length: 100, name: "feature_type", nullable: true, comment: '' })
    featureType: string;



}