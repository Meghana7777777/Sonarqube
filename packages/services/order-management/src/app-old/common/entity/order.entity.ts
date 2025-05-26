import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { PackMethodEnum, RollSelectionTypeEnum, MoStatusEnum } from '@xpparel/shared-models';
import { OrderLineEntity } from "./order-line.entity";

@Entity('order')
export class OrderEntity extends AbstractEntity {

  // order no of ext system. moght be same as refId in some cases
  @Column({ type: 'varchar', length: 50, name: 'order_no', nullable: false })
  orderNo: string;

  @Column({ type: 'varchar', length: 50, name: 'ref_id', nullable: false })
  refId: string;

  @Column({ type: 'text', name: 'buyer_desc', nullable: true })
  buyerDesc: string;

  @Column({ type: 'varchar', length: 50, name: 'buyer_loc', nullable: true })
  buyerLocation: string;

  @Column({ type: 'varchar', length: 50, name: 'co', nullable: true })
  co: string;

  @Column({ type: 'varchar', length: 50, name: 'co_desc', nullable: true })
  coDesc: string;

  @Column({ type: 'int', name: 'quantity', nullable: false })
  quantity: number;

  @Column({ type: 'varchar', length: 40, name: 'product_type', nullable: true })
  productType: string;

  // not used as of now
  @Column({ type: 'varchar', length: 50, name: 'product_code', nullable: true })
  productCode: string;

  @Column({ type: 'varchar', length: 50, name: 'vpo', nullable: true })
  vpo: string;

  @Column({ type: 'varchar', length: '10', name: 'pack_method', nullable: true })
  packMethod: PackMethodEnum;

  @Column({ type: "boolean", name: 'is_confirmed', default: false, comment: 'true: order confirmed and ready for product creation, false: order not yet confirmed' })
  isConfirmed: boolean;

  @Column({ type: 'varchar', length: 255, name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ type: 'varchar', length: 30, name: 'customer_code', nullable: true })
  customerCode: string;

  @Column({ type: 'varchar', length: 30, name: 'profit_center_code', nullable: true })
  profitCenterCode: string;

  @Column({ type: 'varchar', length: 50, name: 'profit_center_name', nullable: true })
  profitCenterName: string;

  @Column({ type: 'varchar', length: 100, name: 'product_name', nullable: true })
  productName: string;

  @Column({ type: 'varchar', length: 100, name: 'product_category', nullable: true })
  productCategory: string;

  @Column({ type: 'varchar', length: 50, name: 'style_name', nullable: false })
  styleName: string;

  @Column({ type: 'varchar', length: 100, name: 'style_code', nullable: true })
  styleCode: string;

  @Column({ type: 'varchar', length: 100, name: 'style_description', nullable: true })
  styleDesc: string;

  @Column({ type: 'varchar', length: 30, name: 'plant_style', nullable: true, comment: "The user entered style for the saleorder which is used a reference text" })
  plantStyle: string;

  @Column({ type: 'varchar', length: 10, name: 'planned_cut_date', nullable: true })
  plannedCutDate: string;

  @Column({ type: 'tinyint', name: 'so_progress_status', nullable: true, comment: 'Status indicates if the order is OPEN or in progres(sizes/pack method saved) or COMPLETED if dispatched' })
  soProgressStatus: MoStatusEnum;

  @OneToMany(type => OrderLineEntity, ol => ol.orderId, { cascade: true })
  orderLines: OrderLineEntity[];
}

