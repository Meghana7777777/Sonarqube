import { ActualDocketBasicInfoModel, LayIdsRequest, PoCutModel, PoSerialWithCutPrefRequest, PoSummaryModel, RawOrderNoRequest, SoListModel, SoListRequest, SoStatusEnum } from "@xpparel/shared-models";
import { CutGenerationServices, LayReportingService, OrderManipulationServices, POService } from "@xpparel/shared-services";
import { Button, Card, Col, Collapse, CollapseProps, Divider, Form, Modal, Row, Select, Space, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import BundleTagGrid from "./bundle-tag-grid";
import BundleTagPrintSheet from "./bundle-tag-print-sheet";
import React from "react";
import { getCssFromComponent } from "../../WMS";

const BundleTagPage = () => {
   useEffect(() => {
      getListOfSo()
   }, [])
   const user = useAppSelector((state) => state.user.user.user);
   const [saleOrders, setSaleOrders] = useState<SoListModel[]>([]);
   const [poS, setPos] = useState<PoSummaryModel[]>([]);
   const [docketsInfo, setDocketsInfo] = useState<PoCutModel[]>([]);
   const [stateKey, setStateKey] = useState<number>(0);
   const [poSerial, setPoSerial] = useState<number>(undefined);
   const [actualDockets, setActualDockets] = useState<ActualDocketBasicInfoModel[]>([]);// View Bundle Sheets Data
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   //Selected PO Summary
   const [poSUmmary, setPoSummary] = useState<PoSummaryModel>(undefined);
   const orderManipulationServices = new OrderManipulationServices();
   const pOService = new POService();
   const cutGenerationServices = new CutGenerationServices();
   const layReportingService = new LayReportingService();
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
   const changeSaleOrder = (saleOrderId: number) => {
      form.resetFields(['productionOrder']);
      setPos([]);
      const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, saleOrderId, undefined, undefined, undefined, false, false, false, false, false);
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
   const getCutsInfo = (fromValues) => {
      const { productionOrder } = fromValues;
      setPoSerial(productionOrder);
      setPoSummary(poS.find(e => e.poSerial == productionOrder));
      const req = new PoSerialWithCutPrefRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, productionOrder, true, true, false, false, false, false);
      cutGenerationServices.getCutInfoForPo(req).then((res => {
         if (res.status) {
            setDocketsInfo(res.data);
            setStateKey(preState => preState + 1);
         } else {
            AlertMessages.getErrorMessage(res.internalMessage);
         }
      })).catch(error => {
         AlertMessages.getErrorMessage(error.message)
      });
   }

   const constructItems = (cutInfo: PoCutModel[]) => {
      const items: CollapseProps['items'] = cutInfo.map((c, i) => {
         const layIds = [];
         let totalShadeBundles = 0;
         let mainDocketNumber = '';
         c.actualDockets.forEach(ad => {
            if (ad) {
               totalShadeBundles += ad.isMainDoc ? ad.totalAdbs : 0;
               if (ad.isMainDoc) {
                  layIds.push(ad.layId);
                  mainDocketNumber = ad.docketNumber;
               }
            }
         })
         return {
            key: i,
            label: <Space align="baseline"> <span>Cut Number : <Tag color="black">{c.cutSubNumber}</Tag></span> | <span>Total Quantity: <Tag color="black">{c.planQuantity}</Tag></span>| <span>Total Shade Bundles: <Tag color="black">{totalShadeBundles}</Tag></span> | <span>Product Name: <Tag color="black">{c.productName}</Tag></span> </Space>,
            children: <BundleTagGrid poSerial={poSerial} style={poSUmmary ? poSUmmary.style : ''} key={stateKey + 1 + 'it' + i} cutInfo={c} />,
            extra: <Button size="small" className="btn-yellow" onClick={(event) => { event.stopPropagation(); viewBundleSheet(layIds, mainDocketNumber) }}>View Bundle Sheet</Button>
         }
      })
      return items;
   }
   const viewBundleSheet = (layIds: number[], mainDocketNumber: string) => {
      const req = new LayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, layIds, true, true, mainDocketNumber);
      layReportingService.getActualDocketInfo(req).then((res => {
         if (res.status) {
            if (res.data.length == 0) {
               AlertMessages.getErrorMessage('Cut reporting is not yet done to get the bundles');
               return false;
            }
            setActualDockets(res.data);
            setModalVisible(true);
         } else {
            AlertMessages.getErrorMessage(res.internalMessage);
         }
         return true;
      })).catch(error => {
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
      <Card title='Bundle Tag Print' size="small">
         <Form form={form} onFinish={getCutsInfo} layout="horizontal">
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
         <Row>
            <Collapse
               expandIconPosition='end'
               size="small"
               key={stateKey + 1 + 'r'}
               // onChange={changeCollapse}
               style={{ width: '100%' }}
               expandIcon={({ isActive }) => isActive ? < MinusOutlined style={{ fontSize: '20px' }} /> : <  PlusOutlined style={{ fontSize: '20px' }} />} defaultActiveKey={[]} bordered items={constructItems(docketsInfo)} />
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
         <BundleTagPrintSheet adBundles={actualDockets} poSummary={poS.find(e => e.poSerial == poSerial)} />
      </Modal>
   </>
}

export default BundleTagPage;