import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "./entity/customer-entity";
import { CustomerController } from "./customer-controller";
import { CustomerService } from "./customer-service";
import { CustomerRepository } from "./repository/customer-repository";

@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity])],
    controllers: [CustomerController],
    providers: [CustomerService,CustomerRepository],
    exports: [CustomerService]
})
export class CustomerModule { }