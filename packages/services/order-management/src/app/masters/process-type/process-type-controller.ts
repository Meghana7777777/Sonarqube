import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProcessTypeService } from "./process-type-service";
import { ProcessTypeCreateRequest, ProcessTypeIdRequest, ProcessTypeResponse } from "@xpparel/shared-models";
import { CommonResponse, returnException } from "@xpparel/backend-utils";
import path, { extname, join, resolve } from "path";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync } from "fs";
import * as fs from 'fs'
const fileDestination = path.join(__dirname, '../../../../packages/services/order-management/upload-files/process-type-images')

if (!fs.existsSync(fileDestination)) {
    fs.mkdirSync(fileDestination);
}


@ApiTags('processType')
@Controller('processType')
export class ProcessTypeController {
  constructor(
    private service: ProcessTypeService,
  ) { }

  @Post('createProcessType')
  @ApiBody({ type: ProcessTypeCreateRequest })
  async createProcessType(@Body() req: ProcessTypeCreateRequest): Promise<ProcessTypeResponse> {
    try {
      return await this.service.createProcessType(req);
    } catch (error) {
      return returnException(ProcessTypeResponse, error);
    }
  }

  @Post('deleteProcessType')
  @ApiBody({ type: ProcessTypeIdRequest })
  async deleteProcessType(@Body() req: ProcessTypeIdRequest): Promise<ProcessTypeResponse> {
    try {
      return await this.service.deleteProcessType(req);
    } catch (error) {
      return returnException(ProcessTypeResponse, error);
    }
  }

  @Post('getAllProcessType')
  @ApiBody({ type: ProcessTypeIdRequest })
  async getAllProcessType(@Body() req: ProcessTypeIdRequest): Promise<ProcessTypeResponse> {
    try {
      return await this.service.getAllProcessType(req);
    } catch (error) {
      return returnException(ProcessTypeResponse, error);
    }
  }

  @Post('activateDeactivateProcessType')
  @ApiBody({ type: ProcessTypeIdRequest })
  async activateDeactivateProcessType(@Body() req: ProcessTypeIdRequest): Promise<ProcessTypeResponse> {
    try {
      return await this.service.activateDeactivateProcessType(req);
    } catch (error) {
      return returnException(ProcessTypeResponse, error);
    }
  }

@Post('/updateImagePath')
@ApiOperation({ summary: 'Upload Process Type Image' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
      id: {
        type: 'number',
      },
    },
  },
})
@UseInterceptors(FilesInterceptor('file', 1, {
  storage: diskStorage({
    destination: fileDestination,
    filename: (req, file, callback) => {
      console.log(file.originalname);
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
      callback(null, `${name}-${randomName}${fileExtName}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG)$/)) {
      return callback(new Error('Only JPG, PNG, and JPEG files are allowed!'), false);
    }
    callback(null, true);
  },
}))
async updateImagePath(@UploadedFiles() files: any, @Body() uploadData: any): Promise<CommonResponse> {
  try {
    if (!files || files.length === 0) {
      const updateResult = await this.service.updateImagePath(null, uploadData.id);
      return updateResult;
    }
    
    return await this.service.updateImagePath(files, uploadData.id);
  } catch (error) {
    if (files?.length > 0 && files[0]?.filename) {
      const createdFilePath = path.join(fileDestination, files[0].filename);
      if (fs.existsSync(createdFilePath)) fs.unlinkSync(createdFilePath);
    }
    return returnException(CommonResponse, error);
  }
}





}