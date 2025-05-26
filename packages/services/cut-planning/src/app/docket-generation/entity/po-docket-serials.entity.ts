
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocConfirmationStatusEnum, PhysicalEntityTypeEnum } from "@xpparel/shared-models";

@Entity('po_docket_serials')
export class PoDocketSerialsEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("varchar", { length: 50, name: "product_name", nullable: false, comment: '' })
    productName: string;

    @Column("varchar", { length: 100, name: "color", nullable: true, comment: '' })
    color: string;
    
    @Column("varchar", { length: 15, name: "size", nullable: false, comment: '' })
    size: string;

    @Column("varchar", { length: 20, name: "component", nullable: false, comment: '' })
    component: string;

    @Column("mediumint", { name: "last_panel_number", nullable: false, comment: '' })
    lastPanelNumber: number;

    @Column("varchar", { length: 1, name: "entity_type", nullable: false, comment: '' })
    entityType: PhysicalEntityTypeEnum;
}