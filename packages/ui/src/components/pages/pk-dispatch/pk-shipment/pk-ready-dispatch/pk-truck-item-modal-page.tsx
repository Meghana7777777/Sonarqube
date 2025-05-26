import { useState, useEffect, useRef } from "react";
import { Drawer, Input, Select, Button, Form, Row, Col, Tag, message, Descriptions, Typography, Spin, Card, Space } from "antd";
import { ScanOutlined, ReloadOutlined, SearchOutlined, PlusOutlined, UserOutlined, PhoneOutlined, CarOutlined } from "@ant-design/icons";
import truckIcon from "../../../../../assets/icons/truck.png";
import { PkShippingRequestIdRequest, PkShippingRequestTruckIdRequest, PkTruckItemsMapRequest } from "@xpparel/shared-models";
import { useAppSelector } from "packages/ui/src/common";
import { PkShippingRequestService } from "@xpparel/shared-services";
import { AlertMessages } from "packages/ui/src/components/common";
import carton from '../../../../../assets/icons/cartons.png';

interface PropsItems {
  visible: boolean;
  onClose: () => void;
  shippingRequestId: string;
}

interface TruckInfo {
  truckId: number;
  driverName: string;
  truckNo: string;
  loadingStatus: number;
  mobileNumber?: string;
}

const { Search } = Input;

const TruckDrawerModal = ({ visible, onClose, shippingRequestId }: PropsItems) => {
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  const [scannedCartons, setScannedCartons] = useState<Set<string>>(new Set());
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  const [cartons, setCartons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [truckInfo, setTruckInfo] = useState<TruckInfo[]>([]);
  const [mappedCartons, setMappedCartons] = useState<Set<string>>(new Set());
  const [scannedCount, setScannedCount] = useState(0);
  const [truckMappedCounts, setTruckMappedCounts] = useState<Record<string, number>>({});
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<Record<string, number>>({});
  const [barcodeSource, setBarcodeSource] = useState<Map<string, string>>(new Map());
  const truckRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const user = useAppSelector((state) => state.user.user.user);
  const shippingRequestService = new PkShippingRequestService();

  useEffect(() => {
    if (visible) {
      const fetchData = async () => {
        setLoading(true);
        await Promise.all([
          getCartonswithSrID(shippingRequestId),
          getTruckInfowithSrID(shippingRequestId),
          getMappedCartons(shippingRequestId),
        ]);
        setLoading(false);
      };
      fetchData();
    }
  }, [visible, shippingRequestId]);

  useEffect(() => {
    if (truckInfo.length === 0) setSelectedTruck(null);
  }, [truckInfo]);

  const getCartonswithSrID = async (shippingRequestId: string) => {
    try {
      const req = new PkShippingRequestIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [Number(shippingRequestId)], '', true, true, true, true);
      const response = await shippingRequestService.getDSetSubItemsForSrId(req);
      const dSetSubItems = response.data?.[0]?.dSetSubItems || [];
      setCartons(dSetSubItems.map(item => ({ key: item.id, barcode: item.barcode, ctnNo: item.ctnNo })));
    } catch (error) {
      AlertMessages.getErrorMessage("Failed to load cartons.");
      setCartons([]);
    }
  };

  const getTruckInfowithSrID = async (shippingRequestId: string) => {
    const reqObj = new PkShippingRequestIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [Number(shippingRequestId)], 'Fetching truck info', false, true, false, false);
    try {
      const response = await shippingRequestService.getShippingRequestByIds(reqObj);
      const mappedTruckInfo = response?.data?.flatMap(item =>
        item.truckInfo.map(truck => ({
          truckId: truck.id,
          driverName: truck.dirverName,
          truckNo: truck.truckNumber,
          loadingStatus: truck.loadingStatus || 0,
          mobileNumber: truck.contact || "Not Available",
        }))
      ) || [];
      setTruckInfo(mappedTruckInfo);
      setLoadingState(mappedTruckInfo.reduce((acc, truck) => ({
        ...acc,
        [truck.truckNo]: truck.loadingStatus,
      }), {}));
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
      setTruckInfo([]);
      setLoadingState({});
    }
  };

  const getMappedCartons = async (shippingRequestId: string) => {
    const reqObj = new PkShippingRequestIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [Number(shippingRequestId)], 'Fetching truck info', false, true, false, false);
    try {
      const response = await shippingRequestService.getTruckMappedItemsForSrId(reqObj);
      const mapped = new Set(response.data?.flatMap(truck => truck.items.map(item => item.barcode)) || []);
      const mappedCounts = response.data?.reduce((acc, truck) => ({ ...acc, [truck.truckNo]: truck.items.length }), {}) || {};
      setMappedCartons(mapped);
      setTruckMappedCounts(mappedCounts);
    } catch (error) {
      AlertMessages.getErrorMessage("Failed to load mapped cartons.");
    }
  };

  const mapBarcodesToTruck = async (barcodes: string[], isAutoScan: boolean): Promise<void> => {
    if (!selectedTruck) {
      AlertMessages.getWarningMessage("Please select a truck first!");
      return;
    }
    if (loadingState[selectedTruck] === 2) {
      AlertMessages.getErrorMessage("This truck’s loading is completed. No more barcodes can be scanned.");
      return;
    }
    const selectedTruckInfo = truckInfo.find(truck => truck.truckNo === selectedTruck);
    if (!selectedTruckInfo) {
      AlertMessages.getErrorMessage("Selected truck details not found.");
      return;
    }
    const cartonIds = barcodes.map(barcode => cartons.find(item => item.barcode === barcode)?.ctnNo).filter(Boolean);
    if (cartonIds.length === 0) {
      AlertMessages.getErrorMessage("No valid carton IDs found for the provided barcodes.");
      return;
    }
    const reqModel = new PkTruckItemsMapRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedTruckInfo.truckNo, selectedTruckInfo.truckId, Number(shippingRequestId), cartonIds, barcodes);
    try {
      // Automatically start loading if state is 0
      if (loadingState[selectedTruck] === 0) {
        const loadingReqModel = new PkShippingRequestTruckIdRequest(
          [selectedTruckInfo.truckId],
          Number(shippingRequestId),
          user?.userName,
          user?.orgData?.unitCode,
          user?.orgData?.companyCode,
          user?.userId
        );
        const response = await shippingRequestService.updateTruckLoadingProgress(loadingReqModel);
        if (response?.status) {
          setLoadingState((prev) => ({ ...prev, [selectedTruck]: 1 }));
          setTruckInfo((prev) =>
            prev.map((truck) =>
              truck.truckNo === selectedTruck ? { ...truck, loadingStatus: 1 } : truck
            )
          );
          AlertMessages.getSuccessMessage("Truck loading started automatically!");
        } else {
          AlertMessages.getErrorMessage("Failed to start truck loading.");
          return;
        }
      }
      // Map barcodes
      const response = await shippingRequestService.mapDSetSubItemsToTruck(reqModel);
      if (response?.status) {
        AlertMessages.getSuccessMessage(isAutoScan ? `Barcode ${barcodes[0]} mapped successfully!` : "All manual barcodes successfully mapped to truck!");
        setMappedCartons(prev => new Set([...prev, ...barcodes]));
        if (isAutoScan) {
          setTruckMappedCounts(prev => ({ ...prev, [selectedTruck]: (prev[selectedTruck] || 0) + barcodes.length }));
        }
        if (!isAutoScan) {
          setScannedCartons(prev => new Set([...prev].filter(barcode => !barcodes.includes(barcode))));
          setBarcodeSource(prev => new Map([...prev].filter(([barcode]) => !barcodes.includes(barcode))));
          setScannedCount(prev => prev - barcodes.length);
        }
      } else {
        AlertMessages.getErrorMessage(`Failed to map ${isAutoScan ? "barcode" : "manual barcodes"}.`);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(`Error submitting ${isAutoScan ? "barcode" : "manual barcodes"}: ${error.message}`);
    }
  };

  const handleFinalSubmit = async (): Promise<void> => {
    const manualBarcodes = Array.from(scannedCartons).filter(barcode => barcodeSource.get(barcode) === "manual");
    if (manualBarcodes.length === 0) {
      AlertMessages.getWarningMessage("No manual barcodes have been added.");
      return;
    }
    await mapBarcodesToTruck(manualBarcodes, false);
  };

  const handleScanBarcode = async (barcode: string, isAutoScan = true): Promise<void> => {
    if (!selectedTruck) {
      AlertMessages.getWarningMessage("Please select a truck first!");
      return;
    }
    if (loadingState[selectedTruck] === 2) {
      AlertMessages.getErrorMessage("This truck’s loading is completed. No more barcodes can be scanned.");
      return;
    }
    if (scannedCartons.has(barcode)) {
      AlertMessages.getInfoMessage(`Barcode ${barcode} is already scanned.`);
      return;
    }
    setScannedCartons(prev => new Set([...prev, barcode]));
    setBarcodeSource(prev => new Map(prev).set(barcode, isAutoScan ? "auto" : "manual"));
    setScannedCount(prev => prev + 1);
    if (isAutoScan) {
      setScannedBarcode(barcode);
      setTimeout(() => setScannedBarcode(""), 1000);
      await mapBarcodesToTruck([barcode], true);
    }
  };

  const handleManualBarcodeEntry = async (): Promise<void> => {
    if (!selectedTruck) {
      AlertMessages.getWarningMessage("Please select a truck first!");
      return;
    }
    if (!manualBarcode.trim()) {
      AlertMessages.getWarningMessage("Please enter a barcode.");
      return;
    }
    if (loadingState[selectedTruck] === 2) {
      AlertMessages.getErrorMessage("This truck’s loading is completed. No more barcodes can be added.");
      setManualBarcode("");
      return;
    }
    const barcode = manualBarcode.trim();
    if (scannedCartons.has(barcode)) {
      AlertMessages.getInfoMessage(`Barcode ${barcode} is already scanned.`);
      return;
    }
    setScannedCartons(prev => new Set([...prev, barcode]));
    setBarcodeSource(prev => new Map(prev).set(barcode, "manual"));
    setScannedCount(prev => prev + 1);
    setTruckMappedCounts(prev => ({ ...prev, [selectedTruck]: (prev[selectedTruck] || 0) + 1 }));
    setManualBarcode("");
    AlertMessages.getSuccessMessage(`Barcode ${barcode} added locally and counted.`);
  };

  const handleCopy = (barcode: string) => {
    setSelectedBarcode(barcode);
    navigator.clipboard.writeText(barcode);
    AlertMessages.getSuccessMessage("Barcode copied!");
  };

  const chunkArray = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) result.push(array.slice(i, i + size));
    return result;
  };

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([getCartonswithSrID(shippingRequestId), getTruckInfowithSrID(shippingRequestId), getMappedCartons(shippingRequestId)]).finally(() => setLoading(false));
  };

  const handleLoadingUnloading = async (truckNo: string): Promise<void> => {
    const selectedTruckInfo = truckInfo.find((truck) => truck.truckNo === truckNo);
    const reqModel = new PkShippingRequestTruckIdRequest(
      [selectedTruckInfo.truckId],
      Number(shippingRequestId),
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId
    );
    try {
      const currentStatus = loadingState[truckNo] || 0;
      let response;
      let newStatus;
      if (currentStatus === 0) {
        response = await shippingRequestService.updateTruckLoadingProgress(reqModel);
        newStatus = 1;
      } else if (currentStatus === 1) {
        response = await shippingRequestService.updateTruckLoadingComplete(reqModel);
        newStatus = 2;
      } else if (currentStatus === 2) {
        response = await shippingRequestService.updateTruckLoadingProgress(reqModel);
        newStatus = 0;
      }
      if (response?.status) {
        setLoadingState((prev) => ({ ...prev, [truckNo]: newStatus }));
        setTruckInfo((prev) =>
          prev.map((truck) =>
            truck.truckNo === truckNo ? { ...truck, loadingStatus: newStatus } : truck
          )
        );
        AlertMessages.getSuccessMessage(
          newStatus === 1 ? "Truck loading started!" :
            newStatus === 2 ? "Truck loading completed!" :
              "Truck reset to start loading!"
        );
      } else {
        AlertMessages.getErrorMessage("Failed to update truck loading status.");
      }
    } catch (error) {
      AlertMessages.getErrorMessage(`Error: ${error.message}`);
    }
  };

  const hasManualBarcodes = Array.from(scannedCartons).some(barcode => barcodeSource.get(barcode) === "manual");

  useEffect(() => {
    if (selectedTruck && truckRefs.current.has(selectedTruck)) {
      truckRefs.current.get(selectedTruck)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedTruck]);

  return (
    <Drawer title="Truck Information" placement="right" open={visible} onClose={onClose} width="90%" extra={<Button type="text" icon={<ReloadOutlined />} onClick={handleRefresh} />}>
      {loading ? (
        <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 50 }} />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Descriptions bordered size="small">
              <Descriptions.Item label={<strong>Shipping Request ID</strong>} span={1}>
                {shippingRequestId}
              </Descriptions.Item>
              <Descriptions.Item label={<strong>Total Barcodes</strong>} span={1}>
                <Tag color="blue">{cartons.length}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={<strong>Scanned Barcodes</strong>} span={1}>
                <Tag color="green">
                  {new Set([...scannedCartons, ...mappedCartons]).size}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={<strong>Barcode Legend</strong>} span={3} contentStyle={{ padding: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  <Tag color="green">✅ Scanned Barcode</Tag>
                  <Tag color="red">❌ Unscanned Barcode</Tag>
                  <Tag color="blue">🔵 Selected Barcode</Tag>
                </div>
              </Descriptions.Item>

            </Descriptions>
            <div style={{ height: "790px", overflow: "auto", scrollbarWidth: "none" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>Carton Barcodes</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", padding: "20px" }}>
                {chunkArray(cartons, 10).map((chunk, index) => (
                  <table key={index} style={{ borderCollapse: "collapse", border: "1px solid #d1d5db" }}>
                    <tbody>
                      {chunk.map(item => (
                        <tr key={item.key} style={{ borderBottom: "1px solid #d1d5db", height: "40px" }}>
                          <td style={{ backgroundColor: "#f9fafb", minWidth: "120px", maxWidth: "180px", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 8px" }}>
                            <Tag
                              color={scannedCartons.has(item.barcode) || mappedCartons.has(item.barcode) ? "green" : selectedBarcode === item.barcode ? "blue" : "red"}
                              style={{ cursor: "pointer", fontSize: "13px", padding: "0px 8px", minWidth: "80px", textAlign: "center", lineHeight: "20px", marginTop: "5px" }}
                              onClick={() => handleCopy(item.barcode)}
                            >
                              {item.barcode}
                            </Tag>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <div style={{ overflowX: "auto", padding: "10px" }}>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-start", minWidth: "fit-content" }}>
                {truckInfo.map((truckItem) => (
                  <div
                    key={truckItem.truckNo}
                    onClick={() => setSelectedTruck(truckItem.truckNo)}
                    ref={(el) => {
                      if (el) {
                        truckRefs.current.set(truckItem.truckNo, el);
                      } else {
                        truckRefs.current.delete(truckItem.truckNo);
                      }
                    }}
                    style={{
                      border: selectedTruck === truckItem.truckNo ? "1px solid black" : "none",
                      padding: "12px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "220px",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      transition: "border 0.3s ease",
                      flexShrink: 0
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <div style={{ position: "relative", width: "150px", height: "120px" }}>
                        <img src={truckIcon} alt="Truck" width="150" height="120" />
                        {loadingState[truckItem.truckNo] === 1 && (
                          <img
                            src={carton}
                            alt="Carton"
                            width="70"
                            height="70"
                            style={{
                              position: "absolute",
                              bottom: "5px",
                              left: "-40px",
                              transform: "translateY(0)",
                              transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                            }}
                          />
                        )}
                      </div>
                      <Typography.Text strong style={{ fontSize: "13px", color: "#333" }}>
                        <span style={{ fontWeight: "bold", color: "#ff5733" }}>Truck Number:</span>
                        <span style={{ color: "#007bff" }}> {truckItem.truckNo}</span>
                      </Typography.Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9", gap: "5px", marginTop: "8px" }}>
                      <Tag
                        color={truckMappedCounts[truckItem.truckNo] > 0 ? "green" : "red"}
                        style={{ fontSize: "22px", fontWeight: "bold", padding: "5px 8px" }}
                      >
                        {truckMappedCounts[truckItem.truckNo] || 0}
                      </Tag>
                      <Button
                        type="default"
                        onClick={() => handleLoadingUnloading(truckItem.truckNo)}
                        disabled={loadingState[truckItem.truckNo] === 2}
                        style={{
                          color:
                            loadingState[truckItem.truckNo] === 2 ? "#52c41a" :
                              loadingState[truckItem.truckNo] === 1 ? "#1890ff" :
                                "#ff4d4f",
                        }}
                      >
                        {loadingState[truckItem.truckNo] === 2 ? "Loading Completed" :
                          loadingState[truckItem.truckNo] === 1 ? "Loading Progress" :
                            "Start Loading"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col xs={24} sm={24} md={24} lg={17} xl={17} xxl={17}>
                <Card title="Carton Barcode Allocation">
                  <Form layout="vertical" style={{ maxWidth: 612 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <label style={{ minWidth: 140, marginRight: 8 }}>Truck Number:</label>
                      <Select
                        value={selectedTruck}
                        placeholder="Select a Truck"
                        style={{ width: 300 }}
                        onChange={setSelectedTruck}
                      >
                        {truckInfo.map((truck) => (
                          <Select.Option key={truck.truckId} value={truck.truckNo}>
                            {truck.truckNo}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <label style={{ minWidth: 140, marginRight: 8 }}>Scan Carton Barcode:</label>
                      <Space>
                        <Input
                          placeholder="Scan Barcode"
                          autoComplete="off"
                          prefix={<ScanOutlined />}
                          autoFocus
                          value={scannedBarcode}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            if (value) {
                              handleScanBarcode(value);
                            }
                          }}
                        />
                        <Search
                          placeholder="Type Barcode"
                          value={manualBarcode}
                          onChange={(e) => setManualBarcode(e.target.value)}
                          onSearch={handleManualBarcodeEntry}
                          enterButton
                        />
                      </Space>
                    </div>
                    {hasManualBarcodes && (
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={handleFinalSubmit}
                          disabled={scannedCartons.size === 0}
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    )}
                  </Form>
                </Card>
              </Col>

              <Col xs={24} sm={24} md={24} lg={7} xl={7} xxl={7}>
                <Card title="Truck Details">
                  {selectedTruck ? (
                    (() => {
                      const truck = truckInfo.find((t) => t.truckNo === selectedTruck);
                      return truck ? (
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <UserOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
                            <Typography.Text>{truck.driverName}</Typography.Text>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <PhoneOutlined style={{ color: "#52c41a", fontSize: "16px" }} />
                            <Typography.Text>{truck.mobileNumber}</Typography.Text>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <CarOutlined style={{ color: "#fa8c16", fontSize: "16px" }} />
                            <Typography.Text>{truck.truckNo}</Typography.Text>
                          </div>
                        </Space>
                      ) : (
                        <Typography.Text>No truck selected</Typography.Text>
                      );
                    })()
                  ) : (
                    <Typography.Text>Please select a truck to view details</Typography.Text>
                  )}
                </Card>
              </Col>
            </Row>

          </Col>
        </Row>
      )}
    </Drawer>
  );
};

export default TruckDrawerModal;