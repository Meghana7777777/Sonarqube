import { QualityTypeServices } from '@xpparel/shared-services';
import { Col, Form, FormInstance, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
export interface QualityCheckListFormProps {
    form: FormInstance<any>;
    selectedRecord?: any;
    initialvalues?: any
    qualityCheckListId?: any
}
const QualityCheckListForm = (props: QualityCheckListFormProps) => {

    const { Option } = Select
    const qualityService = new QualityTypeServices()
    const [qualityTypeData, setQualityTypeData] = useState<any[]>([]);
    const { form, qualityCheckListId, initialvalues, selectedRecord } = props;

    useEffect(() => {
        getAllQualityType();
    }, []);

    const getAllQualityType = () => {
        qualityService.getAllActiveQualityType().then(res => {
            if (res) {
                setQualityTypeData(res.data);
            } else {
                setQualityTypeData([]);
            }
        })
    }

    useEffect(() => {
        if (initialvalues) {
            form.setFieldsValue(initialvalues)
        } else {
            form.resetFields();
        }
    }, [initialvalues])

    return (
        <Form layout='vertical' form={form} initialValues={initialvalues}>
            <Row gutter={24}>

                <Form.Item name={'qualityCheckListId'} hidden>
                    <Input />
                </Form.Item>

                <Form.Item name={'versionFlag'} hidden>
                    <Input />
                </Form.Item>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item label="Quality Type"
                        name="qualityTypeId"
                        rules={[{ required: true, message: 'Quality Type Is Required' }]}>
                        <Select placeholder="Enter Quality Type" showSearch allowClear optionFilterProp='children'>
                            {qualityTypeData.map((rec) => {
                                return <Option key={rec.id} value={rec.id}>{rec.qualityType}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item label="Parameter" name="parameter">
                        <Input placeholder="Enter Parameter" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )


}
export default QualityCheckListForm;
