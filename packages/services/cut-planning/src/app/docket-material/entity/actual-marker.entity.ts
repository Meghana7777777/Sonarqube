import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractEntity } from '../../../../../order-execution/src/database/common-entities';

@Entity('actual_marker')
export class ActualMarkerEntity extends AbstractEntity{

  @Column("text", { name: "marker_name", nullable: false,  comment: ''})
  markerName: string;

  @Column("decimal", { precision: 6, scale: 2, name: "marker_width", nullable: false, comment: '' })
  markerWidth: string;

  @Column("decimal", { precision: 8, scale: 4, name: "marker_length", nullable: false, comment: '' })
  markerLength: string;

  @Column("varchar", { name: "docket_group", nullable: false, comment: '' })
  docketGroup: string;

}