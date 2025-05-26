export const SpsIntlMessageCodesEnglish = {
    //sps → 26001-31000
    //DowntimeService
    26001: "Down Time created successfully",
    26002: 'Downtime record not found',
    26003: "Down Time updated successfully",
    26004: 'Error updating downtime: ${error.message}',
    //ForecastPlanningService
    26005: 'forecast data saved successfully',
    26006: 'Forecast status fetched successfully',
    26007: 'Error fetching forecast status',
    //ModuleService
    26008: "No Modules Found for the Given Section Code",
  
    26010: "Data exists w3ith same component",
    26011: `Section "Updated" : "Created" Successfully`,
    26012: "Please give Module Id",
    26013: "Module Data not Found",
    26014: ' Module Deleted Successfully',
    26015: "No Data Found",
    26016: 'Module de-activated successfully' ,
    
    26017: 'No modules found for section code: ${req.secCode}',
    26018: "Modules fetched successfully",
    26019: 'Failed to fetch modules: ${error.message}',
    26020: 'Module Code is required',
    26021: 'No  data found for the provided module code',
    26022: 'Data fetched successfully',
   
    //SewVersionService
    26024: 'OP version is already saved for the PO and product : ${req.productName} ',
    26025: 'Operation Sequence Saved Successfully',
    26026: 'Provide the op version id',
    26027: 'Op version does not exist for the provided version id',
    26028: 'Operation Sequence Deleted Successfully',
    26029: 'Unable to retrieve operation version model by ops version Id',
    26030: 'Operation Version Cloned Successfully',
    26031: 'Version details retrieved successfully',
    26032: 'Data fetched successfully',
    
    //SewVersionInfoService

    26034: 'Operation version details not found for the given details',

    26035: 'Job Group details not found in the operation sequence ${jobGroup}',
    //SewingJobGenerationServiceForMO

    26036: ' sewingOrderInfoObj',

    26037: 'Sewing job quantity should be more than logical bundle qty',
    26038: 'Jobs Preview For the Bundle Group and features Retrieved successfully',

    26039: 'Fgs not found for the OSL REF Id ',
    26040: 'Sewing jobs saved Successfully',
    26041: 'No sewing jobs found',
    26042: 'sewing jobs already planned',
    26043: "Sewing Jobs Deleted Successfully",

    26044: 'Job not yet planned please plan and try again',
    26045: 'Process job header properties retrieved successfully',

    26046: 'Required Panel Info retrieved successfully',
    26047: 'Request Created Successfully',

    //SewingJobGenerationService
    26048: 'Sewing Order details not found for the given id please check and try again Id: ${sewingOrderId}',
    26049: 'Sewing order info retrieved successfully',
    26050: 'Sewing Order details not found for the given id please check and try again sewSerial: ${sewSerial}',
    26051: 'Feature Group Details Retrieved successfully',
    26052: 'Sewing Order details not found for the given id please check and try again sewSerial: ${sewingOrderId}',
    26053: 'Sewing job quantity should be more than logical bundle qty',
    26054: 'Sewing job qty should be min of bundle height ',
    26055: 'Sewing Job Preview Details Retrieved Successfully',
    26056: 'No sewing jobs found',
    26057: 'sewing jobs already planned',
    26058: "Sewing Jobs Deleted Successfully",
    26059: 'Sewing job details not found for the given sewing job',
    26060: 'Job Details not found in the job fg',
    26061: 'Components not found for the given details',

    26062: 'Barcode details retrieved successfully',

    //InputPlanningDashboardService


    26063: "No sections found",
    26064: "Input Planning Dashboard data fetched successfully",
    26065: 'Failed to fetch Input Planning Dashboard data. Error',
    26066: "Downtime details fetched successfully",
    26067: 'Trim detail retrieved successfully.',
    26068: 'Failed to retrieve trim details',

    26069: "Operations retrieved successfully",
    26070: 'Failed to retrieve operations: ${err.message}',
    26071: 'Failed to retrieve module details for moduleCode: ${req.moduleCode}. Error: ${err.message}',

    //SewingJobPlanningService
    26072: 'Sewing Orders retrieved successfully',
    26073: 'Failed to fetch orders: ${error.message}',
    26074: 'Sewing Order Lines retrieved successfully',
    26075: 'Failed to fetch order lines: ${error.message}',
    26076: 'Sewing Order sew serial retrieved successfully',
    26077: 'Failed to fetch sew serials',
    26078: 'Operations data fetched successfully',
    26079: 'Failed to fetch operations data: ${error.message}',
    26080: 'No sewing job data found',
    26081: 'Sewing job data with operations fetched successfully',
    26082: 'Failed to fetch sewing job data: ${error.message}',
    26083: 'Sewing job ${req.jobNo} status updated to in progress successfully',

    //SewingOrderService
    26084: 'Unable to save data in Order Entity',
    26085: 'Unable to save data in Order Line Entity',
    26086: 'Unable to save data in Order Line Group Entity',
    26087: 'Sewing Order Created Successfully',
    26088: 'Sewing Order data retrieved successfully',
    26089: 'Sew Fg Info Saved successfully',
    26090: 'No sub line ids exists for the given order number',
    26091: 'sub line ids for the order',
    26092: 'Operation Version already mapped Cannot delete the sewing oredr',
    26093: 'Sewing Serial Does Not exists',
    26094: "Sewing Serial Deleted Successfully",
    26095: 'Customer Info Retrieved successfully for SewSerial',

    //SectionService

    // 26096: 'Internal server error', "Already exists",
    26097: "Data exists with same component",
    26098: 'Section "Updated" : "Created" Successfully',
    26099: "Please give section Id",
    26100: "Section Data not Found",
    26101: 'Section Deleted Successfully',

    26102: 'Sections data fetched successfully',
    26103: 'Failed to fetch section data: ${error.message}',
    26104: 'Section de-activated successfully' ,
    
    26105: "No sections found for the given company code and unit code",
    26106: "Sections retrieved successfully",

    26107: 'No sections found',
    26108: 'Job number is required',
    26109: 'No data found for the provided job number',

    26110: "Data exists with same component",
    26111: 'Workstation "Updated" : "Created" Successfully',
    26112: "Please give workstation Id",
    26113: "workstation Data not Found",
    26114: 'workstation Deleted Successfully',
    26115: 'No Work stations found for section code',
    26116: "Work Stations fetched successfully",
    26117: 'Failed to fetch Work Stations: ${error.message}',
    26118: 'workstation de-activated successfully',
    
    26119: 'No Workstations found for the provided Module Code',
    //WorkstationOperationService
    26120: "Please give work station operation Id",
    26121: "workstation Data not Found",
    26122: 'workstation Deleted Successfully',
    26123: 'workstation operation de-activated successfully' ,
    
    // TrimsIssuedDashboardService
    26124: 'Trim details retrieved successfully.',
    26125: 'Failed to retrieve trim details: ${err.message}',
    26127: 'Failed to retrieve module details for moduleCode: ${req.moduleCode}. Error: ${err.message}',
    26128: "No sections found",
    26129: "Input Planning Dashboard data fetched successfully",
    26130: 'Failed to fetch Input Planning Dashboard data. Error: ${err.message}',
    26131: 'All issued quantities updated successfully',
    //BullQueueService 
   
    //WorkstationOperationService
    26133: 'workstation operation activated successfully',
    26134: 'workstation activated successfully',
    26135: 'Section activated successfully',
     //SewVersionService
    26136:'Module activated successfully',
    26137:'Operation Version does not exists Please check and try again',
  //SewVersionInfoService
    26138:'opVersion data retrieved',
   
    26139: "Failed to fetch data",
    26140:'Sewing Order details not found for the given id please check and try again sew Serial: ${sewSerial}',
    
    26143:'Job Details not found the given job',
    26144:'Sewing job Batch info retrieved successfully',
    26145:'Success',
    26146: "WorkStation Already exists"

    //
    



    
 


  

  

}
