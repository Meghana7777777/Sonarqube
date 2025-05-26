import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UnitsRepository } from "./REPO/units-repo";
import { UnitsController } from "./units-controller";
import { UnitsEntity } from "./units-entity";
import { UnitsService } from "./units-service";

@Module({
    imports: [TypeOrmModule.forFeature([UnitsEntity])],
    providers: [UnitsService, UnitsRepository],
    controllers: [UnitsController],
    exports: [UnitsService]

})

export class UnitsModule {}