import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductsCreateRequest, ProductsIdRequest, ProductsResponse } from "@xpparel/shared-models";
import { CommonResponse, returnException } from "@xpparel/backend-utils";
import path, { extname } from "path";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync } from "fs";
import * as fs from "fs";
import { ProductsService } from "./product-service";

const fileDestination = path.join(__dirname, '../../../../packages/services/order-management/upload-files/products-images');

if (!fs.existsSync(fileDestination)) {
  fs.mkdirSync(fileDestination);
}

@ApiTags('product')
@Controller('product')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Post('createProduct')
  @ApiBody({ type: ProductsCreateRequest })
  async createProduct(@Body() req: ProductsCreateRequest): Promise<ProductsResponse> {
    try {
      return await this.service.createProduct(req);
    } catch (error) {
      return returnException(ProductsResponse, error);
    }
  }

  @Post('deleteProduct')
  @ApiBody({ type: ProductsIdRequest })
  async deleteProduct(@Body() req: ProductsIdRequest): Promise<ProductsResponse> {
    try {
      return await this.service.deleteProduct(req);
    } catch (error) {
      return returnException(ProductsResponse, error);
    }
  }

  @Post('getAllProducts')
  @ApiBody({ type: ProductsIdRequest })
  async getAllProducts(@Body() req: ProductsIdRequest): Promise<ProductsResponse> {
    try {
      return await this.service.getAllProducts(req);
    } catch (error) {
      return returnException(ProductsResponse, error);
    }
  }

  @Post('activateDeactivateProduct')
  @ApiBody({ type: ProductsIdRequest })
  async activateDeactivateProduct(@Body() req: ProductsIdRequest): Promise<ProductsResponse> {
    try {
      return await this.service.activateDeactivateProduct(req);
    } catch (error) {
      return returnException(ProductsResponse, error);
    }
  }

  @Post('/updateProductImage')
  @ApiOperation({ summary: 'Upload Product Image' })
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
  async updateProductImage(@UploadedFiles() files: any, @Body() uploadData: any): Promise<CommonResponse> {
    try {
      if (!files || files.length === 0) {
        const updateResult = await this.service.updateProductImage(null, uploadData.id);
        return updateResult;
      }
      return await this.service.updateProductImage(files, uploadData.id);
    } catch (error) {
      if (files?.length > 0 && files[0]?.filename) {
        const createdFilePath = path.join(fileDestination, files[0].filename);
        if (fs.existsSync(createdFilePath)) fs.unlinkSync(createdFilePath);
      }
      return returnException(CommonResponse, error);
    }
  }

  @Post('getProductByProductCode')
    @ApiBody({ type: ProductsIdRequest })
    async getProductByProductCode(@Body() req: ProductsIdRequest): Promise<ProductsResponse> {
      try {
        return await this.service.getProductByProductCode(req);
      } catch (error) {
        return returnException(ProductsResponse, error);
      }
    }
}