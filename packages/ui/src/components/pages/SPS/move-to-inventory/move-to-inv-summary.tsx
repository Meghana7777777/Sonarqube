import React, { useEffect, useState } from 'react';
import { Table, Tag, Tabs, Spin, Select } from 'antd';
import { SPS_R_MoveToInvProcSerialOrderQtysModel, SPS_C_ProdColorBundlesSummaryRequest, SPS_R_MoveToInvProcSerialSummaryModel, ProcessTypeEnum } from '@xpparel/shared-models';
import { AlertMessages } from '../../../common';
import { useAppSelector } from 'packages/ui/src/common';
import { SpsInventoryService } from '@xpparel/shared-services';
import MoveToInvList from './move-to-inv-list';
import MovedBundles from './move-to-inv-bundles';
import ReadyToMoveBundles from './move- to-ready-bunldes';

const { TabPane } = Tabs;

interface EnrichedOrderQtysModel extends SPS_R_MoveToInvProcSerialOrderQtysModel {
  jobQty: number;
  pJQty: number;
}

interface MoveToInvSummaryProps {
  poSerial: number;
  processTypes: ProcessTypeEnum[];
  fgColor: string[];
  productName: string[];
}

const MoveToInvSummary: React.FC<MoveToInvSummaryProps> = ({ poSerial, processTypes, fgColor, productName }) => {
  const user = useAppSelector((state) => state.user.user.user);
  const moveToInventoryService = new SpsInventoryService();
  const [activeColor, setActiveColor] = useState(fgColor[0]);
  const [selectedProcessType, setSelectedProcessType] = useState<ProcessTypeEnum>(processTypes.length > 0 ? processTypes[0] : undefined);
  const [data, setData] = useState<SPS_R_MoveToInvProcSerialSummaryModel>(null);
  const [activeTab, setActiveTab] = useState('list');

  const fetchSummary = async (procType: ProcessTypeEnum, color: string) => {
    try {
      setData(null);
      const req = new SPS_C_ProdColorBundlesSummaryRequest(user.userName, user.orgData?.unitCode, user.orgData?.companyCode, user.userId, poSerial, productName[fgColor.indexOf(color)] || productName[0], color, procType, true, true, true, true);
      const res = await moveToInventoryService.getInventoryMovementSummaryForPoProdColorProcType(req);

      if (res?.status) {
        const enriched: EnrichedOrderQtysModel[] = res.data.orderQtys.map((order) => {
          const job = res.data.jobQtys.find(j => j.color === order.color && j.size === order.size);
          const jobQty = job ? job.jobQty : 0;
          return {
            ...order,
            jobQty,
            pJQty: Math.max(0, order.oQty - jobQty)
          };
        });
        setData({ ...res.data, orderQtys: enriched });
      } else {
        AlertMessages.getErrorMessage(res?.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error);
    }
  };

  useEffect(() => {
    if (selectedProcessType && activeColor) {
      fetchSummary(selectedProcessType, activeColor);
    }
  }, [selectedProcessType, activeColor]);

  const getUniqueSizes = () => {
    if (!data) return [];
    return [...new Set(data.orderQtys.map(item => item.size))].sort();
  };

  const buildTableData = () => {
    if (!data) {
      return [];
    }

    const sizes = getUniqueSizes();
    const colors = [...new Set(data.orderQtys.map(item => item.color))];
    const rows: any[] = [];

    colors.forEach(color => {
      const orderData = (data.orderQtys as EnrichedOrderQtysModel[]).filter(item => item.color === color);
      const bundleData = data.bundlesSummary.filter(item => item.color === color);

      const orderRow = {
        key: `${color}-order`,
        color,
        rowType: 'order'
      };
      sizes.forEach(size => {
        const item = orderData.find(i => i.size === size);
        orderRow[size] = item ? (
          <>
            <Tag color="blue">{item.oQty}</Tag>
            <Tag color="green">{item.jobQty}</Tag>
          </>
        ) : (
          <>
            <Tag color="blue">0</Tag>
            <Tag color="green">0</Tag>
          </>
        );
      });
      rows.push(orderRow);

      const movedBundlesQtyRow = {
        key: `${color}-movedBundlesQty`,
        color: '',
        rowType: 'movedBundlesQty',
      };

      sizes.forEach(size => {
        const bundleItem = bundleData.find(b => b.size === size);
        if (bundleItem) {
          movedBundlesQtyRow[size] = (
            <>
              <Tag color="volcano">{bundleItem.totalInvMovedBundlesQty}</Tag>
              <span style={{ margin: '0 8px', fontWeight: 'bold' }}>+</span>
              <Tag color="purple">{bundleItem.totalBundlesQty}</Tag>
              <span style={{ margin: '0 8px', fontWeight: 'bold' }}>=</span>
              <Tag color="green">
                {bundleItem.totalInvMovedBundlesQty + bundleItem.totalBundlesQty}
              </Tag>
            </>
          );
        } else {
          movedBundlesQtyRow[size] = (
            <>
              <Tag color="volcano">0</Tag>
              <span style={{ margin: '0 8px', fontWeight: 'bold' }}>+</span>
              <Tag color="purple">0</Tag>
              <span style={{ margin: '0 8px', fontWeight: 'bold' }}>=</span>
              <Tag color="green">0</Tag>
            </>
          );
        }
      });

      rows.push(movedBundlesQtyRow);


      const bundleCountRow = {
        key: `${color}-bundleCount`,
        color: '',
        rowType: 'bundleCount'
      };
      sizes.forEach(size => {
        const bundleItem = bundleData.find(b => b.size === size);
        bundleCountRow[size] = bundleItem ? (
          <>
            <Tag color="geekblue">{bundleItem.totalInvMovedBundles}</Tag>
            <Tag color="orange" style={{ marginLeft: 8 }}>{bundleItem.totalBundles}</Tag>
          </>
        ) : (
          <>
            <Tag color="geekblue">0</Tag>
            <Tag color="orange" style={{ marginLeft: 8 }}>0</Tag>
          </>
        );
      });
      rows.push(bundleCountRow);
    });

    return rows;
  };

  const sizes = getUniqueSizes();

  const columns = [
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      align: 'center' as 'center',
      render: (text: string, record: any) => {
        if (record.rowType === 'order') {
          return { children: text, props: { rowSpan: 3 } };
        }
        return { children: null, props: { rowSpan: 0 } };
      }
    },
    ...sizes.map(size => ({
      title: size,
      dataIndex: size,
      key: size,
      align: 'center' as 'center'
    }))
  ];

  return (
    <>
      <Tabs
        type="card"
        activeKey={activeColor}
        onChange={(key) => {
          setActiveColor(key);
          setSelectedProcessType(processTypes.length > 0 ? processTypes[0] : undefined);
        }}
      >
        {fgColor.map((color) => {
          const product = productName[fgColor.indexOf(color)] || productName[0];
          const label = `${product} - ${color}`;
          return (
            <TabPane tab={label} key={color}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ marginRight: 8 }}>Process Type:</label>
                <Select
                  style={{ width: 200 }}
                  placeholder="Select Process Type"
                  value={selectedProcessType}
                  onChange={(value) => {
                    setSelectedProcessType(value);
                  }}
                >
                  {processTypes.map((pt) => (
                    <Select.Option key={pt} value={pt}>
                      {pt}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <Table
                columns={columns}
                dataSource={buildTableData()}
                pagination={false}
                bordered
                size="small"
                rowKey="key"
                scroll={{ x: 'max-content' }}
              />
            </TabPane>
          );
        })}
      </Tabs>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        style={{ marginTop: 16 }}
        destroyInactiveTabPane={true}
      >
        <TabPane tab="Inventory List" key="list">
          {selectedProcessType ? (
            <MoveToInvList
              poSerial={poSerial}
              processType={selectedProcessType}
              fgColor={activeColor}
              productName={productName[fgColor.indexOf(activeColor)] || productName[0]}
            />
          ) : (
            <div>No process type selected.</div>
          )}
        </TabPane>

        <TabPane tab="Moved Bundles" key="bundles">
          {selectedProcessType ? (
            <MovedBundles
              poSerial={poSerial}
              processType={selectedProcessType}
              fgColor={activeColor}
              productName={productName[fgColor.indexOf(activeColor)] || productName[0]}
            />
          ) : (
            <div>No process type selected.</div>
          )}
        </TabPane>

        <TabPane tab="Ready to Move Bundles" key="Movebundles">
          {selectedProcessType ? (
            <ReadyToMoveBundles
              poSerial={poSerial}
              processType={selectedProcessType}
              fgColor={activeColor}
              productName={productName[fgColor.indexOf(activeColor)] || productName[0]}
            />
          ) : (
            <div>No process type selected.</div>
          )}
        </TabPane>
      </Tabs>
    </>
  );

};

export default MoveToInvSummary;