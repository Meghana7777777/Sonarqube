import { useEffect, useState } from 'react';
import { PkDSetIdsRequest, PkShippingReqesutItemAttrsModel, PkShippingReqesutItemModel, PkShippingRequestFilterRequest, PkShippingRequestIdRequest, PkShippingRequestModel, PkShippingRequestProceedingEnum, PkShippingRequestShippingInfoModel, PkShippingRequestTruckInfoModel, PkShippingRequestVendorRequest, MoListModel, MoListRequest, MoStatusEnum, VendorCategoryEnum, VendorCategoryRequest, VendorModel } from "@xpparel/shared-models";
import { OrderManipulationServices, ShippingRequestService, VendorService } from "@xpparel/shared-services";
import { Button, Card, Col, Collapse, Form, Modal, Row, Select, Space, Input, message, DatePicker, Tag, Popconfirm } from "antd";
import { disabledBackDates, useAppSelector } from "packages/ui/src/common";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import PendingDispatchTable from "./pending-dispatch-table";

import { AlertMessages } from "../../../../common";
import { DataType, DSetItemsModel } from "./pending-dispatc-interface";
import { IPendingDHeader, IPendingDInline } from './pending-dispatc-interface';
import { defaultDateFormat } from 'packages/ui/src/components/common/data-picker/date-picker';
import moment from 'moment';

const { Option } = Select;
export const PendingDispatchPage = ()=>{
  const [manufacturingOrders, setManufacturingOrders] = useState<MoListModel[]>([]);
  const [selectedManufacturingOrder, setSelectedManufacturingOrder] = useState<string[]>([]);
  const [fetchedData, setFetchedData] = useState<IPendingDHeader[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState("");
  const [isUpdateShippingModalVisible, setIsUpdateShippingModalVisible] = useState(false);
  const [plannedDispatchDate, setPlannedDispatchDate] = useState(null);
  const [selectedShippingRequest, setSelectedShippingRequest] = useState<IPendingDHeader | null>(null);
  const [vendorsData, setVendorsData] = useState<VendorModel[]>([]);
  const [selectedReqNo, setSelectedReqNo] = useState<number | string>();

  const manufacturingOrderService = new OrderManipulationServices();
  const shippingRequestService = new ShippingRequestService();
  const vendorService = new VendorService()
  const user = useAppSelector((state) => state.user.user.user);
  const [form] = Form.useForm();

  useEffect(() => {
    getManufacturingOrders();
    getAllVendorsByCategory();
  }, []);

  const getManufacturingOrders = async () => {
    try {
      const reqObj = new MoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, MoStatusEnum.IN_PROGRESS);
      const manufacturingOrderRes = await manufacturingOrderService.getListOfMo(reqObj);
      if (manufacturingOrderRes.status) {
        setManufacturingOrders(manufacturingOrderRes.data);
      } else {
        AlertMessages.getErrorMessage(manufacturingOrderRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message); ``
    }
  };
  const getAllVendorsByCategory = () => {
    const req = new VendorCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, VendorCategoryEnum.BUYER);
    vendorService.getAllVendorsByVendorCategory(req)
      .then((res) => {
        if (res.status) {
          setVendorsData(res.data);
        } else {
          setVendorsData([]);
        }
      })
      .catch((err) => {
      });
  }
  const getShippingRequestByFilterRequest = async (manufacturingOrderPks: string[]) => {
    try {
      // const reqObj = new ShippingRequestFilterRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, manufacturingOrderPks, undefined, true, true, true, true);

      const req = new PkShippingRequestFilterRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, manufacturingOrderPks, [], false, false, true, true);

      const shippingRequestRes = await shippingRequestService.getShippingRequestByFilterRequest(req);

      if (shippingRequestRes.status) {
        const resultData: PkShippingRequestModel[] = shippingRequestRes.data;

        // Initialize an array for the headers
        const headerData: IPendingDHeader[] = [];

        resultData.forEach((item) => {
          // Initialize total values for the header
          let totalQuantity = 0;
          let totalCuts = 0;
          let totalBags = 0;
          let totalBundles = 0;

          // Array to store the inline data (Pending_D_Inline)
          const inlineData: IPendingDInline[] = [];

          // Loop through each shipping request item and calculate totals
          item.shippingReqItems.forEach((reqItem) => {
            const attr = reqItem.srItemAttrModel;
            const cutNumbers = attr?.destinations || [];
            const totalBagNos = attr?.delDates || [];
            const totalSubItems = Number(attr?.poNos) || 0;
            const totalQty = Number(attr?.poNos) || 0;

            // Calculate total cuts and bags
            totalCuts += cutNumbers.length;
            totalBags += totalBagNos.length;
            totalBundles += totalSubItems;
            totalQuantity += totalQty;

            // Create inline data for each shipping request item
            const inlineItem: IPendingDInline = {
              MO: reqItem.moNumber || '',
              cutOrder: '-',
              productName: reqItem.itemLevel || '',
              cutNumbers: cutNumbers.join(', '),
              quantity: totalQty,
              bags: totalBagNos.length,
            };

            // Push inline data to the array
            inlineData.push(inlineItem);
          });

          // header data
          const newHeaderData: IPendingDHeader = {
            id: item.id,
            reqNo: item.srNo || '', // Default to empty string if undefined
            quantity: totalQuantity, // Total quantity
            totalCuts: totalCuts, // Total cuts
            totalBags: totalBags, // Total bags
            totalBundles: totalBundles, // Total bundles
            chid: inlineData,
            approveStatus: item.approvalStatus
          };

          // Push the new header data to the array
          headerData.push(newHeaderData);
        });

        // Now set the data where necessary
        setFetchedData(headerData);
      } else {
        setFetchedData([]);
        AlertMessages.getErrorMessage(shippingRequestRes.internalMessage)
      }



    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    }
  };



  const searchShippableSet = async () => {
    if (selectedManufacturingOrder.length > 0) {

      await getShippingRequestByFilterRequest(selectedManufacturingOrder);
      setHasSearched(true);
    } else {
      message.warning("Please select at least one Manufacturing Order.");
    }
  };





  const renderProducts = (item: IPendingDHeader) => {
    let child = item.chid || [];
    return (
      <>
        <PendingDispatchTable childData={child} />
      </>
    );
  };


  const handleDelete = async (record: IPendingDHeader) => {
    try {

      const srId = Number(record.id);
      const reqObj = new PkShippingRequestIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [srId], "", false, false, false, false);
      const deleteResponse = await shippingRequestService.deleteShippingRequest(reqObj);
      if (deleteResponse.status) {
        AlertMessages.getSuccessMessage(deleteResponse.internalMessage);
        searchShippableSet();

      } else {
        AlertMessages.getErrorMessage(deleteResponse.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };


  const handleApprove = async (record: IPendingDHeader) => {
    try {
      const srId = Number(record.id);

      const reqObj = new PkShippingRequestIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [srId], remarks, false, false, false, false);
      const deleteResponse = await shippingRequestService.approveShippingRequest(reqObj);
      if (deleteResponse.status) {
        setIsApproveModalVisible(false);
        AlertMessages.getSuccessMessage(deleteResponse.internalMessage);
        setRemarks('');
      } else {
        AlertMessages.getErrorMessage(deleteResponse.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };


  const handleReject = async (record: IPendingDHeader) => {
    try {
      const srId = Number(record.id);

      const reqObj = new PkShippingRequestIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [srId], remarks, false, false, false, false);
      const deleteResponse = await shippingRequestService.rejectShippingRequest(reqObj);
      if (deleteResponse.status) {
        setIsRejectModalVisible(false);
        AlertMessages.getSuccessMessage(deleteResponse.internalMessage);
        setRemarks('');
      } else {
        AlertMessages.getErrorMessage(deleteResponse.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };

  // Header rendering function for Collapse Panel
  const renderHeader = (record: IPendingDHeader) => {
    const isApproved = record.approveStatus == PkShippingRequestProceedingEnum.APPROVED;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%" }}>
        <Space size="small" wrap>
          <Col>Req No : <Tag color="black">{record.id}</Tag></Col>
          <Col>Quantity : <Tag color="black">{record.quantity}</Tag></Col>
          <Col>Total Cuts : <Tag color="black">{record.totalCuts}</Tag></Col>
          <Col>Total Bags : <Tag color="black">{record.totalBags}</Tag></Col>
          <Col>Total Bundles : <Tag color="black">{record.totalBundles}</Tag></Col>
        </Space>
        <Space size="small" wrap>
          <Popconfirm
            onConfirm={e => { e.stopPropagation(); handleDelete(record); }}
            onCancel={e => e.stopPropagation()}          
            title={"Are you sure to Delete Dispatch request ?"}>
            <Button type="primary" size="small" onClick={(e) => { e.stopPropagation(); }} icon={<DeleteOutlined />} danger   disabled={isApproved} />
          </Popconfirm>
          <Button type="primary" size="small" className='btn-yellow'
            onClick={(e) => { e.stopPropagation(); setIsUpdateShippingModalVisible(true); setSelectedReqNo(record.id); reSetForm(); }}>Update Shipping Info</Button>

          <Button type="primary" size="small" className='btn-green'
          disabled={isApproved}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedShippingRequest(record);  // Set the selected shipping request
              setIsApproveModalVisible(true);      // Open the modal
              setRemarks(undefined)
            }}
          >Approve</Button>

          {/* <Button type="primary" size="small" onClick={(e) => {
            e.stopPropagation();
            setSelectedShippingRequest(record);
            setIsRejectModalVisible(true);
            setRemarks(undefined);

          }} danger>Reject</Button> */}

          {/* <Button type="primary" size="small" onClick={(e) => {
            e.stopPropagation()
            // setSelectedShippingRequest(record);
            setIsRejectModalVisible(true);
          }}>Reject</Button> */}

        </Space>
      </div>
    );
  };
  const reSetForm = () => {
    form.resetFields();
  }

  const handleUpdateShippingInfo = async (values) => {
    const { vendor, shippingInfo, remarks, plannedDate } = values;
    const req = new PkShippingRequestVendorRequest(vendor, remarks, plannedDate, Number(selectedReqNo), user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    const res = await shippingRequestService.saveVendorInfoForShippingRequest(req);
    if (res.status) {
      setIsUpdateShippingModalVisible(false);
      AlertMessages.getSuccessMessage(res.internalMessage);
    } else {
      AlertMessages.getErrorMessage(res.internalMessage);
    }

  };
  const changeVendor = (vendorId: number) => {
    const vendorAddObj = vendorsData.find(e => e.id == vendorId);
    if (vendorAddObj) {
      form.setFieldValue('shippingInfo', `${vendorAddObj.vAddress}\n${vendorAddObj.vPlace}\n${vendorAddObj.vCountry}`)
    }
  }
  return (
    <>
      <Card>
        <Row >
          <Col xs={12} sm={8} md={6} lg={7}>
            <Form>
              <Form.Item label="Select Manufacturing Order" name="manufacturingOrder" rules={[{ required: true, message: "Select MO/Plant Style Ref" }]} style={{ marginBottom: 0 }}>
                <Select
                  style={{ width: "300px" }}
                  mode="multiple"
                  onChange={e => setSelectedManufacturingOrder(e)}
                  placeholder="Select MO/Plant Style Ref"
                  filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
                >
                  {manufacturingOrders.map((moList) =>
                    <Select.Option value={moList.orderId} key={moList.orderId}>{moList.plantStyle ? `${moList.orderNo} - ${moList.plantStyle}` : moList.orderNo}</Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Form>
          </Col>
          <Col xs={12} sm={8} md={6} lg={7}>
            <Button type="primary"  style={{ marginLeft: '30px' }} onClick={searchShippableSet}>Search</Button>
          </Col>
        </Row>

        <div style={{ marginTop: 50 }}>
          {hasSearched && (
            <Collapse
              accordion={false}
              size="small"
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? (
                  <MinusOutlined style={{ fontSize: '20px' }} />
                ) : (
                  <PlusOutlined style={{ fontSize: '20px' }} />
                )
              }
            >
              {fetchedData?.map((record, index: number) => (
                <Collapse.Panel
                  key={index}
                  header={renderHeader(record)}
                  style={{ padding: 0 }}
                >
                  {renderProducts(record)}
                </Collapse.Panel>
              ))}
            </Collapse>
          )}
        </div>
      </Card>

      {/* Approve Modal */}
      <Modal title="Approve" open={isApproveModalVisible} onOk={() => handleApprove(selectedShippingRequest)} onCancel={() => setIsApproveModalVisible(false)}
        footer={[<Space>
          <Button onClick={() => setIsApproveModalVisible(false)}> Cancel</Button>
          <Button type='primary' onClick={() => handleApprove(selectedShippingRequest)} className='btn-green'>Approve</Button></Space>]}
      >
        <Input.TextArea rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add Approval remarks here..." />
      </Modal>

      <Modal title="Reject" open={isRejectModalVisible} onOk={() => handleReject(selectedShippingRequest)} onCancel={() => setIsRejectModalVisible(false)}

        footer={[<Space><Button onClick={() => setIsRejectModalVisible(false)}>Cancel</Button>
          <Popconfirm
            onConfirm={() => {
              handleApprove(selectedShippingRequest)
            }}
            onCancel={e => e.stopPropagation()}
            title={"Are you sure to Reject Dispatch request ?"}>

            <Button type='primary' danger >Reject</Button>
          </Popconfirm>
        </Space>]}
      >
        <Input.TextArea rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add rejection remarks here..." />
      </Modal>

      {/* Update Shipping Info Modal */}
      <Modal
        title="Update Shipping Info"
        open={isUpdateShippingModalVisible}
        // onOk={handleUpdateShippingInfo}
        onCancel={() => setIsUpdateShippingModalVisible(false)}
        footer={[]}
      >
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} onFinish={handleUpdateShippingInfo} form={form} name='vendorForm'>
          <Form.Item label="Vendor" required name='vendor' rules={[{ required: true, message: 'Please select a vendor.' }]}>
            <Select style={{ width: "100%" }}
              placeholder="Select Vendor"
              onChange={changeVendor}
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())
              }
              showSearch
            >
              {vendorsData.map(v => <Option key={v.vCode} value={v.id}>{`${v.vName} - ${v.vDesc}`}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Shipping Info" name='shippingInfo'   >
            <Input.TextArea readOnly rows={4}


            />
          </Form.Item>

          <Form.Item label="Planned Dispatch Date" required name='plannedDate' rules={[{ required: true, message: 'Please select a dispatch date.' }]}>
            <DatePicker onChange={(date) => setPlannedDispatchDate(date)} disabledDate={(current: any) => disabledBackDates(current, moment().format(defaultDateFormat))} />
          </Form.Item>

          <Form.Item label="Remarks" name='remarks'>
            <Input.TextArea
              rows={4}

              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks here..."
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Space>
              <Button type="primary" onClick={reSetForm} danger>
                Reset
              </Button>
              <Button type="primary" htmlType="submit" className='btn-green'>
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

    </>
  );
};

export default PendingDispatchPage;