import { EmbJobNumberRequest, PoEmbHeaderModel, PoSerialWithEmbPrefRequest, PoSummaryModel, RawOrderNoRequest, SoListModel, SoListRequest, SoStatusEnum, VendorCategoryEnum, VendorCategoryRequest, VendorModel } from "@xpparel/shared-models";
import { EmbRequestHandlingService, OrderManipulationServices, POService, VendorService } from "@xpparel/shared-services";
import { Button, Card, Col, Collapse, CollapseProps, Form, Modal, Row, Select, Space, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import EmbellishmentJobsGrid from "./embellishment-jobs-grid";
import React from "react";
import EmbellishmentPrintSheet from "./embellishment-print-sheet";
import { getCssFromComponent } from "../../WMS";

const EmbellishmentJobsPage = () => {
   useEffect(() => {
      getListOfSo();
      getVendorInfo();
   }, [])
   const user = useAppSelector((state) => state.user.user.user);
   const [saleOrders, setSaleOrders] = useState<SoListModel[]>([]);
   const [poS, setPos] = useState<PoSummaryModel[]>([]);
   const [stateKey, setStateKey] = useState<number>(0);
   const [poSerial, setPoSerial] = useState<number>(undefined);
   const [embInfo, setEmbInfo] = useState<PoEmbHeaderModel[]>([]);
   const [embInfoOfEmb, setEmbInfoOfEmb] = useState<PoEmbHeaderModel[]>([]);
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [vendorInfo, setVendorInfo] = useState<VendorModel[]>([]);
   //Selected PO Summary
   const [poSUmmary, setPoSummary] = useState<PoSummaryModel>(undefined);
   const orderManipulationServices = new OrderManipulationServices();
   const pOService = new POService();
   const embRequestHandlingService = new EmbRequestHandlingService();
   const vendorService = new VendorService();
   const [form] = Form.useForm();
   const { Option } = Select;
   /**
    * Get Sale Orders
    */
   const getListOfSo = () => {
      const req = new SoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, SoStatusEnum.IN_PROGRESS);
      orderManipulationServices.getListOfSo(req).then((res => {
         if (res.status) {
            setSaleOrders(res.data);
         } else {
            AlertMessages.getErrorMessage(res.internalMessage);
         }
      })).catch(error => {
         AlertMessages.getErrorMessage(error.message)
      });
   }

   const getVendorInfo = () => {
      const req = new VendorCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, VendorCategoryEnum.EMBELLISHMENT);
      vendorService.getAllVendorsByVendorCategory(req).then((res => {
         if (res.status) {
            setVendorInfo(res.data);
         } else {
            AlertMessages.getErrorMessage(res.internalMessage);
         }
      })).catch(error => {
         AlertMessages.getErrorMessage(error.message)
      });
   }

   const changeSaleOrder = (saleOrderId: number) => {
      form.resetFields(['productionOrder']);
      setPos([]);
      const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, null, saleOrderId, undefined, undefined, undefined, false, false, false, false, false);
      pOService.getPosForSo(req).then((res => {
         if (res.status) {
            setPos(res.data);
         } else {
            AlertMessages.getErrorMessage(res.internalMessage);
         }
      })).catch(error => {
         AlertMessages.getErrorMessage(error.message)
      });
   }
   /**
    * Call this function when click on Submit Button
    */
   const getEmbJobsForPo = (fromValues) => {
      const { productionOrder } = fromValues;
      setPoSerial(productionOrder);
      setPoSummary(poS.find(e => e.poSerial == productionOrder));
      const req = new PoSerialWithEmbPrefRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, productionOrder, true, true, false);
      embRequestHandlingService.getEmbJobsForPo(req).then((res => {
         if (res.status) {
            setEmbInfo(res.data);
            setStateKey(preState => preState + 1);
         } else {
            AlertMessages.getErrorMessage(res.internalMessage);
         }
      })).catch(error => {
         AlertMessages.getErrorMessage(error.message)
      });
   }

   const constructItems = (embData: PoEmbHeaderModel[]) => {
      const items: CollapseProps['items'] = embData.map((e, i) => {
         const totalBundles = e.embLines.reduce((acc, embLine) => acc + embLine.quantity, 0);
         return {
            key: i,
            label: <Space align="baseline"> <span>Emb Number : <Tag color="black">{e.embJobNumber}</Tag></span> | <span>Total Plan Quantity: <Tag color="black">{e.plannedJobQty}</Tag></span>| <span>Total Bundles: <Tag color="black">{totalBundles}</Tag></span>| <span>Docket: <Tag color="black">{e.docketGroup}</Tag></span> | <span>Product Name: <Tag color="black">{e.productName}</Tag></span></Space>,
            children: <EmbellishmentJobsGrid poSerial={poSerial} style={poSUmmary ? poSUmmary.style : ''} venderInfo={vendorInfo} embJobNumber={e.embJobNumber} key={stateKey + 1 + 'it' + i} embJobLines={e.embLines} />,
            extra: <Button size="small" className="btn-yellow" onClick={(event) => { event.stopPropagation(); getEmbDataForEmb(e.embJobNumber) }}>View Bundle Sheet</Button>
         }
      })
      return items;
   }
   const getEmbDataForEmb = (embJobNumber: string) => {
      const req = new EmbJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, embJobNumber, undefined, undefined, true, true, true);
      embRequestHandlingService.getEmbJobsForEmbJobNumber(req).then(res => {
         if (res.status) {
            for (const embJob of res.data) {
               if (embJob.embLines.length == 0) {
                  AlertMessages.getErrorMessage('Cut reporting is not yet done to get the bundles');
                  return false;
               }
            }
            setEmbInfoOfEmb(res.data);
            setModalVisible(true);
         } else {
            AlertMessages.getErrorMessage(res.internalMessage);
         }
         return true;
      }).catch(error => {
         AlertMessages.getErrorMessage(error.message)
      });
   }
   const closeModel = () => {
      setModalVisible(false);
   };
   const printBundle = () => {
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
      setModalVisible(false);
   }
   return <>
      <Card title='Embellishment Job Print' size="small">
         <Form form={form} onFinish={getEmbJobsForPo} layout="horizontal">
            <Row gutter={[16, 16]}>
               <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                  <Form.Item label="SO/Plant Style Ref" name="saleOrder" rules={[{ required: true, message: 'SO/Plant Style Ref' }]}>
                     <Select
                        placeholder='Select Sale Order'
                        onChange={changeSaleOrder}
                        filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                        showSearch
                     >
                        {saleOrders.map(soList => {
                           return <Option value={soList.orderId} key={`${soList.orderId}`}>{soList.plantStyle ? soList.orderNo + ' - ' + soList.plantStyle : soList.orderNo}</Option>
                        })}
                     </Select>
                  </Form.Item>
               </Col>
               <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                  <Form.Item label="Select Cut Order" name="productionOrder" rules={[{ required: true, message: 'Select Cut Order' }]}>
                     <Select placeholder='Select Cut Order' showSearch optionFilterProp="label">
                        {poS.map((poObj, i) => <Option key={`s` + i} label={`${poObj.poSerial}-${poObj.poDesc}`} value={poObj.poSerial}>{poObj.poSerial}-{poObj.poDesc}</Option>)}
                     </Select>
                  </Form.Item>
               </Col>
               <Col>
                  <Form.Item>
                     <Button type="primary" htmlType="submit">
                        Submit
                     </Button>
                  </Form.Item>
               </Col>
            </Row>
         </Form>
         <br />
         <br />
         <Row>
            <Collapse
               expandIconPosition='end'
               size="small"
               key={stateKey + 1 + 'r'}
               // onChange={changeCollapse}
               style={{ width: '100%' }}
               expandIcon={({ isActive }) => isActive ? < MinusOutlined style={{ fontSize: '20px' }} /> : <  PlusOutlined style={{ fontSize: '20px' }} />} defaultActiveKey={[]} bordered items={constructItems(embInfo)} />
         </Row>
      </Card>
      <Modal
         className='print-docket-modal'
         key={'modal' + Date.now()}
         width={'800px'}
         style={{ top: 0 }}
         open={modalVisible}
         title={<React.Fragment>
            <Row>
               <Col span={12}>
                  Print Bundle Sheet
               </Col>
               <Col span={10} style={{ textAlign: 'right' }}>
                  <Button type='primary' onClick={() => printBundle()}>Print</Button>
               </Col>
            </Row>
         </React.Fragment>}
         onCancel={closeModel}
         footer={[
            <Button key='back' onClick={closeModel}>
               Cancel
            </Button>,
         ]}
      >
         <EmbellishmentPrintSheet embJobInfo={embInfoOfEmb} poSummary={poS.find(e => e.poSerial == poSerial)} />
      </Modal>
   </>
}

export default EmbellishmentJobsPage;