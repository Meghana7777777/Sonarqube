import { CommonRequestAttrs, ProcessTypeEnum, OpFormEnum, ItemsInfoModel, processTypeEnumDisplayValues } from "@xpparel/shared-models";
import { AssetManagementService, ComponentServices, MachineTypeService } from "@xpparel/shared-services";
import { Button, Col, Form, FormInstance, Input, Row, Select } from "antd"
import { useEffect, useState } from "react";

interface IProductType {
    selectedRecord?: any;
    formRef: FormInstance<any>
    initialvalues: any;
    opId: any;
}
export const OperationsForm = (props: IProductType) => {
    const [intialValues, setInitialvalues] = useState<any>()
    const { initialvalues, formRef, opId } = props;
    const { Option } = Select;
    const service = new MachineTypeService();
    const [resData, setResData] = useState<ItemsInfoModel[]>([]);
    useEffect(() => {
        if (intialValues) {
            formRef.setFieldsValue(intialValues)
        } else {
            formRef.resetFields();
        }
    }, [intialValues])
    useEffect(() => {
        getAllMachineNames()
    }, [])
    const getAllMachineNames = () => {
        service.getAllItems().then(res => {
            if (res.status) {
                setResData(res.data);

            }
        }).catch(err => {
            console.log(err.message)
        })
    }
    return <>
        <Form form={formRef} initialValues={initialvalues} layout="vertical">
            <Form.Item style={{ display: 'none' }} name="id">
                <Input type="hidden" />
            </Form.Item>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Operation Id"
                        name="opCode"
                        rules={[{ required: true, message: 'Enter the Operation Id' }]}>
                        <Input disabled={opId} placeholder="Please Enter Operation Id" />
                    </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="External operation Id"
                        name="eOpCode"
                        rules={[{ required: true, message: 'Enter the External operation Id' }]}>
                        <Input placeholder="Please Enter External operation Id" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Operation Name"
                        name="opName"
                        rules={[{ required: true, message: 'Enter the Operation Name' }]}>
                        <Input placeholder="Please Enter Operation Name" />
                    </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Operation Category"
                        name="opCategory"
                        rules={[{ required: false, message: 'Select the Operation Category' }]}>
                        <Select placeholder="Please Select Operation Category" value={ProcessTypeEnum} optionFilterProp="children" showSearch allowClear>
                            {Object.keys(ProcessTypeEnum).map(key => (
                                <option key={key} value={key}>
                                    {processTypeEnumDisplayValues[key]}
                                </option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }} >
                    <Form.Item
                        label="Operation Form"
                        name="opForm"
                        rules={[{ required: false, message: 'Select the Operation Form' }]}>
                        <Select placeholder="Please Select Operation Form" value={OpFormEnum} optionFilterProp="children" showSearch allowClear>
                            {Object.values(OpFormEnum).map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        label="Machine Name"
                        name="machineName"
                        rules={[{ required: false, message: 'Select the Machine Name' }]}>

                        <Select mode="multiple" placeholder="Please select Machine Name" value={resData} defaultValue={initialvalues?.itemName}>
                            {resData.map((value) => (
                                <Option key={value.itemId} value={value.itemName}>
                                    {value.itemName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </>

}

export default OperationsForm