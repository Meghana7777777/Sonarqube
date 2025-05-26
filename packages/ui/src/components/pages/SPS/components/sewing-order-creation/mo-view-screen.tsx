import { useEffect, useState } from "react";
import { Row, Col, Select, Table, Button, Popconfirm, Space, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { QuestionCircleOutlined, RedoOutlined } from "@ant-design/icons";
import { OrderManipulationServices, SewingOrderCreationService } from "@xpparel/shared-services";
import { DeleteSewOrderCreation, FeatureGrouping, SewingCreationOptionsModel, SewingOrderCreationRequest, SewSerialRequest, MoListModel, MoListRequest, MoStatusEnum } from "@xpparel/shared-models";
import { useAppSelector } from '../../../../../common';
import { AlertMessages } from "packages/ui/src/components/common";

const { Option } = Select;
interface MOCreationProps {
  onStepChange: (step: number, selectedRecord: SewSerialRequest) => void;
}

const MoViewScreen = (props: MOCreationProps) => {
  const { onStepChange } = props;
  const [moList, setMoList] = useState<MoListModel[]>([]);
  const [SewingOrderData, setSewingOrderData] = useState<SewingCreationOptionsModel[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const user = useAppSelector((state) => state.user.user.user);



  const OMSService = new OrderManipulationServices()
  const SPSService = new SewingOrderCreationService()

  useEffect(() => {
    const reqObject = new MoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, MoStatusEnum.IN_PROGRESS)
    OMSService.getListOfMo(reqObject).then((response) => {
      if (response.status) {
        setMoList(response?.data)
      }
      else {
        console.log('No data found')
        AlertMessages.getErrorMessage(response.internalMessage)
      }
    }).catch(err => console.log(err.message));


  }, [])

  useEffect(() => {
    getSewingOrderCreatedData();

    // setSewingOrderData(combinedMockObject)
  }, [selectedOrderId])


  const getSewingOrderCreatedData = () => {
    if (selectedOrderId) {
      const reqObj = new SewingOrderCreationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, selectedOrderId)
      SPSService.getSewingOrderCreatedData(reqObj).then((response) => {
        if (response.status) {
          setSewingOrderData(response?.data)
        }
        else {
          AlertMessages.getErrorMessage(response.internalMessage)
        }
      }).catch((error) => {
        AlertMessages.getErrorMessage(error.message)

      })
    }
  }

  const handleOrderChange = (orderId: number) => {
    setSelectedOrderId(orderId);

  };

  const handleReload = () => {
    getSewingOrderCreatedData();

  };

  const getNonNullKeysFromFeatureGrouping = (featureGrouping: FeatureGrouping[]): string[] => {
    const nonNullKeys: Set<string> = new Set();

    featureGrouping.forEach(feature => {
      Object.keys(feature).forEach(key => {
        if (feature[key] !== null && feature[key] !== undefined && !Array.isArray(feature[key])
        // && key!=='sFeatureGroupId' && key!=='moLine' && key!=='PlannedCutDate'
        ) {
           
          nonNullKeys.add(key);
        }
      });
    });
    return Array.from(nonNullKeys);
  };

  const handleProceed = (id: number, serial: number) => {
    const req = new SewSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, serial, id, true, true)
    console.log(req)
    console.log(id, serial)
  }

  const deleteMo = (record: SewingCreationOptionsModel) => {
    const reqObj = new DeleteSewOrderCreation(record.sewSerial);
    SPSService.deleteSewingOrder(reqObj).then((response) => {
      if (response.status) {
        AlertMessages.getSuccessMessage(response.internalMessage)
      }

      else {
        AlertMessages.getErrorMessage(response.internalMessage)
      }
    }).catch(err => console.log(err.message));

  }


  const actionButtonHandler = (): any => {


    return [
      {
        title: "Activity",
        key: "actions",
        fixed: "right",
        align: "center",
        width: 80,
        render: (text, record: SewingCreationOptionsModel) => (

          <Space>
            <Button size='small' type='primary' onClick={() => {
              const req = new SewSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, record.sewSerial, record.mOrderId, true, true)
              // console.log(req);
              onStepChange(1, req);

            }}>Proceed</Button>
            <Popconfirm
              title="Delete Product type Sku Mapping"
              description="Are you sure to delete this ?"
              onConfirm={() => deleteMo(record)}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button type="primary" size={'small'} danger>Delete</Button>
            </Popconfirm>
          </Space>

        ),
      },
    ];
  };

  const expandedRowRender1 = (record: SewingCreationOptionsModel) => {
    const expandedRowRender = (record: any) => {

      const filteredFeatureGrouping = record?.featureGrouping?.flatMap((fg: any) =>
        fg.subLineInfo?.map((subLine: any) => ({
          ...subLine,
          sizes: {
            [subLine.size]: subLine.quantity,
          },
        })) || []
      );


      const sizes = Array.from(
        new Set(
          filteredFeatureGrouping?.flatMap((subLine: any) => subLine.size)
        )
      );


      const innerColumns = [
        { title: "Destination", dataIndex: "destination", key: "destination" },
        { title: "Planned Cut Date", dataIndex: "PlannedCutDate", key: "PlannedCutDate" },
        { title: "Delivery Date", dataIndex: "deliveryDate", key: "deliveryDate" },
        { title: "CO Line", dataIndex: "coLine", key: "coLine" },
        { title: "Buyer PO", dataIndex: "buyerPo", key: "buyerPo" },
        // { title: "Product Type", dataIndex: "productType", key: "productType" },
        // { title: "Product Name", dataIndex: "productName", key: "productName" },
        { title: "Color", dataIndex: "color", key: "color" },
        // // Dynamically generate size columns
        // ...sizes.map((size: string) => ({
        //   title: size,  // Dynamic column title for size
        //   dataIndex: size,  // Dynamic dataIndex for size
        //   key: size,  // Unique key for each size column
        //   render: (_, row) => <span>{row.sizes?.[size] || 0}</span>,  // Render size quantity
        // })),
        { title: "Size", dataIndex: "size", key: "size" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      ];


      return (
        <Table
          size="small"
          rowKey="sSubLineId"
          dataSource={filteredFeatureGrouping}
          columns={innerColumns}
          pagination={false}
          bordered
        />
      );
    };
    const parentColumns: ColumnsType<any> = [
      { title: "MO Line", dataIndex: "moLine", key: "moLine" },
      { title: "Product Type", dataIndex: "productType", key: "productType" },
      { title: "Product Name", dataIndex: "productName", key: "productName" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    ];

    return (
      <Table
        size="small"
        rowKey="sLineId"
        dataSource={record.moLineInfo}
        columns={[...parentColumns]}
        pagination={false}
        bordered
        expandable={{
          expandedRowRender,
        }}
      />);


  }

  const mainColumns: ColumnsType<any> = [
    // { title: "Sewing Order Id", dataIndex: "mOrderId", key: "mOrderId" },
    { title: "Manufacturing Order", dataIndex: "orderNumber", key: "orderNumber" },

    { title: "Routing Order Description", dataIndex: "description", key: "description" },
    { title: "Routing Order Serial", dataIndex: "sewSerial", key: "sewserial" },
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Customer Order", dataIndex: "orderNumber", key: "orderNumber" },

    // { title: "Product Type", dataIndex: "productType", key: "productType" },
  ]
  return (
    <>
      <Row gutter={[16, 16]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Col>
          MO/Plant Style Ref :
          <Select showSearch={true}
            style={{ width: '200px' }}
            placeholder='Select Manufacturing Order'
            optionFilterProp="label"
            onChange={(value) => handleOrderChange(value)}
            allowClear={true}
            onClear={()=>setSewingOrderData([])}
            filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
          >
            {moList.map(moList => {
              return <Option value={moList.orderId} key={`${moList.orderId}`}>{moList.plantStyle ? moList.orderNo + ' - ' + moList.plantStyle : moList.orderNo}</Option>
            })}
          </Select>
        </Col>
        <Col>
          <Tooltip title="Reload">
            <Button
              disabled={!selectedOrderId}
              type="primary"
              icon={<RedoOutlined style={{ fontSize: "20px" }} />}
              onClick={handleReload}
            />
          </Tooltip>
        </Col>
      </Row>

      <br />
      <Row>
        <Col span={24}>
          <Table
            size="small"
            rowKey="mOrderId"
            dataSource={SewingOrderData || null}
            columns={[...mainColumns, ...actionButtonHandler()]}
            pagination={false}
            bordered
            expandable={{
              expandedRowRender: expandedRowRender1,
            }}
            onRow={(record, rowIndex) => ({
              onMouseEnter: () => {
                const rowElement = document.getElementById(`row-${rowIndex}`);
                if (rowElement) {
                  rowElement.style.backgroundColor = '#7dd2f7';
                  rowElement.setAttribute('title', getNonNullKeysFromFeatureGrouping(record?.moLineInfo[0]?.featureGrouping).length>0?`This Routing Order is grouped based on the  ${getNonNullKeysFromFeatureGrouping(record?.moLineInfo[0]?.featureGrouping).toString()}`:`This Routing order hasn't been grouped`);
                }
              },
              onMouseLeave: () => {
                const rowElement = document.getElementById(`row-${rowIndex}`);
                if (rowElement) {
                  rowElement.style.backgroundColor = '';
                  rowElement.removeAttribute('title');
                }
              },
              id: `row-${rowIndex}`,
            })}
          />
        </Col>
      </Row>
    </>
  );
};

export default MoViewScreen;
