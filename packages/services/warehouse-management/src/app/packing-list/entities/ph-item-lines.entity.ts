import { Column, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { InsInspectionStatusEnum, PhItemLinesObjectTypeEnum, PhLinesGrnStatusEnum } from "@xpparel/shared-models";
import { PhItemsEntity } from "./ph-items.entity";

@Entity('ph_item_lines')
export class PhItemLinesEntity extends AbstractEntity {
    @Column('varchar', {
        name: 'po_number',
    })
    poNumber: string;

    @Column('varchar', {
        name: 'po_line_item_no',
        nullable: true
    })
    poLineItemNo: string;

    @Column({
        type: 'enum',
        name: 'object_type',
        enum: PhItemLinesObjectTypeEnum,
    })
    objectType: PhItemLinesObjectTypeEnum;

    @Column('integer', {
        name: 'object_sys_no',
        default: null
    })
    objectSysNumber: number;

    @Column('varchar', {
        name: 'object_ext_no',
        default: null
    })
    objectExtNumber: string;

    @Column('integer', {
        name: 'object_seq_no',
        default: null
    })
    objectSeqNumber: number;

    @Column("decimal", {
        name: "i_quantity",
        nullable: false,
        precision: 8,
        scale: 2,
    })
    inputQuantity: number;

    @Column('varchar', {
        name: 'i_q_uom',
    })
    inputQuantityUom: string;

    @Column("decimal", {
        name: "s_quantity",
        nullable: false,
        precision: 8,
        scale: 2,
    })
    sQuantity: number;

    @Column("decimal", {
        name: "i_length",
        nullable: false,
        precision: 8,
        scale: 2,
    })
    inputLength: number;

    @Column('varchar', {
        name: 'i_l_uom',
    })
    inputLengthUom: string;

    @Column("decimal", {
        name: "s_length",
        nullable: false,
        precision: 8,
        scale: 2,
    })
    sLength: number;


    @Column("decimal", {
        name: "i_width",
        nullable: false,
        precision: 8,
        scale: 2,
    })
    inputWidth: number;

    @Column('varchar', {
        name: 'i_w_uom',
    })
    inputWidthUom: string;


    @Column("decimal", {
        name: "s_width",
        nullable: false,
        precision: 8,
        scale: 2,
    })
    sWidth: number;

    @Column("decimal", {
        name: "net_weight",
        nullable: false,
        precision: 8,
        scale: 2,
    })
    netWeight: number;

    @Column("decimal", {
        name: "gross_weight",
        nullable: false,
        precision: 8,
        scale: 2,
    })
    grossWeight: number;

    @Column('varchar', {
        name: 's_shade',
    })
    sShade: string;

    @Column("decimal", {
        name: "gsm",
        nullable: false,
        precision: 8,
        scale: 2,
        default: 0
    })
    gsm: number;


    @Column("decimal", {
        name: "s_sk_length",
        precision: 8,
        scale: 2,
        default: null
    })
    sSkLength: number;


    @Column("decimal", {
        name: "s_sk_width",
        precision: 8,
        scale: 2,
        default: null
    })
    sSkWidth: number;


    @Column("decimal", {
        name: "s_sk_group",
        precision: 8,
        scale: 2,
        default: null
    })
    sSkGroup: number;

    @Column('varchar', {
        name: 'qr_code',
        default: null
    })
    qrCode: string;


    @Column("decimal", {
        name: "allocated_quantity",
        precision: 8,
        scale: 2,
        default: 0
    })
    allocatedQuantity: number;


    @Column("decimal", {
        name: "issued_quantity",
        precision: 8,
        scale: 2,
        default: 0
    })
    issuedQuantity: number;


    @Column("decimal", {
        name: "return_quantity",
        precision: 8,
        scale: 2,
        default: 0
    })
    returnQuantity: number;

    @Column("decimal", {
        name: "measured_width",
        precision: 8,
        scale: 2,
        default: null
    })
    measuredWidth: number;

    @Column("decimal", {
        name: "measured_weight",
        precision: 8,
        scale: 2,
        default: null
    })
    measuredWeight: number;

    @Column({
        type: 'enum',
        name: 'inspection_status',
        enum: InsInspectionStatusEnum,
    })
    inspectionStatus: InsInspectionStatusEnum;

    @Column('varchar', {
        name: 'barcode',
    })
    barcode: string;

    @Column('tinyint', { name: 'print_status', default: false })
    printStatus: boolean;

    @Column('enum', {
        name: 'grn_status',
        enum: PhLinesGrnStatusEnum,
    })
    grnStatus: PhLinesGrnStatusEnum;

    @UpdateDateColumn({
        name: 'grn_date'
    })
    grnDate: Date;

    @Column('tinyint', { name: 'is_released' })
    isReleased: boolean;

    @Column("int", {
        name: "ph_id",
        default: false
    })
    phId: number;

    @Column('tinyint', { name: 'inspection_pick', default: false })
    inspectionPick: boolean;

    @Column('varchar', {
        name: 'lot_number',
    })
    lotNumber: string;

    @Column('varchar', {
        name: 'batch_number',
    })
    batchNumber: string;

    @ManyToOne(type => PhItemsEntity, packingHeader => packingHeader.phItemLinesInfo, { nullable: false })
    @JoinColumn({ name: "ph_items_id" })
    phItemId: PhItemsEntity | null;

    @Column('tinyint', { name: 'show_in_inventory', default: false })
    showInInventory: boolean;//TODO: once all inspections done we need to update 
}