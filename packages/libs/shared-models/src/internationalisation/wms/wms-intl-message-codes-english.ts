  export const WmsIntlMessageCodesEnglish = {
  //3. wms -(16000-21000)

 // warehouse-dashboard

  6001: 'Bin Roll Info retrieved Successfully',
  6002: 'Header Info retrieved successfully',

//grn dashboard service
  6003: 'Grn Info Received successfully',
  //grn service
  6004:'Packing list header not found. Please check.',
   6005: 'GRN details saved successfully for given roll Id',
   6006: 'GRN Details not found for the given pack list. Please verify',
   6007: 'GRN has been approved successfully.',
   6008: 'Inspection Preferences have been saved',
  //grn service
//  6004: 'Unloading already completed. Please verify',
//   6005: 'Unloading started the packing list.',
//   6006: 'Unloading started the packing list.',
//   6007: 'Some Updated please refresh and tray again',
//   6008: 'Pause reason and unloading spent secs mandatory to pause the unloading.',
//   6009: 'Unloading paused the packing list.',
//   6010: 'Unloading completed for the packing list.',
//   6011: 'Packing list unloading details retrieved successfully',
//   6012: 'GRN details saved successfully for given roll Id',
//   6013: 'GRN Details not found for the given pack list. Please verify',
//   6014: 'Truck No : ${truckInfo.vehicleNumber} unloading is still not completed',
//   6015: 'GRN has been approved successfully.',
//   6016: 'Vehicle Details not found. Please check.',
//   6017: 'Inspection Preferences have been saved',
//   6018: `Unloading is not Completed you can't send the vehicle out`,
//   6019: 'Vehicle has been dispatched out successfully',
//   6020: 'Security check in details retrieved successfully for given packing list Id.',
//   6021: 'Vehicles in plant data retrived successfully',
//   6022: 'unloading completed not at security check out vehicles data',
//   6023: 'Vehicle Details not found. Please check.',
 // inspection conformation service
  6024: 'Materail receving status updated',
  6025: 'Inspection confirmed to start',

  // InspectionInfoService
  6026: 'Inspection request is not found',
  6027: 'Inspection requests info retrieved successfully',
  6028: 'Inspection request is not found',
  6029: 'Inspection requests info retrieved successfully',
  6030: 'Insepction request is invalid',
  6031: 'Inspection request status changed successfully',
  6032: 'Inspection Request not found for the given lot number and inspection category.',
  6033: 'Rolls Not found for the re request.',
  6034: "Data retrieved successfully",
  6035: "Error occurred while fetching data",

  //InspectionRollsInfoService
  6036: 'Inspection request is not found',
  6037: 'Inspection requests info retrieved successfully',

  //    InspectionService
  6038: 'Packing list header not found. Please check.',
  6039: 'Vehicle with the packing list is still not arrived at the unit',
  6040: 'Inspection Confirmed successfully.',
  6041: 'Inspection details not found for given inspection header Id',
  6042: 'Inspection not yet started, Please start the inspection in the board.',
  6043: 'GRN Details not found for the given pack list. Please verify',
  6044: 'Inspection rolls not found for given inspection header Id',
  6045: 'Inspection header and roll info received successfully',
  6046: 'GRN Details not found for the given pack list. Please verify',
  6047: 'Inspection rolls not found for given inspection header Id',
  6048: 'Inspection header and roll info received successfully',
  6049: 'Barcode not found.',
  6050: 'Sample Barcode Not Found.',
  6051: 'Inspection Id not found for given roll id and inspection category',
  6052: 'Please provide inspection Request Id',
  6053: 'Inspection Request details not found for given request Id, Please verify',
  6054: 'Inspection header already been inspected. Please verify.',
  6055: 'Inspection Results Updated Successfully',
  6073: '"Reinspection requests can only be created for failed inspection requests.',
  6074: 'GRN Details not found for the given pack list. Please verify',

  6076: 'Inspection not yet started, Please start the inspection in the board.',
  6077: 'Rolls already mapped to the inspection request, Please check',
  6078: 'Rolls successfully mapped to inspection request',

  //LocationAllocationService
  6079: 'Objects ids are not provided',
  6080: 'Object location info retrieved successfully',
  // LcoationMappingHelperService

  6081: 'Given objects doesnt exist',
  6082: 'Selected pallets does not exist',

  // PalletBinMappingService

  6083: 'Trying to allocate to a different bin than the system suggested bin',
  6084: 'The pallet is already placed in the current bin',
  6085: 'Pallets can only be placed in suggested bins without approval',
  6086: 'Pallet is mapped to the bin',
  6087: 'Please select the pallets',
  6088: 'Pallet is already confirmed to a bin',
  6089: 'Pallet is already mapped to the same bin',
  6090: 'Pallet is mapped to tlhe suggested bin',
  6091: 'No confirmed pallets for the packing list',
  6092: 'Pallets mapped to bin',
  6093: 'Bin does not exist',
  6094: 'Bin capacity is already full. Cannot keep more pallets',
  6097: 'No confimred pallets for the packing list',
  6098: 'Pallet UnMapped Successfully.',

  //MaterialIssuanceService

  6099: 'Roll quantity issued',

  //PalletGroupCreationService 
  6100: 'Pallet groups already created for the pack list',
  6101: 'Pallet groups created successfully',

  // PalletGroupInfoService
  6102: 'Pgs for pack list retrieved successfully',
  6103: 'The roll is not mapped to any of the pallet groups',
  6104: 'No pallet group found for : ',

  //PalletInfoService
  6105: 'Pallet does not exist',
  6106: 'No pallets mapped for the packing list',
  6107: 'No rolls mapped to the pallet',
  6109: 'There are no rolls mapped to this pallet',
  6110: 'Rolls for pallet retrieved',
  6111: 'Pallet and Bin information not found',
  6112: 'Tray and trollesys rretrieved successfully',
  6113: 'Enter the roll',
  6114: 'Roll pallet allocation validation info retrieved',
  6115: 'Enter the roll',
  6116: 'Pallet capacity is already filled, you cannot add more rolls',
  6117: 'System suggested and the incoming pallet is not matching',
  6118: 'Rolls with different bacth numbers cannot be assigned to same pallet for warehouse storage',
  6119: 'The current roll you are scanning is already in the current pallet you selected',
  6120: 'Roll mapped to pallet successfully',
  // 6121: 'Pallet is having rolls that were allocated for the '+infoText+' storage',
  6122: 'Roll is not mapped to the selected pallet.',
  //BinsDataService
  6124: "Bin Code already available please check",
  6125: 'Please provide the bin id',
  6126: 'Bin does not exist',
  6127: '${palletsInBin.length} pallets are present in the bin. Cannot be de-activated',
  6128: '${trolleysInBin.length} trolleys are present in the bin. Cannot be de-activated',
  //  6129:'binRec.isActive ? 'Bins de-activated successfully' : 'Bins activated successfully'
  6131: "Bins Data Retrieved Successfully",
  6132: 'Racks does not exist',

  6133: 'Rack and binds info retrieved',

  //MoversDataService

  6134: "Movers Code already available please check",
  6135: 'Movers ${reqModel.id ? "Updated" : "Created"} Successfully`',

  

  //PalletsDataService
  6138: "Pallet Code already available please check",
  6139: 'Pallets ${reqModel.id ? "Updated" : "Created"} Successfully',

  
  6142: 'No pallet info found',
  //RacksDataService

  6143: "Rack Code already available please check.",
  6144: 'Rack ${reqModel.id ? "Updated" : "Created"} Successfully',
 
  
  6147: "Racks Data Retrieved Successfully",

  //   ReasonsDataService
  6148: "Reasons Code already available please check",
  6149: 'Reasons ${reqModel.id ? "Updated" : "Created"} Successfully',
  6150: 'Reason is not provided',

  //RollAttributesDataService

  6151: "Someone Already Modified This Record please Refresh And Continue",
  6152: 'Roll Atrributes ${reqModel.id ? "Updated" : "Created"} Successfully',
  // 6153 :'Roll Atrributes de-activated successfully' , 'Roll Atrributes activated successfully'

  

  //TraysService
  6157: 'Trays Code ${reqModel.code} already available please check',
  6158: `Tray Created successfully`,
  6160: `Tray Id doen't exists`,
  6161: `Tray Updated successfully`,
  6162: 'Tray does not exist',
  6163: 'Trays do not exist',
  6164: 'Data Retrieved Successfully',
  6165: 'Tray not found for the given barcodes',
  
  6167: 'Tray not found for the given traycodes',
  
  6169: 'Tray ids not provided',
  6170: 'Tray ids not provided',

  6172: 'No trays exist for the provided ids',

  //TrolleyService

  6173: "Trolly Code already available please check",
  6174: `Trolly created successfully`,
  6175: "Trolly Id not provided",
  6176: "Trolly Id doesn't exists",
  6177: 'Trolly Updated successfully',
  6178: 'Please provide the trolly id',
  6179: 'Trolly does not exist',
  6180: '${traysInTrolley.length} trays are present in the trolley. Cannot be de-activated',
  6181: "Trollys not found",

  6183: 'Trolley barcodes not provided',
  6184: 'Trolley barcodes not provided',
  6185: 'Tolleys not found for the barcodes',

  6187: 'Trolley ids not provided',
  6188: 'Trolley ids not provided',

  6190: 'Trollys does not exist for the provdied ids',

  //UsersGroupDataService
  6191: "Someone Already Modified This Record please Refresh And Continue",
  6192: 'UserGroups ${reqModel.id ? "Updated" : "Created"} Successfully',
 
  
  //FabricRequestCreationInfoService
  6195: 'No pending requests found for the cut table',
  6196: 'Pending Warehouse Requests For Cut table Retrieved successfully',
 

  //FabricRequestCreationService

  6198: 'Warehouse request created',
  6199: 'Request is missing id: ${req.id} and reqNo: ${req.requestNo} ',
  6200: 'Request is already created for id: ${req.id} and reqNo: ${req.requestNo} ',
  6201: 'Provided item count : ${itemIds.length}. Existing inventory count: ${rollsInfo.length}',
  6202: 'Id and Barcode not macthed for input. id: ${i.inventoryId} and barcode: ${i.barcode}',
  6203: 'WH request created',
  6204: 'External request number is not provided',
  6205: 'Request is not existing for reqNo: ${req.extReqNo}',
  6206: 'WH request deleted',



  //FabricRequestHandlingService
  6207: 'The given request no : ${req.materialRequestNo} does not exist',
  6208: 'The given request no : ${req.materialRequestNo} is not mapped to any docket',
  6209: `Material is already issued for this request`,
  6210: 'Material issued to the cutting table',
  6211: 'The given request no : ${req.materialRequestNo} does not exist',
  6212: 'The given request no : ${req.materialRequestNo} is not mapped to any docket',
  6213: `Material is already set to preparing material for this request`,
  6214: 'Material issued to the cutting table',
  6215: 'A laying operation is already being carried out for the docket group',

  //PackingListService
  6216: 'Duplicate lot number identified in the packing list, Please check.',
  6217: 'Duplicate roll number identified with in the lot number. Please check',
  6218: 'Pack list already exist with given pack list code',
  6219: 'Packing list has been created successfully.',
  6220: 'Packing list has been deleted successfully.',
  6221: 'Processing has been started for the packing list you cannot edit or delete',
  
  6223: 'Packing lists not found for the given criteria',
  6224: 'Error retrieving data: ${error.message}',
  6225: 'Pending Supplier Po Information Received successfully',
  6226: 'Supplier PO summary has been received successfully.',
  
  6228: 'Packing list confirmed successfully.',
  
  6230: 'Packing list summary retrieved successfully',
  
  6232: 'Packing list already checked In. Please Verify.',
  
  6235: 'Packing list not yet checked In. Please Verify.',
  6236: 'Roll Information not found for the given selection criteria.',
  6237: 'Print status updated successfully for the rolls',
  6238: 'Roll Information not found for the given selection criteria.',
  6239: 'Print barcode released successfully for the rolls',
  6240: 'Roll Info Retried successfully ',
  6241: 'Sale order Data Not Available.',

  6242: 'Item Level Data retrived',
  6243: 'Measured reference data retrieved successfully',
  6244: 'No data found for the specified phItemLinesId',

  //StockConsumptionService

  6245: 'The item : ${item.itemBarcode} for the id : ${item.itemId} does not exist',
  6246: 'Stock consumption updated Successfully',
  6247: 'The roll : ${req.rollId} does not exist',
//StockInfoService

  6251: 'Item code is not provided to retrieve the stock',
  6252: 'Sale order code is not provided to retrieve the stock',
  6253: 'No PO is found for the provided sale order',
  6254: 'Stock Not Available.',
  6255: 'Stock Data Retrived Successfully',

  //PackingListDashboardService

  6256: "Supplier Wise Info retrived",
  6258: 'success',

  // PreIntegrationService

  6259: 'Supplier PO not found. Please check',
  6260: 'Supplier PO not found. Please check',
  6261: 'Supplier Po item information retrieved successfully.',
  6262: 'Supplier Info retrieved successfully.',
  6263: 'Style Wise Stock Summary Data Retrived successfully',
  6264: 'Unloading started the packing list.',
  6265: 'Sale order Data Not Available.',
  6266: 'Sale Order Data Retrived Successfully',
  6267: 'Style Data Not Available.',
  6268: 'Style Info retrieved successfully.',
  6269: 'Item Code Data Not Available.',
  6270: 'Item Code Data retrieved successfully.',
  6271: 'Batch Code Data Not Available.',
  6272: 'Item Code Data retrieved successfully.',
  6273: 'Quantity updated successfully',
  6274: 'Sale Order Items splitted successfully',
  6275: 'saleOrder line and splits deleted, parent quantity updated successfully',

  //TrayRollInfoService
  6276: 'Roll ids are not provided',
  6277: 'Trays not yet mapped for the given rolls',
  6278: 'Tray rolls retrieved successfully',
  6279: 'Roll ids are not provided',
  6280: 'Tray and Trolley information not found',
  6281: 'Tray and trollesys rretrieved successfully',

  //TrayRollMappingService
  6282: 'Rolls ids not provided',
  6283: 'Given Roll does not exist',
  6284: 'Roll is not mapped to any tray yet',
  6285: 'Roll un mapped to the trolly',
  6286: 'Please provide the tray id',
  6287: 'Rolls ids not provided',
  6288: 'Given tray does not exist',
  6289: 'Selected tray is in de-active state',
  6290: 'Tray capacity of ${trayCapacity} rolls is already full',
  6291: 'Given Roll does not exist',
  6292: 'The roll ${roll.barcode} is already present in the same tray ${tray[0].code}',
  6293: 'Rolls were not mapped to the trays',
  6294: 'Roll mapped to the tray',

  //TrayTrolleyInfoService

  6295: 'Tray ids not provided',
  6296: 'No mapped trolleys found for the tray ids',
  6297: 'No mapped trolleys found for the tray ids',
  6298: 'No trolleys found for the tray ids',
  6299: 'Trolleys retrieved for the trays',

  //TrayTrolleyMappingService

  6300: 'No trays found for the provided ids',
  6301: 'Tray is not mapped to any trolley yet',
  6302: 'Tray unmapped from the trolley',
  6303: 'No trolleys found for the provided ids',
  6304: 'Selected trolley is in de-active state',
  6305: 'No trays found for the provided ids',
  6306: 'Selected tray is in de-active state',
  6307: 'The trolley capacity is already full with ${trolleyTraysCount} trays',
  6308: 'The selected tray ${tray.code} is already located in the same trolley ${trolleyRecs[0].code}',
  6309: 'Tray mapped to the trolley',

  //TrolleyBinInfoService
  6310: 'Trolley ids are not provided',
  6311: 'Bins not yet mapped for the given trolleys',
  6312: 'Bins not yet mapped for the given trolleys',
  6313: 'Tray rolls retrieved successfully',

  //TrolleyBinMappingService
  6314: 'No trolleys found for the provided ids',
  6315: 'Trolley is not mapped to any bin yet',
  6316: 'Trolley unmapped from the bin successfully',
  6317: 'No trolleys found for the provided ids',
  6318: 'Selected trolley is in de-active state',
  6319: 'No bin found for the provided ids',
  6320: 'Selected bin is in de-active state',
  6321: 'Trolley can only be put in LEVEL-1 bins',
  6322: 'Currently ${palletsInBin.length} pallets are mapped to the bin. Trolley cannot be placed',
  6323: 'The Bin capacity is already full with ${trolleyBinCount} trolley',
  6324: 'The selected trolley ${trolleyRecs[0].code} is already located in the same bin ${binRec.name}',
  6325: 'Trolley mapped to the bin',
  //FabricRequestHandlingHelperService
  6326: 'Unable to check for docket status from cutting team',
  6327:'Packing list vehicle information not found for the given Id',
  
 
6330:'Packing list security information not found for the given vehicle information Id.',
6331:'The insepction flow is incorrect. PENDING -> MATERIAL RECEIVED -> PROGRESS -> COMPLETED ',
6332:'Selected bins does not exist',
6333: 'Max pallet roll capacity is not defined',
 // PalletGroupInfoService
6334:'No pallet groups mapped for the pack list',
6335:'Pallet group info retrieved successfully',
//PalletInfoService
6336: 'Pallet info retrieved successfully',
6337: 'Rolls for packing list retrieved',
 //roll pallet mapping service
6338:'Rolls deallocated from the pallet',
6339:'Roll id is not provided',
6340:'Bins ${reqModel.id ? "Updated" } Successfully',
6341: 'Bins ${reqModel.id ?  "Created"} Successfully',
 //ReasonsDataService
 6342:'Tray id not provided',
 6343: 'Tray barcodes not provided',
//  BinInfoService
6344: 'Bin info retrieved successfully',
6345: 'No pallets mapped for the packing list',
6346: 'No bins mapped for the packing list',
6347: 'Bin pallets and rolls retrieved successfully',
6348: 'Bins retrieved successfully',

 
   











  }
 
 
  