import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum, InsUomEnum } from '@xpparel/shared-models';
import { PCutRmEntity } from "./p-cut-rm.entity";

@Entity('p_cut_rm_size_props')
export class PCutRmSizePropsEntity extends AbstractEntity {

    @Column({ type: 'decimal',  precision: 5, scale: 2 , name: 'wastage' , nullable: true })
    wastage: number;
  
    @Column({ type: 'decimal',  precision: 5, scale: 2, name: 'consumption', nullable: true   })
    consumption: number;
  
    @Column({ type: 'varchar', length: 10 , name: 'size', nullable: false  })
    size: string;

    @Column({ type: 'varchar', length: 10, name: 'uom', nullable: true  })
    uom: InsUomEnum; // Assuming UOM is an enumerated type in your database

    @Column({ type: 'bigint', name: 'po_serial', nullable: false })
    poSerial: number;
    
    @ManyToOne(type => PCutRmEntity, pcrm => pcrm.pCutRmSizeProps, { nullable: false })
    @JoinColumn({ name: "p_cut_rm_id", foreignKeyConstraintName: "PCRM"})
    poCutMaterialId: PCutRmEntity;
}