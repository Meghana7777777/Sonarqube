import React, { useState } from "react";
import { Table, Button, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import AddToBagDrawer from "./shipping-add-to-bag-popup";
import { ShipmentData } from "./shipping-request-interface";
import { InfoCircleOutlined, PrinterOutlined, ShoppingOutlined } from "@ant-design/icons";
// import BundleTagBarcode4X2 from "../../../PPS/bundle-tag/bundle-4x2-barcode-print";
import { AlertMessages } from "packages/ui/src/components/common";
import { ActualDocketBasicInfoModel, LayIdsRequest } from "@xpparel/shared-models";
import { LayReportingService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import BagBarcode4X2 from "./bag-barcode";
import BagSheetTable from "./bag-sheet";
import BundleTagBarcode4X2 from "../../../pk-dispatch/pk-shipment/pk-create-dispatch/bundle-4x2-barcode-print";


interface ShipmentPageChildProps {
  data: ShipmentData[];
  refreshParentComponent: (isNeedToRefresh:boolean) => void;
}

const ShippableSetDetails: React.FC<ShipmentPageChildProps> = ({ data ,refreshParentComponent}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ShipmentData | null>(null);
  const [pendingPallets, setPendingPallets] = useState<any[]>([]);
  const [printBarFlag, setPrintBarFlag] = useState<boolean>(false);
  const [actualDocketsForBundles, setActualDocketsForBundles] = useState<ActualDocketBasicInfoModel[]>([]);
  const [stateKey, setStateKey] = useState<number>(0);
  const [style, setStyle] = useState<string>(undefined);
  const [isShowBagBarcodes, setIsShowBagBarcodes] = useState<boolean>(false);
  const [isShowBagLevelInfo, setIsShowBagLevelInfo] = useState<boolean>(false);
  const layReportingService = new LayReportingService();
  const user = useAppSelector((state) => state.user.user.user);

  const showAddToBagModal = (record: ShipmentData) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };
  const showBagBarcode = (record: ShipmentData) => {
    setSelectedRecord(record);
    setIsShowBagBarcodes(true);
  };
  const showBagLevelInfo = (record: ShipmentData) => {
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
  const columns: ColumnsType<ShipmentData> = [
    { title: "Cut No", dataIndex: "cutNumber", align: "center" },
    { title: "Cut Sub No", dataIndex: "cutSubNumber", align: "center" },
    { title: "Bags", dataIndex: "bags", align: "center" },
    { title: "Bundles", dataIndex: "bundles", align: "center" },
    {
      title: "Action", key: "action", align: "center", width: 200,
      render: (_, record) => (
        <Space>
          <Button className="btn-blue" onClick={() => getBundleTagsForLay(record.layId, record.docNumber, record.style)} icon={<PrinterOutlined />}> Print Bundles </Button>
           <Button className="btn-orange" onClick={()=>showBagBarcode(record)} icon={<PrinterOutlined />}> Print Bags </Button>
          <Button type="primary" className="btn-yellow" onClick={() => showAddToBagModal(record)} icon={<ShoppingOutlined />}> Add to Bag </Button>
          <Button style={{ backgroundColor: "#9C27B0", color: "#fff" }} onClick={() => showBagLevelInfo(record)} icon={<InfoCircleOutlined />}> Show Bag Level Info </Button>
        </Space>
      ),
    },
  ];
  const printBarcode = () => {

  }
  return (
    <>
      <Table
        size="small"
        rowKey={(record) => record.cutNumber}
        bordered
        pagination={false}
        columns={columns}
        dataSource={data}
      />
      <AddToBagDrawer
        isDrawerOpen={isDrawerOpen}
        handleClose={handleCloseDrawer}
        selectedRecord={selectedRecord}
  
         />
    {/* TODO:CUT Done*/}
      {printBarFlag && <BundleTagBarcode4X2 setPrintBarFlag={setPrintBarFlag} key={stateKey + 1} docketsData={actualDocketsForBundles} printBarCodes={printBarcode} style={style} />}
        <BagBarcode4X2  cutInfo={selectedRecord} isShow={isShowBagBarcodes} setPrintBarFlag={setIsShowBagBarcodes}/>
        <BagSheetTable  cutInfo={selectedRecord} isShow={isShowBagLevelInfo} updateModalState={setIsShowBagLevelInfo}/>
    </>
  );
};

export default ShippableSetDetails;
