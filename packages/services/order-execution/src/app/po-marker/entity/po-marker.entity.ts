import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('po_marker')
export class PoMarkerEntity extends AbstractEntity {

  @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
  poSerial: number;

  @Column("varchar", { length: 30,  name: "product_name", nullable: false, comment: '' })
  productName: string;

  @Column("varchar", { length: 30,  name: "fg_color", nullable: false, comment: '' })
  fgColor: string;

  @Column("varchar", { length: 100,  name: "item_code", nullable: false, comment: '' })
  itemCode: string;

  @Column("varchar", { length: 20, name: "marker_type", nullable: false, comment: '' })
  markerType: string;

  @Column("varchar", { length: 20, name: "marker_type_id", nullable: false, comment: 'PK of the marker type master entity' })
  markerTypeId: string;

  @Column("text", { name: "marker_name", nullable: false,  comment: ''})
  markerName: string;

  @Column("varchar", { name: "pat_version", length: 20, nullable: true,  comment: ''})
  patVersion: string;

  @Column("varchar", { length: 20, name: "marker_version", nullable: false,  comment: ''})
  markerVersion: string;

  @Column("decimal", { precision: 8, scale: 4, name: "marker_length", nullable: false, comment: '' })
  markerLength: string;

  @Column("decimal", { precision: 6, scale: 2, name: "marker_width", nullable: false, comment: '' })
  markerWidth: string;

  @Column("decimal", { precision: 6, scale: 2, name: "end_allowance", nullable: false, comment: '' })
  endAllowance: string;

  @Column("decimal", { precision: 6, scale: 2, name: "perimeter", nullable: false, comment: '' })
  perimeter: string;

  @Column("boolean", { name: "default_marker", default: false, comment: '' })
  defaultMarker: boolean;

  @Column({ type: 'text', name: 'remarks1', nullable: true })
  remarks1: string;

  @Column({ type: 'text', name: 'remarks2', nullable: true })
  remarks2: string

  @Column("smallint", { name: "club_marker_code", nullable: false, comment: 'Note: This will be 0 for normal markers. An auto inc value of the club marker if any. Starts with 1 under a PO and will increment' })
  clubMarkerCode: number;

  @Column("boolean", { name: "club_marker", default: false, comment: 'True if this is a club marker' })
  clubMarker: boolean;

}
