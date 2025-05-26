import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../../../database/common-entities";

@Entity('marker_type')
export class MarkerTypeEntity extends AbstractEntity {

  @Column({ type: 'varchar', length: 20, name: 'marker_type', nullable: false })
  markerType: string;

  @Column({ type: 'varchar', length: 30, name: 'marker_desc', nullable: false })
  markerDesc: string;
}
