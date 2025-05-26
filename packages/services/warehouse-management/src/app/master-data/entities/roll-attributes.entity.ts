import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('roll_attributes')
export class RollAttributesEntity extends AbstractEntity {
    @Column('varchar', {name:'name',
        length: 100,
      })
      name: string;
    
      @Column('varchar', {name:'code',
        length: 50,
      })
      code: string;
    
     
    
     
}