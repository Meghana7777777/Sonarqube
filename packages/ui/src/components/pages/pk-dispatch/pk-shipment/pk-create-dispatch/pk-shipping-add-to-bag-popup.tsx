import React, { useState, useEffect, useRef } from "react";
import { Drawer, Input, Form, Row, Col, Descriptions, Table, message, Button, Select, TableProps, Tag, Flex, Space, Alert } from "antd";
import { CheckOutlined, CopyOutlined, ReloadOutlined, ScanOutlined, ShoppingOutlined } from "@ant-design/icons";
import { PalletDetailsModel, PkDSetGetBarcodesRequest, PkDSetItemsBarcodesModel, PkDSetSubItemsBarcodesModel, PkDSetSubItemContainerMappingRequest, GlobalResponseObject, PkContainerWiseSubItemBarcodeModel, PkDSetItemAttrEnum } from "@xpparel/shared-models";
import { useAppSelector } from "packages/ui/src/common";
import { DispatchReadyService } from "@xpparel/shared-services";
import { AlertMessages } from "packages/ui/src/components/common";

interface AddToBagDrawerProps {
  isDrawerOpen: boolean;
  handleClose: (isNeedToRefresh: boolean) => void;
  selectedRecord: {
    moNum: string;
    productName: string;
    cutNumber: string;
    bundles: number;
    bags: number;
    containers: any[];
    dsetId: number;
    dSetItemId: number;
  };


}
interface Barcode {
  dSetItemId: number;
  barcode: string;
  quantity: number;
  shade: string;
  size: string;
  selectedContainerId?: number; 
}
interface IContainerInfo {
  containerId: number;
  containerName: string;
}
interface DisplayMsg {
  isSuccess: boolean;
  msg: string;
}

interface BarcodeResponse {
  barcode: string;
  containerName: string;
  message: string;
  isError: boolean;
  id: number;
}


const PkAddToBagDrawer: React.FC<AddToBagDrawerProps> = ({
  isDrawerOpen,
  handleClose,
  selectedRecord,
}) => {
  const [manualBarcode, setManualBarcode] = useState<string>("");
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [barcodeData, setBarcodeData] = useState<Barcode[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<number | undefined>(undefined); // Store the selected container ID
  const user = useAppSelector((state) => state.user.user.user);
  const dispatchReadyService = new DispatchReadyService();
  const barcodeInputRef = useRef(null);
  const [debounceTimer, setDebounceTimer] = useState<any>();
  const [containersInfo, setContainerInfo] = useState<IContainerInfo[]>([]);
  const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);
  const [pendingBundles, setPendingBundles] = useState<number>(0);
  const [barcodeResponses, setBarcodeResponses] = useState<BarcodeResponse[]>([]);
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const { Option } = Select;
  const [form] = Form.useForm();
  useEffect(() => {
    if (isDrawerOpen) {
      removeDIsplayMsg();
      setBarcodeData([]);
      setContainerInfo([]);
      setSelectedContainerId(undefined);
      clearTimeout(debounceTimer);
      fetchBarcodeData([selectedRecord.dsetId], [selectedRecord.dSetItemId]);
      calculatePendingBundles(selectedRecord.bundles, selectedRecord.containers);
      setIsScanned(false);
    }
  }, [isDrawerOpen]);

  const handleContainerChange = (containerName: number) => {
    setSelectedContainerId(containerName);
    barcodeInputFocus();
  };

  const handleManualBarcodeSubmit = async () => {
    const msg = selectedContainerId ? manualBarcode.trim() ? undefined : 'Please enter valid barcode' : 'Please select Container';
    if (!msg) {
      await barcodeScanning(manualBarcode, selectedContainerId, "A");
      setManualBarcode("");
      barcodeInputFocus();
    } else {
      addDisplayMsg(msg);
      setManualBarcode("");
      barcodeInputFocus();
    }
  };
  const beforeScanBarcode = (value: string) => {
    clearTimeout(debounceTimer);
    // Set a new timer to call scanBarcode after 500ms
    const timeOutId = setTimeout(() => {
      handleScanBarcodeSubmit(value);
      setScannedBarcode(value);
    }, 500);
    setDebounceTimer(timeOutId);
  }

  const handleScanBarcodeSubmit = async (barcodeVal: string) => {
    const msg = selectedContainerId ? barcodeVal.trim() ? undefined : 'Please scan valid barcode' : 'Please select Container';
    if (!msg) {
      await barcodeScanning(barcodeVal, selectedContainerId, "A");
      setScannedBarcode("");
    } else {
      addDisplayMsg(msg);
      barcodeInputFocus();
    }
  };

  const barcodeScanning = async (subItemBarcode: string, containerId: number, shift: string) => {
    try {
      form.setFieldValue("barcodeInput", "");
      const reqObj = new PkDSetSubItemContainerMappingRequest( [subItemBarcode], containerId, true, shift, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,
        false, true);
      const response = await dispatchReadyService.putDSetSubItemInTheContainer(reqObj);
      const responseObj: BarcodeResponse = {
        barcode: subItemBarcode,
        containerName: "",
        message: response.internalMessage,
        isError: !response.status,
        id: Date.now(),
      };
      if (response.status) {
        addDisplayMsg(response.internalMessage, true);
        removeScannedBarcodeFromPendingBarcodes(subItemBarcode);
      } else {
        addDisplayMsg(response.internalMessage);
        responseObj.isError = true;
      }
      setBarcodeResponses((prevResponses) => [...prevResponses, responseObj]);
      return;
    } catch (error) {
      addDisplayMsg(error.message);
    }
  };

  const removeScannedBarcodeFromPendingBarcodes = (barcode: string) => {

    const pendingBarcodes = barcodeData.filter(item => item.barcode !== barcode);
    setBarcodeData(pendingBarcodes);
    // Validate scanned barcode is from pending barcode or same barcode scanned twice
    // then should not decrease pending barcode count
    if (barcodeData.length > pendingBarcodes.length) {
      setPendingBundles(preState => preState - 1);
    }

  }
  const fetchBarcodeData = async (dsetId: number[], dSetItemIds: number[],) => {
    try {
      const reqObj = new PkDSetGetBarcodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, dsetId, dSetItemIds, false, true, false, true, true, false);

      const response = await dispatchReadyService.getDsetItemBarcodeInfo(reqObj);
      if (response.status) {
        if (response.data.length) {
          const uniqueContainerNames = new Map<string, IContainerInfo>();
          const scannedBarcodes = new Set<string>()
          const barcodeModels: Barcode[] = [];
          response.data.forEach(barcode => {
            barcode.containerWiseBarcodeMapping.forEach(e => {
              uniqueContainerNames.set(e.containerName, { containerId: e.containerId, containerName: e.containerName });
              e.totalBarcodes.forEach(sb => scannedBarcodes.add(sb))

            })
            barcode.dSetSubItemBarcodes.forEach(subItemBarcode => {
              const barcodeData: Barcode = {
                dSetItemId: barcode.dSetItemId,
                barcode: subItemBarcode.barcode,
                quantity: Number(subItemBarcode.quantity),
                shade: subItemBarcode?.detailedInfo?.shade,
                size: subItemBarcode?.detailedInfo?.size
              };
              if (!scannedBarcodes.has(subItemBarcode.barcode)) {
                barcodeModels.push(barcodeData)
              }
            });

          }

          );
          setBarcodeData(barcodeModels);
          setContainerInfo(Array.from(uniqueContainerNames.values()))
        } else {
          AlertMessages.getWarningMessage("No data found");
        }
      } else {
        AlertMessages.getErrorMessage(response.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    }
  };


  const refreshTableData = () => {
    fetchBarcodeData([selectedRecord.dsetId], [selectedRecord.dSetItemId]);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success('Copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy.');
      });
  };
  const closeMsg = () => {
    removeDIsplayMsg();
    barcodeInputFocus();
  }
  const removeDIsplayMsg = () => {
    setDisplayMsg(undefined);
  }
  const addDisplayMsg = (msg: string, isSuccess: boolean = false,) => {
    const displayObj: DisplayMsg = { isSuccess, msg };
    setDisplayMsg(displayObj);
    form.setFieldValue('barcodeInput', '');
  }
  const barcodeInputFocus = () => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }
  const columns: TableProps<Barcode>["columns"] = [
    {
      title: "Barcode",
      dataIndex: "barcode",
      width: 150,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }} onClick={() => handleCopy(record.barcode)}>
          <span style={{ marginRight: 8 }}>{record.barcode}</span>
          <Button icon={<CopyOutlined />} className="clip-board" size="small" />
        </div>
      ),
    },
    { title: "Quantity", dataIndex: "quantity", width: 150 },
    { title: "Shade", dataIndex: "shade", width: 150 },
    { title: "Size", dataIndex: "size", width: 150 },
    {
      title: "Select Bag",
      dataIndex: "containerName",
      width: 150,
      render: (text, record) => (
        <Select
          placeholder="Select Bag"
          onChange={(value) => handleContainerSelection(value, record.barcode)}
        >
          {containersInfo.map((container) => (
            <Option key={container.containerId} value={container.containerId}>
              {container.containerName}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const calculatePendingBundles = (bundles, containers) => {
    const totalSubItems = containers.reduce((total, container) => total + container.totalSubItemsInContainer, 0);
    const bundleDiff = bundles - totalSubItems;
    setPendingBundles(bundleDiff)
  }
  const renderPendingBundlesDisplay = (pendingBundlesQty) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{pendingBundles < 0 ? 0 : pendingBundles}</span>
      </div>
    );
  };

  const Columns: TableProps<BarcodeResponse>['columns'] = [
    {
      title: "Barcode",
      dataIndex: "barcode",
      width: 150,
      render: (barcode: string, record) => (
        <div style={{ color: record.isError ? 'red' : 'green' }}>
          {barcode}
        </div>
      )
    },
    {
      title: "Message",
      dataIndex: "message",
      width: 150,
      render: (text, record) => (<div>
        {record.isError ? <span>{record.message}</span> : record.message}
      </div>
      )
    },
  ];

  const filteredBarcodeData = barcodeData.filter(barcodeItem => {
    const isScanned = barcodeResponses.some(response =>
      response.barcode.includes(barcodeItem.barcode) && response.isError === false
    );
    return !isScanned;
  });

  const handleContainerSelection = (containerId: number, barcode: string) => {
    setBarcodeData((prevData) =>
      prevData.map((item) =>
        item.barcode === barcode ? { ...item, selectedContainerId: containerId } : item
      )
    );
  };

  const handleSubmit = async () => {
  try {
    const selectedData = barcodeData
      .filter((item) => item.selectedContainerId) 
      .map((item) => ({
        barcode: item.barcode,
        containerId: item.selectedContainerId,
      }));

    if (selectedData.length === 0) {
      message.error("Please select containers for the barcodes.");
      return;
    }
     for (const { barcode, containerId } of selectedData) {
      await barcodeScanning(barcode, containerId, "A");
      setBarcodeData((prevData) =>
        prevData.filter((item) => item.barcode !== barcode)
      );
    }
      message.success("All selected barcodes submitted successfully.");
    } catch (error) {
      message.error("Error submitting barcodes: " + error.message);
    }  
  };


  return (
    <Drawer title={
      <Flex justify="space-between">
        <span> <ShoppingOutlined style={{ marginRight: 8 }} /> Add to Bag </span>
        <Space size={'large'}>
          {displayMsg && <Alert
            message={displayMsg.msg}
            type={displayMsg.isSuccess ? "success" : 'error'}
            style={{ padding: '8px 12px' }}
            banner
            showIcon
            closable
            afterClose={closeMsg}
          />}
        </Space>
      </Flex>
    }
      placement="right" onClose={() => handleClose(isScanned)} open={isDrawerOpen} width="100%">
      {selectedRecord && (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Descriptions bordered size="small">
                <Descriptions.Item label={<strong>MO</strong>}>{selectedRecord.moNum}</Descriptions.Item>
                <Descriptions.Item label={<strong>Product Name</strong>}><Tag style={{ fontSize: '14px' }} color="#d46b08">{selectedRecord.productName}</Tag></Descriptions.Item>
                <Descriptions.Item label={<strong>Cut No</strong>}>{selectedRecord.cutNumber}</Descriptions.Item>
                <Descriptions.Item label={<strong>No of Bags</strong>}>{selectedRecord.bags}</Descriptions.Item>
                <Descriptions.Item label={<strong>Total Bundles</strong>}><Tag style={{ fontSize: '14px' }} color="green">{selectedRecord.bundles}</Tag></Descriptions.Item>
                <Descriptions.Item label={<strong>Pending Bundles</strong>} style={{ flex: '1 0 100%' }}>
                  {/* <PendingBundlesDisplay bundles={selectedRecord.bundles} containers={selectedRecord.containers} /> */}
                  {renderPendingBundlesDisplay(pendingBundles)}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "16px 0" }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={refreshTableData}
                  style={{ marginLeft: 'auto' }}
                >
                </Button>
              </div>

              <Table
                columns={columns}
                dataSource={barcodeData}
                pagination={false}
                rowKey="barcode"
                size="small"
                bordered
                scroll={{ y: 580 }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Col>

            <Col span={12}>
              <Form layout="vertical" form={form}>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="Select Container">
                      <Select
                        placeholder="Select a Container"
                        onChange={handleContainerChange}
                      >
                        {containersInfo.map((e) => (
                          <Select.Option key={e.containerId} value={e.containerId}>
                            {e.containerName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Scan Barcode" name='barcodeInput'>
                      <Input
                        placeholder="Scan Barcode"
                        ref={barcodeInputRef}
                        onChange={(e) => beforeScanBarcode(e.target.value)}

                        prefix={<ScanOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Enter Barcode">
                      <Input.Group compact>
                        <Input
                          style={{ width: 'calc(100% - 50px)' }}
                          placeholder="Enter Barcode"
                          value={manualBarcode}
                          onChange={(e) => setManualBarcode(e.target.value)}
                        />
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={handleManualBarcodeSubmit}
                        />
                      </Input.Group>
                    </Form.Item>
                  </Col>
                  <Table
                    columns={Columns}
                    dataSource={barcodeResponses.sort((a, b) => b.id - a.id)}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    style={{ width: '100%', maxWidth: '800px' }}
                  />
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </Drawer>
  );

};

export default PkAddToBagDrawer;



