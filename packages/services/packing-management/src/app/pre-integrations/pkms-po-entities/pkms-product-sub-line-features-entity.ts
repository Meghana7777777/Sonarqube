import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { OrderTypeEnum, ProcessTypeEnum } from "@xpparel/shared-models";

@Entity('pkms_product_sub_line_features')
export class PKMSProductSubLineFeaturesEntity extends AbstractEntity {
    @Column('bigint', { name: 'processing_serial', nullable: false })
    processingSerial: number;

    @Column('varchar', { name: 'process_type', length: 25, nullable: false })
    processType: ProcessTypeEnum;

    @Column('varchar', { name: 'customer_code', length: 30, nullable: true })
    customerCode: string;

    @Column('varchar', { name: 'profit_center_code', length: 30, nullable: true })
    profitCenterCode: string;

    @Column('varchar', { name: 'profit_center_name', length: 50, nullable: true })
    profitCenterName: string;

    @Column('varchar', { name: 'style_name', length: 50, nullable: false })
    styleName: string;

    @Column('varchar', { name: 'style_code', length: 100, nullable: true })
    styleCode: string;

    @Column('varchar', { name: 'style_description', length: 100, nullable: true })
    styleDescription: string;

    @Column('varchar', { name: 'business_head', length: 50, nullable: true })
    businessHead: string;

    @Column('varchar', { name: 'mo_creation_date', length: 50, nullable: true })
    moCreationDate: string;

    @Column('bigint', { name: 'mo_line_id', nullable: true })
    moLineId: number;

    @Column('bigint', { name: 'mo_id', nullable: true })
    moId: number;

    @Column('varchar', { name: 'mo_closed_date', length: 50, nullable: true })
    moClosedDate: string;

    @Column('varchar', { name: 'ex_factory_date', length: 50, nullable: true })
    exFactoryDate: string;

    @Column('varchar', { name: 'destination', length: 25, nullable: false })
    destination: string;

    @Column('varchar', { name: 'delivery_date', length: 25, nullable: false })
    deliveryDate: string;

    @Column('varchar', { name: 'schedule', length: 25, nullable: false })
    schedule: string;

    @Column('varchar', { name: 'z_feature', length: 25, nullable: false })
    zFeature: string;

    @Column('varchar', { name: 'plan_prod_date', length: 25, nullable: false })
    planProdDate: string;

    @Column('varchar', { name: 'plan_cut_date', length: 25, nullable: false })
    planCutDate: string;

    @Column('int', { name: 'mo_product_sub_line_id', nullable: false })
    moProductSubLineId: number;

    @Column('varchar', { name: 'mo_line_number', length: 20, nullable: false })
    moLineNumber: string;

    @Column('varchar', { name: 'mo_number', length: 50, nullable: false })
    moNumber: string;

    @Column('varchar', { name: 'customer_name', length: 50, nullable: false })
    customerName: string;

    @Column('varchar', { name: 'co_number', length: 50, nullable: false })
    coNumber: string;


    @Column('varchar', { name: 'so_line_number', length: 20, nullable: false })
    soLineNumber: string;

    @Column('varchar', { name: 'so_number', length: 50, nullable: false })
    soNumber: string;

    @Column('varchar', { name: 'product_code', length: 50, nullable: false })
    productCode: string; // NOTE : newely addded check if required or not

    @Column('varchar', { name: 'fg_color', length: 20, nullable: false })
    fgColor: string; // NOTE : newely addded check if required or not

    @Column('varchar', { name: 'size', length: 20, nullable: false })
    size: string;

    @Column({ type: 'varchar', length: 10, name: 'oq_type', nullable: true })
    oqType: OrderTypeEnum;
}
