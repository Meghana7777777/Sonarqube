export const FgwhIntlMessageCodesEnglish = {

   //FgRacksService
   //fgwh → 46001-51000

   46001: "Rack Code already available please check.",
   46002: 'Rack ${reqModel.id ? "Updated" } Successfully',
   46003: 'Rack ${reqModel.id ? "Created"} Successfully',
   46004: 'Racks de-activated successfully',
   46005: 'Racks activated successfully',

   //FgLocationsService

   46006: "Location Code already available please check",
   46007: 'Locations ${reqModel.id ? "Updated" } Successfully',
   46008: 'Locations ${reqModel.id ?  "Created"} Successfully',
   46009: 'Please provide the location id',
   46010: 'Location does not exist',
   46011: '{palletsInLocation.length} pallets are present in the location. Cannot be de-activated',
   46012: '${trolleysInLocation.length} trolleys are present in the location. Cannot be de-activated',
   46013: 'Locations de-activated successfully',
   46014: 'Locations activated successfully',
   46015: 'Locations ${toggle.affected} Updated Successfully',
   46016: "Locations Data Retrieved Successfully",
   46017: 'Racks does not exist',
   46018: 'Rack and locations info retrieved',
   46019: 'Containers ${reqModel.id ? "Updated" } Successfully',
   46020: 'Containers ${reqModel.id ?  "Created"} Successfully',
   46021: 'Containers de-activated successfully',
   46022: 'Containers activated successfully',
   46023: 'No container info found',


   //FgWarehouseReqService
   46024: "Created Successfully",
   46025: 'Data retrieved',
   46026: "There Is No Lines To This Header",
   46027: "Fg Where House Lines Retrieved Successfully",
   46028: "Request Id Not found to update",
   46029: "Security details updates Successfully",
   46030: "No packlists found for the header request id",
   46031: "Please Create Fg Ware House Requests",
   //FgWarehouseBarcodeScanningService

   46032: 'Carton Barcode Not Found Or Already scanned. Please check',
   46033: 'FG In Request is not available for given Container Cartons',
   46034: 'Location mapped successfully',
   46035: "Session started successfully!",
   46036: "Session Not Started",

   //FgWarehouseInfoService
   46037: 'Warehouse requests not found for the given pack list ids',
   46038: 'Warehouse Request details retrieved successfully',
   46039: 'Warehouse Group Info Received successfully',
   46040: 'Arrival and dispatch details retrieved successfully',

   //FgContainerDataService

   //CartonContainerMappingService
   46041: 'Container is having cartons that were allocated for the ',
   46042: 'Carton container allocation validation info retrieved',
   46043: 'Container capacity is already filled: you cannot add more cartons',
   46044: 'System suggested and the incoming container is not matching',
   46045: 'Cartons with different bacth numbers cannot be assigned to same container for warehouse storage',
   46046: 'The current carton you are scanning is already in the current container you selected',
   46047: 'Carton mapped to container successfully',
   46048: 'Carton quantity issued',

   46049: 'Carton not found with given barcode',


   //ContainerGroupCreationService

   46050: 'Container groups already created for the pack list',

   46051: 'Container groups created successfully',

   //FGContainerGroupInfoService
   46052: 'Pgs for pack list retrieved successfully',
   46053: 'The Carton is not mapped to any of the container groups',
   46054: 'No container group found for : ',

   //ContainerInfoService 
   46055: 'Container does not exist',

   46056: 'No containers mapped for the packing list',

   46057: 'There are no cartons mapped to this container',
   46058: 'Cartons for container retrieved',
   46059: 'Container and Location information not found',
   46060: 'Tray and tcartonesys rretrieved successfully',

   //ContainerLocationMappingService

   46061: 'Trying to allocate to a different location than the system suggested location',
   46062: 'The container is already placed in the current location',
   46063: 'Containers can only be placed in suggested location without approval',
   46064: 'Container is mapped to the location',

   46065: 'Container is already confirmed to a location',
   46066: 'Container is already mapped to the same location',
   46067: 'Container is mapped to the suggested location', 

   46068: 'Containers mapped to location',



   46069: 'Container UnMapped Successfully.',

   //LocationAllocationService
   46070: 'Cartons ids are not provided',
   46071: 'Carton location info retrieved successfully',

   //LocationInfoService
   46072: 'Location info retrieved successfully',
   46073: 'No containers mapped for the packing list',
   46074: 'No location mapped for the packing list',
   46076: 'Locations retrieved successfully',

   // LocationMappingHelperService
   46077: 'Given cartons doesnt exist',
   46078: 'Selected containers does not exist',
   46079: 'Selected location does not exist',

   //WareHouseService
   46080: 'Warehouse type saved successfully',
   46081: "warehouse Code already exists.",
   46082: 'Warehouse updated Successfully',
   46083: 'Warehouse created Successfully',
   46084: 'warehouse data retrieved successfully',

// locations service
46085:'Locations ${opCount.affected} Updated Successfully',
// fg container data service
46086:"Container Code already exists.",
46087:"Updated Successfully",
46088:"No data found to update",
46089:'Carton Barcode Not Found Or Already scanned. Please check',
46090:'Barcode Already Scanned',
46091:'Container info retrieved successfully',
46092: 'No cartons mapped to the container',
46093:'Cartons for packing list retrieved',
46094:'Please select the containers',
46095:'No conformed containers for the packing list',
46096: 'Location capacity is already full. Cannot keep more containers',
46097: 'Location containers and cartons retrieved successfully',
46098:'Carton ${dto.barcode} Is Loaded Into ${dto.truckNo} Successfully'



}