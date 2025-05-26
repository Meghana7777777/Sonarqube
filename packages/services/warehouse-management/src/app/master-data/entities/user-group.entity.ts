import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('user_group')
export class UserGroupEntity extends AbstractEntity {
    @Column('varchar', {name:'group_name',
        length: 100,
      })
      groupName: string;
    
      @Column('varchar', {name:'user_id',  
      })
      userId: string;
    
     
    
     
}