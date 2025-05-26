import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';
import { OperationHelperService } from './operation-helper.service';
import { OperationEntity } from './entity/operation.entity';
import { OperationInfoService } from './operation-info.service';
import { OperationRepository } from './repository/operation.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OperationEntity
        ]),
    ],
    controllers: [OperationController],
    providers: [OperationService, OperationHelperService, OperationInfoService, OperationRepository],
    exports: [OperationService, OperationHelperService, OperationInfoService]
})
export class OperationModule { }