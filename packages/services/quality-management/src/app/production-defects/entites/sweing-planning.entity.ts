import { SweingPlanningZoneEnum } from "@xpparel/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sweing_planning')
export class SweingPlanningEntity {
  
    @PrimaryGeneratedColumn("increment",{
        name:'sweing_planning_id'
    })
    sweingPlanningId:number

    @Column('int',{
        name:'po_number_id',
        nullable:true
    })
    poNumberId:number
    versionFlag: number;

    @Column('varchar',{
        name:'sweing_quantity',
        nullable:true
    })
    sweingQuantity:number
    updateduser:string;

    @Column('varchar',{
        name:'escallation_matrix_1',
        nullable:true
    })
    EscallationMatrix1:string

    @Column('varchar',{
        name:'escallation_matrix_2',
        nullable:true
    })
    EscallationMatrix2:string
    
    @Column('varchar',{
        name:'escallation_matrix_3',
        nullable:true
    })
    EscallationMatrix3:string

    @Column('enum',{
        name:'zone',
        enum:SweingPlanningZoneEnum
      })
      zone: SweingPlanningZoneEnum
}