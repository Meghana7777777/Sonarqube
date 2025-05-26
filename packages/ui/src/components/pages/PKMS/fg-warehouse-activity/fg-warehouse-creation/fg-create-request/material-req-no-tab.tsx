import { PrinterOutlined } from '@ant-design/icons';
import { CommonRequestAttrs, PackListCartoonIDs, PkmsFgWhCurrStageEnum, PkmsFgWhReqApprovalEnum, PKMSFgWhReqNoResponseDto, PKMSPackJobIdReqDto, UpdateFgWhOurReqDto, WareHouseResponseDto } from '@xpparel/shared-models';
import { PKMSFgWarehouseService, WareHouseService } from '@xpparel/shared-services';
import { Button, Card, Col, DatePicker, Drawer, Form, Modal, Popover, Row, Select } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import PickListDataPrint from './pick-list-data';
import PKMSCartonToContainerLoading from './pkms-carton-to-container-loading';
import { AlertMessages } from 'packages/ui/src/components/common';
import moment from 'moment';
interface IProps {
    packOrder: number;
}

const MaterialReqNoTab = (props: IProps) => {
    const fgService = new PKMSFgWarehouseService();
    const user = useAppSelector((state) => state.user.user.user);
    const [data, setData] = useState<PKMSFgWhReqNoResponseDto[]>([]);
    const [printModal, setPrintModel] = useState<boolean>();
    const [packListIds, setPackListIds] = useState<number[]>([]);
    const [fgWhReqIds, setFgWhReqIds] = useState<number[]>();
    const [packListCartoonIDs, setPackListCartoonIDs] = useState<PackListCartoonIDs[]>();
    const [openTruckLoadingDrawer, setOpenTruckLoadingDrawer] = useState(false);
    const [dummyRefreshKey, setDummyRefreshKey] = useState<number>(0)
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [selectedWhReqData, setSelectedWhReqData] = useState<PKMSFgWhReqNoResponseDto | null>(null);
    const wareHouseService = new WareHouseService();
    const [warehouseDropDown, setWarehouseDropDown] = useState<WareHouseResponseDto[]>([]);
    const [floors, setFloors] = useState<number>();
    const [formRef] = Form.useForm();

    useEffect(() => {
        if (props.packOrder)
            getFgReqNoAgainstToPackJobNo()
    }, [props.packOrder])

    useEffect(() => {
        getWareHouseDropDown();
    }, [])

    const getFgReqNoAgainstToPackJobNo = () => {
        const req = new PKMSPackJobIdReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.packOrder);
        fgService.getFgReqNoAgainstToPackJobNo(req).then(res => {
            if (res.status) {
                setData(res.data);
            } else {
                setData([]);
            }
        }).catch(err => {
            console.log(err.message);
        });
    };
    const getWareHouseDropDown = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        wareHouseService.getWareHouseDropDown(req).then(res => {
            if (res.status) {
                setWarehouseDropDown(res.data)
            } else {
                setWarehouseDropDown([])
            }
        }).catch(err => console.log(err.message))
    }

    const wareHouseOnChange = (value: string) => {
        const record = warehouseDropDown.find((rec) => rec.wareHouseCode === value);
        if (record.noOfFloors) {
            setFloors(record.noOfFloors);
        } else {
            setFloors(0);
        }

    };

    const updateFgWareHouseRejected = (whReqId: number) => {
        formRef.validateFields().then(values => {
            const req = new UpdateFgWhOurReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.toWhCode, values.floor, values.requestDate, whReqId, PkmsFgWhCurrStageEnum.OPEN, PkmsFgWhReqApprovalEnum.OPEN);
            fgService.updateFgWareHouseRejected(req).then(res => {
                if (res.status) {
                    getFgReqNoAgainstToPackJobNo();
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    setUpdateModalVisible(false);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch(err => console.log(err.message))
        }).catch(err => console.log(err.message))

    }
    return <>
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            {data?.length > 0 ? (
                data.map((item, index) => {
                    return (
                        <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <Card
                                size="small"
                                headStyle={{ background: '#6ac0a9', color: '#fff' }}
                                title={item.fgWhReqNo}
                                extra={[

                                    <Button
                                        size="small"
                                        type="primary"
                                        className="btn-yellow"
                                        onClick={() => {
                                            setDummyRefreshKey(dummyRefreshKey + 1)
                                            setPackListIds(item.packListIds);
                                            setFgWhReqIds([item.fgWhReqIds]);
                                            setOpenTruckLoadingDrawer(true)
                                        }}
                                    >
                                        Truck
                                    </Button>,
                                    <>{" "}</>,
                                    <Button
                                        disabled={item.requestApprovalStatus !== PkmsFgWhReqApprovalEnum.REJECT}
                                        type="primary"
                                        size="small"
                                        onClick={() => {
                                            wareHouseOnChange(item.toWhCode)
                                            item.requestDate = moment(item.requestDate) as any
                                            setSelectedWhReqData(item);
                                            setUpdateModalVisible(true);
                                        }}
                                    >
                                        Update
                                    </Button>,
                                    <>{" "}</>,
                                    <Popover
                                        content={'Pick Print List'}
                                    >   <Button
                                            icon={<PrinterOutlined />}
                                            size="small"
                                            type="primary"
                                            onClick={() => {
                                                setPackListIds(item.packListIds);
                                                setFgWhReqIds([item.fgWhReqIds]);
                                                setPackListCartoonIDs(item.packListIds.map(id => ({ packListId: id, cartonIds: [] })));
                                                setPrintModel(true);
                                            }}
                                        /></Popover>,
                                ]}>

                            </Card>
                        </Col>
                    )
                })
            ) : (
                <p> </p>
            )}
        </Row>
        <Modal
            open={printModal}
            width={900}
            closable
            onCancel={() => setPrintModel(false)}
            onOk={() => setPrintModel(false)}
        >
            <PickListDataPrint
                plIds={packListIds}
                fgWhReqIds={fgWhReqIds}
            />
        </Modal>

        <Drawer
            title={'Carton To Container Mapping'}
            open={openTruckLoadingDrawer}
            footer={null}
            onClose={() => {
                setOpenTruckLoadingDrawer(false);
                setDummyRefreshKey(dummyRefreshKey + 1)
            }}
            width={1300}
        >
            <PKMSCartonToContainerLoading 
                packListIds={packListIds}
                fgWhReqIds={fgWhReqIds}
                key={dummyRefreshKey}
            />
        </Drawer>

        <Modal
            width={800}
            open={updateModalVisible}
            title="Update Warehouse Request"
            onCancel={() => setUpdateModalVisible(false)}
            key={dummyRefreshKey}
            footer={[
                <Button
                    onClick={() => {
                        setDummyRefreshKey(dummyRefreshKey + 1)
                        setUpdateModalVisible(false);
                    }}
                    type='primary' danger>Cancel</Button>,
                <Button
                    onClick={() => {
                        setDummyRefreshKey(dummyRefreshKey + 1);
                        updateFgWareHouseRejected(selectedWhReqData.fgWhReqIds)
                    }}
                    type='primary' >Update</Button>,
            ]}
        >
            <Form layout='vertical' form={formRef} initialValues={selectedWhReqData}>
                <Row style={{ display: 'flex', gap: '0px' }}>
                    <Col span={8}>
                        <Form.Item
                            name={"toWhCode"}
                            rules={[{ message: 'Please Select Warehouse Code', required: true }]}
                            label={'Warehouse Code'}
                        >
                            <Select
                                placeholder={'Please Select Warehouse Code'}
                                allowClear
                                showSearch
                                style={{ width: '150px' }}
                                onChange={wareHouseOnChange}
                            >
                                {warehouseDropDown.map((rec) => <Select.Option value={rec.wareHouseCode}>{rec.wareHouseCode + "-" + rec.wareHouseDesc}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Floor'}
                            name={"floor"}
                            rules={[{ message: 'Please Select Floor', required: true }]}
                            style={{ width: '200px' }}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={'Select Floor'}
                            >
                                {Array.from(Array(floors).keys()).map(rec => <Select.Option value={rec + 1}>{'Floor' + " " + (rec + 1)}</Select.Option>)}
                            </Select>

                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Request Date'}
                            name={"requestDate"}
                            rules={[{ message: 'Please Select Request Date', required: true }]}
                        >
                            <DatePicker
                                style={{ width: '150' }}
                                format={'YYYY-MM-DD HH:MM'}
                            />
                        </Form.Item>
                    </Col>


                </Row>
            </Form>

        </Modal>




    </>




};

export default MaterialReqNoTab;
