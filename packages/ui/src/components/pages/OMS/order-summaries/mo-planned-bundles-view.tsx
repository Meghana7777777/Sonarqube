import { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Tag, Table, Button, Space, Modal, QRCode, Tooltip, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MC_MoNumberRequest, PlannedBundleModel, ProcessTypeEnum, processTypeEnumDisplayValues } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { MOConfigService } from '@xpparel/shared-services';
import { AlertMessages } from '../../../common';
import printJS from 'print-js';
import Barcode from 'react-barcode';
import dayjs from 'dayjs';
import { PrinterOutlined } from '@ant-design/icons';

interface BundleItem {
  product_name: string;
  fg_color: string;
  size: string;
  quantity: number;
  no_of_bundles: number;
  processTypeEnum: ProcessTypeEnum;
  mo_code: string;
  bundle_numbers: string[];
  style_code: string;
  destination: string;
  delivery_date: string;
  plan_prod_date: string;
}

type GroupedData = {
  [key in ProcessTypeEnum]?: BundleItem[];
};

interface IProps {
  moNumber: string;
}

const MOPlannedBundlesView = ({ moNumber }: IProps) => {
  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBundles, setSelectedBundles] = useState<BundleItem[]>([]);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.user.user.user);
  const mOConfigService = new MOConfigService();
  const colors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];


  const getMoPlannedBundlesFromRequest = async (moNumber: string) => {
    try {
      const reqModel = new MC_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber);
      const response = await mOConfigService.getMoPlannedBundlesFromRequest(reqModel);
      if (response.data) {
        const group: GroupedData = {};
        response.data.forEach((item: PlannedBundleModel) => {
          const type = item.processTypeEnum;
          if (!group[type]) group[type] = [];
          group[type]!.push({
            product_name: item.product_name,
            fg_color: item.fg_color,
            size: item.size,
            quantity: item.quantity,
            no_of_bundles: item.no_of_bundles,
            processTypeEnum: item.processTypeEnum,
            mo_code: item.mo_code,
            bundle_numbers: item.bundle_numbers ?? [],
            style_code: item.style_code,
            destination: item.destination,
            delivery_date: item.delivery_date,
            plan_prod_date: item.plan_prod_date
          });
        });
        setGroupedData(group);
      } else {
        AlertMessages.getErrorMessage(response.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err);
    }
  };

  useEffect(() => {
    getMoPlannedBundlesFromRequest(moNumber);
  }, [moNumber]);

  const columns: ColumnsType<BundleItem> = [
    { title: 'Product Code', dataIndex: 'product_name', width: 120, align: 'center' },
    { title: 'Fg Color', dataIndex: 'fg_color', width: 100, align: 'center' },
    { title: 'Size', dataIndex: 'size', width: 80, align: 'center' },
    { title: 'Bundle Size', dataIndex: 'quantity', width: 100, align: 'center' },
    { title: 'Bundle Count', dataIndex: 'no_of_bundles', width: 120, align: 'center' },
    {
      title: 'Total Bundle Qty',
      key: 'total_qty',
      align: 'center',
      width: 120,
      render: (_, record) => record.quantity * record.no_of_bundles,
    }
  ];

  const getTagColor = (procType: ProcessTypeEnum) => {
    const colorIndex = Object.values(ProcessTypeEnum).indexOf(procType);
    return colors[colorIndex % colors.length] || 'orange';
  };

  const renderBundleCards = (groupedData: GroupedData) => {
    const entries = Object.entries(groupedData) as [ProcessTypeEnum, BundleItem[]][];
    const rows: JSX.Element[] = [];

    for (let i = 0; i < entries.length; i += 2) {
      const rowItems = entries.slice(i, i + 2);
      rows.push(
        <Row gutter={16} key={`row-${i}`} style={{ marginBottom: 16 }}>
          {rowItems.map(([procType, items]) => (
            <Col xs={24} md={12} key={procType}>
              <Card
                size="small"
                bodyStyle={{ padding: 0 }}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Row style={{ width: '100%' }}>
                      <Col flex="auto">
                        <Tag color={getTagColor(procType)} style={{ fontSize: 14, fontWeight: 600 }}>
                          {processTypeEnumDisplayValues[procType] || 'Unknown'}
                        </Tag>
                      </Col>

                      <Col flex="none">
                        <Tooltip title="Total Bundle Quantity">
                          <Tag color="#f50">
                            {items.reduce((total, item) => total + (Number(item.quantity) * Number(item.no_of_bundles)), 0)}
                          </Tag>
                        </Tooltip>
                      </Col>

                      <Col flex="none" style={{ marginLeft: 8 }}>
                        <Button type="primary" icon={<PrinterOutlined />} size="small" onClick={() => { setSelectedBundles(items); setIsModalOpen(true); }}
                          style={{ height: 24, backgroundColor: '#023047', borderColor: '#023047', color: 'white' }}>
                          Print Bundles
                        </Button>
                      </Col>
                    </Row>
                  </div>
                }
              >
                <div style={{ padding: 16 }}>
                  <Table
                    dataSource={items}
                    columns={columns}
                    rowKey={(record, index) => `${record.mo_code}_${record.size}_${record.processTypeEnum}_${index}`}
                    pagination={false}
                    size="small"
                    bordered
                    scroll={{x: 'max-content'}}
                    style={{minWidth: '100%'}}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      );
    }
    return rows;
  };

   const printAllBarCodes = () => {
    const pageContent = document.getElementById("printArea");
    if (pageContent) {
      printJS({
        printable: pageContent,
        type: "html",
        showModal: true,
        modalMessage: "Loading...",
        targetStyles: ['*'],
        style: `
          @page { size: 384px 192px; margin: 0mm; }
          body { margin: 0; padding: 0; }
          #printArea { width: 384px; height: 192px; overflow: hidden; } /* Match @page height */
          #printArea > div { width: 100%; height: 100%; padding: 0; margin: 0; }
          .ant-modal-body { padding: 0 !important; }
          .label { height: 192px; box-sizing: border-box; } /* Ensure each label fits the page */
        `
      });
      setIsModalOpen(false);
    } else {
      AlertMessages.getErrorMessage("Page content element not found.");
    }
  };


  return (
    <Card size="small" title="MO Planned Bundles View" style={{ marginTop: 20 }}>
      {loading ? <div>Loading...</div> : renderBundleCards(groupedData)}
      <Modal
        title={<Space> Print Planned Bundles <Button type="primary" onClick={printAllBarCodes}>Print</Button> </Space>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={415}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, margin: 0 }}
      >
        <div id="printArea" ref={printAreaRef} style={{ width: 384, margin: 0, padding: 0 }}>
          {selectedBundles.length === 0 ? (
            <p>No bundle data available.</p>
          ) : (
            selectedBundles.flatMap((item, index) =>
              item.bundle_numbers.length > 0 ? item.bundle_numbers.map((bundleNo, idx) => (
                <div
                  key={`${item.mo_code}_${bundleNo}_${idx}`}
                  className="label"
                  style={{
                    width: '384px',
                    height: '192px',
                    padding: '8px',
                    margin: 0,
                    border: '1px dashed #000',
                    background: '#fff',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    display: 'block',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', height: '100%' }}>
                    <div style={{ flex: '0 0 40%', maxWidth: '40%', textAlign: 'center' }}>
                      <QRCode value={bundleNo} size={80} />
                      <div style={{ marginTop: '6px' }}>
                        <Barcode
                          value={bundleNo}
                          width={0.7}
                          height={20}
                          displayValue={true}
                          fontSize={10}
                          marginTop={0}
                          textMargin={4} 
                          textAlign="center"
                        />
                      </div>
                    </div>
                    <div style={{ flex: '0 0 60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px' }}>
                      <p style={{ margin: '2px' }}><strong>Product Name:</strong> {item.product_name}</p>
                      <p style={{ margin: '2px' }}><strong>Color:</strong> {item.fg_color}</p>
                      <p style={{ margin: '2px' }}><strong>Size:</strong> {item.size}</p>
                      <p style={{ margin: '2px' }}><strong>Qty:</strong> {item.quantity}</p>
                      <p style={{ margin: '2px' }}><strong>Process Type:</strong> {processTypeEnumDisplayValues[item.processTypeEnum]}</p>
                      <p style={{ margin: '2px' }}><strong>Style Code:</strong> {item.style_code}</p>
                      <p style={{ margin: '2px' }}><strong>Destination:</strong> {item.destination}</p>
                      <p style={{ margin: '2px' }}><strong>Delivery Date:</strong> {dayjs(item.delivery_date).format('YYYY-MM-DD')}</p>
                      <p style={{ margin: '2px' }}><strong>Plan Prod. Date:</strong> {dayjs(item.plan_prod_date).format('YYYY-MM-DD')}</p>
                    </div>
                  </div>
                </div>
              )) : []
            )
          )}
        </div>
      </Modal>
    </Card >
  );
};

export default MOPlannedBundlesView;
