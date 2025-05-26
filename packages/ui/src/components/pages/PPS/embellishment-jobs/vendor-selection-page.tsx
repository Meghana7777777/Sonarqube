
import { VendorModel } from "@xpparel/shared-models";
import { Form, Select, Button, Descriptions } from 'antd';
import { useEffect, useState } from "react";

interface IProps {
    venderInfo: VendorModel[];
    buttonText?: string;
    updateVendorDetails: (v: VendorModel) => void;
}
const VendorSelectionPage = (props: IProps) => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const [selectedVendor, setSelectedVendor] = useState<VendorModel>(undefined);

    const onFinish = () => {
        props.updateVendorDetails(selectedVendor)
    };
    const changeVendor = (vendorId: number) => {
        const v = props.venderInfo.find(e => e.id == vendorId);
        setSelectedVendor(v);
    }
    const renderItems = (vendorInfo: VendorModel) => {
        return [
            {
                key: '1',
                label: 'Vendor Code',
                children: vendorInfo.vCode
            },
            {
                key: '2',
                label: 'Vendor Name',
                children: vendorInfo.vName
            },
            {
                key: '3',
                label: 'Vendor Description',
                children: vendorInfo.vDesc
            },
            {
                key: '4',
                label: 'Vendor Country',
                children: vendorInfo.vCountry
            },
            {
                key: '5',
                label: 'Vendor Place',
                children: vendorInfo.vPlace
            }
        ]
    }
    return <>
        <Form form={form} onFinish={onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <Form.Item name="vendor" label="Select Vendor" rules={[{ required: true, message: 'Please select an vendor' }]}>
                <Select placeholder="Select Vendor"
                    onChange={changeVendor}
                    optionFilterProp="label"
                    showSearch
                    allowClear

                >
                    {props.venderInfo.map(v => <Option label={v.vName} key={v.id} value={v.id}>{v.vName}</Option>)}
                </Select>
            </Form.Item>
            {selectedVendor ? <><Descriptions title="" bordered size="small"
                column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={renderItems(selectedVendor)} /> <br /></> : null}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" disabled={!selectedVendor}>
                    {props.buttonText ? props.buttonText : 'View Labels'}
                </Button>
            </Form.Item>
        </Form>
    </>
}

export default VendorSelectionPage;