import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('cut_table_plan')
export class CutTablePlanEntity{
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 100, name: "po_serial", nullable: true, comment: '' })
    poSerial: string;
  
    @Column("varchar", { length: 100, name: "docket_number", nullable: true, comment: '' })
    docketNumber: string;

    @Column("varchar", { length: 100, name: "resource_id", nullable: true, comment: '' })
    resourceId: string;
  
    @Column("varchar", { length: 100, name: "load_time", nullable: true, comment: '' })
    loadTime: string;


    @Column("varchar", { length: 100, name: "material_request_status", nullable: true, comment: '' })
    materialRequestStatus: string;

    @Column("varchar", { length: 100, name: "material_allocation_status", nullable: true, comment: '' })
    materialAllocationStatus: string;
  
    @Column("varchar", { length: 100, name: "material_issued_status", nullable: true, comment: '' })
    materialIssuedStatus: string;

    @Column("varchar", { length: 100, name: "material_request_time", nullable: true, comment: '' })
    materialRequestTime: string;

    @Column("varchar", { length: 100, name: "material_allocation_time", nullable: true, comment: '' })
    materialAllocationTime: string;
  
    @Column("varchar", { length: 100, name: "material_issued_time", nullable: true, comment: '' })
    materialIssuedTime: string;

    @Column("varchar", { length: 100, name: "remarks", nullable: true, comment: '' })
    remarks: string;

    @Column("varchar", { length: 100, name: "material_request_by", nullable: true, comment: '' })
    materialRequestBy: string;
  
    @Column("varchar", { length: 100, name: "material_allocation_by", nullable: true, comment: '' })
    materialAllocationBy: string;

    @Column("varchar", { length: 100, name: "material_issued_by", nullable: true, comment: '' })
    materialIssuedBy: string;

    @Column("varchar", { length: 100, name: "material_requirement", nullable: true, comment: '' })
    materialRequirement: string;


}