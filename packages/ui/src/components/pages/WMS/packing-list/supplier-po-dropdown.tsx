import { CommonRequestAttrs, SupplierPoModel, SupplierCodeReq, SupplierPoSummaryModel, SupplierInfoModel } from '@xpparel/shared-models';
import { PackingListService, PreIntegrationService, SupplierServices } from '@xpparel/shared-services';
import { Card, Col, Descriptions, Form, FormInstance, Row, Select } from 'antd';
import { useAppSelector } from '../../../../common';
import React, { Children, useEffect, useState } from 'react';
import POSummery from './po-summery';

interface ISupplierPoDropDownComponentProps {
  formRef: FormInstance<any>;
  getItemCodes: (spoCode: string) => void
}

const { Option } = Select;
export const SupplierPoDropDownComponent = (props: ISupplierPoDropDownComponentProps) => {
  const { formRef, getItemCodes } = props;
  const [pendingPosData, setPendingPosData] = useState<SupplierInfoModel[]>([]);
  const [poSummery, setPoSummery] = useState<SupplierPoSummaryModel>()
  const user = useAppSelector((state) => state.user.user.user);

  const service = new PackingListService();
  const preIntegrationService: PreIntegrationService = new PreIntegrationService()
  const supplierServices: SupplierServices = new SupplierServices()

  useEffect(() => {
    getPendingSupplierPoData();
  }, []);

  const getPendingSupplierPoData = () => {
    const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    supplierServices
      .getAllSuppliersData(req)
      .then((res) => {
        if (res.status) {
          setPendingPosData(res.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getPoSummaryForSupplier = (spoCode: string) => {
    const req = new SupplierCodeReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, spoCode);
    service
      .getPoSummaryForSupplier(req)
      .then((res) => {
        if (res.status) {
          setPoSummery(res.data[0]);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };




  const handleSupplierCodeChange = (value, option) => {
    formRef.setFieldValue('supplierName', option?.children?.[2]);
    getItemCodes(value);
    getPoSummaryForSupplier(value);
  };

  return (
    <div>
      <Form form={formRef} layout='horizontal'>
        <Row justify="space-between">

          <Form.Item name={'supplierName'} hidden></Form.Item>
          <Col xs={24} sm={{ span: 16, offset: 2 }} md={{ span: 16, offset: 2 }} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }} xxl={{ span: 16, offset: 2 }}>
            <Form.Item name="supplierCode" label="Supplier Code" rules={[{ required: true, message: 'Select Supplier Code' }]}>
              <Select

                placeholder="Select Supplier Code" style={{ width: '100%' }} onChange={handleSupplierCodeChange}
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => (option!.children as unknown as string).toString().toLocaleLowerCase().includes(input.toLocaleLowerCase())}>
                {pendingPosData.map((data) => {
                  return <Option value={data.supplierCode}>{data.supplierCode}-{data.supplierName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col xs={24} sm={{ span: 16, offset: 2 }} md={{ span: 16, offset: 2 }} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }} xxl={{ span: 16, offset: 2 }}>
          {poSummery && <POSummery poSummeryData={poSummery} />
          }
        </Col>
      </Row>
    </div>
  );
};

export default SupplierPoDropDownComponent;
