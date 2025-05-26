import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StyleService } from "./style-service";
import { StyleCreateRequest, StyleIdRequest, StyleRequest, StyleResponse } from "@xpparel/shared-models";
import { CommonResponse, ErrorResponse, returnException } from "@xpparel/backend-utils";
import path, { extname } from "path";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync } from "fs";
import * as fs from "fs";

const fileDestination = path.join(__dirname, '../../../../packages/services/order-management/upload-files/style-images');

if (!fs.existsSync(fileDestination)) {
    fs.mkdirSync(fileDestination);
}

@ApiTags('style')
@Controller('style')
export class StyleController {
  constructor(
    private service: StyleService,
  ) { }

  @Post('createStyle')
  @ApiBody({ type: StyleCreateRequest })
  async createStyle(@Body() req: StyleCreateRequest): Promise<StyleResponse> {
    try {
      return await this.service.createStyle(req);
    } catch (error) {
      return returnException(StyleResponse, error);
    }
  }

  @Post('deleteStyle')
  @ApiBody({ type: StyleIdRequest })
  async deleteStyle(@Body() req: StyleIdRequest): Promise<StyleResponse> {
    try {
      return await this.service.deleteStyle(req);
    } catch (error) {
      return returnException(StyleResponse, error);
    }
  }

  @Post('getAllStyles')
  @ApiBody({ type: StyleIdRequest })
  async getAllStyles(@Body() req: StyleIdRequest): Promise<StyleResponse> {
    try {
      return await this.service.getAllStyles(req);
    } catch (error) {
      return returnException(StyleResponse, error);
    }
  }

  @Post('activateDeactivateStyle')
  @ApiBody({ type: StyleIdRequest })
  async activateDeactivateStyle(@Body() req: StyleIdRequest): Promise<StyleResponse> {
    try {
      return await this.service.activateDeactivateStyle(req);
    } catch (error) {
      return returnException(StyleResponse, error);
    }
  }
  
  @Post('/styleUpdateImage')
  @ApiOperation({ summary: 'Upload Style Image' })
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
  async styleUpdateImage(@UploadedFiles() files: any, @Body() uploadData: any): Promise<CommonResponse> {
    try {
      if (!files || files.length === 0) {
        const updateResult = await this.service.styleUpdateImage(null, uploadData.id);
        return updateResult;
      }
      return await this.service.styleUpdateImage(files, uploadData.id);
    } catch (error) {
      if (files?.length > 0 && files[0]?.filename) {
        const createdFilePath = path.join(fileDestination, files[0].filename)
        if (fs.existsSync(createdFilePath)) fs.unlinkSync(createdFilePath)
        }
      return returnException(CommonResponse, error);
    }
  }
  
    @Post('getStyleByStyleCode')
    @ApiBody({ type: StyleIdRequest })
    async getStyleByStyleCode(@Body() req: StyleIdRequest): Promise<StyleResponse> {
      try {
        return await this.service.getStyleByStyleCode(req);
      } catch (error) {
        return returnException(StyleResponse, error);
      }
    }
    
}