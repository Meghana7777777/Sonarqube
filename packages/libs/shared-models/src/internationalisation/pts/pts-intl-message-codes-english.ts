export const PtsIntlMessageCodesEnglish = {
  // pts → 31001-36000

  //emb-tracking
  16021: 'No dockets given in the request',


  16022: 'Emb lines are not selected',
  16023: 'Emb lines are not found',
  16024: 'Dispatch request is already created for the docket: ${embLine.embParentJobRef}',
  16025: 'Multiple vendors cannot be under the same dispacth request',
  16026: 'A dispatch request can only have 1 cut order',
  16027: "Emb dispatch request created successfully",

  16028: 'The status is already ${embDrEnt.requestStatus}. Request cannot be deleted',
  16029: 'The emb dispatch requested deleted successfully',

  16030: 'The current status is already in ${embDispatchStatusEnumDisplayValues[embDrEnt.requestStatus]}',
  16031: 'The current status is ${embDispatchStatusEnumDisplayValues[embDrEnt.requestStatus]}. Previous status update is not allowed',
  16032: 'The emb dispatch status changed successfully',

  16033: 'Print status updated successfully',

  //EmbDispatchInfoService


  16034: 'Dispatch request id is not provided',
  //EmbRejectionService
  16035: 'Rejection are not found for : ${barcode} ',

  //EmbRequestInfoService

  16036: 'Emb job ${req.embJobNumber} is not found',


  16037: 'Provide the emb lines',
  16038: 'Emb lines does not exist',
  //EmbRequestService
  16039: 'The provided dockets doesnt have the component mapped for the emb operation',
  16040: 'EMB job created',
  16041: 'Emb line deleted successfully',
  16042: 'EMB header does not exist for the docket ${req.docketNumber} in the system',
  16043: 'EMB lines exist for the emb header and doc : ${req.docketNumber}',
  16044: 'EMB header details deleted for the doc : ${req.docketNumber} ',

  16045: 'Bundle tag is already printed for job : ${req.embJobNumber} and laying id : ${line.embActualJobRef}',
  16046: 'Emb barcode print successfull',
  16047: 'Bundle tag is already released for job : ${req.embJobNumber} and laying id : ${line.embActualJobRef}',
  16048: 'Emb barcode print release successfull',
  16049: 'No dockets given in the request',
  16050: 'Emb lines freezed successfully',

  //EmbTrackingInfoService
  16051: 'No emb jobs found for the docket: ${req.docketNumber} and the operation : ${req.operationCode}',
  16052: 'Emb bundles retrieved',
  16053: 'Job scanned qtys retrieved',
  //EmbTrackingService
  16054: 'The emb job : ${req.embJobNumber} is already created',
  16055: 'The provided lay ids doesnt have the component mapped for the emb operation',
  16056: 'Emb job created successfully',
  16057: 'Entered rejection qty and reason wise qtys doesnt match',
  16058: 'Operation does not belong to the bundle. Please verify',
  16059: 'Only ${scannedQty.g_qty} is completed for this operation. But you are trying to reverse ${req.gQty}',
  16060: 'Next operation ${postOpBarcode.postOp} is already done to fulfill this operation. Available reversible qty : ${availableReversableQty}',

  16061: 'No rejections are done to do the reversal operation',

  16062: 'Emb job number and operation code are not provided in the request',
  16063: 'No transactions exist for the emb job and the operation',
  16064: 'Barcode is invalid for the operation',
  16065: 'Bundle is already scanned for the operation',
  16066: 'Trying to scan more than bundle qty. Bundle qty : ${barcodeRecord.quantity}. Already scanned qty : ${preScanQty} ',
  16067: 'Previous operation ${preOpBarcode.preOp} is not done to fulfill this operation. Available qty : ${availableScannableQty}',
  16068:'No dispatch requests found for the ${req.embDispatchId}',
  16069:'Dispatch requests retrieved',
  16070:'No emb jobs found for the PO',
  16071:'Emb header info retrieved',
  16072:'EMB header does not exist for the job ${req.embJobNumber} in the system',
  16073: 'EMB lines does not exist for job : ${req.embJobNumber} ',
  16074: 'Provide the emb line ids',
  16075: 'No Emb lines found to freeze',
  16076:'Barcode ${req.barcode} does not exist',
  16077:'EMB job is not found for the barcode : ${req.barcode} ',
  16078:'Emb jobs are freezed. Might be cut is already dispatch',
  16079:'Bundle scan success',





 





}