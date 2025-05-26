import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('approval_hierarchy')
export class ApprovalHierarchyEntity extends AbstractEntity {
    @Column('varchar', {name:'feature',
        length: 100
      })
      feature: string;
    
      @Column('varchar', {name:'sub_feature',
        length: 50
      })
      subFeature: string;
    
      @Column('varchar', {name:'user_role',
      length: 50
      })
      userRole: number;
    
      @Column('varchar', {name:'order',
        length: 50
      })
      order: string;
    
     


    
      
}