import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, OrderDataItemDetailsResponse, OrderNumbersRequest, PoItemProductModel, PoItemRefCompProductModel, PoProdTypeAndFabResponse, PoProdutNameRequest, PoRmResponse, PoRmUpdateRequest, PoSerialRequest, RefComponentInfoResponse } from '@xpparel/shared-models';
import { PoMaterialInfoService } from './po-material-info.service';
import { PoMaterialService } from './po-material.service';


@ApiTags('Production order material')
@Controller('po-material')
export class PoMaterialController {
    constructor(
        private service: PoMaterialService,
        private infoService: PoMaterialInfoService
    ) {

    }

    /**
     * saves the po material props
     * @returns 
     */
    @ApiBody({type: PoRmUpdateRequest})
    @Post('/updatePoMaterialProps')
    async updatePoMaterialProps(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // Here we have to update the sizes level properties and the RM level properties like maxplies, cons, wastage, etc
            return await this.service.updatePoMaterialProps(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * Only unset the user entered values for the po RM if any
     * deletes the po material props
     * @returns 
     */
    @ApiBody({type: PoSerialRequest})
    @Post('/deletePoMaterialProps')
    async deletePoMaterialProps(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // This means we have to update all the values of all the RMs to zero. i.e maxplies, consumption, wastage, etc
            // Currently not useful. Dont implement this
            return await this.service.deletePoMaterialProps(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * gets the po material info
     * @returns 
     */
    @ApiBody({type: PoSerialRequest})
    @Post('/getPoMaterialInfo')
    async getPoMaterialInfo(@Body() req: any): Promise<PoRmResponse> {
        try {
            return await this.infoService.getPoMaterialInfo(req);
        } catch (err) {
            return returnException(PoRmResponse, err);
        }
    }

    /**
     * gets the Prodcut type => fabrics[] for the given po
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoSerialRequest })
    @Post('/getPoProdTypeAndFabrics')
    async getPoProdTypeAndFabrics(@Body() req: any): Promise<PoProdTypeAndFabResponse> {
        try {
            return await this.infoService.getPoProdTypeAndFabrics(req);
        } catch(err) {
            return returnException(PoProdTypeAndFabResponse, err);
        }
    }

    @ApiBody({ type: PoProdutNameRequest })
    @Post('/getPoProdTypeAndFabricsForProductName')
    async getPoProdTypeAndFabricsForProductName(@Body() req: any): Promise<PoProdTypeAndFabResponse> {
        try {
            return await this.infoService.getPoProdTypeAndFabricsForProductName(req);
        } catch(err) {
            return returnException(PoProdTypeAndFabResponse, err);
        }
    }

    /**
     * Service to get product type fabric for the given PO
     * @param req 
     * @returns 
    */
    @ApiBody({ type: PoSerialRequest })
    @Post('/getPoProdTypeAndFabricsAndItsSizes')
    async getPoProdTypeAndFabricsAndItsSizes(@Body() req: any): Promise<PoProdTypeAndFabResponse> {
        try {
            return await this.infoService.getPoProdTypeAndFabricsAndItsSizes(req);
        } catch(err) {
            return returnException(PoProdTypeAndFabResponse, err);
        }
    }

    @ApiBody({ type: PoItemProductModel })
    @Post('/getRefComponentForPoAndFabric')
    async getRefComponentForPoAndFabric(@Body() req: PoItemProductModel): Promise<RefComponentInfoResponse> {
        try {
            return await this.service.getRefComponentForPoAndFabric(req.poSerial, req.companyCode, req.unitCode, req.itemCode, req.productName, req.fgColor);
        } catch(err) {
            return returnException(RefComponentInfoResponse, err);
        }
    }

    @ApiBody({ type: PoItemRefCompProductModel })
    @Post('/getAcComponentForPoFabricAndRefComp')
    async getAcComponentForPoFabricAndRefComp(@Body() req: PoItemRefCompProductModel): Promise<RefComponentInfoResponse> {
        try {
            return await this.service.getAcComponentForPoFabricAndRefComp(req.poSerial, req.companyCode, req.unitCode, req.itemCode, req.productName, req.fgColor, req.refComponent);
        } catch(err) {
            return returnException(RefComponentInfoResponse, err);
        }
    };

    @ApiBody({ type: PoItemRefCompProductModel })
    @Post('/getRefComponentsForPoAndProduct')
    async getRefComponentsForPoAndProduct(@Body() req: PoItemRefCompProductModel): Promise<RefComponentInfoResponse> {
        try {
            return await this.service.getRefComponentsForPoAndProduct(req.poSerial, req.companyCode, req.unitCode, req.productName, req.fgColor);
        } catch(err) {
            return returnException(RefComponentInfoResponse, err);
        }
    };
    // @ApiBody({ type: OrderNumbersRequest})
    // @Post('/getOrderColorItemWiseDetails')
    // async getOrderColorItemWiseDetails(@Body() req: any): Promise<OrderDataItemDetailsResponse> {
    //     try {
    //         return await this.service.getOrderColorItemWiseDetails(req);
    //     } catch (err) {
    //         return returnException(OrderDataItemDetailsResponse, err);
    //     }
    // }
    

}


