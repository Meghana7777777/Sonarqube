import { ClusterOutlined, DeleteOutlined, DownCircleFilled, EyeOutlined, PrinterTwoTone, SyncOutlined, UpCircleFilled } from '@ant-design/icons';
import { CartonPrintModel, CartonPrintReqDto, CommonIdReqModal, CommonRequestAttrs, PackListCreateModel, PackSerialDropDownModel, PackSerialRequest, PLAndPackJobBarCodeRequest, PONoRequest } from '@xpparel/shared-models';
import { PackListService, PackListViewServices, PreIntegrationServicePKMS } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Modal, Popconfirm, Row, Select, Space, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { PackJobView } from './pack-job-view';
import { PackListCartonPreview } from './pack-list-carton-preview';
import PrintBarCodes from './print-pack-list';
import PackListReport from './pack-list-report';
import PackListReportPDF from './pack-list-report copy';
import { PLCartonWeight } from './pl-carton-weight';


const { Option } = Select;


interface IPackListViewGridProps {
  selectedSummeryRecord?: PackSerialRequest
}

export const PackListViewGrid = (props: IPackListViewGridProps) => {
  const { selectedSummeryRecord } = props;
  const [poData, setPoData] = useState<PackSerialDropDownModel[]>([]);
  const [packListData, setPackListData] = useState<PackListCreateModel[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [cartonData, setCartonData] = useState<CartonPrintModel[]>([]);
  const [printBarcodeReqIds, setPrintBarcodeReqIds] = useState<{ packListId: number, packJobId: number, poId: number }>();
  const [refreshKey, setRefreshKey] = useState<string[]>([]);
  const [packListModelStatus, setPackListModelStatus] = useState<boolean>(false);
  const [activePkListData, setActivePkListData] = useState<PackListCreateModel>(null);
  const [packListExcelModal, setPackListExcelModal] = useState(false);
  const [packListWeightModal, setPackListWeightModal] = useState(false);
  const [packListId, setPackListId] = useState<number[]>([]);




  const service = new PackListViewServices();
  const pkListService = new PackListService();
  const preIntegrationService = new PreIntegrationServicePKMS();

  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;

  const [formRef] = Form.useForm();

  useEffect(() => {
    getAllPos();
    if (selectedSummeryRecord) {
      formRef.setFieldValue('poId', selectedSummeryRecord?.packSerial);
      getPackListsForPo()
    }
  }, []);

  const getAllPos = () => {
    const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    preIntegrationService.getAllPackSerialDropdownData(reqObj)
      .then((res) => {
        if (res.status) {
          setPoData(res.data);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
          setPoData([]);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
        setPoData([]);
      });
  };

  const getPackListsForPo = () => {
    const poNumber: number = formRef.getFieldValue('poId');
    const req = new PONoRequest(userName, userId, orgData.unitCode, orgData.companyCode, poNumber, undefined, undefined);
    service.getPackListsForPo(req)
      .then((res) => {
        if (res.status) {
          setPackListData(res.data);
        } else {
          setPackListData([]);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
        setPackListData([]);
      });
  };

  const deletePackList = (packListId: number) => {
    const req = new CommonIdReqModal(packListId, userName, orgData.unitCode, orgData.companyCode, userId);
    pkListService.deletePackList(req)
      .then((res) => {
        if (res.status) {
          getPackListsForPo()
        } else {
          getPackListsForPo()
        }
      })
      .catch((err) => {
        console.log(err.message);
        getPackListsForPo()
      });
  };

  const getPackingListDataById = (packListId: number) => {
    const req = new CommonIdReqModal(packListId, userName, orgData.unitCode, orgData.companyCode, userId);
    service.getPackingListDataById(req)
      .then((res) => {
        if (res.status) {
          setActivePkListData(res.data);
        } else {
          setActivePkListData(null);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setActivePkListData(null);
      });
  };

  const printBarcodesForPackListId = () => {
    const req = new PLAndPackJobBarCodeRequest(printBarcodeReqIds.packListId, printBarcodeReqIds.packJobId, userName, orgData.unitCode, orgData.companyCode, userId);
    service.printBarcodesForPackListId(req)
      .then((res) => {
        if (res.status) {
          setCartonData([]);
          AlertMessages.getSuccessMessage(res.internalMessage);
          getPackListsForPo();
        } else {
          setCartonData([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => AlertMessages.getErrorMessage(err.message));
  };


  const getCartonPrintData = (packListId: number, packJobId: number, poId: number) => {
    const req = new CartonPrintReqDto(poId, packListId, userName, orgData.unitCode, orgData.companyCode, userId, packJobId)
    pkListService.getCartonPrintData(req).then(res => {
      if (res.status) {
        setPrintBarcodeReqIds({ packListId, packJobId, poId })
        setIsPrintModalVisible(res.status);
        setCartonData(res.data)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => console.log(err.message))
  }

  const releaseBarcodesPrintForPackListId = (packListId: number, packJobId: number) => {
    const req = new PLAndPackJobBarCodeRequest(packListId, packJobId, userName, orgData.unitCode, orgData.companyCode, userId);
    service.releaseBarcodesPrintForPackListId(req)
      .then((res) => {
        if (res.status) {
          getPackListsForPo();
        } else {
          AlertMessages.getSuccessMessage(res.internalMessage)
        }
      })
      .catch(err => console.log(err.message))
  };

  const columns = [
    {
      title: 'Pack List Number',
      dataIndex: 'plConfigNo',
      key: 'plConfigNo',
    }, {
      title: 'Pack List Desc',
      dataIndex: 'plConfigDesc',
      key: 'plConfigDesc',
    },
    {
      title: 'No of Pack Jobs',
      dataIndex: 'packJobs',
      key: 'packJobs',
    },
    {
      title: 'Pack Serial No',
      dataIndex: 'packSerial',
      key: 'packSerial',
    },
    {
      title: 'Pack List Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'No of Cartons',
      dataIndex: 'noOfCartons',
      key: 'noOfCartons',
    },
    {
      title: 'Actions',
      render: (value, record) => (
        <Space>
          <Button
            icon={<PrinterTwoTone />}
            size="small"
            disabled={record.printStatus}
            onClick={() => getCartonPrintData(record.plConfigId, record.packJobId, record.poId)}
          >
            Print
          </Button>
          <Button
            icon={<SyncOutlined />}
            size="small"
            onClick={() => releaseBarcodesPrintForPackListId(record.plConfigId, record.packJobId)}
          >
            Release
          </Button>
          <Button
            className='export-excel-btn'
            icon={<SyncOutlined />}
            size="small"
            onClick={() => {
              setPackListId([record.plConfigId]);
              setPackListExcelModal(true);
            }}
          >
            Download Excel
          </Button>
          <Button
            icon={<ClusterOutlined />}
            size="small"
            onClick={() => {
              setPackListId([record.plConfigId]);
              setPackListWeightModal(true);
            }}
          >
            Update Weight
          </Button>
          <span style={{ margin: '0 8px' }}></span>
          <Tooltip title="View" key={record.plConfigId}>
            <Button
              size='small'
              className="btn-yellow mr-5"
              type="text"
              onClick={() => {
                setPackListModelStatus(true);
                getPackingListDataById(record.plConfigId)
              }}
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Tooltip title="delete" key={record.plConfigId}>
            <Popconfirm
              title={`Are you sure you want to delete?`}
              onConfirm={(e) => {
                e.stopPropagation();
                deletePackList(record.plConfigId)
              }}
              onCancel={(e) => {
                e.stopPropagation();
              }}
              okText="Yes"
              cancelText="No">
              <Button size="small" type="primary" onClick={(e) => e.stopPropagation()} danger icon={<DeleteOutlined />}>Delete</Button>
            </Popconfirm></Tooltip>
        </Space>
      ),
    },
  ];

  const handleExpand = (expanded: boolean, record: any) => {
    setExpandedRowKeys(expanded ? [...expandedRowKeys, record.plConfigId] : expandedRowKeys.filter((key) => key !== record.plConfigId));
  };

  const onClosePackListWeightModal = () => {
    setPackListWeightModal(false);
    setPackListId([]);
  }


  return (
    <>
      <Card title={
        <span><EyeOutlined style={{ marginRight: 4 }} />Pack List View</span>
      }>
        <Form form={formRef} size="small" layout='horizontal'>
          <Row gutter={[16, 16]} >
            <Col xs={24} sm={24} md={9} lg={7} xl={6} >
              <Form.Item label="Select Pack Order" name="poId" rules={[{ required: true }]}>
                <Select
                  placeholder="Select Po"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: '100%', marginBottom: '16px' }}
                >
                  {poData.map((po) => (
                    <Select.Option key={po.packSerial} value={po.packSerial}>
                      {po.packSerial}-{po.packOrderDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button type="primary"  onClick={getPackListsForPo}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          size="small"
          columns={columns}
          scroll={{x:"max-content"}}
          bordered
          dataSource={packListData}
          expandable={{
            expandedRowKeys,
            onExpand: handleExpand,
            expandedRowRender: (record: PackListCreateModel) => <PackJobView plConfigId={record.plConfigId} poId={record.poId} getPackListsForPo={getPackListsForPo} />,
            expandIcon: ({ expanded, onExpand, record }) =>
              record.packJobs !== 0 ? (
                expanded ? (
                  <UpCircleFilled onClick={(e) => onExpand(record, e)} />
                ) : (
                  <DownCircleFilled onClick={(e) => onExpand(record, e)} />
                )
              ) : (
                <></>
              ),
          }}
          pagination={false}
          rowKey={(rec) => rec.plConfigId}
        />


        <PrintBarCodes
          isPrintModalVisible={isPrintModalVisible}
          cartonData={cartonData}
          printBarCodes={() => {
            setIsPrintModalVisible(false);
            printBarcodesForPackListId()
          }}
          setIsPrintModalVisible={setIsPrintModalVisible}
        />
      </Card>
      <Modal
        width={800}
        title={
          <span
            style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
          >
            Pack List View
          </span>
        }
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
        open={packListModelStatus}
        onCancel={() => {
          setPackListModelStatus(false);
          setActivePkListData(null);
        }}
        footer={null}
        closable
      >
        <PackListCartonPreview activePkListData={activePkListData} />
      </Modal>
      <Modal
        width={1400}
        title={<></>}
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
        open={packListExcelModal}
        onCancel={() => {
          setPackListExcelModal(false);
          setPackListId([]);
        }}
        footer={null}
        closable
        style={{ top: 0 }}
      >
        <PackListReport
          selectedPackListId={packListId}
        />
      </Modal>
      <Modal
        width={1400}
        title={<></>}
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
        open={packListWeightModal}
        onCancel={() => {
          onClosePackListWeightModal()
        }}
        footer={null}
        closable
        style={{ top: 0 }}
      >
        <PLCartonWeight
          onClosePackListWeightModal={onClosePackListWeightModal}
          selectedPackListId={packListId}
        />
      </Modal>
    </>
  );
};

export default PackListViewGrid;
