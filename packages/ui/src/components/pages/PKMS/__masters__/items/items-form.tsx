import { MaterialTypeEnum, MaterialTypeRequestModel } from "@xpparel/shared-models";
import { MaterialTypeService } from "@xpparel/shared-services";
import { Col, Form, FormInstance, Input, InputNumber, message, Row, Select } from "antd";
import { useEffect, useState } from "react";

interface ItemsProps {
  formRef: FormInstance<any>;
  initialValues: any;
  category: MaterialTypeEnum;
}

const { Option } = Select;

export const ItemsForm = (props: ItemsProps) => {
  const { formRef, initialValues, category } = props;
  const service = new MaterialTypeService();
  const [Items, setItems] = useState<MaterialTypeRequestModel[]>([]);
  const [selectItem, setSelectItem] = useState<any[]>([]);

  useEffect(() => {
    if (initialValues) {
      formRef.setFieldsValue({ ...initialValues, category });
    }
    getMaterialsToItems();
  }, [initialValues]);

  const getMaterialsToItems = () => {
    service.getMaterialsToItems()
      .then((res) => {
        if (res.status) {
          setItems(res.data);
        } else {
          setItems([]);
          message.error(res.internalMessage, 4);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (category) {
      formRef.setFieldsValue({ category });
    }
  }, [category]);

  return (
    <>
      <Form form={formRef} layout="vertical">
        <Form.Item name={'id'} hidden>
          <Input />
        </Form.Item>

        <Form.Item name={'category'} hidden initialValue={category}>
          <Input defaultValue={category} />
        </Form.Item>

        <Form.Item name={'dimensionId'} hidden >
          <Input />
        </Form.Item>

        <Row>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item name={'code'} label={'Code'} rules={[{ required: true }]}>
              <Input placeholder="Code" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7} offset={1}>
            <Form.Item name={'desc'} label={'Description'} rules={[{ required: true }]}>
              <Input placeholder="Description" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7} offset={1}>
            <Form.Item
              name={'materialType'}
              label={'Material Type'}
              rules={[{ required: true, message: 'Please select Material Type' }]}
            >
              <Select
                placeholder={'Material Type'}
                onChange={(value) => setSelectItem(value)}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option!.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {Items?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.materialTypeDesc}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {[MaterialTypeEnum.CARTON, MaterialTypeEnum.POLY_BAG].includes(category) && (
          <Row>
            <Col xs={24} sm={24} md={7} lg={7} xl={7}>
              <Form.Item name={'length'} label={'Length'} rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} placeholder="Length" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={7} lg={7} xl={7} offset={1}>
              <Form.Item name={'width'} label={'Width'} rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} placeholder="Width" min={0} />
              </Form.Item>
            </Col>
            {MaterialTypeEnum.CARTON === category && (
              <Col xs={24} sm={24} md={7} lg={7} xl={7} offset={1}>
                <Form.Item name={'height'} label={'Height'} rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="Height" min={0} />
                </Form.Item>
              </Col>
            )}
          </Row>
        )}
      </Form>
    </>
  );
};

export default ItemsForm;
