import { InsFabricInspectionRequestCategoryEnum, PackingListSummaryModel, PackingSecurityMenuEnum } from '@xpparel/shared-models';
import { ShipMentPage } from '../components/pages/dispatch';
import { OrderQtyRevision, OrderSummaryStepper } from '../components/pages/OMS';
import { FgWhReqAnalysis } from '../components/pages/PKMS/fg-warehouse-dashboard/fg-wh-req-analysis-dashboard/fg-wh-req-analysis-dashbaord';
// import { DocketPlanning, MaterialAllocation, MrnRequest, PlannedDocketReport, ProductionOrderStepper } from '../components/pages/PPS';
// import BundleTagPage from '../components/pages/PPS/bundle-tag/bundle-tag-page';
// import EmbellishmentGatePassPage from '../components/pages/PPS/emb-gatepass/emb-gatepass-page';
// import EmblishmentScanPage from '../components/pages/PPS/emb-tracking/emblishment-scan-page';
// import EmbellishmentJobsPage from '../components/pages/PPS/embellishment-jobs/embellishment-jobs-page';
// import { OnFloorRollsControl } from '../components/pages/PPS/material-allocation/on-floor-rolls/on-floors-rolls-control';
import ApproverForm from '../components/pages/QMS/masters/approvers/approver-form';
import ApproverView from '../components/pages/QMS/masters/approvers/approver-grid';
import EscallationForm from '../components/pages/QMS/masters/escallation/escallation-form';
import EscallationView from '../components/pages/QMS/masters/escallation/escallation-grid';
import QualityCheckListForm from '../components/pages/QMS/masters/quality-check-list/quality-check-list-form';
import QualityCheckListView from '../components/pages/QMS/masters/quality-check-list/quality-check-list-view';
import QualityTypeForm from '../components/pages/QMS/masters/quality-type/quality-type-form';
import QualityTypeView from '../components/pages/QMS/masters/quality-type/quality-type-grid';
import AttendanceCapturing from '../components/pages/SPS/components/attendance-capturing';
import DowntimeOverview from '../components/pages/SPS/components/downtime-capturing/downtime-overview';
import ForecastPlan from '../components/pages/SPS/components/forecast-plan';
import ProductionPlanningMasters from '../components/pages/SPS/components/masters/production-planning-masters';
import OperationTracking from '../components/pages/SPS/components/operation-reporting';
import SewingLayout from '../components/pages/SPS/components/sewing-order-layout';
import SewingJobPlanning from '../components/pages/SPS/components/sewing-planning/sewing-job-planning';
import TrimsTrackingDaskBoard from '../components/pages/SPS/components/trims-issued-dashboard/trims-tracking-dashboard';
import SewingJobTracking from '../components/pages/SPS/planning-dashboard/sewing-job-tracking';

// import KnittingReporting from '../components/pages/PPS/knitting-reporting/knitting-reporting';
import { SecurityCheckinDashBoard } from '../components/pages/WMS/dash-board';
import { DashBoard, RacksDashboard } from '../components/pages/WMS/dash-boards';
import { InspectionSpecificDashboard } from '../components/pages/WMS/inspection/dahsboard/inspection-specific-dashboard';
import FourPointInspectionForm from '../components/pages/WMS/inspection/inspection-forms/four-point-inspection/four-point-inspection-form';
import RelaxationInspectionForm from '../components/pages/WMS/inspection/inspection-forms/relaxation-inspection-form';
import ShadeInspectionForm from '../components/pages/WMS/inspection/inspection-forms/shade-inspection-form';

import { packingComponents } from './packing-all-components';

import MOProcessSummary from '../common/processing-order/mo-process-summary';
import InspectionConfigMain from '../components/pages/ins/inspection-config/inspection-config-main';
import InspectionReasonsGrid from '../components/pages/ins/masters/ins-reasons/inspection-reasons-grid';
import { ThreadInspectionDashboardsMainPage } from '../components/pages/ins/thread-inspections/thread-ins-dahsboard';
import { TrimInspectionDashboardsMainPage } from '../components/pages/ins/trim-inspection/trim-ins-dahsboard';
import { YarnInspectionDashboardsMainPage } from '../components/pages/ins/yarn-inspection/yarn-ins-dahsboard';
import MaterialAllocationForKnitJob from '../components/pages/KMS/knit-material-request/material-allocation-for-knit-job';
import KnitPoSummary from '../components/pages/KMS/knitting-management/knit-po-summary/knit-po-summary';
import KnittingMainPanel from '../components/pages/KMS/knitting-management/knitting-main-panel';
import KnitJobReporting from '../components/pages/KMS/knitting-planning/knitjob-info-location-page-view';
import CreateBomItem from '../components/pages/OMS/masters/bom-item-master/bom-item-master';
import CreateCustomer from '../components/pages/OMS/masters/customer-master/customer-master';
import CreateProcessType from '../components/pages/OMS/masters/process-type-master/process-type';
import ProductMaster from '../components/pages/OMS/masters/product-master/product-master';
import CreateStyle from '../components/pages/OMS/masters/style-master/style-master';
import OrderDumpPanel from '../components/pages/OMS/order-management/manf-order-creation/order-dump.panel';
import SaleOrderDumpPanel from '../components/pages/OMS/order-management/sale-order-creation/sale-order-dump.panel';
import StyleLevelOpVersion from '../components/pages/OMS/style-management/style-level-opversion';
import { PkShipMentPage } from '../components/pages/pk-dispatch';
import ProductionDefectsForm from '../components/pages/QMS/masters/production-defects/production-defects-form';
import QualityChecksReporting from '../components/pages/QMS/quality-checks/quality-checks-reporting/quality-checks-reporting';
import QualityChecksTracker from '../components/pages/QMS/quality-checks/quality-checks-tracker/quality-checks-tracker';
import QualityConfigurationForm from '../components/pages/QMS/quality-configuration/quality-configuration-form';
import QualityConfigurationView from '../components/pages/QMS/quality-configuration/quality-configuration-view';
import ModuleTrackingDashboard from '../components/pages/SPS/components/module-tracking-dashboard/module-tracking-dashboard';
import SewingJobPriorityPage from '../components/pages/SPS/sew-job-priority/sew-job-priority-page';
import SpsPoSummary from '../components/pages/SPS/sps-processing-order/po-summary/sps-po-summary';
import SPSProcessingOrderLayout from '../components/pages/SPS/sps-processing-order/sps-processing-order-layout';
import AttributesMasterGrid from '../components/pages/ums/attributes-master/attributes-master-grid';
import MastersRendering from '../components/pages/ums/config-master/config-master-rendering';
import GLobalConfigGrid from '../components/pages/ums/global-config/global-config-grid';
import { BinTrolleyAllocation, CreateBins, CreatePallets, CreateRacks, CreateSuppliers, CreateTray, CreateTrolly, GrnAllocationPage, InspectionDashboardsMainPage, LabInspectionForm, Masters, MaterialIssuanceDashboard, MoToRmPoMapping, PackingListCreationPage, PackListSummaryPage, PalletBinAllocation, PalletBinUnMapping, PalletInsRollAllocation, PalletRollUnMapping, RequestStatus, RollQtyIssuance, Shrinkage, TrayRollAllocation, TrolleyTrayAllocation, WarehouseRequestDashboardPage } from '../components/pages/WMS';
import { DocketPlanning, LayReporting, MaterialAllocation, MrnRequest, ProductionOrderStepper } from '../components/pages/PPS';
import EmbellishmentJobsPage from '../components/pages/PPS/embellishment-jobs/embellishment-jobs-page';
import BundleTagPage from '../components/pages/PPS/bundle-tag/bundle-tag-page';
import { OnFloorRollsControl } from '../components/pages/PPS/material-allocation/on-floor-rolls/on-floors-rolls-control';
import EmblishmentScanPage from '../components/pages/PPS/emb-tracking/emblishment-scan-page';
import { WhDashboardPage } from '../components/pages/WMS/warehouse-dashboard';
import QMSDashboardN from '../components/pages/QMS/dashboards/dashboard-n';
import AvialbleStockDetails from '../components/pages/WMS/avilable-stock-details/stock-summary-report';
import MoOperationsSummaryReport from '../components/pages/OMS/reports/mo-operations-summary/mo-operations-summary-report';
 
export const components = {
    Masters: <Masters />,
    GLobalConfigGrid: <GLobalConfigGrid />,
    ConfigMasterGrid: <MastersRendering />,
    Attributes: <AttributesMasterGrid />,
    PackingListCreationPage: <PackingListCreationPage />,
    PackListSummaryPage: <PackListSummaryPage key={"securityCheck"} packingSecurityMenuEnum={PackingSecurityMenuEnum.SECURITY} onStepChange={(step: number, selectedRecord: PackingListSummaryModel) => { }} />,
    GrnAllocationPage: <GrnAllocationPage />,
    // PalletRollAllocation: <PalletRollAllocation />,
    MOToPOMapping: <MoToRmPoMapping />,
    ThreadInspectionDashboardsMainPage: <ThreadInspectionDashboardsMainPage />,
    TrimInspectionDashboardsMainPage: <TrimInspectionDashboardsMainPage />,

    PalletBinAllocation: <PalletBinAllocation />,
    InspectionDashboardsMainPage: <InspectionDashboardsMainPage />,
    YarnInspectionDashboardsMainPage: <YarnInspectionDashboardsMainPage />,
    FourPointInspectionForm: <FourPointInspectionForm inspReqId={null} reload={0} />,
    ShadeInspectionForm: <ShadeInspectionForm inspReqId={null} reload={0} />,
    LabInspectionForm: <LabInspectionForm inspReqId={null} reload={0} />,
    Shrinkage: <Shrinkage inspReqId={null} reload={0} />,
    RelaxationInspectionForm: <RelaxationInspectionForm inspReqId={null} reload={0} />,
    RequestStatus: <RequestStatus />,
    InspectionSpecificDashboard: <InspectionSpecificDashboard typeOfInspection={InsFabricInspectionRequestCategoryEnum.INSPECTION} />,
    // WhDashboardPage: <WhDashboardPage />,  // DashBoard
    RacksDashboard: <RacksDashboard />,
    DashBoard: <DashBoard />,
    SecurityCheckinDashBoard: <SecurityCheckinDashBoard />,

    // todo:
    // WidthSegregationReport: <WidthSegregationReport />,
    // SupplierWiseWidthSegregationReport: <SupplierWiseWidthSegregationReport />,


    // CustomerWiseFabricReconciliationDetailsReport: <CustomerWiseFabricReconciliationDetailsReport />, //Report
    // FabricWiseFabricReconciliationDetailsReport: <FabricWiseFabricReconciliationDetailsReport />,//Report
    // StyleWiseFabricReconciliationDetailsReport: <StyleWiseFabricReconciliationDetailsReport />,//Report
    // PLStockSummaryDetailsReport: <PLStockSummaryDetailsReport />,//Report
    // StyleWiseStockSummaryDetailsReport: <StyleWiseStockSummaryDetailsReport />,//Report
    // SupplierWiseStockSummaryDetailsReport: <SupplierWiseStockSummaryDetailsReport />,//Report
    // SupplierPackingListReport: <SupplierPackingListReport />,//Report
    // CustomerWiseFabricRecieveReports: <CustomerWiseFabricRecieveReports />,//Report
    // CuttingReturnFabricReport: <CuttingReturnFabricReport />,//Report
    // EmptyPalletDetailReport: <EmptyPalletDetailReport />,//Report
    // FabricInwatdDetailsReport: <FabricInwatdDetailsReport />,//Report
    // FabricIssuedDetailsReport: <FabricIssuedDetailsReport />,//Report
    // FactoryTransferFabricReport: <FactoryTransferFabricReport />,//Report
    // FullStockReport: <FullStockReport />,//Report
    // GRNDetailsPackListWiseReport: <GRNDetailsPackListWiseReport />,//Report
    // GRNDetailsAllReport: <GRNDetailsAllReport />,//Report
    // PurchaseOrderDetailsReport: <PurchaseOrderDetailsReport />,//Report
    // InHouseDetailsReport: <InHouseDetailsReport />,//Report
    // SupplierReturnDetailsReport: <SupplierReturnDetailsReport />,//Report


    // todo:

    // FabricShadeAndGradeSeparationReport: <IFabricShadeAndGradeSeparationReport />,
    // InspectionSummaryReport: <InspectionSummaryReport />,
    // FourPointInspectionReports: <FourPointInspectionReports irId={0} />,
    // ShadeInspectionReport: <ShadeInspectionReport irId={0} />,
    // LabInspectionReport: <LabInspectionReport irId={0} />,
    // ShrinkageInspectionReport: <ShrinkageInspectionReport irId={0} />,
    // RelaxationInspectionReports: <RelaxationInspectionReports />,

    // VehicleUnloadingDashboardPage: <VehicleUnloadingDashboardPage />, //DashBoard
    // MODataIntegrationPage: <MODataIntegrationPage />,
    PalletRollDeAllocation: <PalletRollUnMapping />,
    RollIssuance: <RollQtyIssuance />,
    ManufacturingOrderDump: <OrderDumpPanel />,
    OMSOrderSummary: <OrderSummaryStepper />,
    // ProductionOrder: <ProductionOrderStepper />,
    // MaterialAllocation: <MaterialAllocation />,
    // DocketPlanning: <DocketPlanning />,
    // LayReporting: <KnittingReporting />,
    // WarehouseRequestDashboardPage: <WarehouseRequestDashboardPage />,
    // EmbellishmentJobsPage: <EmbellishmentJobsPage />,
    // BundleTagPage: <BundleTagPage />,
    PalletInsRollAllocation: <PalletInsRollAllocation />,
    PalletBinDeAllocation: <PalletBinUnMapping />,
    // MrnRequest: <MrnRequest />,
    // DispatchHeaderStep: <DispatchHeaderStep />, 
    DispatchHeaderStep: <ShipMentPage />,
    // PkDispatchHeaderStep: <PkDispatchHeaderStep />,
    PkDispatchHeaderStep: <PkShipMentPage />,
    // EmbellsihmentTracking: <EmblishmentScanPage />,
    // EmbDispatch: <EmbellishmentGatePassPage />,
    // OnFloorRolls: <OnFloorRollsControl />,
    TrayRollAllocation: <TrayRollAllocation />,
    TrolleyTrayAllocation: <TrolleyTrayAllocation />,
    BinTrolleyAllocation: <BinTrolleyAllocation />,
    // WarehouseAnalysisDashboard: <WareHouseAnalysisDashboard />, //DashBoard
    // GrnAnalysisDashboard: <GrnAnalysisDashboard />, //DashBoard
    OrderQtyRevision: <OrderQtyRevision />,
    // FabricInwardReport: <FabricInwardReport />,  //Report
    // GRNSummaryWiseReport: <GRNSummaryWiseReport />,  //Report
    // ReceivingReport: <ReceivingReport />,  //Report
    // OnHandStockReport: <OnHandStockReport />,  //Report
    // AgingReport: <AgingReport />,  //Report
    // ReconciliationReport: <ReconciliationReport />,  //Report

    // PackingListAnalysisDashBoard: <PackingListDashboardPage />, //DashBoard
    // BuyerAnalysisDashBoard: <BuyerAnalysisComponent />,//DashBoard
    // InspectionAnalysisDashBaoard: <InspectionComponent />,//DashBoard
    // PlannedDocketReport: <PlannedDocketReport />,
    SewingPlanning: <></>,
    // YyReport: <YyReport />

    ProductionPlanningMasters: <ProductionPlanningMasters />,
    SewingOrder: <SewingLayout />,
    SewingJobPlanning: <SewingJobPlanning />,
    ForeCastPlan: <ForecastPlan />,
    AttendanceCapturing: <AttendanceCapturing />,
    SewingJobTracking: <SewingJobTracking
    // usernameData={usernameData} sewingJobDataa={undefined}    
    // dummyData={dummyData} sewingJobsData={sewingJobsData} barCodeTableData={barCodeTableData} barcodePopoverData={barcodePopoverData} 
    />,
    // OperationTracking: <OperationTracking 
    // // usernameData={usernameData} sewingJobDataa={undefined}    
    // // dummyData={dummyData}
    // //  sewingJobsData={sewingJobsData} barCodeTableData={barCodeTableData} barcodePopoverData={barcodePopoverData} 
    // />,
    TrimsTrackingDaskBoard: <TrimsTrackingDaskBoard />,
    ModuleTrackingDashboard: <ModuleTrackingDashboard />,
    OperationTracking: <OperationTracking />,
    // DownTimeCapturing: <OperationTracking />
    DownTimeCapturing: <DowntimeOverview />,
    FgWhReqAnalysis: <FgWhReqAnalysis />,
    //Packing
    ...packingComponents,
    //QMS 
    ApproverView: <ApproverView />,
    ApproverForm: <ApproverForm form={undefined} />,
    QualityTypeView: <QualityTypeView />,
    QualityTypeForm: <QualityTypeForm form={undefined} />,
    QualityCheckListView: <QualityCheckListView />,
    QualityCheckListForm: <QualityCheckListForm form={undefined} />,
    EscallationView: <EscallationView />,
    EscallationForm: <EscallationForm form={undefined} />,
    ProductionDefectsForm: <ProductionDefectsForm form={undefined} />,
    ProductionDefectsView: <QualityChecksReporting />,
    QualityChecksTracker:<QualityChecksTracker />,
    DefectTrackingView: <QualityConfigurationForm formRef={undefined} initialValues={undefined} onFinish={() => {}} />,
    QMSDahsboard: <QMSDashboardN />,
    // OperationTracking: <OperationTracking
    //     userNameAndOperationCodeData={dummyData}
    //     sewingJobsBarcodeData={sewingJobsData}
    //     barCodeTableData={barCodeTableData}
    //     barcodePopoverData={barcodePopoverData}
    // />,
    // DownTimeCapturing: <DowntimeOverview />,
    // FgWhReqAnalysis: <FgWhReqAnalysis />,
    //Packing
    // ...packingComponents,
    // OperationTracking: <OperationTracking />,
    // DownTimeCapturing: <OperationTracking />
    SewingJobPriorityPage: <SewingJobPriorityPage />,
    SaleOrderDump: <OrderDumpPanel />,
    ProcessType: <CreateProcessType></CreateProcessType>,
    Product: <ProductMaster></ProductMaster>,
    Style: <CreateStyle></CreateStyle>,
    Customer: <CreateCustomer></CreateCustomer>,
    BomItem: <CreateBomItem></CreateBomItem>,
    MaterialIssuance: <MaterialIssuanceDashboard />,
    KnittingMainPanel: <KnittingMainPanel />,
    KnitJobPlanning: <KnitJobReporting />,
    StyleLevelOpVersion: <StyleLevelOpVersion />,
    OrderSummaryStepper: <OrderSummaryStepper />,
    OrderDumpPanel: <OrderDumpPanel />,
    MaterialAllocationForKnitJob: <MaterialAllocationForKnitJob />,
    CustomerOrderUpload: <SaleOrderDumpPanel />,
    InspectionConfigMain: <InspectionConfigMain />,
    InspectionReasonsGrid: <InspectionReasonsGrid />,
    SPSProcessingOrderLayout: <SPSProcessingOrderLayout />,
    QualityConfigurationView: <QualityConfigurationView />,
    QualityChecksReporting: <QualityChecksReporting />,
    MOProcessSummary: <MOProcessSummary />,
    KnitPoSummary: <KnitPoSummary />,
    SpsPoSummary: <SpsPoSummary />,
    CutOrder: <ProductionOrderStepper />, // cut-order
    MaterialAllocation: <MaterialAllocation />,// material-allocation
    DocketPlanning: <DocketPlanning />, // cut-planning
    EmbellishmentJobsPrint: <EmbellishmentJobsPage />, // emb-jobs-print
    BundleTagPrint: <BundleTagPage />, // bundle-tag-print
    OnFloorRolls: <OnFloorRollsControl />, // on-floor-rolls
    MrnRequest: <MrnRequest />, //mrn-request
    LayReporting: <LayReporting />,// lay-reporting
    EmbellishmentReporting: <EmblishmentScanPage />, //emb-reporting
    WhDashboardPage: <WhDashboardPage />, //warehouse-dashboard
    WarehouseRequestDashboardPage: <WarehouseRequestDashboardPage />, //fabric-request-dashboard
    CreateRacks: <CreateRacks />,
    CreateBins: <CreateBins />,
    CreatePallets: < CreatePallets />,
    CreateTrolly: <CreateTrolly />,
    CreateTray: <CreateTray />,
    CreateSuppliers: <CreateSuppliers />,
    StockSummary: <AvialbleStockDetails/>,
    MoOperationsSummaryReport:<MoOperationsSummaryReport/>
}