import React, { useState, useEffect } from 'react';
import { MinusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Collapse, Select, Table, Modal, Form, DatePicker, TimePicker, Input, Tag, Row, Col, Card, message, Flex, Space } from 'antd';
import { DispatchSetService, OrderManipulationServices, ShippingRequestService } from '@xpparel/shared-services';
import { AlertMessages } from '../../../../common';
import { useAppSelector } from 'packages/ui/src/common';
import { PkAodAbstarctModel, PkDSetIdsRequest, PkDSetModel,PkDSetResponse, PkDSetSubItemsModel, GlobalResponseObject, PkShippingRequestFilterRequest, PkShippingRequestIdRequest, PkShippingRequestItemIdRequest, PkShippingRequestModel, PkShippingRequestProceedingEnum, MoListModel, MoListRequest, MoStatusEnum, PkTruckTypeEnum } from '@xpparel/shared-models';


import { PlusOutlined, CarOutlined } from '@ant-design/icons';

import TruckInfoForm from './truck-info-form';
import { getCssFromComponent } from '../../../WMS';
import PrintDispatch from './dispatch-print-page';
import Checkout from './checkout';

const { Option } = Select;
export interface ShippingReqesutAttrsModel {
  moNumbers: string[];
}
interface IReqCutInfo {
  [key:string] : ICutInfo[]
}
interface ICutInfo {
  key: number;
  mo: string;
  cutSubOrder: string[];
  productName: string;
  cutNumbers: string;
  quantity: number;
  bags: number;
}
const columns2 = [
  { title: 'Manufacturing Order', dataIndex: 'mo', key: 'mo' },
  { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
  { title: 'Cut Number', dataIndex: 'cutNumbers', key: 'cutNumbers' },
  { title: 'Cut Sub No', dataIndex: 'cutSubOrder', key: 'cutSubOrder' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  { title: 'No Of Bags', dataIndex: 'bags', key: 'bags' }
];

const ReadyToShip: React.FC<{ disableActions?: boolean, stepCase?: number, showPrintAod: boolean }> = ({ disableActions, stepCase, showPrintAod }) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [manufacturingOrders, setManufacturingOrders] = useState<MoListModel[]>([]);
  const [selectedMo, setSelectedMo] = useState<string[]>([]);
  const [shippingRequestData, setShippingRequestData] = useState<PkShippingRequestModel[]>([])
  const [showHeaderRow, setShowHeaderRow] = useState<boolean>(false);
  const [dispatchData, setDispatchRequestData] = useState<PkDSetModel[]>([]);
  const [dynamicFields, setDynamicFields] = useState([{ truckNumber: '', checkoutTime: null, checkoutDate: null, remarks: '' }]);
  const user = useAppSelector((state) => state.user.user.user);
  const manufacturingOrderService = new OrderManipulationServices();
  const shippingValue = new ShippingRequestService();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [isShowAODModel, setIsShowAODModel] = useState<boolean>(false);
  const [shippingPrintInfo, setShippingPrintInfo] = useState<PkAodAbstarctModel[]>([]);
  const [reqCutInfo, setReqCutInfo] = useState<IReqCutInfo>({});

  useEffect(() => {
    getManufacturingOrders();
  }, []);


  const getManufacturingOrders = () => {
    const reqObj = new MoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, MoStatusEnum.IN_PROGRESS);

    manufacturingOrderService.getListOfMo(reqObj)
      .then((manufacturingOrderRes) => {
        if (manufacturingOrderRes.status) {
          setManufacturingOrders(manufacturingOrderRes.data);
        } else {
          AlertMessages.getErrorMessage(manufacturingOrderRes.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
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
    const reqWiseCutInfo:IReqCutInfo = {};
    shippableData.forEach(reqObj => {       
       reqWiseCutInfo[reqObj.id] = reqObj.shippingReqItems.map((item) => {
      //   const obj: ICutInfo = {
      //     key: item.id,
      //     mo: item.moNumber,
      //     cutSubOrder: item.srItemAttrModel?.destinations,
      //     productName: item.style,
      //     cutNumbers: Array.isArray(item.srItemAttrModel?.delDates) ? 
      //         item.srItemAttrModel.coNos.join(', ') : '', 
      //     // quantity: item.srItemAttrModel?.delDates || 0,
      //     bags: item.srItemAttrModel?.coNos?.length || 0,
      // };
         
        // return obj;
        return null;
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
      const reqItems: number[] = shippingInfo.shippingReqItems.map(e => e.id)
      const req = new PkShippingRequestItemIdRequest(reqItems, '', user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId);
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
        {shippingRequestData.map((element) => {
          const shippingReqItems = Array.isArray(element.shippingReqItems) ? element.shippingReqItems : [];

          // const totalQuantity = shippingReqItems.reduce(
          //   // (total, item) => total + (item.srItemAttrModel?. || 0),
          //   0
          // );

          // const totalCuts = shippingReqItems.reduce(
          //   // (total, item) => total + (item.srItemAttrModel?.?.length || 0),
          //   // 0
          // );

          // const totalBags = shippingReqItems.reduce(
          //   // (total, item) => total + (item.srItemAttrModel?.totalBagNos?.length || 0),
          //   0
          // );

          // const totalBundles = shippingReqItems.reduce(
          //   // (total, item) => total + (item.srItemAttrModel?.totalSubItems || 0),
          //   0
          // );

          return (
            <Collapse key={element.id} size='small' accordion={false}
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
                  <Flex justify='space-between' wrap='wrap'>
                    <Space wrap>
                      Request No: <Tag color="black">{element.id || "N/A"}</Tag> &nbsp;
                      {/* Quantity: <Tag color="black">{totalQuantity}</Tag> &nbsp;
                      Total Cuts: <Tag color="black">{totalCuts}</Tag> &nbsp;
                      Total Bags: <Tag color="black">{totalBags}</Tag> &nbsp;
                      Total Bundles: <Tag color="black">{totalBundles}</Tag>0 */}
                    </Space>
                    <Col>
                      {stepCase === 3 && (
                        <Space wrap>
                          <Button type="primary" icon={<CarOutlined />} className='btn-yellow' onClick={() => handleEdit(element.id)} size='small' >
                            Update Truck Info
                          </Button>
                          <Button type="primary" size="small" onClick={(e) => { e.stopPropagation(); setSelectedId(element.id); getDispatchShippingPrintInfo(element) }} className='btn-orange'>Print AOD</Button>
                          <Button
                            type="primary" size='small' className='btn-green'
                            onClick={(event) => {
                              setIsCheckoutVisible(true);
                              setIsModalVisible(false);
                              setSelectedItem(element.id);
                              event.stopPropagation();
                            }}
                          >
                            Check Out
                          </Button>
                        </Space>
                      )}
                      {showPrintAod && (
                        <Space wrap>
                          <Button type="primary" size="small" onClick={(e) => { e.stopPropagation(); setSelectedId(element.id); getDispatchShippingPrintInfo(element) }} className="btn-orange">
                            Print AOD
                          </Button>
                        </Space>)}
                    </Col>
                  </Flex>
                  // </Row>
                }
                key={element.id}
              >
                <div>
                  <Table
                    size='small'
                    bordered
                    columns={columns2}
                    dataSource={reqCutInfo[element.id] ? reqCutInfo[element.id]: []}
                    pagination={false}
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

      <div style={{ display: 'inline-flex' }}>
        <Form>
       
        <Col xs={12} sm={8} md={6} lg={7}>
          <Form.Item
            label="Select Manufacturing Order"
            name="manufacturingOrder"
            rules={[{ required: true, message: 'Please select at least one manufacturing order' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select MO/Plant Style Ref"
              onChange={changeManufacturingOrder}
              style={{ width: '300px' }}
              filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
            >
              {manufacturingOrders.map((moList) => (
                <Option value={moList.orderId} key={moList.orderId}>
                  {moList.plantStyle
                    ? `${moList.orderNo} - ${moList.plantStyle}`
                    : moList.orderNo}
                </Option>
              ))}
            </Select>
          </Form.Item>
          </Col>
          
        </Form>
        
        <Button type="primary" style={{ marginLeft: '50px' }} onClick={searchShippableSet}>
          Search
        </Button>
  
      </div>

      {showHeaderRow && (

        <HeaderRow />

      )}
      <br />

      {isModalVisible && selectedItem && (
        <TruckInfoForm
          isVisible={isModalVisible}
          onClose={handleCancel}
          initialFields={dynamicFields}
          shippingRequestData={shippingRequestData}
          user={user}
          requestId={selectedItem}
        />)}
      {isCheckoutVisible && selectedItem && (
        <Checkout
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
            <Col span={10} style={{ textAlign: 'right' }}>
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
        {stepCase === 4 ? (
        <><PrintDispatch printType="Duplicate" shippingInfo={shippingPrintInfo} />
        <PrintDispatch printType="Acknowledgement" shippingInfo={shippingPrintInfo} />
        <PrintDispatch printType="Security / Gate Copy" shippingInfo={shippingPrintInfo}/>
        <PrintDispatch printType="Book Copy" shippingInfo={shippingPrintInfo}/>
        </>
      ) : (
    <>
        <PrintDispatch printType="Original" shippingInfo={shippingPrintInfo} />
        <PrintDispatch printType="Acknowledgement" shippingInfo={shippingPrintInfo} />
        <PrintDispatch printType="Security / Gate Copy" shippingInfo={shippingPrintInfo} />
        <PrintDispatch printType="Book Copy" shippingInfo={shippingPrintInfo} />
    </>
     )}
        </div>
      </Modal>
    </Card>
  );
};
export default ReadyToShip;




