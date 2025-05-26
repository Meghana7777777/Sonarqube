import React from 'react';
import { Table, Typography, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SI_MoLineProductModel } from '@xpparel/shared-models';

interface RmInfo {
  itemCode: string;
  itemDesc: string;
  avgCons: number;
  itemColor: string;
  seq: number;
}

interface MoLineProductModel {
  moLine: string;
  productName: string;
  rmInfo: RmInfo[];
}

const ProductRawMaterialsTable= () => {
  // Sample data
  const data: any[] = [
    {
      moLine: "MO12345",
      productName: "T-Shirt",
      rmInfo: [
        {
          itemCode: "FAB001",
          itemDesc: "Cotton Fabric",
          avgCons: 2.5,
          itemColor: "Red",
          seq: 1
        },
        {
          itemCode: "THR002",
          itemDesc: "Thread",
          avgCons: 0.5,
          itemColor: "White",
          seq: 2
        },
        {
          itemCode: "LBL003",
          itemDesc: "Brand Label",
          avgCons: 0.2,
          itemColor: "Black",
          seq: 3
        }
      ],
      moNumber: '',
      fgColor: '',
      subLines: [],
      opInfo: [],
      opRmInfo: [],
      moLineProdcutAttrs: undefined,
      productCode: '',
      productType: ''
    },
    {
      moLine: "MO67890",
      productName: "Jeans",
      rmInfo: [
        {
          itemCode: "DEN001",
          itemDesc: "Denim Fabric",
          avgCons: 3.0,
          itemColor: "Blue",
          seq: 1
        },
        {
          itemCode: "BTN002",
          itemDesc: "Metal Button",
          avgCons: 0.3,
          itemColor: "Silver",
          seq: 2
        },
        {
          itemCode: "ZPR003",
          itemDesc: "Zipper",
          avgCons: 0.5,
          itemColor: "Gold",
          seq: 3
        }
      ],
      moNumber: '',
      fgColor: '',
      subLines: [],
      opInfo: [],
      opRmInfo: [],
      moLineProdcutAttrs: undefined,
      productCode: '',
      productType: ''
    }
  ];

  // Define columns for the tables
  const columns: ColumnsType<any> = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '20%',
      align: 'center',
    },
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: '15%',
      align: 'center',
    },
    {
      title: 'Item Desc',
      dataIndex: 'itemDesc',
      key: 'itemDesc',
      width: '20%',
      align: 'center',
    },
    {
      title: 'Item Color',
      dataIndex: 'itemColor',
      key: 'itemColor',
      width: '15%',
      align: 'center',
    },
    {
      title: 'Sequence',
      dataIndex: 'seq',
      key: 'seq',
      width: '15%',
      align: 'center',
    },
    {
      title: 'Avg Consumption',
      dataIndex: 'avgCons',
      key: 'avgCons',
      width: '15%',
      align: 'center',
    },
  ];

  const renderMoLineTables = () => {
    return data.map((moLineItem, index) => {
      const tableData = moLineItem.rmInfo.map((rmItem) => {
        return {
          key: `${moLineItem.moLine}-${rmItem.itemCode}`,
          productName: moLineItem.productName,
          ...rmItem
        };
      });

      return (
        <div key={moLineItem.moLine} style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ margin: '16px 0 8px' }}>
            {`MO line ${index + 1}`}
          </Typography.Title>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            size="middle"
            rowKey={record => record.key}
          />
        </div>
      );
    });
  };

  return (
    <Card style={{ width: '100%' }} title='Knit Item Info'>
      {renderMoLineTables()}
    </Card>
  );
};

export default ProductRawMaterialsTable;