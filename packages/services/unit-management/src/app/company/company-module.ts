import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { CompanyEntity } from "./company-entity";
import { CompanyService } from "./company-service";
import { CompanyRepository } from "./REPO/company-repo";
import { CompanyController } from "./company-controller";

@Module({
    imports: [TypeOrmModule.forFeature([CompanyEntity])],
    providers: [CompanyService, CompanyRepository],
    controllers: [CompanyController],
    exports: [CompanyService]
})
export class CompanyModule {}