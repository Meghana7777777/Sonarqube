import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { GenericOptionsTypeEnum, InputTypesEnum } from "@xpparel/shared-models";
import { Form, Input, Row, Col, Button, Select, Radio, Divider, Space, InputRef } from "antd";
import { FormInstance } from "antd/lib";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface IProps {
  formRef: FormInstance<any>;
  initialValues?: any;
  enumOptionItems: string[];
  setEnumOptionItems: Dispatch<SetStateAction<string[]>>
}

export const AttributesMasterForm: React.FC<IProps> = ({ formRef, initialValues, enumOptionItems, setEnumOptionItems }) => {
  const [dropDownType, setDropDownType] = useState<boolean>(false);
  const [optionsSource, setOptionsSource] = useState<GenericOptionsTypeEnum>()
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);


  useEffect(() => {
    if (initialValues) {
      formRef.setFieldsValue(initialValues);
      inputTypeOnchange(initialValues?.inputType);
      if (initialValues?.optionsType === GenericOptionsTypeEnum.ENUM) {
        setEnumOptionItems(initialValues?.optionsSource);
      } else {
        initialValues.optionsSource = initialValues?.optionsSource?.[0]
      }
      setOptionsSource(initialValues?.optionsType)
    }
  }, [JSON.stringify(initialValues)]);



  const inputTypeOnchange = (inputType: InputTypesEnum) => {
    if (inputType === InputTypesEnum.Select) {
      setDropDownType(true);
    } else {
      setDropDownType(false);
      setOptionsSource(undefined);
      setEnumOptionItems([])
      formRef.setFieldValue('optionsSource', undefined)
      formRef.setFieldValue('optionsType', undefined)
    }

  }

  return (
    <Form form={formRef} layout="vertical" >
      <Form.Item name="id" hidden />

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter a name" }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Label Name" name="labelName" rules={[{ required: true, message: "Please enter a label name" }]}>
            <Input placeholder="Enter label name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Input Type"
            name="inputType"
            rules={[{ required: true, message: "Please select an input type" }]}

          >
            <Select
              allowClear
              filterOption={(input, option) => (option!.children as unknown as string).toString().toLocaleLowerCase().includes(input.toLocaleLowerCase())}
              placeholder="Select Input Type"
              onChange={(value: InputTypesEnum) => {
                inputTypeOnchange(value)
              }}

            >
              {Object.values(InputTypesEnum).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {
          dropDownType && <Col span={12}>
            <Form.Item
              label="Options Type"
              name="optionsType"
              rules={[{ required: true, message: "Please select an Options Type" }]}

            >
              <Select
                placeholder="Select Options Type"
                onChange={(value: GenericOptionsTypeEnum) => {
                  setOptionsSource(value);
                  formRef.setFieldValue('optionsSource', undefined)
                }}

              >
                {Object.values(GenericOptionsTypeEnum).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        }
        {
          (dropDownType && optionsSource === GenericOptionsTypeEnum.ENUM) && <>
            <Col span={16}>
              <Form.Item
                label={'Option Source'}
                name={'optionsSource'}

              >
                <Select
                  mode='multiple'
                  allowClear
                  value={enumOptionItems}
                  placeholder={'Please Add Items'}
                  onChange={(e) => {
                    setEnumOptionItems(e)
                  }}
                  dropdownRender={(menu) => {
                    return <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                          ref={inputRef}
                          value={name}
                          placeholder="Please enter item"
                          onKeyDown={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            setName(e.target.value)
                          }}
                        />
                        <Button type='primary' icon={<PlusOutlined />}
                          onClick={() => {
                            setEnumOptionItems((prev) => {
                              const p = [...prev]
                              if (name) {
                                p.push(name);
                              }
                              formRef.setFieldValue('optionsSource', p)
                              return p
                            });
                            setName('')
                            setTimeout(() => {
                              inputRef.current?.focus();
                            }, 0);
                          }}

                        />
                        <Button
                          type='primary'
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => {
                            setEnumOptionItems([]);
                            formRef.setFieldValue('optionsSource', [])

                          }}
                        />
                      </Space>
                    </>
                  }}
                >
                  {enumOptionItems.map((rec) => {
                    return <Select.Option

                      value={rec}
                    >
                    </Select.Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
          </>
        }
        {
          (dropDownType && optionsSource === GenericOptionsTypeEnum.API) && <>
            <Col span={24}>
              <Form.Item
                label={'Option Source'}
                name={'optionsSource'}>
                <Input.TextArea
                  placeholder="Please Enter Api"
                >
                </Input.TextArea>
              </Form.Item>
            </Col>

          </>
        }

        <Col span={12}>
          <Form.Item label="Required Field" name="requiredField" rules={[{ required: true, message: "Please select an option" }]}>
            <Select placeholder="Select Required Field">
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Placeholder" name="placeHolder">
            <Input placeholder="Enter placeholder (optional)" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Validation Message" name="validationMessage">
            <Input placeholder="Enter validation message (optional)" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Max Length"
            name="maxLength"
            rules={[{ required: false, message: "Please enter max length" }]}
          >
            <Input type="number" placeholder="Enter max length" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Min Length"
            name="minLength"
            rules={[{ required: false, message: "Please enter min length" }]}
          >
            <Input type="number" placeholder="Enter min length" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Hidden"
            name="hidden"
          >
            <Radio.Group
              defaultValue={false}
            >
              <Radio value={true}>{'YES'}</Radio>
              <Radio value={false}>{'NO'}</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Disable"
            name="disabled"
          >
            <Radio.Group
              defaultValue={false}
            >
              <Radio value={true}>{'YES'}</Radio>
              <Radio value={false}>{'NO'}</Radio>
            </Radio.Group>

          </Form.Item>
        </Col>

      </Row>
    </Form>
  );
};

export default AttributesMasterForm;
