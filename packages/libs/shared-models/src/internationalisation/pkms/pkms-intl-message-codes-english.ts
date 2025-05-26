export const PkmsIntlMessageCodesEnglish = {
    //pkms → 36001-41000

    // MaterialTypeService
    36001: 'material type saved successfully',
    36002: "Material Type Code already exists.",

    36003: 'material type data retrieved successfully',
     36004: 'items data retrieved successfully',

    //ItemsService
    36005: "Items Code already exists.",
    36006: 'items data retrieved successfully',

    36007: 'Packing spec data retrieved successfully',

    //PackTableService
    36008: "Please Remove Spaces Before Table Name",
    36009: "Please Remove Spaces After Table Name",
    36010: 'PackTable with name "${rec.tableName}" already exists.',
    
    36012: 'Job request is not created in the pack table',
    36013: 'The request ${reqModel.packTableId} is already planned to cut table ${deletePackTable.workStationDesc}',
    36014: 'The request ${reqModel.jobNumber} is already sent to the packTable. Please unPlan the jobNumber and try',
    36015: 'PackTable Deleted Successfully',
    //PackTypeService
    36016: 'material type saved successfully',
    36017: "Pack Type Code already exists.",
    36018: ' Pack type data retrieved successfully',
    36019: 'PAck type data retrieved successfully',
    36020: 'items data retrieved successfully',

    // PackJobService
    36021: 'Request ${currPlanningJOb.packJobNumber} does not exist',
    36022: 'Request ${currPlanningJOb.packJobNumber} is already completed. You cannot unplan',
    36023: 'Request unplanned successfully',
    36024: 'No inprogress and completed pack jobs requests are found',
    36025: 'Pack Tables planned successfully',

    36026: "you can plan only one request at a time",
    36027: "No packJobs are available",
    36028: "packJobs already mapped to packTable",
    36029: "given table id doesn't exist",
    36030: 'Pack jobs are plan to pack table',

    // PackingMaterialReqService
    36031: 'Pack List saved successfully',
    36032: 'material req are not found',
    36033: 'Pack Materials retrieved Successfully',
    36034: 'There Is No Items Mapped',
    36035: 'Pack Material Summary Retrieved',
    36036: "Please Provide Valid Material Request Id",
    //  36037: 'Material Has Been ${statusObj[req.status]['message']} Successfully',

    //PAckingMaterialReqInfoService
    36038: 'Data not available with given Pack list Id',
    //InspectionPreferenceService
    36039: 'PackList not found',
    36040: 'Saved Successfully',

    36041: 'Packing list header not found. Please check.',
    36042: 'Inspection Confirmed successfully.',
    36043: "Ins Pending Materials Retrieved Successfully",
    36044: 'Inspection request is invalid',
    36045: 'The Inspection flow is incorrect. PENDING -> MATERIAL RECEIVED -> PROGRESS -> COMPLETED ',

    36046: 'Inspection request status changed successfully',

    36047: "Please Select All Cartons",
    36048: "Inspection Updated Successfully",
    36049: 'Req Is Not Valid',
    36050: "Inspection Completed For Given data",
    36051: "Inspection Not Completed For Given data",
    //PreIntegrationService
    36052: 'Unable to save data in Order Entity',
    36053: 'Unable to save data in Order Line Entity',
    36054: 'Unable to save data in Order Line Group Entity',
    36055: 'Po data saved successfully',
    36056: 'Po Data not available',
    36057: 'Po Data retrieved successfully',
    36058: 'Pack Order Data not available',
    36059: 'Pack Serial retrieved successfully',
    36060: 'No sub line ids exists for the given order number',
    36061: 'sub line ids for the order',

    36062: 'Pack Order data retrieved successfully',
    36063: 'Pack Fg Info Saved successfully',
    36064: "Pack Serial Numbers Retrieved Successfully",
    36065: 'Pack Order does not exists',
    36066: 'Pack list exist: Cannot delete the Pack order',
    36067: "Pack Order Deleted Successfully",
    //PackingListInfoService
    36068: 'Carton does not exist',
    36069: 'Carton information retrieved successfully',
    //PackListService

    36070: 'Pack List saved successfully',
    36071: "There Is No Fgs For Mapping",
    36072: 'Pack Order deleted successfully',
    36073: 'Data not available',
    36074: ' request is not found',
    36075: 'pack list already approved.',
    36076: 'Print status updated successfully',


    36077: 'released status updated successfully',



    36078: 'There is no Pack job exist with given details',

    36079: 'Carton not found with given barcode',
    36080: "Please Provide Valid UPC",
    36081: "This Fg Qty Already Mapped",
    36082: "Items Updated Successfully",
    36083: '',
    36084: 'No pack orders exist for the selected sale orders',
    36085: "Please Enter valid FG",
    36086: "You can not scan more than required quantity",
    36087: "Scan Completed",
    36088: "There Is Cartons Against To This Barcode",
    36089: 'Carton information retrieved successfully',

    36090: 'Carton weight details successfully',

    //FgRackDashboardService


    36091: 'Location Carton Info retrieved Successfully',

    //BullQueueService


    // PackingSpecService

    36093: "pack Spec  Code already exists.",
    36094: 'Packing spec ${dto.id ? "Updated"  successfully',
    36095: 'Packing spec ${dto.id ?  "Created" successfully',
    36096: 'Pack Spec data retrieved successfully',
    //RejectedReasonsService
    36097: "Reason Code already exists.",
    36098: '',
    //CartonContainerMappingService
    36099: 'Cartons deallocated from the container',
    36100: 'Carton id is not provided',
    36101: 'Carton is not mapped to the selected container.',
    36102: 'Enter the carton',
    36103: 'Max container carton capacity is not defined',
    36104: 'No container groups mapped for the pack list',
    36105: 'Container group info retrieved successfully',
    36106: 'pack jobs retrieved successfully',


}