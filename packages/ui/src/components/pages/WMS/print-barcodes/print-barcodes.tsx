import { PrinterTwoTone, SyncOutlined } from "@ant-design/icons";
import {
  BarcodeColumnsDto,
  BatchInfoModel,
  PackingListInfoModel,
  PackingListSummaryModel,
  PhBatchLotRollRequest,
  RollInfoModel,
} from "@xpparel/shared-models";
import { PackingListService } from "@xpparel/shared-services";
import { Collapse, CollapseProps, Space, Tooltip } from "antd";
import { useState } from "react";
import { useAppSelector } from "../../../../common";
import {
  ScxButton,
  ScxCard,
  ScxForm,
  ScxRow,
} from "../../../../schemax-component-lib";
import { AlertMessages } from "../../../common";
import { PrintBarcodeHeader } from "./print-barcode-header";
import BarcodePrint from "./print-barcode-source";
import { PrintBarCodesTable } from "./print-barcodes-table";
import "./print-barcodes.css";
import RollBarcode4By2 from "./print-barcod-4-2";

const { Panel } = Collapse;
interface IPrintBarCodesProps {
  summeryDataRecord: PackingListSummaryModel;
}
type ExtraProperties = {
  supplierCode: string;
  phId: number;
  // Add more extra properties as needed
};

const lotsDropdownSet: Set<string> = new Set();
const rollsDropDownMap: Map<number, string> = new Map();
export type PrintTableModel = RollInfoModel & ExtraProperties;
export const PrintBarCodes = (props: IPrintBarCodesProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const { summeryDataRecord } = props;
  const [headerFormRef] = ScxForm.useForm();
  const [packListData, setPackListData] = useState<PackingListInfoModel>();
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [printableRolls, setPrintableRolls] = useState<any[]>([]);
  const [headerFormData, setHeaderFormData] = useState<any>([]);

  const packageService = new PackingListService();

  const getPackListNumber = (
    req: PhBatchLotRollRequest,
    showErrorMsg: boolean = false
  ) => {
    setHeaderFormData(req);
    packageService
      .getPackListInfo(req)
      .then((res) => {
        if (res.status) {
          // setActiveKeys(res.data[0]?.batchInfo.map(rec => rec.batchNumber));
          setPackListData(res.data[0]);
          setPrintableRolls([]);
        } else {
          if (showErrorMsg) {
            AlertMessages.getErrorMessage(
              res.errorCode + " - " + res.internalMessage
            );
          }
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const printAllBarcode = (req: PhBatchLotRollRequest) => {
    const rollsData: any[] = [];
    packListData?.batchInfo.map((rec) => {
      const rollData = processBatchData(
        rec,
        packListData.supplierCode,
        packListData.id
      );
      rollsData.push(...rollData);
    });
    setPrintableRolls(rollsData);
  };

  const handlePrintBatchLevel = (tablesData: any[]) => {
    setPrintableRolls(tablesData);
  };

  const handlePrintRollLevel = (tablesData: any[]) => {
    setPrintableRolls(tablesData);
  };

  const handleReleaseBatchLevel = (
    req: PhBatchLotRollRequest,
    batch: string
  ) => {
    req.batchNumber = batch;
    handleRelease(req);
  };

  const handleReleaseRollLevel = (req: PhBatchLotRollRequest) => {
    handleRelease(req);
  };

  const handlePrint = (data: any[]) => {
    setPrintableRolls(data);
  };

  const handleRelease = (req: PhBatchLotRollRequest) => {
    packageService
      .releaseBarCodes(req)
      .then((res) => {
        if (res.status) {
          let lot = headerFormRef.getFieldValue("lotNumber");
          let roll = headerFormRef.getFieldValue("rollNumber");
          const dupReq: PhBatchLotRollRequest = new PhBatchLotRollRequest(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            summeryDataRecord.id,
            lot,
            undefined,
            roll,
            summeryDataRecord.supplierCode,
            undefined
          );
          getPackListNumber(dupReq);
          setPrintableRolls([]);
          AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
          AlertMessages.getErrorMessage(
            res.errorCode + "-" + res.internalMessage
          );
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const processBatchData = (
    batchInfo: BatchInfoModel,
    supplierCode: string,
    phId: number
  ) => {
    const tablesData: RollInfoModel[] = [];
    let setDropDownValues = true;
    const lotNumber = headerFormRef.getFieldValue("lotNumber");
    const rollNumber = headerFormRef.getFieldValue("rollNumber");
    if (lotNumber || rollNumber) setDropDownValues = false;
    batchInfo.lotInfo?.forEach((lot) => {
      if (setDropDownValues) lotsDropdownSet.add(lot.lotNumber);
      lot.rollInfo.forEach((roll) => {
        if (setDropDownValues)
          rollsDropDownMap.set(roll.id, roll.externalRollNumber);
        const obj: PrintTableModel = {
          ...roll,
          supplierCode,
          phId,
        };
        obj["qrcodeId"] = JSON.stringify(obj);
        tablesData.push(obj);
      });
    });
    return tablesData;
  };

  const printBarCodes = (data: PrintTableModel[]) => {
    const rollNumber = data.length == 1 ? `${data[0].rollNumber}` : undefined;
    const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      summeryDataRecord.id,
      data[0].batchNumber,
      undefined,
      rollNumber,
      summeryDataRecord.supplierCode,
      undefined
    );
    packageService
      .printBarCodes(req)
      .then((res) => {
        if (res.status) {
          // if the user selected batch or roll then dont delete them from the request.
          let lot = headerFormRef.getFieldValue("lotNumber");
          let roll = headerFormRef.getFieldValue("rollNumber");
          const dupReq: PhBatchLotRollRequest = new PhBatchLotRollRequest(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            summeryDataRecord.id,
            lot,
            undefined,
            roll,
            summeryDataRecord.supplierCode,
            undefined
          );

          getPackListNumber(dupReq);
          setPrintableRolls([]);
        } else {
          AlertMessages.getErrorMessage(
            res.errorCode + "-" + res.internalMessage
          );
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };
  const barcodeColumns: BarcodeColumnsDto[] = [
    {
      lineNumber: 0,
      title: "",
      dataIndex: "qrcodeId",
      span: 2,
      showLabel: false,
      showBarcode: false,
      showQRCode: true,
    },
    {
      lineNumber: 0,
      title: "Object No",
      dataIndex: "externalRollNumber",
      span: 4,
      showLabel: true,
      showBarcode: false,
      showQRCode: false,
    },
    {
      lineNumber: 0,
      title: "Object Qty",
      dataIndex: "supplierQuantity",
      span: 4,
      showLabel: true,
      showBarcode: false,
      showQRCode: false,
    },
    {
      lineNumber: 0,
      title: "Object Width",
      dataIndex: "supplierWidth",
      span: 4,
      showLabel: true,
      showBarcode: false,
      showQRCode: false,
    },
    {
      lineNumber: 1,
      title: "",
      dataIndex: "barcode",
      span: 2,
      showLabel: false,
      showBarcode: true,
      showQRCode: false,
    },
    {
      lineNumber: 1,
      title: "Batch No",
      dataIndex: "batchNumber",
      span: 1,
      showLabel: true,
      showBarcode: false,
      showQRCode: false,
    },
    {
      lineNumber: 1,
      title: "Lot No",
      dataIndex: "lotNumber",
      span: 1,
      showLabel: true,
      showBarcode: false,
      showQRCode: false,
    },
    {
      lineNumber: 2,
      title: "Material Item Code",
      dataIndex: "materialItemCode",
      span: 4,
      showLabel: true,
      showBarcode: false,
      showQRCode: false,
    },
    {
      lineNumber: 2,
      title: "Item Type",
      dataIndex: "itemType",
      span: 3,
      showLabel: true,
      showBarcode: false,
      showQRCode: false,
    },
    {
      lineNumber: 3,
      title: "Item Category",
      dataIndex: "itemCategory",
      span: 4,
      showLabel: true,
      showBarcode: false,
      showQRCode: false,
    },
  ];
  const validateIsRollPrinted = (batchInfo: BatchInfoModel) => {
    let isRollPrinted = false;
    for (const lotInfo of batchInfo.lotInfo) {
      const rollObj = lotInfo.rollInfo.find((roll) => roll.printStatus == true);
      if (rollObj) {
        isRollPrinted = true;
        break;
      }
    }
    return isRollPrinted;
  };

  const getItems = (batches: BatchInfoModel[]) => {
    const items: CollapseProps["items"] = batches.map((batch) => {
      return {
        key: batch.batchNumber,
        label: `Batch No : ${batch.batchNumber}`,
        children: (
          <PrintBarCodesTable
            handleRelease={handleReleaseRollLevel}
            handlePrint={handlePrintRollLevel}
            tableData={processBatchData(
              batch,
              packListData.supplierCode,
              packListData.id
            )}
          />
        ),
        extra: (
          <>
            <ScxRow justify="end">
              <Space>
                <Tooltip title="Release">
                  <ScxButton
                    // type="primary"
                    icon={<SyncOutlined />}
                    size="small"
                    onClick={(e) => {
                      handleReleaseBatchLevel(
                        headerFormData,
                        batch.batchNumber
                      );
                      e.stopPropagation();
                    }}
                  >
                    Release
                  </ScxButton>
                </Tooltip>
                <Tooltip title="Print">
                  <ScxButton
                    disabled={validateIsRollPrinted(batch)}
                    size="small"
                    onClick={(e) => {
                      handlePrint(
                        processBatchData(
                          batch,
                          packListData.supplierCode,
                          packListData.id
                        )
                      );
                      e.stopPropagation();
                    }}
                    icon={<PrinterTwoTone />}
                  >
                    Print
                  </ScxButton>
                </Tooltip>
              </Space>
            </ScxRow>
          </>
        ),
      };
    });
    return items;
  };
  return (
    <ScxCard className="print-barCodes-header-card" title="Print BarCodes">
      <PrintBarcodeHeader
        headerFormRef={headerFormRef}
        disablePrintButton={packListData?.batchInfo?.length === 0}
        getPackListNumber={getPackListNumber}
        printAllBarcode={printAllBarcode}
        summeryDataRecord={summeryDataRecord}
        lotsDropdownSet={lotsDropdownSet}
        rollsDropDownMap={rollsDropDownMap}
        packListData={packListData}
      />
      {packListData?.batchInfo?.length !== 0 && (
        <Collapse
          bordered={true}
          defaultActiveKey={activeKeys}
          size="small"
          items={getItems(packListData ? packListData.batchInfo : [])}
        />
      )}
      {printableRolls.length !== 0 && (
        // <BarcodePrint
        //   key={Date.now()}
        //   printBarCodes={() => printBarCodes(printableRolls)}
        //   barcodeInfo={printableRolls}
        //   columns={barcodeColumns}
        //   newWindow={false}
        //   closeBarcodePopUp={() => {
        //     setPrintableRolls([]);
        //   }}
        //  />
        <RollBarcode4By2    
         key={Date.now()}    
         printBarCodes={() => printBarCodes(printableRolls)}
         rollBarcodeData={printableRolls}
        />
        
      )}
    </ScxCard>
  );
};

export default PrintBarCodes;
