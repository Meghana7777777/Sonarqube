import React, { useState } from "react";
import { Table, Button, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import AddToBagDrawer from "./pk-shipping-add-to-bag-popup";
import { PkShipmentData } from "./pk-shipping-request-interface";
import { InfoCircleOutlined, PrinterOutlined, ShoppingOutlined } from "@ant-design/icons";
// import BundleTagBarcode4X2 from "../../../PPS/bundle-tag/bundle-4x2-barcode-print";
import { AlertMessages } from "packages/ui/src/components/common";
import { ActualDocketBasicInfoModel, LayIdsRequest } from "@xpparel/shared-models";
import { LayReportingService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import BagBarcode4X2 from "./pk-bag-barcode";
import BagSheetTable from "./pk-bag-sheet";
import BundleTagBarcode4X2 from "./bundle-4x2-barcode-print";


interface ShipmentPageChildProps {
  data: PkShipmentData[];
  refreshParentComponent: (isNeedToRefresh:boolean) => void;
}

const PkShippableSetDetails: React.FC<ShipmentPageChildProps> = ({ data ,refreshParentComponent}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PkShipmentData | null>(null);
  const [pendingPallets, setPendingPallets] = useState<any[]>([]);
  const [printBarFlag, setPrintBarFlag] = useState<boolean>(false);
  const [actualDocketsForBundles, setActualDocketsForBundles] = useState<ActualDocketBasicInfoModel[]>([]);
  const [stateKey, setStateKey] = useState<number>(0);
  const [style, setStyle] = useState<string>(undefined);
  const [isShowBagBarcodes, setIsShowBagBarcodes] = useState<boolean>(false);
  const [isShowBagLevelInfo, setIsShowBagLevelInfo] = useState<boolean>(false);
  const layReportingService = new LayReportingService();
  const user = useAppSelector((state) => state.user.user.user);

  const showAddToBagModal = (record: PkShipmentData) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };
  const showBagBarcode = (record: PkShipmentData) => {
    setSelectedRecord(record);
    setIsShowBagBarcodes(true);
  };
  const showBagLevelInfo = (record: PkShipmentData) => {
    setSelectedRecord(record);
    setIsShowBagLevelInfo(true);
  };


  const handleCloseDrawer = (isNeedToRefresh: boolean) => {
    setIsDrawerOpen(false);
    setSelectedRecord(null);
    if(isNeedToRefresh) {
      refreshParentComponent(isNeedToRefresh);
    }
  };

 

 
  const getBundleTagsForLay = (layId: number, mainDocketNumber: string, stylePar: string) => {
    setStyle(stylePar);
    const req = new LayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [layId], false, true, mainDocketNumber);
    layReportingService.getActualDocketInfo(req).then((res => {
      if (res.status) {
        setActualDocketsForBundles(res.data);
        setPrintBarFlag(true);
        setStateKey(preState => preState + 1);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message)
    });
  }

  // moNum: string;
  // packListId: string;
  // totalCartons: number;
  // dsetId: number;
  // dSetItemId: number;
  // styles: string;
  // buyers: string;
  // delDates: string;
  // vpos: string;
  // dSetCode: string;
  // productNames: string;
  // destinations: string;
  // plDesc: string

  const columns: ColumnsType<PkShipmentData> = [
    { title: "Style", dataIndex: "styles", align: "center" },
    { title: "Buyer", dataIndex: "buyers", align: "center" },
    { title: "Destination", dataIndex: "destination", align: "center" },
    { title: "VPO Number", dataIndex: "vpos", align: "center" },
    { title: "Pack list desc", dataIndex: "plDesc", align: "center" },
    { title: "Total cartons", dataIndex: "totalCartons", align: "center" },
    // {
    //   title: "Action", key: "action", align: "center", width: 200,
    //   render: (_, record) => (
    //     <Space>
    //       <Button className="btn-blue" onClick={() => getBundleTagsForLay(record.layId, record.docNumber, record.style)} icon={<PrinterOutlined />}> Print Bundles </Button>
    //        <Button className="btn-orange" onClick={()=>showBagBarcode(record)} icon={<PrinterOutlined />}> Print Bags </Button>
    //       <Button type="primary" className="btn-yellow" onClick={() => showAddToBagModal(record)} icon={<ShoppingOutlined />}> Add to Bag </Button>
    //       <Button style={{ backgroundColor: "#9C27B0", color: "#fff" }} onClick={() => showBagLevelInfo(record)} icon={<InfoCircleOutlined />}> Show Bag Level Info </Button>
    //     </Space>
    //   ),
    // },
  ];
  const printBarcode = () => {

  }
  return (
    <>
      <Table
        size="small"
        rowKey={(record) => record.packListId}
        bordered
        pagination={false}
        columns={columns}
        dataSource={data}
      />
      {/* <AddToBagDrawer
        isDrawerOpen={isDrawerOpen}
        handleClose={handleCloseDrawer}
        selectedRecord={selectedRecord}
  
         /> */}
      {/* TODO:CUT :Done*/}
      {printBarFlag && <BundleTagBarcode4X2 setPrintBarFlag={setPrintBarFlag} key={stateKey + 1} docketsData={actualDocketsForBundles} printBarCodes={printBarcode} style={style} />}
        {/* <BagBarcode4X2  cutInfo={selectedRecord} isShow={isShowBagBarcodes} setPrintBarFlag={setIsShowBagBarcodes}/>
        <BagSheetTable  cutInfo={selectedRecord} isShow={isShowBagLevelInfo} updateModalState={setIsShowBagLevelInfo}/> */}
    </>
  );
};

export default PkShippableSetDetails;
