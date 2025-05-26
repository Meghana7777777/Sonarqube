import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CustomerService } from "./customer-service";
import { CommonRequestAttrs, CustomerCreateRequest, CustomerDropDownResponse, CustomerIdRequest, CustomerResponse } from "@xpparel/shared-models";
import { CommonResponse, returnException } from "@xpparel/backend-utils";
import path, { extname, join, resolve } from "path";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync } from "fs";
import * as fs from 'fs'
const fileDestination = path.join(__dirname, '../../../../packages/services/order-management/upload-files/customer-images');

if (!fs.existsSync(fileDestination)) {
  fs.mkdirSync(fileDestination);
}


@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private service: CustomerService,
  ) { }

  @Post('createCustomer')
  @ApiBody({ type: CustomerCreateRequest })
  async createCustomer(@Body() req: CustomerCreateRequest): Promise<CustomerResponse> {
    try {
      return await this.service.createCustomer(req);
    } catch (error) {
      return returnException(CustomerResponse, error);
    }
  }

  @Post('deleteCustomer')
  @ApiBody({ type: CustomerIdRequest })
  async deleteCustomer(@Body() req: CustomerIdRequest): Promise<CustomerResponse> {
    try {
      return await this.service.deleteCustomer(req);
    } catch (error) {
      return returnException(CustomerResponse, error);
    }
  }

  @Post('getAllCustomers')
  @ApiBody({ type: CustomerIdRequest })
  async getAllCustomers(@Body() req: CustomerIdRequest): Promise<CustomerResponse> {
    try {
      return await this.service.getAllCustomers(req);
    } catch (error) {
      return returnException(CustomerResponse, error);
    }
  }

  @Post('getAllCustomersForDropDown')
  @ApiBody({ type: CustomerIdRequest })
  async getAllCustomersForDropDown(@Body() req: CommonRequestAttrs): Promise<CustomerDropDownResponse> {
    try {
      return await this.service.getAllCustomersForDropDown(req);
    } catch (error) {
      return returnException(CustomerResponse, error);
    }
  }


  @Post('activateDeactivateCustomer')
  @ApiBody({ type: CustomerIdRequest })
  async activateDeactivateCustomer(@Body() req: CustomerIdRequest): Promise<CustomerResponse> {
    try {
      return await this.service.activateDeactivateCustomer(req);
    } catch (error) {
      return returnException(CustomerResponse, error);
    }
  }

  @Post('/customerUpdateImage')
  @ApiOperation({ summary: 'Upload customer Image' })
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
  async customerUpdateImage(@UploadedFiles() files: any, @Body() uploadData: any): Promise<CommonResponse> {
    try {
      if (!files || files.length === 0) {
        const updateResult = await this.service.customerUpdateImage(null, uploadData.id);
        return updateResult;
      }
      return await this.service.customerUpdateImage(files, uploadData.id);
    } catch (error) {
      if (files?.length > 0 && files[0]?.filename) {
        const createdFilePath = path.join(fileDestination, files[0].filename)
        if (fs.existsSync(createdFilePath)) fs.unlinkSync(createdFilePath)
      }
      return returnException(CommonResponse, error);
    }
  }

  @Post('getCustomerByCustomerCode')
  @ApiBody({ type: CustomerIdRequest })
  async getCustomerByCustomerCode(@Body() req: CustomerIdRequest): Promise<CustomerResponse> {
    try {
      return await this.service.getCustomerByCustomerCode(req);
    } catch (error) {
      return returnException(CustomerResponse, error);
    }
  }



}