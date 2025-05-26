import { AttributesMasterModelDto, CommonRequestAttrs } from '@xpparel/shared-models';
import { MasterService } from '@xpparel/shared-services';
import { Col, Form, Input, Mentions, Row, Select } from 'antd';
import { FormInstance } from 'antd/lib';
import { useAppSelector } from 'packages/ui/src/common';
import React, { useEffect, useState } from 'react';
import { prop } from './global-config-grid';

interface IProps {
  formRef: FormInstance<any>;
  initialValues: any;
  dropdown: prop[];
  setSelectedAttributes: React.Dispatch<React.SetStateAction<AttributesMasterModelDto[]>>;
  attributesData: AttributesMasterModelDto[]
}

const { Option } = Select

export const GlobalConfigForm = (props: IProps) => {
  const { formRef, initialValues, dropdown, setSelectedAttributes, attributesData } = props;

  useEffect(() => {
    if (initialValues) {
      formRef.setFieldsValue(initialValues);
      addSelectedAttributes(initialValues?.attributes)
    }
  }, [initialValues]);



  const addSelectedAttributes = (ids: number[]) => {
    const records = []
    for (const selectedId of ids) {
      records.push(attributesData.find((rec) => rec.id === selectedId))
    }
    setSelectedAttributes(records);
  }

  return (
    <Form form={props.formRef} layout="vertical">
      {/* Hidden Field for 'id' */}
      <Form.Item label="ID" name="id" hidden></Form.Item>

      <Row gutter={16}>
        {/* Master Name Field */}
        <Col span={12}>
          <Form.Item label="Master Name" name="masterName" rules={[{ required: true, message: 'Master Name is required' }]}>
            <Input placeholder="Master Name" />
          </Form.Item>
        </Col>

        {/* Master Code Field */}
        <Col span={12}>
          <Form.Item label="Code Label" name="masterCode" rules={[{ required: true, message: 'Master Code is required' }]}>
            <Input placeholder="Master Code" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Master Label Field */}
        <Col span={12}>
          <Form.Item label="Name Label" name="masterLabel" rules={[{ required: true, message: 'Master Label is required' }]}>
            <Input placeholder="Master Label" />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item label="Parent" name="parentId">
            <Select
              style={{ width: '200px' }}
              placeholder="Select Parent ID"
              allowClear
              showSearch
              filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
            >
              {dropdown.map((rec => <Option
                value={rec.id}
                disabled={initialValues?.id === rec.id}
              >{rec.name}</Option>))}

            </Select>
          </Form.Item>
        </Col>

        {/* Parent ID as a Select dropdown */}
        <Col span={12}>
          <Form.Item label="Attributes" name="attributes" rules={[{ required: false, message: 'Attribute is required' }]}>
            <Select
              style={{ width: '200px' }}
              allowClear
              mode='multiple'
              showSearch
              filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
              placeholder={'Please Select Attributes'}
              onChange={(ids: number[]) => {
                addSelectedAttributes(ids)
              }}
            >
              {attributesData.map((rec) => {
                return <Select.Option
                  value={rec.id}
                > {rec.labelName}</Select.Option>
              })}
            </Select>

          </Form.Item>

        </Col>

      </Row>
    </Form >
  );
};

export default GlobalConfigForm;
