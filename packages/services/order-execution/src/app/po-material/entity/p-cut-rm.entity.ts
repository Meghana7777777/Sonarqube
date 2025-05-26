import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum, InsUomEnum } from '@xpparel/shared-models';
import { PCutRmSizePropsEntity } from "./p-cut-rm-size-prop.entity";

@Entity('p_cut_rm')
export class PCutRmEntity extends AbstractEntity {

    @Column({ type: 'varchar', length: 30, name: 'item_code', nullable: false  })
    itemCode: string;
  
    @Column({ type: 'varchar', length: 100, name: 'item_name', nullable: true })
    itemName: string;
  
    @Column({ type: 'varchar', length: 200, name: 'item_desc', nullable: true  })
    itemDesc: string;
  
    @Column({ type: 'varchar', length: 10, name: 'uom', nullable: true  })
    uom: InsUomEnum; // Assuming UOM is an enumerated type in your database
  
    @Column({ type: 'tinyint', name: 'sequence', default: 0 })
    sequence: number;
  
    @Column({ type: 'text', name: 'components', comment: 'Components saved in a csv format', nullable: false })
    componentNames: string;

    @Column({ type: 'varchar', length:5, name: 'ref_component', comment: 'The Ref component per fabric. Begins form 1 and goes on under a ', nullable: false })
    refComponent: string;
  
    @Column({ type: 'varchar', length: 20, name: 'fab_category', nullable: true  })
    fabricCategory: string;
  
    @Column({ type: 'varchar', length: 10, name: 'cg_name', nullable: true  })
    cgName: string;
  
    @Column({ type: 'varchar', length: 20, name: 'pattern_ver', nullable: true  })
    patternVersion: string;
  
    @Column({ type: 'varchar', length: 10, name: 'gusset_sep', nullable: true  })
    gussetSeparation: string;
  
    @Column({ type: 'varchar', length: 20, name: 'strip_match', nullable: true  })
    stripMatch: string;
  
    @Column({ type: 'decimal',  precision: 6, scale: 2, name: 'pur_width', nullable: true  })
    purchaseWidth: string;
  
    @Column({ type: 'decimal',  precision: 8, scale: 4, name: 'avg_cons', nullable: true  })
    avgConsumption: number;
  
    @Column({ type: 'bigint', name: 'po_serial', nullable: false })
    poSerial: number;

    @Column({ type: 'integer', name: 'max_plies', nullable: true, default: 0 })
    maxPlies: number;

    @Column({ type:  'decimal',  precision: 8, scale: 4, name: 'wastage', nullable: true, default: 0 })
    wastage: number;

    @Column({ type: 'varchar', name: 'item_color', nullable: true, default: ''  })
    itemColor: string;

    @Column({ type: 'varchar',length:'40', name: 'product_type', nullable: false  })
    productType: string;

    @Column({ type: 'varchar', name: 'product_name', nullable: false  })
    productName: string;

    @Column({ type: 'varchar', name: 'fg_color', nullable: false  })
    fgColor: string;
    
    @Column({ type: 'boolean', name: 'is_main_fabric', default: false  })
    isMainFabric: boolean;

    @Column({ type: 'boolean', name: 'is_binding', default: false  })
    isBinding: boolean;

    @Column({ type: 'decimal',  precision: 8, scale: 4, name: 'binding_cons', nullable: true, default: 0  })
    bindingConsumption: number;

    @OneToMany(type => PCutRmSizePropsEntity, pcrm => pcrm.poCutMaterialId, { cascade: true })
    pCutRmSizeProps: PCutRmSizePropsEntity[];
}