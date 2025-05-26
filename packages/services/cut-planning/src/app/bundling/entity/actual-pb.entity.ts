import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, DocPanelGenStatusEnum } from "@xpparel/shared-models";
import { CutOrderProductBundleStateEnum } from "../../common/entity/po-sub-line-bundle.entity";


@Entity('actual_pb')
export class ActualPbEntity extends AbstractEntity {
    
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("bigint", { name: "psl_id", nullable: false, comment: 'PK of the psl table' })
    pslId: number;

    @Column("bigint", { name: "docket_number", nullable: true, comment: '', default: null })
    docketNumber: string;
    
    @Column("varchar", { length: 20, name: "pb_barcode", nullable: false,  comment: 'The original planned barcode'})
    pbBarcode: string;

    // Auto inc number under a docket. .i.e irrespective of size, this will start from 1 and max will be equal to the SUM(ratios of all sizes)
    @Column("varchar", { length: 20, name: "ab_barcode", nullable: false,  comment: 'The actual barcode under a planned barcode. The barcode number is a split of the planned barcode'})
    abBarcode: string;
    
    @Column("smallint", { name: "p_qty", nullable: false, comment: 'QTY of the planned barcode' })
    pQty: number;

    @Column("smallint", { name: "a_qty", nullable: false, comment: 'QTY of this actual barcode' })
    aQty: number;

    @Column("varchar", { length: 2, name: "shade", nullable: false, comment: 'Shade of this actual barcode' })
    shade: string;

    @Column('bigint', { name: 'confirmation_id', default: 0, comment: 'The random ID generated while doing the bundling activity. Usually the timestamp' })
    confirmationId: number;

    @Column('tinyint', { name: 'bundle_state', default: CutOrderProductBundleStateEnum.FORMED,  comment: 'Refer KnitOrderProductBundleStateEnum. 0 - initially, 1 - when the bundle is confirmed, 2 - when the bundle is moved to inventory' })
    bundleState: CutOrderProductBundleStateEnum;
}
