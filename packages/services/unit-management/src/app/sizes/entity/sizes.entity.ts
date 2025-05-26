import { Column,Entity} from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

@Entity('sizes')
export class SizesEntity extends AbstractEntity {



    @Column('varchar',{
      name: 'size_code',
      length:15,
      nullable:false
    })
    sizeCode:string;
    
    @Column('varchar',{
      length: 15,
      name: 'size_desc',
      nullable:false
    })
    sizeDesc:string;

    @Column('int',{
      name: 'size_index',
      nullable:false
    })
    sizeIndex:number;

    
}
