import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileUploadEntity } from "./entity/file-upload.entity";
import { FileUploadController } from "./file-upload-controller";
import { FileUploadService } from "./file-upload-service";
import { LoggerService } from "../../../logger";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { DataSource } from "typeorm";
import { FileUploadRepo } from "./repo/file-upload-repo";

@Module({
    imports: [
        TypeOrmModule.forFeature([FileUploadEntity]),
    ],
    controllers: [FileUploadController],
    providers: [
        FileUploadService,
         {
            provide: 'TransactionManager',
            useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
            inject: [DataSource],
        },
        {
            provide: 'LoggerService',
            useClass: LoggerService,
        },
        {
            provide: 'FileUploadRepoInterface',
            useClass: FileUploadRepo,
        },
    ]
})
export class FileUploadModule { }