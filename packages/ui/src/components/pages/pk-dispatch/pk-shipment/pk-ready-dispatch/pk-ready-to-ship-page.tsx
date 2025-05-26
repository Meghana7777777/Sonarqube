import React, { useState, useEffect } from 'react';
import { MinusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Collapse, Select, Table, Modal, Form, DatePicker, TimePicker, Input, Tag, Row, Col, Card, message, Flex, Space } from 'antd';
import { OrderManipulationServices, PkShippingRequestService, PreIntegrationServicePKMS } from '@xpparel/shared-services';
import { AlertMessages } from '../../../../common';
import { SequenceUtils, useAppSelector } from 'packages/ui/src/common';
import { PkAodAbstarctModel, PkDSetIdsRequest, PkDSetModel, PkDSetResponse, PkDSetSubItemsModel, GlobalResponseObject, PkShippingRequestFilterRequest, PkShippingRequestIdRequest, PkShippingRequestItemIdRequest, PkShippingRequestModel, PkShippingRequestProceedingEnum, MoListModel, MoListRequest, MoStatusEnum, PkTruckTypeEnum, CommonRequestAttrs, MoNumberResDto } from '@xpparel/shared-models';
import { PlusOutlined, CarOutlined } from '@ant-design/icons';
import PkTruckInfoForm from './pk-truck-info-form';
import { getCssFromComponent } from '../../../WMS';
import PkCheckout from './pk-checkout';
import { constructSrUniqueAttrs } from '../pk-pending-dispatch/sr-attrs.helper';
import PkPrintDispatch from './pk-dispatch-print-page';
import PkAodPrint from './aod-print';
import TruckDrawerModal from './pk-truck-item-modal-page';

const { Option } = Select;
export interface ShippingReqesutAttrsModel {
  moNumbers: string[];
}
interface IReqCutInfo {
  [key: string]: ICutInfo[]
}
interface ICutInfo {
  key: number;
  mo: string;       // Manufacturings order number
  poNo: string;     // Po number
  styles: string;  // styles
  buyers: string;    // buyers
  destinations: string;      // destinations
  delDates: string;
  drReqNo: string;
}
const columns2 = [
  { title: "Dispatch Set", dataIndex: "drReqNo", key: "drReqNo", align: "center" as const },
  { title: "MO", dataIndex: "mo", key: "mo", align: "center" as const },
  { title: "VPO No", dataIndex: "poNo", key: "poNo", align: "center" as const },
  { title: "Style", dataIndex: "styles", key: "styles", align: "center" as const },
  { title: "Buyer", dataIndex: "buyers", key: "buyers", align: "center" as const },
  { title: "Destination", dataIndex: "destinations", key: "destinations", align: "center" as const },
  {
    title: "Delivery Dates", dataIndex: "delDates", key: "delDates", align: "center" as const,
    render: (v) => SequenceUtils.deliveryDatesMethod(v)
  },
];

const PkReadyToShip: React.FC<{ disableActions?: boolean, stepCase?: number, showPrintAod: boolean }> = ({ disableActions, stepCase, showPrintAod }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [manufacturingOrders, setManufacturingOrders] = useState<MoNumberResDto[]>([]);
  const [selectedMo, setSelectedMo] = useState<string[]>([]);
  const [shippingRequestData, setShippingRequestData] = useState<PkShippingRequestModel[]>([])
  const [showHeaderRow, setShowHeaderRow] = useState<boolean>(false);
  const [dispatchData, setDispatchRequestData] = useState<PkDSetModel[]>([]);
  const [dynamicFields, setDynamicFields] = useState([{ truckNumber: '', checkoutTime: null, checkoutDate: null, remarks: '' }]);
  const user = useAppSelector((state) => state.user.user.user);
  const manufacturingOrderService = new OrderManipulationServices();
  const shippingValue = new PkShippingRequestService();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [isShowAODModel, setIsShowAODModel] = useState<boolean>(false);
  const [shippingPrintInfo, setShippingPrintInfo] = useState<PkAodAbstarctModel[]>([]);
  const [reqCutInfo, setReqCutInfo] = useState<IReqCutInfo>({});
  const [istruckShippingModalVisible, setIstruckShippingModalVisible] = useState(false);
  const [selectedShippingRequestId, setSelectedShippingRequestId] = useState<string>("");
  const preIntegrationServicePKMS = new PreIntegrationServicePKMS();

  useEffect(() => {
    getManufacturingOrders();
  }, []);



  const getManufacturingOrders = async () => {
    try {
      const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      const manufacturingOrderRes = await preIntegrationServicePKMS.getPKMSMoNumbers(reqObj);
      if (manufacturingOrderRes.status) {
        setManufacturingOrders(manufacturingOrderRes.data);
      } else {
        AlertMessages.getErrorMessage(manufacturingOrderRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };


  const changeManufacturingOrder = (manufacturingOrder: string[]) => {
    const selectedManufacturingOrders = manufacturingOrder.map(order => order.toString());
    setSelectedMo(selectedManufacturingOrders);
  };



  const getShippingRequestByFilterRequest = async (selectedMo: string[]) => {
    const reqObj = new PkShippingRequestFilterRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      selectedMo,
      disableActions ? [PkShippingRequestProceedingEnum.DISPATCHED] : [PkShippingRequestProceedingEnum.REJECTED, PkShippingRequestProceedingEnum.OPEN, PkShippingRequestProceedingEnum.APPROVED],
      true, true, true, true
    );

    try {
      const shippingRequestFilter = await shippingValue.getShippingRequestByFilterRequest(reqObj);
      if (shippingRequestFilter.status) {
        setShippingRequestData(shippingRequestFilter.data);
        constructCutTableData(shippingRequestFilter.data)
      } else {
        AlertMessages.getErrorMessage(shippingRequestFilter.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };

  const constructCutTableData = (shippableData: PkShippingRequestModel[]) => {
    const reqWiseCutInfo: IReqCutInfo = {};
    shippableData.forEach(reqObj => {
      reqWiseCutInfo[reqObj.id] = reqObj.shippingReqItems.map((item) => {
        const obj: ICutInfo = {
          key: item.id,
          mo: item.srItemAttrModel?.moNo,
          poNo: item.srItemAttrModel?.poNos?.toString(),
          styles: item.srItemAttrModel?.styles?.toString(),
          buyers: item.srItemAttrModel?.buyers?.toString(),
          destinations: item.srItemAttrModel?.destinations?.toString(),
          delDates: item.srItemAttrModel?.delDates?.toString(),
          drReqNo: item.drReqNo
        };

        return obj;
      })
    });

    setReqCutInfo(reqWiseCutInfo);
  }
  const searchShippableSet = () => {
    if (selectedMo.length > 0) {
      getShippingRequestByFilterRequest(selectedMo)
        .then(() => {
          setShowHeaderRow(true);
        })
        .catch((error) => {
          console.error('Error fetching shipping requests:', error);
        });
    } else {
      AlertMessages.getErrorMessage("Please select at least one Manufacturing Order.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedItem(null);
  };

  const handleEdit = (id: number) => {
    setSelectedItem(id);
    setIsModalVisible(true);
    setIsCheckoutVisible(false);
    form.setFieldsValue({ srId: id, truckNumber: '', checkoutTime: null, checkoutDate: null, remarks: '' });
  };

  const addDynamicField = () => {
    setDynamicFields([...dynamicFields, { truckNumber: '', checkoutTime: null, checkoutDate: null, remarks: '' }]);
  };

  const removeDynamicField = (index: number) => {
    const updatedFields = [...dynamicFields];
    updatedFields.splice(index, 1);
    setDynamicFields(updatedFields);
  };


  const getDispatchShippingPrintInfo = async (shippingInfo: PkShippingRequestModel) => {
    try {
      const reqItems: number[] = shippingInfo.shippingReqItems.map(e => e.id);
      const req = new PkShippingRequestItemIdRequest(reqItems, '', user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      const shippingPrintRes = await shippingValue.getShippingRequestItemAodAbrstactInfo(req);
      if (shippingPrintRes.status) {
        setIsShowAODModel(true);
        setShippingPrintInfo(shippingPrintRes.data);
      } else {
        AlertMessages.getErrorMessage(shippingPrintRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  }

  const HeaderRow = () => {
    return (
      <>
        {shippingRequestData.map((record) => {
          const srAttrs = constructSrUniqueAttrs(record.shippingReqItems.map(r => r.srItemAttrModel));
          const shippingReqItems = Array.isArray(record.shippingReqItems) ? record.shippingReqItems : [];

          let totalCartons = 0;
          let totalFgs = 0;
          shippingReqItems.forEach(r => {
            totalCartons += Number(r.srItemAttrModel.totalCartons);
            totalFgs += Number(r.srItemAttrModel.totalFgs);
          });

          return (
            <Collapse key={record.id} size='small' accordion={false}
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? (
                  <MinusOutlined style={{ fontSize: '20px' }} />
                ) : (
                  <PlusOutlined style={{ fontSize: '20px' }} />
                )
              }
            >
              <Collapse.Panel
                header={
                  // <Row gutter={16} align="middle">
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%" }}>
                    <Space size="small" wrap>
                      <Col>Req No : <Tag color="black">{record.id}</Tag></Col>
                      <Col>VPO : <Tag color="black">{srAttrs.poNos}</Tag></Col>
                      <Col>Buyers : <Tag color="black">{srAttrs.buyers}</Tag></Col>
                      <Col>Delivery : <Tag color="black">{SequenceUtils.deliveryDatesMethod(srAttrs.delDates)}</Tag></Col>
                      <Col>Destination : <Tag color="black">{srAttrs.dests}</Tag></Col>
                      <Col>Total Cartons : <Tag color="black">{totalCartons}</Tag></Col>
                      <Col>Total FG Qty : <Tag color="black">{totalFgs}</Tag></Col>
                    </Space>
                    <Space size="small" wrap>
                      {stepCase === 3 && (
                        <Space wrap>
                          <Button type="primary" icon={<CarOutlined />} className='btn-yellow' onClick={() => handleEdit(record.id)} size='small' >
                            Update Truck Info
                          </Button>
                          <Button type="primary" size="small" onClick={(e) => { e.stopPropagation(); setSelectedId(record.id); getDispatchShippingPrintInfo(record) }} className='btn-orange'>Print AOD</Button>
                          <Button
                            type="primary"
                            size="small"
                            className="btn-yellow"
                            onClick={(e) => {
                              setSelectedShippingRequestId(record.id.toString()); // Set the specific shipping request ID
                              setIstruckShippingModalVisible(true);
                              e.stopPropagation();
                            }}
                          >
                            Truck Map
                          </Button>
                          <Button
                            type="primary" size='small' className='btn-green'
                            onClick={(event) => {
                              setIsCheckoutVisible(true);
                              setIsModalVisible(false);
                              setSelectedItem(record.id);
                              event.stopPropagation();
                            }}
                          >
                            Check Out
                          </Button>

                        </Space>
                      )}
                      {showPrintAod && (
                        <Space wrap>
                          <Button type="primary" size="small" onClick={(e) => { e.stopPropagation(); setSelectedId(record.id); getDispatchShippingPrintInfo(record) }} className="btn-orange">
                            Print AOD
                          </Button>
                        </Space>)}
                    </Space>
                  </div>
                  // </Row>
                }
                key={record.id}
              >
                <div>
                  <Table
                    size='small'
                    bordered
                    columns={columns2}
                    dataSource={reqCutInfo[record.id] ? reqCutInfo[record.id] : []}
                    pagination={false}
                    scroll={{x: 'max-content'}}
                  />
                </div>
              </Collapse.Panel>
            </Collapse>
          );
        })}
      </>
    );
  };

  const printAod = () => {
    const divContents = document.getElementById('printArea').innerHTML;
    const element = window.open('', '', 'height=700, width=1024');
    element.document.write(divContents);
    getCssFromComponent(document, element.document);
    element.document.close();
    // Loading image lazy
    setTimeout(() => {
      element.print();
      element.close();
    }, 1000);
  }



  return (
    <Card>

      <div>
        <Form layout='horizontal'>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={9} lg={8} xl={8}>
              <Form.Item
                label="Select Manufacturing Order"
                name="manufacturingOrder"
                rules={[{ required: true, message: 'Please select at least one manufacturing order' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select MO/Plant Style Ref"
                  onChange={changeManufacturingOrder}
                  // style={{ width: '300px' }}
                  filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
                >
                  {manufacturingOrders.map((moList) => (
                    <Option value={moList.moId} key={moList.moId}>
                      {moList.moNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>


            <Col style={{marginBottom: '10px'}}>
              <Button type="primary" onClick={searchShippableSet}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {showHeaderRow && (

        <HeaderRow />

      )}
      <br />

      {isModalVisible && selectedItem && (
        <PkTruckInfoForm
          isVisible={isModalVisible}
          onClose={handleCancel}
          initialFields={dynamicFields}
          shippingRequestData={shippingRequestData}
          user={user}
          requestId={selectedItem}
        />)}
      {isCheckoutVisible && selectedItem && (
        <PkCheckout
          isVisible={isCheckoutVisible}
          onClose={handleCancel}
          shippingRequestData={shippingRequestData}
          user={user}
          requestId={selectedItem}
        />)}

      <Modal
        title={<React.Fragment>
          <Row>
            <Col span={12}>
              Print Dispatch Set
            </Col>
            <Col span={11} style={{ textAlign: 'right' }}>
              <Button type='primary' onClick={() => printAod()}>Print</Button>
            </Col>
          </Row>
        </React.Fragment>}
        width={'100%'}
        style={{ top: 0 }}
        // open={false}
        open={isShowAODModel}
        footer={[
          <Button key='back' onClick={() => setIsShowAODModel(false)}>
            Cancel
          </Button>,
        ]}
        onCancel={() => setIsShowAODModel(false)}
      >
        <div id='printArea'>

          {/* {stepCase === 4 ? ( */}
          <>
            <PkAodPrint srItemsInfo={shippingPrintInfo} />
            {/* <PkPrintDispatch printType="Duplicate" shippingInfo={shippingPrintInfo} />
            <PkPrintDispatch printType="Acknowledgement" shippingInfo={shippingPrintInfo} />
            <PkPrintDispatch printType="Security / Gate Copy" shippingInfo={shippingPrintInfo}/>
            <PkPrintDispatch printType="Book Copy" shippingInfo={shippingPrintInfo}/> */}
          </>
          {/* ) : ( */}
          <>
            {/* <PkPrintDispatch printType="Original" shippingInfo={shippingPrintInfo} />
              <PkPrintDispatch printType="Acknowledgement" shippingInfo={shippingPrintInfo} />
              <PkPrintDispatch printType="Security / Gate Copy" shippingInfo={shippingPrintInfo} />
              <PkPrintDispatch printType="Book Copy" shippingInfo={shippingPrintInfo} /> */}
          </>
          {/* )} */}
        </div>
      </Modal>
      <TruckDrawerModal
        visible={istruckShippingModalVisible}
        onClose={() => setIstruckShippingModalVisible(false)}
        shippingRequestId={selectedShippingRequestId}
      />
    </Card>
  );
};
export default PkReadyToShip;




