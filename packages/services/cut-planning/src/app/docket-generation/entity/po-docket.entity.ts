import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum } from "@xpparel/shared-models";

@Entity('po_docket')
export class PoDocketEntity extends AbstractEntity {

    // Ref key of the po serial
    @Column("bigint", { name: "po_serial", nullable: false, comment: '' })
    poSerial: number;
  
    @Column("varchar", { length: 50, name: "product_name", nullable: false, comment: '' })
    productName: string;

    @Column("varchar", { length: 40, name: "product_type", nullable: false, comment: '' })
    productType: string;

    @Column("varchar", { length: 100, name: "color", nullable: true, comment: '' })
    color: string;

    // An inc number under a PO + product name + fabric. Starts with 1 an keeps on incrementing when creating the dockets
    // @Column("tinyint", { name: "cut_no", nullable: false, comment: '' })
    // cutNumber: number;

    // this will be same as the ID
    @Column("varchar", { name: "docket_number", nullable: false, comment: '' })
    docketNumber: string;

    @Column("varchar", { name: "docket_group", nullable: false, comment: '' })
    docketGroup: string;
  
    @Column("smallint", { name: "plies", nullable: false,  comment: ''})
    plies: number;
  
    @Column("varchar", { length: 100, name: "item_code", nullable: false, comment: '' })
    itemCode: string;

    @Column("varchar", { length: 10, name: "cg_name", nullable: true, comment: '' })
    cgName: string;

    @Column("bigint", { name: "po_ratio_id", nullable: false, comment: '' })
    poRatioId: number;

    @Column("bigint", { name: 'po_marker_id', nullable: true, comment: 'The PK of the marker entity' })
    poMarkerId: number;

    @Column("bigint", { name: "po_ratio_fab_id", nullable: false, comment: '' })
    poRatioFabricId: number;

    // @Column("decimal", { precision: 8, scale: 2, name: "material_requirement", nullable: true, comment: 'plies * size ratio' })
    // materialRequirement: number;

    @Column("boolean", { name: "main_docket", nullable: false, default: false, comment: 'The main docket if the fabric is main' })
    mainDocket: boolean;

    @Column("boolean", { name: "is_binding", nullable: false, default: false, comment: 'The is binding flag that is selected in the fabric properties' })
    isBinding: boolean;

    // @Column("decimal", { precision: 8, scale: 2, name: "binding_requirement", nullable: false, default: 0, comment: 'plies * size ratio * binding cons' })
    // bindingRequirement: number;

    @Column("mediumint", { name: "planned_bundles", nullable: false, comment: ''})
    plannedBundles: number;

    @Column("mediumint", { name: "bundle_gen_status", nullable: false, comment: '0-OPEN, 1-INPROGRESS, 2-COMPLETED.  Default: OPEN. After creating docket record it will be INPROGRESS. After bundles gen it will be COMPLETED'})
    bundleGenStatus: DocBundleGenerationStatusEnum;

    @Column("tinyint", { name: "doc_confirmation", nullable: false, default: DocConfirmationStatusEnum.OPEN, comment: '0-OPEN, 1-INPROGRESS, 2-CONFIMRED.    Default: OPEN. After confirmation INPROGRESS. After all the panels are generated for all bundles in doc, this will be CONFIRMED ' })
    docketConfirmation: DocConfirmationStatusEnum;

    @Column({ type: 'varchar', length:5, name: 'ref_component', comment: 'The Ref component per fabric. Begins form 1 and goes on under a ', nullable: false })
    refComponent: string;
}