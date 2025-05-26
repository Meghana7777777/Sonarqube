import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemsEntity } from "./items.entity";

@Entity('pm_m_item_dimensions')
export class ItemDimensionsEntity {

    @PrimaryGeneratedColumn({
        name: 'id'
    })
    public id: number;

    @Column({ name: 'length', type: 'int', nullable: true })
    length: number;

    @Column({ name: 'width', type: 'int', nullable: true })
    width: number;

    @Column({ name: 'height', type: 'int', nullable: true })
    height: number;

    // @OneToOne(() => ItemsEntity, (items: ItemsEntity) => items.dimensionsId)
    // items: ItemsEntity;
}