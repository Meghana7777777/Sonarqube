import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";


@Entity('mover')
export class MoverEntity extends AbstractEntity {
    @Column('varchar', {name:'name',
        length: 100,
      })
      name: string;
    
      @Column('varchar', {name:'code',
        length: 50,
      })
      code: string;
    
      @Column('int', {name:'capacity',
      })
      capacity: string;
    
      @Column('varchar', {name:'uom',
        length: 50,
      })
      uom: string;
       
      
}