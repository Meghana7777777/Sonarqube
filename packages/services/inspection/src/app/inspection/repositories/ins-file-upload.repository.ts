import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { FileUploadEntity } from "../../entities/file-upload.entity";

@Injectable()
export class FileUploadRepo extends Repository<FileUploadEntity> {
    constructor(dataSource: DataSource) {
        super(FileUploadEntity, dataSource.createEntityManager());
    }
}