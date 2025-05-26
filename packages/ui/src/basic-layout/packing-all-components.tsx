
import CartonTracking from "../components/pages/pk-dispatch/pk-shipment/warehouse-out-form/carton-tracking";
import { ContainerPage, CreatePackTables, FGContainerToCartonAllocation, FGLocationTransfer, FGWareHouseGrid, FGWhDashboardPage, FgContainerToLocationAllocation, FgCreateContainers, FgCreateLocations, FgCreateRacks, ItemsPage, MaterialTypeGrid, PackListViewGrid, PackTypeGrid, PackingOrderLayout, PackingSpecGrid } from "../components/pages/PKMS";
import { RejectedReasonsGrid } from "../components/pages/PKMS/__masters__/rejected-reasons";
import { FgWarehouseRequestCreation } from "../components/pages/PKMS/fg-warehouse-activity";
import FGWareHouseInActivity from "../components/pages/PKMS/fg-warehouse-activity/fg-wh-in-activity";
import FGWareHouseOutActivity from "../components/pages/PKMS/fg-warehouse-activity/fg-wh-out-activity";
import FgLocationReport from "../components/pages/PKMS/fg-wh-report/fg-wh-location-report";
import { InspectionRequest } from "../components/pages/ins/packing-inpection";
import PackInspectionBoard from "../components/pages/ins/packing-inpection/pkms-inspection-boards/inspection-dashboards-main-page";
import PlanningScreenComponent from "../components/pages/PKMS/pack-job-planning/pack-job-planning-screen";
import { PackListCreation } from "../components/pages/PKMS/pack-list-creation/pack-list-creation";
import { PackingMaterialCreate } from "../components/pages/PKMS/packing-list-material";
import { FgCartonFilling } from "../components/pages/PKMS/scan-and-pack";

export const packingComponents = {
    MaterialType: <MaterialTypeGrid />,
    FGWareHouseMaster: <FGWareHouseGrid />,
    Items: <ItemsPage />,
    PackTypes: <PackTypeGrid />,
    PackingSpec: <PackingSpecGrid />,
    PackingListCreation: <PackListCreation />,
    PackJobPlanning: <PlanningScreenComponent />,
    PackListView: <PackListViewGrid />,
    PackMaterialRequest: <PackingMaterialCreate />,
    FgCartonFilling: <FgCartonFilling />,
    PackingInspection: <InspectionRequest />,
    RejectedReasons: <RejectedReasonsGrid />,
    RacksCreation: <FgCreateRacks newWindow={false} />,
    LocationCreation: <FgCreateLocations newWindow={false} />,
    ContainerCreation: <FgCreateContainers newWindow={false} />,
    PackInspectionBoard: <PackInspectionBoard />,
    FGPalletCartonAllocation: <FGContainerToCartonAllocation />,
    FGPalletBinAllocation: <FgContainerToLocationAllocation />,
    PackOrderCreationPage: <PackingOrderLayout />,
    ContainerPage: <ContainerPage />,
    FGWarehouseDashboard: <FGWhDashboardPage />,
    FGWareHouseInActivity: <FGWareHouseInActivity />,
    FGWareHouseOutActivity: <FGWareHouseOutActivity />,
    FgWarehouseRequestCreation: <FgWarehouseRequestCreation />,
    CartonTracking: <CartonTracking />,
    FGLocationTransfer: <FGLocationTransfer />,
    PackWorkStations: <CreatePackTables />,
    FgLocationReport: <FgLocationReport />

}