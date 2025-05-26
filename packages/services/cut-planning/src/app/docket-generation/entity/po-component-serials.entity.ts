
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocConfirmationStatusEnum, PhysicalEntityTypeEnum } from "@xpparel/shared-models";

@Entity('po_component_serials')
export class PoComponentSerialsEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("varchar", { length: 50, name: "product_name", nullable: false, comment: '' })
    productName: string;

    @Column("varchar", { length: 50, name: "fg_color", nullable: false, comment: '' })
    fgColor: string;

    @Column("varchar", { length: 20, name: "component", nullable: false, comment: '' })
    component: string;

    @Column("mediumint", { name: "last_panel_number", nullable: false, comment: '' })
    lastPanelNumber: number;

    @Column("varchar", { length: 1, name: "entity_type", nullable: false, comment: '' })
    entityType: PhysicalEntityTypeEnum;
}