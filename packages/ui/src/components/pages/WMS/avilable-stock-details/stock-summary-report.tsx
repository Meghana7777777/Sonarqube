import { useEffect, useState } from 'react';
import { Select, Space, Spin, Card, Row, Col, Button, Typography, Table, message, Tabs, Descriptions, Tag } from 'antd';
import { OrderCreationService, PackingListService } from '@xpparel/shared-services';
import { ItemCategoryReqModel, PhItemCategoryEnum, CommonRequestAttrs, StockCodesRequest, StockObjectInfoModel } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../../common';
import { FileUnknownOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';

interface ItemInfoResponse {
  item_code: string;
  item_description: string;
}

interface MoNumber {
  moNumber: string;
}

interface StockDataGroup {
  vpo: string;
  totalOriginalQty: number;
  totalLeftOverQty: number;
  noOfLots: number;
  noOfRolls: number;
  lots: LotGroup[];
}

interface LotGroup {
  lot: string;
  totalOriginalQty: number;
  totalLeftOverQty: number;
  noOfRolls: number;
  rolls: StockObjectInfoModel[];
}

const AvialbleStockDetails = () => {
  const [category, setCategory] = useState<string>();
  const [itemCode, setItemCode] = useState<string>();
  const [itemOptions, setItemOptions] = useState<ItemInfoResponse[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [loadingManufacturingOrders, setLoadingManufacturingOrders] = useState<boolean>(false);
  const [manufacturingOrders, setManufacturingOrders] = useState<MoNumber[]>([]);
  const [stockData, setStockData] = useState<StockObjectInfoModel[]>([]);
  const [selectedMoNumber, setSelectedMoNumber] = useState<string | undefined>();
  const packingListService = new PackingListService();
  const orderCreationService = new OrderCreationService();
  const user = useAppSelector((state) => state.user.user.user);
  const phItemCategoryOptions = Object.entries(PhItemCategoryEnum).map(([key, value]) => ({ label: value, value: key }));

  const handleCategoryChange = async (value: string) => {
    setCategory(value);
    setItemCode(undefined);
    setItemOptions([]);
    setSelectedMoNumber(undefined);
    setStockData([]);

    try {
      setLoadingItems(true);
      const req = new ItemCategoryReqModel(user?.orgData?.unitCode, user?.orgData?.companyCode, value);
      const res = await packingListService.getDistinctItemInfoByCategory(req);
      if (res.status) {
        setItemOptions(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error);
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchManufacturingOrders = async () => {
    setLoadingManufacturingOrders(true);
    try {
      const reqModel = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      const res = await orderCreationService.getManufacturingOrdersList(reqModel);
      if (res.status) {
        setManufacturingOrders(res.data as []);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error);
    } finally {
      setLoadingManufacturingOrders(false);
    }
  };

  const fetchStockData = async () => {
    if (!itemCode || !category || !selectedMoNumber) {
      message.error('Please select all required fields before searching.');
      return;
    }
    try {
      const reqModel = new StockCodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, itemCode, [], [], [selectedMoNumber]);
      const res = await packingListService.getInStockObjectsForItemCode(reqModel);
      if (res.status) {
        const parsedData = res.data.map((item: StockObjectInfoModel) => {
          const parsedOriginalQty = parseFloat(item.originalQty as unknown as string);
          const parsedLeftOverQty = Number(item.leftOverQuantity);

          if (isNaN(parsedOriginalQty)) {
            return { ...item, originalQty: 0, leftOverQuantity: parsedLeftOverQty };
          }
          if (isNaN(parsedLeftOverQty)) {
            return { ...item, originalQty: parsedOriginalQty, leftOverQuantity: 0 };
          }

          return { ...item, originalQty: parsedOriginalQty, leftOverQuantity: parsedLeftOverQty };
        });
        setStockData(parsedData);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error);
    }
  };

  useEffect(() => {
    fetchManufacturingOrders();
  }, [category]);

  const handleSearch = () => {
    if (!category || !itemCode || !selectedMoNumber) {
      message.error('Please fill all required fields before searching.');
      return;
    }
    fetchStockData();
  };

  const groupedData: StockDataGroup[] = stockData.reduce((acc: StockDataGroup[], item: StockObjectInfoModel) => {
    let poGroup = acc.find(group => group.vpo === item.vpo);
    if (!poGroup) {
      poGroup = {
        vpo: item.vpo ?? 'Unknown PO',
        totalOriginalQty: 0,
        totalLeftOverQty: 0,
        noOfLots: 0,
        noOfRolls: 0,
        lots: [],
      };
      acc.push(poGroup);
    }

    let lotGroup = poGroup.lots.find(lot => lot.lot === item.lot);
    if (!lotGroup) {
      lotGroup = {
        lot: item.lot ?? 'Unknown Lot',
        totalOriginalQty: 0,
        totalLeftOverQty: 0,
        noOfRolls: 0,
        rolls: [],
      };
      poGroup.lots.push(lotGroup);
      poGroup.noOfLots += 1;
    }

    lotGroup.rolls.push(item);
    lotGroup.totalOriginalQty += item.originalQty || 0;
    lotGroup.totalLeftOverQty += item.leftOverQuantity || 0;
    lotGroup.noOfRolls += 1;

    poGroup.totalOriginalQty += item.originalQty || 0;
    poGroup.totalLeftOverQty += item.leftOverQuantity || 0;
    poGroup.noOfRolls += 1;
    return acc;
  }, []);

  const rollColumns: ColumnType<any>[] = [
    { title: 'Roll Barcode', dataIndex: 'barcode', key: 'barcode', align: 'center', width: 120 },
    { title: 'Pack List ID', dataIndex: 'packListId', key: 'packListId', align: 'center', width: 120 },
    { title: 'Original Qty', dataIndex: 'originalQty', key: 'originalQty', align: 'center', width: 100, render: (value: any) => (isNaN(value) ? '0' : value.toFixed(0)) },
    { title: 'Left Over Qty', dataIndex: 'leftOverQuantity', key: 'leftOverQuantity', align: 'center', width: 100, render: (value: any) => (isNaN(value) ? '0' : value.toFixed(0)) },
    { title: 'Width', dataIndex: 'width', key: 'width', align: 'center', width: 80 },
    { title: 'Issued Qty', dataIndex: 'issuedQuantity', key: 'issuedQuantity', align: 'center', width: 100 },
    { title: 'Return Qty', dataIndex: 'returnQuntity', key: 'returnQuntity', align: 'center', width: 100 },
    { title: 'Shade', dataIndex: 'shade', key: 'shade', align: 'center', width: 80 },
    { title: 'Pallet Code', dataIndex: 'palletCode', key: 'palletCode', align: 'center', width: 100 },
    { title: 'Location Code', dataIndex: 'locationCode', key: 'locationCode', align: 'center', width: 100 },
  ];

  return (
    <>
      <Card title="Available Stock Details" style={{ width: '100%' }} size="small">
        <Row gutter={16} align="bottom">
          <Col span={6}>
            <Typography.Text strong>Select Category <span style={{ color: 'red' }}>*</span></Typography.Text>
            <Select style={{ width: '100%' }} placeholder="Select Category" value={category} onChange={handleCategoryChange} options={phItemCategoryOptions} />
          </Col>

          <Col span={6}>
            <Typography.Text strong>Select Item Code <span style={{ color: 'red' }}>*</span></Typography.Text>
            <Select style={{ width: '100%' }} placeholder="Select Item Code" value={itemCode} onChange={(value) => setItemCode(value)} loading={loadingItems} notFoundContent={loadingItems ? <Spin size="small" /> : null}>
              {itemOptions.map((item) => (
                <Select.Option key={item.item_code} value={item.item_code}>
                  {item.item_code} - {item.item_description}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col span={6}>
            <Typography.Text strong>Select MO <span style={{ color: 'red' }}>*</span></Typography.Text>
            <Select
              style={{ width: '100%' }}
              placeholder="Select Manufacturing Order"
              value={selectedMoNumber}
              loading={loadingManufacturingOrders}
              notFoundContent={loadingManufacturingOrders ? <Spin size="small" /> : null}
              onChange={setSelectedMoNumber}
            >
              {manufacturingOrders.map((order) => (
                <Select.Option key={order.moNumber} value={order.moNumber}>
                  {order.moNumber}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col span={6}>
            <Button
              type="primary"
              onClick={handleSearch}
              style={{ marginTop: 22 }}
              size="middle"
            >
              Search
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: "20px", width: '100%' }}>
        {groupedData.length > 0 ? (
          <Tabs tabPosition="top" type="line">
            {groupedData.map((poGroup, index) => (
              <Tabs.TabPane key={`po-tab-${index}`} tab={`PO: ${poGroup.vpo}`}>
                <Card
                  style={{ marginBottom: 16 }}
                  size="small"
                >
                  <Descriptions bordered column={8} size="small">
                    <Descriptions.Item label="Total Original Qty">
                      <Tag color="blue">{poGroup.totalOriginalQty.toFixed(0)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Left Over Qty">
                      <Tag color="orange">{poGroup.totalLeftOverQty.toFixed(0)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="No. of Lots">
                      <Tag color="purple">{poGroup.noOfLots}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="No. of Rolls">
                      <Tag color="green">{poGroup.noOfRolls}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {poGroup.lots.map((lotGroup, lotIndex) => (
                  <Card
                    key={`lot-card-${index}-${lotIndex}`}
                    type="inner"
                    title={
                      <>
                        LOT NUMBER: <Tag color="#108ee9">{lotGroup.lot}</Tag>
                        {' '}  SUPPLIER NAME:{' '}
                        {[...new Set(lotGroup.rolls.map(r => r.supplierName).filter(Boolean))].map((name, i) => (
                          <Tag color="#f50" key={i}>{name}</Tag>
                        ))}
                      </>
                    }

                    style={{ marginBottom: 16, paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12 }}
                    extra={
                      <Space size="small">
                        <strong>Original Qty:</strong>
                        <Tag color="blue">{lotGroup.totalOriginalQty.toFixed(0)}</Tag>
                        <strong>Left Over Qty:</strong>
                        <Tag color="green">{lotGroup.totalLeftOverQty.toFixed(0)}</Tag>
                        <strong>No. of Rolls:</strong>
                        <Tag color="orange">{lotGroup.noOfRolls}</Tag>
                      </Space>
                    }
                    size="small"
                  >
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                      <Table
                        columns={rollColumns}
                        dataSource={lotGroup.rolls}
                        rowKey="objectId"
                        pagination={false}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        style={{ minWidth: '100%' }}
                      />
                    </div>
                  </Card>
                ))}
              </Tabs.TabPane>
            ))}
          </Tabs>
        ) : (
          <Typography.Text
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%',
              padding: '20px 0',
            }}
          >
            <Space>
              <FileUnknownOutlined />
              No stock data available.
            </Space>
          </Typography.Text>
        )}
      </Card>
    </>
  );
};

export default AvialbleStockDetails;