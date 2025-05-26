export const CpsIntlMessageCodesEnglish = {
  // ( cps → 16001-21000)
  // BullQueueService common intl

  // CutDispatchHelperService
  16001: 'Vendor does not exist for the provided ID',
  16002: 'Po summary does not exist',
  //CutDispatchService
  16003: 'Lay ids must be provided',
  16004: 'Few Laying records does not exist. Refresh the page and try again ',
  16005: 'Cut dispatch request created successfully',
  16006: 'Dispatch request is already created for some of the provided cut numbers',
  16007: 'Cuts does not exist',
  16008: 'Cut is not reported for the docket : ${r.docketNumber}. Total Plies: ${r.plies} Cut Reported plies: ${cutRepPlies} ',
  16009: 'EMB not completed. Docket : ${job.refDocket},  Org Qty: ${jobQty},  Operation: ${op.opCode},  Scan qty: ${op.gQty}',
  16010: 'The dispatch request ${cutDrRec.requestNumber} is already sent out',
  16011: 'Cut dispatch request deleted successfully',
  16012: 'Print status updated successfully',
  16013: 'Dispatch is already done. It cant be changed',
  16014: 'Vendor does not exist',
  16015: 'Transport info updated for the cut dispatch request',
  16016: 'Vendor details are not updated for the Cut Dispatch',
  16017: 'Vendor details not updated for the dispatch request',
  16018: 'Cut dispatch status updated successfully',
  //CutGenerationInfoService

  16019: 'Please provide the cut numbers to get the info',
  16020: 'Cuts provided are of multiple cut orders. Please provide single prod order related cuts',

  16021: 'No dockets given in the request',
  16022: 'cut number retrieved for a docket',
  16023: "Total Layed Cuts data Retrieved",
  // CutGenerationService
  16024: 'Some dockets are not confirmed for cut generation',
  16025: 'No open main fabric dockets found for cut generation',
  16026: 'PoSerial is not provided for deleting the cuts',
  16027: 'No cuts found to delete',
  16028: `Cut dispatch is already created for the cut numbers under the cut order `,
  16029: 'Cuts deleted successfully',
  //CutReportingService
  16030: 'Cut reporting is already ${text} for this laying',
  16031: 'Cut reporting with out roll will not be allowed.',
  16032: 'Cut reporting triggered successfully',
  16033: 'Laying record does not exist',
  16034: 'Laying is not confirmed for this lay',

  16035: 'Cut is in progress for this docket : ${ rec.docketGroup } for laying no : ${ rec.id } ',
  16036: 'The docket ${ r.docketGroup } under the current PO is being reported: current status: ${ r.cutStatus }. You cannot proceed until it is completed',

  16037: 'Dockets not found for the docket group ${ layInfo.docketGroup }',
  16038: 'Last panel is not found for : ${ prodName } : ${ fgColor } : ${ size } : ${ comp } ',
  16039: 'Cut reporting triggered for all the bundles successfully',
  16040: 'Actual panel numbers not found',
  16041: 'Po panel numbers not found',
  16042: 'Laying Record Does Not Exists',

  16043: 'ADB does not exist',
  16044: 'The bundle is already cut reported',
  16045: 'shade plies not avilable',
  16046: 'Color and size panel mismatch issue while creating the actual panels',
  16047: 'Fg number mismatch issue while creating the actual panels',
  16048: 'Cut Reported Successfully',
  16049: 'Laying record does not exist',

  16050: 'Cut must be reversed in the desc order of how it was reported. i.e the latest reported cut must be reversed first',
  16051: 'Cut is in progress for this docket : ${ rec.docketGroup } for laying no : ${ rec.id } ',
  16052: `Cut reporting is not completed for this laying`,
  16053: 'Cut reversing triggered successfully',

  16054: `Cut reporting reversal is not triggered for this laying`,
  16055: 'Cut reversed successfully',
  16056: `Cut reporting is not done for this laying`,
  16057: 'Consumed stock updated successfully',
  //DocketGenerationInfoService
  16058: 'Docket Confirmation List Retrieved Successfully',
  16059: 'Marker specific docket numbers are retrieved',
  16060: 'Dockets Info retrieved successfully for the PO',
  16061: 'Docket number is not provided',
  16062: 'Docket detailed info retrieved',


  //DocketGenerationService 

  16063: 'PO Docket serial does not have data. Please check and try again.',
  16064: 'Dockets are already generated for this ratio. Please check and try again.',
  16065: 'Dockets Confirmation is in progress please check and try again.',

  16066: 'Docket generation already completed / In progress for the given ratio. Please check',
  16067: 'Please assign markers to the ratio before generating the dockets.',
  16068: 'Someone already triggered Docket generation / deletion / confirmation. Please try again',
  16069: 'Dockets Generated Successfully',
  16070: 'Docket details not found for the given docket number. Please check and try again.',

  16071: 'Docket bundles has been generated successfully',
  16072: 'Po docket serials are already created',
  16073: 'PO Docket Serial numbers saved successfully.',

  16074: 'DOcket bundle details not found for the given details. Please check and try again',
  16075: 'Docket panels are already generated / not yet triggered. Please check and try again',
  16076: 'Docket panels are already generated for given docket bundle. Please check and try again',
  16077: 'Docket Panels Generated Successfully.',
  16078: 'Dockets are already confirmed.Please un confirm and try again.',
  16079: 'Docket generation not yet generated for the given ratio. Please check',
  16080: 'Dockets has been deleted successfully',

  16081: 'Dockets already already confirmed for the given po and product name. Please check and try again',


  16082: 'Should validate all the requirements. Please check and try again',

  16083: 'PO docket component serial data not found for the details ${req.poSerial} - ${eachDocket.productName} -  ${size} - ${eachDocket.color} - ${eachComp}',

  16084: 'Dockets not yet confirmed for the given po and product name. Please check and try again',
  16085: 'Cut numbers are already generated. You cannot unconfirm dockets',
  16086: 'Material is already allocated for the docket : ${allocatedRollsForDockets[0].docketGroup}',
  16087: 'Docket un confirmed successfully.',
  16088: 'There Is No Data Against Docket Group ${remks.docGroup}',
  16089: `Remark Updated Successfully`,


  16090: 'Fgs are already populated.',
  16091: 'Cut Finished goods Populated successfully',
  16092: 'Po panel numbers not found',
  16093: 'Eligible panels not found for the given bundle number',
  16094: 'Panels consumed successfully',

  //DocketMaterialInfoService
  16095: 'Someone already doing allocation for the same materia. Please try again',
  16096: 'Some one already doing allocation for the same material. Please check and try again',
  16097: 'Available Rolls Information Retrieved successfully',
  16098: 'Docket information not found. Please check and try again',
  16099: 'Material Requests retrieved successfully',
  16100: 'Docket number and the WH Req number are mandatory',
  16101: 'No docket material request is found',
  16102: 'Materials not allocated for the docket request',
  16103: 'WH req info retrieved',

  16104: 'No rolls found to confirm',

  16105: 'Allocation details not found for the given roll Id',
  //DocketMaterialService
  16106: 'Material Unlocked successfully',
  16107: 'Material allocated successfully',

  16109: 'Roll ${eachRoll.rollId} not found in packing list . Please verify',
  16110: 'Someone already triggered Docket generation / deletion / confirmation. Please try again',
  16111: 'Allocating more quantity than available quantity for the Roll ${eachRoll.rollId} ',
  16112: 'Docket number and material request number are mandatory',

  16113: 'Warehouse team already started working on the request. You cannot modify now',
  16114: 'Laying operation is already started. You cannot modify now',


  16115: 'The request ${req.materialRequestNo} is already planned to cut table ${docPlanRec.resourceDesc}',
  16116: 'Warehouse already started working on this request. You cannot modify now',
  16117: 'No docket is found mapped to the request no ${req.materialRequestNo} ',
  16118: 'Docket material status changed to ${req.status} successfully',
  16119: 'Docket material status changed to ${status} successfully',
  16120: 'Roll ids are not provided for the status change',
  16122: 'Docket material item status changed to ${req.status} successfully',

  16123: 'Laying record is not found',
  16124: 'Layed rolls does not exist for the docket',
  16125: 'Locked rolls released for the lay id : ${req.layId}. Total count: ${onFloorRollEnts.length}',
  16126: 'Roll Location Changed Successfully',
  16127: 'The Roll associated with the barcode is not found on, the floor',
  16128: 'The Roll associated with the barcode is completely utilized',
  16129: 'Roll presence at the location confirmed successfully',

  16130: 'Roll id is not provided',
  16131: 'Roll Id is not allocated to any docket',
  16132: 'Roll Id allocation retrieved',
  16133: "Actual markers not updated",
  //DocketPlanningInfoService
  16135: 'No inprogress Docket requests are found',
  16136: 'Dockets Data Retrieved',
  16137: "No data found for the provided date range",
  //DocketPlanningService
  16139: 'Docket request is already created in the planning table',
  16140: 'Docket request created in pendng cuttable list',
  16141: 'Docket request is not created in the planning table',
  16142: 'The request ${req.materialRequestNo} is already planned to cut table ${docPlanRec.resourceDesc}',
  16143: 'The request ${req.materialRequestNo} is already sent to the Warehouse. Please unplan the docket and try',
  16144: 'Docket request removed from the pendng cuttable list',
  16145: 'You can plan only 1 request at a time',
  16146: 'Request ${currPlanningDoc.matReqNo} does not exist in pending to cut table requests',
  16147: 'Request ${currPlanningDoc.matReqNo} is already planned to ${reqRecord.resourceDesc}',
  16148: 'Given table id : ${req.tableId} does not exist',
  16149: 'Docket request is planned to cut table',
  16150: 'Request ${currPlanningDoc.matReqNo} does not exist',
  16151: 'Request ${currPlanningDoc.matReqNo} is already completed. You cannot unplan',
  16152: 'Material is requested for the docket : ${currPlanningDoc.docketGroup} and request : ${currPlanningDoc.matReqNo}',
  16153: 'WH team already started working on the request. You cannot unplan',
  16154: 'Request unplanned successfully',
  16155: 'The docket is not yet planned or already completed',


  16158: 'Request planned to new table successfully',

  16160: 'Request ${currPlanningDoc.matReqNo} is already completed. You cannot change priority',
  16161: 'Priority changed successfully',
  16162: 'Request ${req.materialRequestNo} does not exist',
  16163: 'Material is already requested for the request : ${req.materialRequestNo}',
  16164: 'Material is requested for the docket',

  16166: 'Material is not requested for the request : ${req.materialRequestNo}',
  16167: 'Material requested for the request : ${req.materialRequestNo} is not sent to the WH team. Please check and then de-allocate',
  16168: 'Material is successfully un-requested for the docket',

  //LayReportingInfoService

  16169: 'No laying is reported for the docket',
  16171: 'Docket number is not provided in the request',
  16172: 'Lay does not exists Please check and try again',
  16173: 'Docket does not exists Please check and try again',
  16174: 'Actual docket bundle info retrieved successfully',
  16175: "End bits data retrieved",
  16176: 'Cutting  List Retrieved Successfully',

  //LayReportingService

  16177: 'Docket information not found. Please check and try again',
  16178: 'Material is still not issued from the warehouse',
  16179: 'A lay is already initiated. You cannot add a new lay without completing the cut for it',
  16180: 'All docket plies are layed',
  16181: 'Lay started successfully with docket',
  16182: 'Given lay is not in progress. Please check and try again',
  16183: 'Reason details not found. Please check and try again',
  16184: 'Laying Paused successfully',
  16185: 'Given lay is not in hold. Please check and try again',
  16186: 'Downtime not yet logged. Please check and try again',
  16187: 'Downtime already completed. You cannot resume it again',
  16188: 'Laying Resumed successfully',
  16189: 'There are some OPEN MRN requests please close those and try again',
  16190: 'Laying Confirmed successfully',
  16191: 'If no damages for the roll : ${r.itemBarcode}: then plies and sequence are mandatory',
  16192: 'Some one has hold the lay or lay is already confirmed please check and try again',
  16193: 'There are some OPEN MRN requests please issue them and try again',
  16194: 'No materials found for the given docket please check and try again',
  16195: 'Dokcet has only ${docketRecord.plies} plies. You are trying to report ${totalLayedPlies +totalLayedPliesValue } plies',
  16196: 'Roll does not belongs to given material request please check and try again',
  16197: 'Roll added successfully',

  16198: 'Lay is in hold state you cannot delete the roll',
  16199: 'Roll deleted successfully',
  16200: 'Lay ids must be provided',


  16201: 'Bundle tags are already printed for the Lay',
  16202: 'Barcodes printed successfully',



  16203: 'Bundle tags are already released for the Lay',
  16204: 'Barcodes released successfully',

  //CutTableService
  16205: "Spaces not allowed in starting and ending",
  16206: "Data exits with same CutTable",
  16207: 'CutTable  "Updated" : "Created"} Successfully',
  16208: "Please give CutTable Id",
  16209: "CutTable Data not Found",
  16210: 'Cut Table Already In Use.Cannot Be Deleted',
  16211: 'CutTable Deleted Successfully',

//CutTableHelperService

  16214: 'Dispatch requests not found',
  16215: 'Cut dispatch request is not found',
  16216: 'Dispatch is already done.',
  16217: 'Please provide the dispatch id',
  16218: 'Cut dispatch request saved successfully',
  16219: 'Cut dispatch request retrieved',
  16220: 'Cut info retrieved',
  16221: 'Dockets does not exist for the po',
  16222: "Cuts generated successfully",
  16223: 'Laying records does not exist for the docket',
  16224: 'Cut reporting is not triggered for this laying',
  16225: 'Provide tha laying id',
  16226: 'No dockets found for the given po and product name',
  16227: 'Docket Info Retrieved Successfully',
  16288: 'Docket group is not provided',
  16289: 'No dockets found for the given docket group',
  16290: 'Docket group detailed info retrieved',
  16291: 'Cut Bundle Info retrieved successfully',
  16292: 'Docket Confirmation List Retrieved Successfully',
  16293: 'Eligible Cut Bundle Details Retrieved successfully',

  16295: 'Cut panels info retrieved successfully',
  16296: 'Docket confirmation is still in progress. Please wait and try again',
  16297: 'Docket Bundles already generated for the given docket number. Please check and try again',
  16298: 'Docket generation not completed for some of the ratios. Please check and try again',
  16299: 'Dockets Confirmed successfully',
  16300: 'Rolls not found in the In stock for the given materials.Please try again',
  //DocketMaterialHelperService
  16301: 'On Floor Roll Info Retrieved Successfully.',
  16302: 'Issuance details not found for the given roll Id',
  16303: "Total layed meterage data retrieved",
  //DocketMaterialService
  16304: 'Requests not found for the given docket',
  16305: 'Docket Request deleted successfully',
  16306: 'Allocated quantity updated successfully for given roll Ids',
  //DocketPlanningService
  16307: 'Dockets retrieved for the cut table',
  16308: "Total layed meterage data successfully",
  //LayReportingInfoService
  16309: 'Lay info retrieved successfully docket',
  16310: 'Lay is already confirmed.',

  16312: 'Some lay numbers do not exist',
  //CutGenerationService
  16313: 'Knitting Jobs does not exist for the po',
  16314: 'Some Knitting Jobs are not confirmed for cut generation',
  16315: 'No open main Item Knitting Jobs found for cut generation',
  16316: "Knitting Cuts generated successfully",

  //cut reporting service

  16317: 'Laying records does not exist for the docket',
  16318: 'Cut is in progress for this docket : ${rec.docketGroup} for laying no : ${rec.id}',
  16319: 'The docket ${r.docketGroup} under the current PO is being reported, current status: ${r.cutStatus}. You cannot proceed until it is completed',
  16320: `Cut reporting is not triggered for this laying`,
  16321: 'Laying record does not exist',
}











