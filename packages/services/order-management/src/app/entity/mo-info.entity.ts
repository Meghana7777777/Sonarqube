import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { ConfirmationStatusEnum } from "@xpparel/shared-models";

@Entity('mo_info')
export class MoInfoEntity extends AbstractEntity {

    @Column({ type: 'varchar', name: 'mo_number', length: 25, nullable: false })
    moNumber: string;

    @Column({ type: 'varchar', name: 'style', length: 25, nullable: false })
    style: string;

    @Column({ type: 'varchar', name: 'plant_style_ref', length: 50, nullable: false })
    plantStyleRef: string;

    @Column({ type: 'varchar', name: 'customer_order_no', length: 25, nullable: false })
    coNumber: string;

    @Column({ type: 'varchar', name: 'customer_name', length: 50, nullable: false })
    customerName: string;

    @Column({ type: 'varchar', name: 'mo_ref_no', length: 50, nullable: false })
    moRefNo: string;

    @Column({ type: 'varchar', name: 'buyer_loc', length: 50, nullable: true })
    customerLoc: string;

    @Column({ type: 'int', name: 'quantity', nullable: false })
    quantity: number;

    @Column({ type: 'varchar', name: 'pack_method', length: 10, nullable: true })
    packMethod: string;

    @Column({ type: 'tinyint', name: 'is_confirmed', nullable: false })
    isConfirmed: ConfirmationStatusEnum;

    @Column({ type: 'varchar', name: 'customer_code', length: 30, nullable: true })
    customerCode: string;

    @Column({ type: 'varchar', name: 'profit_center_code', length: 30, nullable: true })
    profitCenterCode: string;

    @Column({ type: 'varchar', name: 'profit_center_name', length: 50, nullable: true })
    profitCenterName: string;

    @Column({ type: 'varchar', name: 'style_name', length: 50, nullable: false })
    styleName: string;

    @Column({ type: 'varchar', name: 'style_code', length: 50, nullable: true })
    styleCode: string;

    @Column({ type: 'varchar', name: 'style_description', length: 50, nullable: true })
    styleDescription: string;

    @Column({ type: 'tinyint', name: 'mo_progress_status', nullable: true })
    moProgressStatus: number;

    @Column({ type: 'varchar', name: 'business_head', length: 50, nullable: true })
    businessHead: string;

    @Column({ type: 'varchar', name: 'mo_item', length: 50, nullable: true })
    moItem: string;

    @Column({ type: 'varchar', name: 'customer_styles_design_no', length: 50, nullable: true })
    customerStylesDesignNo: string;

    @Column({ type: 'varchar', name: 'mo_creation_date', length: 50, nullable: true })
    moCreationDate: string;

    @Column({ type: 'varchar', name: 'mo_closed_date', length: 50, nullable: true })
    moClosedDate: string;

    @Column({ type: 'varchar', name: 'ex_factory_date', length: 50, nullable: true })
    exFactoryDate: string;

    @Column({ type: 'varchar', name: 'uploaded_date', length: 50, nullable: true })
    uploadedDate: string;

    @Column({ type: 'boolean', name: 'mo_proceeding_status', nullable: true, default: false })
    moProceedingStatus: boolean;

}
