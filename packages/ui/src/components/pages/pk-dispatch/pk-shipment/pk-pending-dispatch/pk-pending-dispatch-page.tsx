import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, FgWhSrIdPlIdsRequest, MoNumberResDto, PackListCartoonIDs, PkShippingRequestFilterRequest, PkShippingRequestIdRequest, PkShippingRequestModel, PkShippingRequestProceedingEnum, PkShippingRequestVendorRequest, PkmsFgWhReqTypeEnum, VendorCategoryEnum, VendorCategoryRequest, VendorDetailsReq, VendorModel } from "@xpparel/shared-models";
import { OrderManipulationServices, PKMSFgWarehouseService, PkShippingRequestService, PreIntegrationServicePKMS, VendorService } from "@xpparel/shared-services";
import { Button, Card, Col, Collapse, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Tag } from "antd";
import { disabledBackDates, SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from 'react';

import moment from 'moment';
import { defaultDateFormat } from 'packages/ui/src/components/common/data-picker/date-picker';
import { AlertMessages } from "../../../../common";
import { PkIPendingDHeader, PkIPendingDInline } from './pk-pending-dispatc-interface';
import PkPendingDispatchTable from './pk-pending-dispatch-table';
import { constructSrUniqueAttrs } from './sr-attrs.helper';
import dayjs from "dayjs";

const { Option } = Select;
export const PkPendingDispatchPage = () => {
  const [selectedManufacturingOrder, setSelectedManufacturingOrder] = useState<string[]>([]);
  const [fetchedData, setFetchedData] = useState<PkIPendingDHeader[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState("");
  const [isUpdateShippingModalVisible, setIsUpdateShippingModalVisible] = useState(false);

  const [plannedDispatchDate, setPlannedDispatchDate] = useState(null);
  const [selectedShippingRequest, setSelectedShippingRequest] = useState<PkIPendingDHeader | null>(null);
  const [vendorsData, setVendorsData] = useState<VendorModel[]>([]);
  const [selectedReqNo, setSelectedReqNo] = useState<number | string>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const manufacturingOrderService = new OrderManipulationServices();
  const shippingRequestService = new PkShippingRequestService();
  const fgService = new PKMSFgWarehouseService();
  const vendorService = new VendorService()
  const user = useAppSelector((state) => state.user.user.user);
  const [form] = Form.useForm();
  const [manufacturingOrders, setManufacturingOrders] = useState<MoNumberResDto[]>([]);
  const preIntegrationServicePKMS = new PreIntegrationServicePKMS();


  useEffect(() => {
    getManufacturingOrders();
    getAllVendorsByCategory();
  }, []);

  useEffect(() => {
    if (isUpdateShippingModalVisible && selectedReqNo) {
      getVendorDetailsByShippingRequest();
    }
  }, [isUpdateShippingModalVisible, selectedReqNo]);


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
        const headerData: PkIPendingDHeader[] = [];
        let packlistIds: string[] = [];
        let packListCartoonIds: PackListCartoonIDs[] = [];
        resultData.forEach((item) => {
          // Initialize total values for the header
          let totalFgs = 0;
          let totalCartons = 0;
          const srAttrs = constructSrUniqueAttrs(item.shippingReqItems.map(r => r.srItemAttrModel));
          // Array to store the inline data (Pending_D_Inline)
          const inlineData: PkIPendingDInline[] = [];

          // Loop through each shipping request item and calculate totals
          item.shippingReqItems.forEach((reqItem) => { //get the array of packlist ids
            packlistIds = reqItem.packListIds;
            packListCartoonIds = reqItem.packListCartoonIds;
            const attr = reqItem.srItemAttrModel;
            const cutNumbers = attr?.poNos || [];
            const totalBagNos = attr?.coNos || [];
            const ctns = Number(attr?.totalCartons) || 0;
            const fgs = Number(attr?.totalFgs) || 0;
            // Calculate total cuts and bags
            totalCartons += ctns;
            totalFgs += fgs;
            // Create inline data for each shipping request item
            const inlineItem: PkIPendingDInline = {
              MO: reqItem.srItemAttrModel?.moNo,
              poNo: reqItem.srItemAttrModel?.poNos?.toString(),
              styles: reqItem.srItemAttrModel?.styles?.toString(),
              buyers: reqItem.srItemAttrModel?.buyers?.toString(),
              destinations: reqItem.srItemAttrModel?.destinations?.toString(),
              delDates: reqItem.srItemAttrModel?.delDates?.toString(),
              drReqNo: reqItem.drReqNo,
              packlistIds: packlistIds,
              srId: reqItem.id,
              packListCartoonIds: packListCartoonIds,
              fgOutReqCreated: reqItem.fgOutReqCreated

            };

            // Push inline data to the array
            inlineData.push(inlineItem);
          });

          // header data
          const newHeaderData: PkIPendingDHeader = {
            id: item.id,
            reqNo: item.srNo || '', // Default to empty string if undefined
            totalCartons: totalCartons,
            totalFgs: totalFgs,
            styles: srAttrs.styles,
            vpo: srAttrs.poNos,
            moNos: srAttrs.moNos,
            buyers: srAttrs.buyers,
            chid: inlineData,
            approveStatus: item.approvalStatus,
            delDates: srAttrs.delDates,
            destinations: srAttrs.dests,
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





  const renderProducts = (item: PkIPendingDHeader) => {
    let child = item.chid || [];
    return (
      <>
        <PkPendingDispatchTable
          childData={child}
          getShippingRequestByFilterRequest={getShippingRequestByFilterRequest}
          selectedManufacturingOrder={selectedManufacturingOrder}
          approveStatus={item.approveStatus}
        />
      </>
    );
  };


  const handleDelete = async (record: PkIPendingDHeader) => {
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

  const getPlCartonsLocationsInfo = async (plIds: number[], packListCartoonIDs?: PackListCartoonIDs[]): Promise<{ totalCtns: number, totalOutCtns: number }> => {
    const req = new FgWhSrIdPlIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, plIds, '', false, false, false, false, false, [], [], [PkmsFgWhReqTypeEnum.IN])
    const res = await fgService.getFgWhInfoForGivenPackListIds(req);
    if (res.status) {
      const data = res.data;
      let totalCartons = 0;
      let totalLocOutCartons = 0;
      data.forEach(d => {
        d.whReqItems.forEach(i => {
          totalCartons += i.cartonsAbstract.totalCartons;
          totalLocOutCartons += i.cartonsAbstract.fgOutCartons;
        })
      })
      return { totalCtns: totalCartons, totalOutCtns: totalLocOutCartons };
    } else {
      AlertMessages.getErrorMessage(res.internalMessage);
      return null;
    }
  }

  const handleApprove = async (record: PkIPendingDHeader) => {
    try {
      const srId = Number(record.id);

      const plIds = new Set<number>();
      record.chid.forEach(r => r.packlistIds.forEach(p => { plIds.add(Number(p)) }));
      const whCartonsAbstract = await getPlCartonsLocationsInfo(Array.from(plIds));
      if (!whCartonsAbstract) {
        AlertMessages.getErrorMessage('Unable to validate for cartons WH out confirmation');
        return;
      }
      if (whCartonsAbstract.totalCtns > whCartonsAbstract.totalOutCtns) {
        AlertMessages.getErrorMessage(`Total cartons for shipment: ${whCartonsAbstract.totalCtns}. Only ${whCartonsAbstract.totalOutCtns} are taken out from WH. Please pick out the remaining cartons`);
        return;
      }
      // first check if the FG wh requests created / or if the cartons are not in WH

      const reqObj = new PkShippingRequestIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [srId], remarks, false, false, false, false);
      const deleteResponse = await shippingRequestService.approveShippingRequest(reqObj);
      if (deleteResponse.status) {
        getShippingRequestByFilterRequest(selectedManufacturingOrder)
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


  const handleReject = async (record: PkIPendingDHeader) => {
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
  const renderHeader = (record: PkIPendingDHeader) => {
    const isApproved = record.approveStatus !== PkShippingRequestProceedingEnum.OPEN;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%" }}>
        <Space size="small" wrap>
          <Col>Req No : <Tag color="black">{record.id}</Tag></Col>
          <Col>VPO : <Tag color="black">{record.vpo}</Tag></Col>
          <Col>Buyers : <Tag color="black">{record.buyers}</Tag></Col>
          <Col>Delivery : <Tag color="black">{SequenceUtils.deliveryDatesMethod(record.delDates)}</Tag></Col>
          <Col>Destination : <Tag color="black">{record.destinations}</Tag></Col>
          <Col>Total Cartons : <Tag color="black">{record.totalCartons}</Tag></Col>
          <Col>Total FG Qty : <Tag color="black">{record.totalFgs}</Tag></Col>
        </Space>
        <Space size="small" wrap>
          <Popconfirm
            onConfirm={e => { e.stopPropagation(); handleDelete(record); }}
            onCancel={e => e.stopPropagation()}
            title={"Are you sure to Delete Dispatch request ?"}>
            <Button type="primary" size="small" onClick={(e) => { e.stopPropagation(); }} icon={<DeleteOutlined />} danger disabled={isApproved} />
          </Popconfirm>
          <Button type="primary" size="small" className='btn-yellow'
            onClick={(e) => { e.stopPropagation(); setIsUpdateShippingModalVisible(true); setSelectedReqNo(record.id); }}>Update Shipping Info</Button>

          <Button type="primary" size="small" className='btn-green'
            disabled={isApproved}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedShippingRequest(record);  // Set the selected shipping request
              setIsApproveModalVisible(true);   // Open the modal
              setRemarks(undefined)
            }}
          >Approve</Button>



          {/* const showAddToBagModal = (record: PkShipmentData) => {
             setIsDrawerOpen(true);
           }; */}
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

  const getVendorDetailsByShippingRequest = async () => {
    try {
      const reqModel = new VendorDetailsReq(
        Number(selectedReqNo),
        user?.orgData?.unitCode,
        user?.orgData?.companyCode
      );

      const vendorResponse = await shippingRequestService.getVendorDetailsByShippingRequest(reqModel);

      if (vendorResponse.status && vendorResponse.data) {
        const vendor = vendorResponse.data;

        form.setFieldsValue({
          vendor: vendor.vendorId,
          shippingInfo: vendor.shippingInfo,
          remarks: vendor.remarks,
          plannedDate: vendor.planningDispatchDate ? dayjs(vendor.planningDispatchDate) : null,
        });
      } else {
        form.resetFields();
      }
    } catch (err) {
      form.resetFields();
      AlertMessages.getErrorMessage(err.message)
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
        <Form layout="horizontal">
          <Row gutter={[24, 24]} >
            <Col xs={24} sm={24} md={9} lg={8} xl={8}>
              <Form.Item label="Select Manufacturing Order" name="manufacturingOrder" rules={[{ required: true, message: "Select MO/Plant Style Ref" }]} style={{ marginBottom: 0 }}>
                <Select
                  style={{ width: "300px" }}
                  mode="multiple"
                  onChange={e => setSelectedManufacturingOrder(e)}
                  placeholder="Select MO/Plant Style Ref"
                  filterOption={(input, option) => (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
                >
                  {manufacturingOrders.map((moList) =>
                    <Select.Option value={moList.moId} key={moList.moId}>{moList.moNumber}</Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary"  onClick={searchShippableSet}>Search</Button>
            </Col>
          </Row>
        </Form>

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
      <Modal title="Approve"
        open={isApproveModalVisible}
        onOk={() => handleApprove(selectedShippingRequest)}
        onCancel={() => setIsApproveModalVisible(false)
        }
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
          <Form.Item label="Buyer" required name='vendor' rules={[{ required: true, message: 'Please select a vendor.' }]}>
            <Select style={{ width: "100%" }}
              placeholder="Select Buyer"
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
            <Input.TextArea readOnly rows={4} />
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

export default PkPendingDispatchPage;