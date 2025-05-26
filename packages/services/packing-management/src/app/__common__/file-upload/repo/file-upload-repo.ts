

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { FileUploadRepoInterface } from "./file-upload-repo-interface"; 
import { FileUploadEntity } from "../entity/file-upload.entity";


@Injectable()
export class FileUploadRepo extends BaseAbstractRepository<FileUploadEntity> implements FileUploadRepoInterface {
    constructor(
        @InjectRepository(FileUploadEntity)
        private readonly fileUploadEntity: Repository<FileUploadEntity>,
    ) {
        super(fileUploadEntity);
    }

}