import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { CommonResponse, PoNumberRequest, SewingDefectFilterReq } from "@xpparel/shared-models";
import { DateDTO } from "./dto/date-dto";
import { PoIdRequest } from "./dto/po-id.req";
import { ProductionDefectDto } from "./dto/production-defects-req";
import { ProductionDefectService } from "./production-defects.service";

@ApiTags('production-defects')
@Controller('production-defects')
export class ProductionDefectController {
    constructor(
        private readonly Service: ProductionDefectService,
    ) { }

    @Post('createSewingDefect')
    @ApiBody({ type: ProductionDefectDto })
    async createSewingDefect(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.createSewingDefect(req);
        } catch (err) {
            return returnException(CommonResponse, err)
        }
    }

    @Post('getPassFailCount')
    @ApiBody({ type: PoNumberRequest })
    async getPassFailCount(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getPassFailCount(req);
        } catch (err) {
            return returnException(CommonResponse, err)
        }
    }

    @Post('sendMail')
    async sendMail(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.sendMail(req);
        } catch (err) {
            return returnException(CommonResponse, err)
        }
    }

    @Post('getSewingQtyAgainstPo')
    @ApiBody({ type: PoIdRequest })
    async getSewingQtyAgainstPo(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getSewingQtyAgainstPo(req);
        } catch (err) {
            return returnException(CommonResponse, err)
        }

    }

    @Post('getSewingDefectInfo')
    @ApiBody({ type: SewingDefectFilterReq })
    async getSewingDefectInfo(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getSewingDefectInfo(req);
        } catch (err) {
            return returnException(CommonResponse, err)
        }

    }
 
    @Post('/getByPoNumber')
    @ApiBody({ type: PoIdRequest })
    async getByPoNumber(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getByPoNumber();
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }
 
    @Post('/getAllTotalDefects')
    @ApiBody({ type: DateDTO })
    async getAllTotalDefects(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getAllTotalDefects(req);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }
 
    @Post('/getAllPassCount')
    @ApiBody({ type: DateDTO })
    async getAllPassCount(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getAllPassCount(req);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }
 
    @Post('/getAllFailCount')
    @ApiBody({ type: DateDTO })
    async getAllFailCount(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getAllFailCount(req);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }
 
    @Post('/getAllBuyerWiseDefect')
    @ApiBody({ type: DateDTO })
    async getAllBuyerWiseDefect(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getAllBuyerWiseDefect(req);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }
    
    @Post('/getAllPOWiseDefect')
    @ApiBody({ type: DateDTO })
    async getAllPOWiseDefect(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getAllPOWiseDefect(req);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }
    
    @Post('/getAllTopTenDefects')
    @ApiBody({ type: DateDTO })
    async getAllTopTenDefects(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getAllTopTenDefects(req);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }
    
    @Post('/getAllQualityTypeTopTenDefects')
    @ApiBody({ type: DateDTO })
    async getAllQualityTypeTopTenDefects(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.Service.getAllQualityTypeTopTenDefects(req);
        } catch (error) {
            return returnException(CommonResponse, error)
        }
    }

    // @Post('/createDefect')
    // @ApiBody({ type: QualityCheckRequest })
    // async createDefect(@Body() req: any): Promise<CommonResponse> {
    //     try {
    //         return await this.Service.createDefect(req);
    //     } catch (err) {
    //         return returnException(CommonResponse, err)
    //     }
    // }

    

}
