import { CommonRequestAttrs, MarkerCreateRequest, MarkerIdRequest, MarkerInfoModel, MarkerProdNameItemCodeModel, MarkerTypeModel, ProductNameItemsRequest } from "@xpparel/shared-models";
import { MarkerTypeService, PoMarkerService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "../../../common";
import { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Drawer, Form, Input, InputNumber, Popconfirm, Select, Space, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";


interface IRatio {
    ratioId: number;
    ratioCode: string;
    ratioDesc: string;
    markerId: number;
    iCodes: MarkerProdNameItemCodeModel[]
}
interface IProps {
    poSerialNo: number;
    ratio: IRatio;
    selectMarker: (markerId: number) => void;
}
const mockData: any = [
    {
        "id": 1,
        "poSerial": "5",
        "productName": "Pant-001",
        "itemCode": "F00283-204",
        "markerName": "m1",
        "markerVersion": "v1",
        "mLength": "12.32",
        "mWidth": "12.32",
        "patVer": null,
        "remarks1": "rem1",
        "remarks2": null,
        "markerType": "NR",
        "markerTypeId": "1",
        "clubMarker": true
    },
    {
        "id": 2,
        "poSerial": "5",
        "productName": "Pant-001",
        "itemCode": "F00283-204",
        "markerName": "pe",
        "markerVersion": "l",
        "mLength": "85.00",
        "mWidth": "8.00",
        "patVer": null,
        "remarks1": "4",
        "remarks2": "1\n",
        "markerType": "NARROW",
        "markerTypeId": "3",
        "clubMarker": false
    },
    {
        "id": 3,
        "poSerial": "5",
        "productName": "Pant-001",
        "itemCode": "F00572-853",
        "markerName": "p",
        "markerVersion": "l8",
        "mLength": "5.00",
        "mWidth": "5.00",
        "patVer": null,
        "remarks1": "5",
        "remarks2": "5",
        "markerType": "NR",
        "markerTypeId": "1",
        "clubMarker": false
    },
    {
        "id": 4,
        "poSerial": "5",
        "productName": "Pant-001",
        "itemCode": "F00283-204",
        "markerName": "p",
        "markerVersion": "Mou",
        "mLength": "5.00",
        "mWidth": "5.00",
        "patVer": null,
        "remarks1": "5",
        "remarks2": "5",
        "markerType": "NR",
        "markerTypeId": "1",
        "clubMarker": true
    },
    {
        "id": 5,
        "poSerial": "5",
        "productName": "Pant-001",
        "itemCode": "F00283-204",
        "markerName": "p",
        "markerVersion": "Mou",
        "mLength": "5.00",
        "mWidth": "5.00",
        "patVer": null,
        "remarks1": "5",
        "remarks2": "5",
        "markerType": "NR",
        "markerTypeId": "1",
        "clubMarker": true
    }
]
const EditRatioMarker = (props: IProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const markerService = new PoMarkerService();
    useEffect(() => {
        if (props.poSerialNo) {
            getPoMarkerByProdNameAndFabComb(props);
            getAllMarkerTypes();
        }
    }, []);
    console.log(props?props.ratio:0)
    const markerTypeService = new MarkerTypeService();
    const [markersData, setMarkersData] = useState<MarkerInfoModel[]>([]);
    const [markerTypes, setMarkerTypes] = useState<MarkerTypeModel[]>([]);
    const [selectedRowMarkerId, setSelectedMarkerId] = useState<any[]>([props?props.ratio.markerId:undefined]);
    const { Option } = Select;
    const [form] = Form.useForm();
    const [openForm, setOpenForm] = useState(false);
    const getAllMarkerTypes = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        markerTypeService.getAllMarkerTypes(req).then((res => {
            if (res.status) {
                setMarkerTypes(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getPoMarkerByProdNameAndFabComb = (props: IProps) => {
        const { poSerialNo, ratio } = props;
        const req = new ProductNameItemsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerialNo, ratio.iCodes);
        markerService.getPoMarkersByProdNameAndFabComb(req).then((res => {
            if (res.status) {
                setMarkersData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const deleteMarker = (markerId: number) => {
        const req = new MarkerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, markerId);
        markerService.deletePoMarker(req).then((res => {
            if (res.status) {
                getPoMarkerByProdNameAndFabComb(props);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }

    const openMarkerForm = () => {
        setOpenForm(true);
    }
    const onClose = () => {
        setOpenForm(false);
        form.resetFields();

    }
    const onFinish = (values) => {
        const { markerLength, markerName, markerType, markerVersion, markerWidth, patternVersion, remarks1, remarks2, endAllowance, perimeter } = values;
        const req = new MarkerCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, false, props.poSerialNo, props.ratio.iCodes, markerName, markerVersion, markerLength, markerWidth, patternVersion, remarks1, remarks2, markerType, markerType, endAllowance, perimeter);
        markerService.createPoMarker(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                onClose();
                getPoMarkerByProdNameAndFabComb(props);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });

    };
    const columns: ColumnsType<MarkerInfoModel> = [
        {
            title: 'Marker Name',
            dataIndex: 'markerName',
            align: 'center',
        },
        {
            title: 'Marker Version',
            dataIndex: 'markerVersion',
            align: 'center',
        },
        {
            title: 'Marker Type',
            dataIndex: 'markerType',
            align: 'center',
        },
        {
            title: 'Marker Length',
            dataIndex: 'mLength',
            align: 'center',
        },
        {
            title: 'Marker Width',
            dataIndex: 'mWidth',
            align: 'center',
        },
        {
            title: 'End Allowance',
            dataIndex: 'endAllowance',
            align: 'center'
        },
        {
            title: 'Perimeter',
            dataIndex: 'perimeter',
            align: 'center'
        },
        {
            title: 'Pattern Version',
            dataIndex: 'patVer',
            align: 'center',
        },
        {
            title: 'Cad Remarks',
            dataIndex: 'remarks1',
            align: 'center',
        },
        {
            title: 'Docket Remarks',
            dataIndex: 'remarks2',
            align: 'center',
        },
        {
            title: 'Action',
            align: 'center',
            render: (_, record) => {
                return <Popconfirm
                    title="Delete Marker"
                    description="Are you sure to delete this ?"
                    onConfirm={() => deleteMarker(record.id)}
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                    <Button type="primary" danger size="small">Delete</Button>
                </Popconfirm>
            }
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: MarkerInfoModel[]) => {
            setSelectedMarkerId(selectedRowKeys);
            props.selectMarker(Number(selectedRowKeys[0]));
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        selectedRowKeys:selectedRowMarkerId

    };
    return <>
        <Divider ><Space> <Button type="primary" onClick={openMarkerForm}>Create Marker</Button></Space> </Divider>
        <Table size="small" bordered columns={columns} dataSource={markersData} pagination={false}
            rowKey={(record: MarkerInfoModel) => record.id}
            rowSelection={{
                type: 'radio',
                ...rowSelection,
            }}
        />
        <Drawer
            title={"Create Marker"}
            placement={"right"}
            onClose={onClose}
            open={openForm}
            width={500}
        >
            {props.ratio.iCodes.map(i => {
                return <Space direction='vertical'><div>Product Name: <Tag color="#2db7f5">{i.productName}</Tag></div><div>Item Code: <Tag color="#87d068">{i.itemCode}</Tag></div></Space>
            })}

            <Divider />
            <Form labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }} onFinish={onFinish} form={form} style={{ width: '400px' }} layout="horizontal">
                <Form.Item label="Marker Name" name="markerName" rules={[{ required: true, message: 'Please input marker name!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Marker Version" name="markerVersion" rules={[{ required: true, message: 'Please input marker version!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Marker Type" name="markerType" rules={[{ required: true, message: 'Please select marker type!' }]}>
                    <Select>
                        {markerTypes.map(mObj => <Option value={mObj.id}>{mObj.markerType}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Marker Length" name="markerLength" rules={[{ required: true, message: 'Please input marker length!' }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="Marker Width" name="markerWidth" rules={[{ required: true, message: 'Please input marker width!' }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="End Allowance" name="endAllowance" rules={[{ required: true, message: 'Please input End Allowance!' }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="perimeter" name="perimeter" rules={[{ required: true, message: 'Please input perimeter!' }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="Pattern Version" name="patternVersion">
                    <Input />
                </Form.Item>

                <Form.Item label="Cad Remarks" name="remarks1">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item label="Docket Remarks" name="remarks2">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Marker
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    </>
}

export default EditRatioMarker;