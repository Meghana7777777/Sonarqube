import { DocketDetailedInfoModel, DocketGroupDetailedInfoModel, MaterialRequestNoRequest, PhItemCategoryEnum, PoDocketGroupRequest, PoDocketNumberRequest, TaskStatusEnum, WhDashMaterialRequesLineItemModel, WhDashMaterialRequesLineModel, WhFabReqStatusRequest, WhMatReqLineItemStatusEnum, WhMatReqLineStatusDisplayValue, WhMatReqLineStatusEnum, WhReqByObjectEnum } from "@xpparel/shared-models";
import { DocketGenerationServices, FabricRequestCreationService, FabricRequestHandlingService } from "@xpparel/shared-services";
import { Button, Card, Col, Descriptions, Form, Modal, Row, Select, Space, Tag, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import moment from "moment";
// import DocketView from "../../PPS/docket-gen/docket-view";
import React from "react";
import { getCssFromComponent } from "../print-barcodes";

interface IProps {
    requestNo: string;
    docketGroup: string;
    materialStatus: WhMatReqLineStatusEnum;
    closePopUp: () => void;
}

const WarehouseRequestInfoGrid = (props: IProps) => {

    useEffect(() => {
        if (props.requestNo) {
            getPendingWhFabricRequestsForCutTableId(props.requestNo, props.docketGroup);
            form.setFieldValue('status', props.materialStatus == WhMatReqLineStatusEnum.OPEN ? undefined : props.materialStatus);
            setSelectedMaterialStatus(undefined);
            setLoading(true);
        }
    }, [props.requestNo + props.materialStatus]);
    const [rollsInfo, setRollsInfo] = useState<WhDashMaterialRequesLineModel>(undefined);
    const [selectedMaterialStatus, setSelectedMaterialStatus] = useState<WhMatReqLineStatusEnum>(undefined);
    const { Option } = Select;
    const [form] = Form.useForm();
    const fabricService = new FabricRequestCreationService();
    const fabricHandlingService = new FabricRequestHandlingService();
    const docketGenerationServices = new DocketGenerationServices();
    const user = useAppSelector((state) => state.user.user.user);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [docketPrintData, setDocketPrintData] = useState<DocketGroupDetailedInfoModel>(undefined);

    const getPendingWhFabricRequestsForCutTableId = (materialReqNo: string, docketGroup: string) => {
        // CORRECT
        const req = new MaterialRequestNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, materialReqNo, undefined, docketGroup);
        fabricService.getItemInfoForWhFabRequestNo(req).then((res => {
            if (res.status) {
                setRollsInfo(res.data[0].reqLines[0]);
                // setSelectedMaterialStatus(res.data[0].reqLines[0].materialStatus);
                // form.setFieldValue('status',res.data[0].reqLines[0].materialStatus)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setRollsInfo(undefined)
            }
            setLoading(false);
        })).catch(error => {
            setLoading(false)
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const columns: ColumnsType<WhDashMaterialRequesLineItemModel> = [
        {
            title: 'S.No',
            render: (_, __, i) => {
                return i + 1
            }
        },
        {
            title: 'Object Barcode',
            dataIndex: 'barcode',
        },
        {
            title: 'Object No',
            render: (_, row) => {
                return row.basicRollInfo.externalRollNumber
            }
        },
        {
            title: 'Width',
            render: (_, row) => {
                return row.basicRollInfo.width
            }
        },
        {
            title: 'Batch',
            render: (_, row) => {
                return row.basicRollInfo.batch
            }
        },
        {
            title: 'Lot No',
            render: (_, row) => {
                return row.basicRollInfo.lot
            }
        },
        // {
        //     title: 'Supplier Shade',
        //     render: (_, row) => {
        //         return row.basicRollInfo.sShade
        //     }
        // },
        // {
        //     title: 'Actual Shade',
        //     render: (_, row) => {
        //         return row.basicRollInfo.aShade
        //     }
        // },
        // {
        //     title: 'Shrinkage',
        //     render: (_, row) => {
        //         return row.basicRollInfo.shrinkageGroup
        //     }
        // },
        {
            title: 'Object Qty',
            render: (_, row) => {
                return <Tag color="blue">{row.basicRollInfo.originalQty}</Tag>
            }
        },
        {
            title: 'Allocated Qty',
            render: (_, row) => {
                return <Tag color="green">{row.allocQty}</Tag>
            }
        },
        // {
        //     title: 'Material Status',
        //     render: (_, row) => {
        //         return row.basicRollInfo.lot
        //     }
        // },

    ]
    const onFinish = (value) => {
        const { status } = value;
        const req = new WhFabReqStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.requestNo, status);
        const statusEndPoints = {
            [WhMatReqLineStatusEnum.PREPARING_MATERIAL]: 'changeWhFabRequestStatusToPreparingMaterial',
            [WhMatReqLineStatusEnum.MATERIAL_NOT_AVL]: 'changeWhFabRequestStatusToMaterialNotAvl',
            [WhMatReqLineStatusEnum.MATERIAL_ISSUED]: 'changeWhFabRequestStatusToIssued',
        }

        fabricHandlingService[statusEndPoints[status]](req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.closePopUp();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const printDocket = () => {
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
    const closeModel = () => {
        setModalVisible(false);
    };
    const viewDocket = (docGroup: string) => {
        // CORRECT
        const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, docGroup, true, true, undefined);
        docketGenerationServices.getDocketGroupDetailedInfo(req).then((res => {
            if (res.status) {
                setDocketPrintData(res.data[0]);
                setModalVisible(true);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    return <>
        <Card loading={loading}>
            <Descriptions
                // title={rollInfo.rollNumber}
                bordered
                size='small'
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Request No">{props && props.requestNo}</Descriptions.Item>
                <Descriptions.Item label="Docket Number">
                    <Tooltip title='Click here to Print Knitting Job'>
                        <Button type='link' disabled={!props.docketGroup} onClick={() => viewDocket(props.docketGroup)}  >
                            <span style={{ whiteSpace: 'nowrap' }}>{props && props.docketGroup}</span>
                        </Button>
                    </Tooltip>
                </Descriptions.Item>
                <Descriptions.Item label="Item Code">{rollsInfo && rollsInfo.materials[0].itemCode}</Descriptions.Item>
                <Descriptions.Item label="Item Description">{rollsInfo && rollsInfo.materials[0].itemDesc}</Descriptions.Item>
                <Descriptions.Item label="Knitting Machine expecting Material by">{rollsInfo?.fulfillentDateTime ? convertBackendDateToLocalTimeZone(rollsInfo.fulfillentDateTime) : 'NA'}</Descriptions.Item>
            </Descriptions>
            <br></br>
            <Table size='small' scroll={{ x: true }} rowKey={(record) => record.barcode + 'd'} pagination={false} bordered dataSource={rollsInfo ? rollsInfo.materials : []} columns={columns} />
            <br></br>
            <Form onFinish={onFinish} form={form} layout="inline"
                initialValues={{
                    status: selectedMaterialStatus,
                }}  >
                <Form.Item
                    name="status"
                    label="Material Status"
                    rules={[{ required: true, message: 'Please Select Material Status' }]}
                    initialValue={props.materialStatus == WhMatReqLineStatusEnum.OPEN ? undefined : props.materialStatus}
                >
                    <Select style={{ width: '300px' }} placeholder="Select Material Status" onChange={(selectedValue) => setSelectedMaterialStatus(selectedValue)}>
                        <Option key={WhMatReqLineStatusEnum.PREPARING_MATERIAL}
                            disabled={props.materialStatus == WhMatReqLineStatusEnum.PREPARING_MATERIAL || props.materialStatus == WhMatReqLineStatusEnum.MATERIAL_ISSUED}
                            value={WhMatReqLineStatusEnum.PREPARING_MATERIAL}>{WhMatReqLineStatusDisplayValue[WhMatReqLineStatusEnum.PREPARING_MATERIAL]}</Option>
                        <Option key={WhMatReqLineStatusEnum.MATERIAL_ISSUED}
                            disabled={props.materialStatus == WhMatReqLineStatusEnum.MATERIAL_ISSUED}
                            value={WhMatReqLineStatusEnum.MATERIAL_ISSUED}>{WhMatReqLineStatusDisplayValue[WhMatReqLineStatusEnum.MATERIAL_ISSUED]}</Option>
                        {/* {
                            Object.keys(WhMatReqLineStatusDisplayValue).map(key => <Option key={key} value={key}>{WhMatReqLineStatusDisplayValue[key]}</Option>)
                        } */}
                    </Select>
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" disabled={!selectedMaterialStatus}>
                        Save
                    </Button>
                </Form.Item>
                {/* <Form.Item >
                    <Button type='link' onClick={() => viewDocket(props.docketNo)}  >
                        Print Docket
                    </Button>
                </Form.Item> */}
            </Form>
        </Card>

        <Modal
            className='print-docket-modal'
            key={'modal' + Date.now()}
            width={'100%'}
            style={{ top: 0 }}
            open={modalVisible}
            title={<React.Fragment>
                <Row>
                    <Col span={12}>
                        Print Docket
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Button type='primary' onClick={() => printDocket()}>Print</Button>
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
            {/* TODO:CUT */}
            {/* <DocketView docketData={docketPrintData} /> */}
        </Modal>
    </>
}
export default WarehouseRequestInfoGrid;