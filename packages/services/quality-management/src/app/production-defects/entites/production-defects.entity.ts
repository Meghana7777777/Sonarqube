import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('production_defect')
export class ProductionDefectEntity {
    @PrimaryGeneratedColumn("increment", {
        name: 'sewing_defect_id'
    })
    sewingDefectId: number

    @Column('varchar', {
        name: 'po_number',
        nullable: true
    })
    poNumber: string

    @Column('int', {
        name: 'customer_id',
        nullable: true
    })
    customerId: number

    @Column('int', {
        name: 'style_id',
        nullable: true
    })
    styleId: number

    @Column('int', {
        name: 'color_id',
        nullable: true
    })
    colorId: number

    @Column('int', {
        name: 'operation_id',
        nullable: false
    })
    operationId: number


    @Column('int', {
        name: 'quality_type_id',
        nullable: false
    })
    qualityTypeId: number

    @Column('int', {
        name: 'defect_id',
        nullable: true
    })
    defectId: number

    @Column('varchar', {
        name: 'test_result',
        nullable: false
    })
    testResult: string

    @Column('varchar', {
        name: 'role',
        nullable: false
    })
    role: string

    @Column('int', {
        name: 'po_id',
        nullable: true
    })
    poId: number

    @Column('int', {
        name: 'employee_id',
        nullable: false
    })
    employeeId: number

    @Column('varchar', {
        name: 'employee_name',
        nullable: false,
        length: 50
    })
    employeeName: string

    @Column('varchar', {
        name: 'barcode',
        nullable: false,
        length: 50
    })
    barcode: string

}