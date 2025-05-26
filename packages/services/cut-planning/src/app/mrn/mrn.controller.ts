import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, LayerMeterageRequest, MrnCreateRequest, MrnIdStatusRequest, MrnRequestResponse, MrnRequestResponseOfTheDay, MrnStatusRequest } from '@xpparel/shared-models';
import { MrnInfoService } from './mrn-info.service';
import { MrnService } from './mrn.service';

@ApiTags('Mrn handling')
@Controller('mrn')
export class MrnController {
  constructor(
    private service: MrnService,
    private infoService: MrnInfoService
  ) {

  }

  @ApiBody({ type: MrnCreateRequest })
  @Post('/createMrnRequest')
  async createMrnRequest(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * Validations
       * 1. The docket must have atleast 1 lay that is still INPROGRESS.
       * 2. The materials received from the request must not be locked with any of the other dockets
       * Logic:
       * get the lay id that is in progress / paused for the docket
       * for every roll - get the info from the WMS
       * Apply a redis lock for the whole unit code
       *  create the records in the MRN, MRN item and po-docket-material entity with the MRN id
       * Release the lock
       */
      return await this.service.createMrnRequest(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: MrnIdStatusRequest })
  @Post('/deleteMrnRequest')
  async deleteMrnRequest(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * If the MRN status is <> open then throw error 
       * delete the mrn request, its items and the po-docket material with the mrn id
       */
      return await this.service.deleteMrnRequest(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: MrnStatusRequest })
  @Post('/getMrnRequestsByMrnStatus')
  async getMrnRequestsByMrnStatus(@Body() req: any): Promise<MrnRequestResponse> {
    try {
      return await this.infoService.getMrnRequestsByMrnStatus(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: MrnIdStatusRequest })
  @Post('/getMrnRequestForMrnId')
  async getMrnRequestForMrnId(@Body() req: any): Promise<MrnRequestResponse> {
    try {
      return await this.infoService.getMrnRequestForMrnId(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: MrnIdStatusRequest })
  @Post('/changeMrnRequestStatus')
  async changeMrnRequestStatus(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * Valiations:
       * If the lay is confirmed for the docket, you cannot modify the status
       * ensure the order of status change should follow as in MrnStatusEnum
       * change the status and insert the new record in the mrn-status-history entity with the current incoming status and mrn id
       */
      return await this.service.changeMrnRequestStatus(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }


  @Post('/getTotalRequestedQuantityToday')
  async getTotalRequestedQuantityToday(@Body() req: LayerMeterageRequest): Promise<MrnRequestResponseOfTheDay> {
    try {
      return await this.infoService.getTotalRequestedQuantityToday(req);
    } catch (err) {
      return returnException(MrnRequestResponseOfTheDay, err);
    }
  }
}
