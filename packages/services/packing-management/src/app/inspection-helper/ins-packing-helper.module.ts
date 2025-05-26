import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InsPackingHelperController } from "./ins-packing-helper.controller";
import { InsPackingHelperService } from "./ins-packing-helper.service";
import { PackingListModule } from "../packing-list/packing-list.module";
import { CartonRepo } from "../packing-list/repositories/carton-repo";


@Module({
    imports:[
        TypeOrmModule.forFeature([]),
        forwardRef(()=>PackingListModule),
    ],
    controllers:[InsPackingHelperController],
    providers:[InsPackingHelperService,],
})
export class InsPackingHelperModule {}