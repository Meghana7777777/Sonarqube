import { PoStatusEnum } from "@xpparel/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('po')
export class PoCreationEntity {

  @PrimaryGeneratedColumn('increment', {
    name: 'po_id'
  })
  poId: number;

  @Column('varchar', {
    name: 'po_number',
    nullable: false,
    length: 50
  })
  poNumber: string;

  @Column('varchar', {
    name: 'buyer',
    nullable: true,
    length: 50
  })
  buyer: string;

  @Column('varchar', {
    name: 'color',
    nullable: true,
    length: 50
  })
  color: string;

  @Column('varchar', {
    name: 'style',
    nullable: true,
    length: 50
  })
  style: string;

  @Column('int', {
    name: 'quantity',
    nullable: true,
  })
  quantity: number;

  @Column('datetime', {
    name: 'estimated_close_date',
    nullable: true,
  })
  estimatedClosedDate: Date;

  @Column('enum', {
    name: 'status',
    enum: PoStatusEnum
  })
  status: PoStatusEnum

  @Column('int', {
    name: 'buyer_id',
    nullable: true
  })
  buyerId: number;

  @Column('int', {
    name: 'color_id',
    nullable: true
  })
  colorId: number;

  @Column('int', {
    name: 'style_id',
    nullable: true
  })
  styleId: number;


  @Column('varchar', {
    name: 'created_user',
    nullable: true,
  })
  createdUser: string;

  @Column('varchar', {
    name: 'updated_user',
    nullable: true,
  })
  updatedUser: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: string;

  @Column("boolean", {
    default: true,
    nullable: true,
    name: "is_active"
  })
  isActive: boolean;

  @VersionColumn({
    default: 1,
    nullable: true,
    name: 'version_flag'
  })
  versionFlag: number;



}