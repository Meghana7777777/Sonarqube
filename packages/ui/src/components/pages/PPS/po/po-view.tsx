import { DownCircleFilled, QuestionCircleOutlined, RedoOutlined, UpCircleFilled } from '@ant-design/icons';
import { PoSerialRequest, PoSummaryModel, RawOrderNoRequest, SoListModel, SoListRequest, SoStatusEnum } from '@xpparel/shared-models';
import { OrderManipulationServices, POService } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Popconfirm, Row, Select, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { POSummaryColumns, poChildColumns } from './po-summery-columns';

interface IPOViewProps {
  onStepChange?: (step: number, selectedRecord: any) => void;
}
const { Option } = Select;
export const POView = (props: IPOViewProps) => {
  const { onStepChange } = props;
  const [expandedIndex, setExpandedIndex] = useState([]);
  const [saleOrders, setSaleOrders] = useState<SoListModel[]>([]);
  const [selectedSalOrdId, setSelectedSalOrdId] = useState<number>();
  const [POSummeryData, setPOSummeryData] = useState<PoSummaryModel[]>([])
  const user = useAppSelector((state) => state.user.user.user);

  const omsManipulationService = new OrderManipulationServices();
  const poService = new POService();

  useEffect(() => {
    getSoList(new SoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, SoStatusEnum.COMPLETED));
  }, []);

  const getOrderSummery = (req: RawOrderNoRequest) => {
    poService.getPosForSo(req)
      .then((res) => {
        if (res.status) {
          setPOSummeryData(res.data);
        } else {
          setPOSummeryData([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  }

  const getSoList = (req: SoListRequest) => {
    omsManipulationService.getListOfSo(req)
      .then((res) => {
        if (res.status) {
          setSaleOrders(res.data);
        } else {
          setSaleOrders([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  }

  const deletePo = (rec: PoSummaryModel) => {
    const req: PoSerialRequest = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rec.poSerial, rec.poId, false, false);
    poService.deletePo(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getOrderSummery(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, selectedSalOrdId, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined));
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  }
  const actionButtonHandler = (): any => {
    return [{
      title: 'Activity',
      key: 'actions',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (text, record) => (
        <>
          <Space>
            {/* <Tooltip title='Size wise data'> */}
            <Button size='small' type='primary' onClick={() => { onStepChange(1, record); }}>Proceed</Button>
            {/* </Tooltip> */}
            <Popconfirm
              title="Delete Product type Sku Mapping"
              description="Are you sure to delete this ?"
              onConfirm={() => deletePo(record)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button type="primary" size={'small'} danger>Delete</Button>
            </Popconfirm>
          </Space>

        </>
      )
    }]
  }
  const soChangeHandler = (orderId: number) => {
    setSelectedSalOrdId(orderId);
    getOrderSummery(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderId, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined));
  }


  const setIndex = (expanded, record) => {
    const expandedRows = new Set(expandedIndex);
    if (expanded) {
      expandedRows.add(record?.poId);
      setExpandedIndex(Array.from(expandedRows));
    } else {
      expandedRows.delete(record?.poId);
      setExpandedIndex(Array.from(expandedRows));
    }
  }

  const columnsOLines = [{

  }]


  const renderItems = (record: PoSummaryModel, index, indent, expanded) => {
    return <Table dataSource={record.poLines} size='small' columns={poChildColumns} bordered scroll={{ x: '100%' }} pagination={false} />
  }

  return (
    <>
      <Form>
        <Form.Item noStyle>
          <Row >
            <Col span={12}>
              SO/Plant Style Ref : <Select showSearch={true} style={{ width: '200px' }} optionFilterProp='label' placeholder='Select Sale Order' onChange={soChangeHandler} allowClear={true} filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}>
                {saleOrders.map(soList => {
                  return <Option value={soList.orderId} key={`${soList.orderId}`}>{soList.plantStyle ? soList.orderNo + ' - ' + soList.plantStyle : soList.orderNo}</Option>
                })}
              </Select>
            </Col>
            <Col span={10}></Col>
            <Col span={2}>
              {<Tooltip title="Reload"><Button
                disabled={!selectedSalOrdId}
                type='primary' icon={<RedoOutlined style={{ fontSize: '20px' }} />} onClick={() => soChangeHandler(selectedSalOrdId)} /></Tooltip>}
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <br></br>
      <Table
        size='small'
        rowKey={record => record.poId}
        dataSource={POSummeryData}
        columns={[...POSummaryColumns, ...actionButtonHandler()]}
        pagination={false}
        bordered
        expandable={{
          expandedRowRender: renderItems,
          expandedRowKeys: expandedIndex,
          onExpand: setIndex
        }}
        expandIcon={({ expanded, onExpand, record }) =>
          expanded ? (
            <UpCircleFilled
              onClick={(e) => onExpand(record, e)}
            >
              Collapse
            </UpCircleFilled>
          ) : (
            <DownCircleFilled onClick={(e) => onExpand(record, e)}>Expand</DownCircleFilled>
          )
        }
      />
    </>
  )
}

export default POView;