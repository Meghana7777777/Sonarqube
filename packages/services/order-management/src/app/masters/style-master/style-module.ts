import { Module } from "@nestjs/common";
import { StyleEntity } from "./entity/style-entity";
import { StyleRepository } from "./repository/style-repository";
import { StyleController } from "./style-controller";
import { StyleService } from "./style-service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([StyleEntity])],
    controllers: [StyleController],
    providers: [StyleService,StyleRepository],
    exports: [StyleService]
})
export class StyleModule { }