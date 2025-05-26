import { MaterialRequestNoRequest, WhDashMaterialRequesLineItemModel, WhDashMaterialRequesLineModel, WhFabReqStatusRequest, WhMatReqLineStatusDisplayValue, WhMatReqLineStatusEnum, WhReqByObjectEnum, WMS_C_FAB_IssuanceRequest, WMS_C_FAB_ItemLevelIssuanceRequest, WMS_C_KnitMaterialIssuanceRequest, WMS_C_KnitMaterialItemLevelIssuanceRequest, WMS_C_PTrimIssuanceRequest, WMS_C_PTrimItemLevelIssuanceRequest, WMS_C_STrimIssuanceRequest, WMS_C_STrimItemLevelIssuanceRequest } from "@xpparel/shared-models";
import { FabricRequestCreationService, FabricRequestHandlingService, WmsKnitItemRequestService, WmsPackTrimRequestService, WmsSpsTrimRequestService } from "@xpparel/shared-services";
import { Button, Card, Descriptions, Form, Input, Select, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useEffect, useState } from "react";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "../../../../common";
import { AlertMessages } from "../../../common";

const { Option } = Select;
interface IMaterialItemViewProps {
    materialStatus: WhMatReqLineStatusEnum;
    requestNo: string;
    activeMainTab: WhReqByObjectEnum;
    isView: boolean;
    matReqId: number;
    clearModal: () => void
}
export const MaterialItemView = (props: IMaterialItemViewProps) => {
    const [selectedMaterialStatus, setSelectedMaterialStatus] = useState<WhMatReqLineStatusEnum>(undefined);
    const [rollsInfo, setRollsInfo] = useState<WhDashMaterialRequesLineModel>(undefined);
    const [materials, setMaterials] = useState<WhDashMaterialRequesLineItemModel[]>([]);

    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    const fabricService = new FabricRequestCreationService();
    const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        if (props.requestNo) {
            getPendingWhFabricRequestsForCutTableId(props.requestNo);
            form.setFieldValue('status', props.materialStatus == WhMatReqLineStatusEnum.OPEN ? undefined : props.materialStatus);
            setSelectedMaterialStatus(undefined);
        }
    }, [props.requestNo + props.materialStatus]);
    const getPendingWhFabricRequestsForCutTableId = (materialReqNo: string) => {
        // CORRECT
        const req = new MaterialRequestNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, materialReqNo, undefined, undefined);
        fabricService.getItemInfoForWhFabRequestNo(req).then((res => {
            if (res.status) {
                setRollsInfo(res.data[0].reqLines[0]);
                setMaterials(res.data[0].reqLines.map(rec => rec.materials).flat());
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setRollsInfo(undefined);
                setMaterials([]);
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
                return row?.basicRollInfo?.externalRollNumber
            }
        },
        {
            title: 'Width',
            render: (_, row) => {
                return row?.basicRollInfo?.width
            }
        },
        {
            title: 'Batch',
            render: (_, row) => {
                return row?.basicRollInfo?.batch
            }
        },
        {
            title: 'Lot No',
            render: (_, row) => {
                return row?.basicRollInfo?.lot
            }
        },
        {
            title: 'Object Qty',
            render: (_, row) => {
                return <Tag color="blue">{row?.basicRollInfo?.originalQty}</Tag>
            }
        },
        {
            title: 'Allocated Qty',
            render: (_, row) => {
                return <Tag color="green">{row.allocQty}</Tag>
            }
        }
    ]
    if (props.materialStatus == WhMatReqLineStatusEnum.PREPARING_MATERIAL) {
        columns.push({
            title: 'Issued Qty',
            render: (_, row) => {
                return <Input defaultValue={row.allocQty} disabled />
            }
        })
    }
    const onFinish = (value) => {
        const { status } = value;
        if (props.activeMainTab === WhReqByObjectEnum.DOCKET) {
            fabricOnFinish(status)
        }
        if (props.activeMainTab === WhReqByObjectEnum.KNITTING) {
            yarnOnFinish(status)
        }

        if (props.activeMainTab === WhReqByObjectEnum.SEWING) {
            sTrimOnFinish(status)
        }
        if (props.activeMainTab === WhReqByObjectEnum.PACKING) {
            pTrimOnFinish(status)
        }
    }

    const sTrimOnFinish = (status) => {
        const wmsSTrimItemRequestService = new WmsSpsTrimRequestService();
        let req: any = new WhFabReqStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.requestNo, status);
        const statusEndPoints = {
            [WhMatReqLineStatusEnum.PREPARING_MATERIAL]: 'changeWhSTrimReqStatus',
            [WhMatReqLineStatusEnum.MATERIAL_NOT_AVL]: 'changeWhSTrimReqStatus',
            [WhMatReqLineStatusEnum.MATERIAL_ISSUED]: 'issueSTrimForWhReqId',
        }
        if (status === WhMatReqLineStatusEnum.MATERIAL_ISSUED) {
            req = new WMS_C_STrimIssuanceRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.matReqId, user?.userName, moment().format('YYYY-MM-DD'), materials.map(rec => {
                return new WMS_C_STrimItemLevelIssuanceRequest(rec.rollId, rec.allocQty)
            }))
        }

        wmsSTrimItemRequestService[statusEndPoints[status]](req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.clearModal();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const pTrimOnFinish = (status) => {
        const wmsPTrimItemRequestService = new WmsPackTrimRequestService();
        let req: any = new WhFabReqStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.requestNo, status);
        const statusEndPoints = {
            [WhMatReqLineStatusEnum.PREPARING_MATERIAL]: 'changeWhPTrimReqStatus',
            [WhMatReqLineStatusEnum.MATERIAL_NOT_AVL]: 'changeWhPTrimReqStatus',
            [WhMatReqLineStatusEnum.MATERIAL_ISSUED]: 'issuePTrimForWhReqId',
        }
        if (status === WhMatReqLineStatusEnum.MATERIAL_ISSUED) {
            req = new WMS_C_PTrimIssuanceRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.matReqId, user?.userName, moment().format('YYYY-MM-DD'), materials.map(rec => {
                return new WMS_C_PTrimItemLevelIssuanceRequest(rec.rollId, rec.allocQty)
            }))
        }

        wmsPTrimItemRequestService[statusEndPoints[status]](req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.clearModal();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const yarnOnFinish = (status) => {
        const wmsKnitItemRequestService = new WmsKnitItemRequestService();
        let req: any = new WhFabReqStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.requestNo, status);
        const statusEndPoints = {
            [WhMatReqLineStatusEnum.PREPARING_MATERIAL]: 'changeWhYarnReqStatus',
            [WhMatReqLineStatusEnum.MATERIAL_NOT_AVL]: 'changeWhYarnReqStatus',
            [WhMatReqLineStatusEnum.MATERIAL_ISSUED]: 'issueKnitMaterialForWhReqId',
        }
        if (status === WhMatReqLineStatusEnum.MATERIAL_ISSUED) {
            req = new WMS_C_KnitMaterialIssuanceRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.matReqId, user?.userName, moment().format('YYYY-MM-DD'), materials.map(rec => {
                return new WMS_C_KnitMaterialItemLevelIssuanceRequest(rec.rollId, rec.allocQty)
            }))
        }

        wmsKnitItemRequestService[statusEndPoints[status]](req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.clearModal();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const fabricOnFinish = (status) => {
        const fabricHandlingService = new FabricRequestHandlingService();
        let req: any = new WhFabReqStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.requestNo, status);
        const statusEndPoints = {
            [WhMatReqLineStatusEnum.PREPARING_MATERIAL]: 'changeWhFabRequestStatusToPreparingMaterial',
            [WhMatReqLineStatusEnum.MATERIAL_NOT_AVL]: 'changeWhFabRequestStatusToMaterialNotAvl',
            [WhMatReqLineStatusEnum.MATERIAL_ISSUED]: 'changeWhFabRequestStatusToIssued',
        }
        if (status === WhMatReqLineStatusEnum.MATERIAL_ISSUED) {
            req = new WMS_C_FAB_IssuanceRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.matReqId, user?.userName, moment().format('YYYY-MM-DD'), materials.map(rec => {
                return new WMS_C_FAB_ItemLevelIssuanceRequest(rec.rollId, rec.allocQty)
            }))
        }

        fabricHandlingService[statusEndPoints[status]](req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.clearModal();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const getOptions = () => {
        if (props.materialStatus == WhMatReqLineStatusEnum.OPEN) {
            return <>
                <Option key={WhMatReqLineStatusEnum.PREPARING_MATERIAL}
                    value={WhMatReqLineStatusEnum.PREPARING_MATERIAL}>{WhMatReqLineStatusDisplayValue[WhMatReqLineStatusEnum.PREPARING_MATERIAL]}</Option>
                <Option key={WhMatReqLineStatusEnum.MATERIAL_NOT_AVL}
                    value={WhMatReqLineStatusEnum.MATERIAL_NOT_AVL}>{WhMatReqLineStatusDisplayValue[WhMatReqLineStatusEnum.MATERIAL_NOT_AVL]}</Option>
            </>
        }
        if (props.materialStatus == WhMatReqLineStatusEnum.PREPARING_MATERIAL) {
            return <>
                <Option key={WhMatReqLineStatusEnum.MATERIAL_ISSUED}
                    value={WhMatReqLineStatusEnum.MATERIAL_ISSUED}>{WhMatReqLineStatusDisplayValue[WhMatReqLineStatusEnum.MATERIAL_ISSUED]}</Option>
            </>
        }
        if (props.materialStatus == WhMatReqLineStatusEnum.MATERIAL_ISSUED) {
            <>
                <Option disable key={WhMatReqLineStatusEnum.MATERIAL_ISSUED}
                    value={WhMatReqLineStatusEnum.MATERIAL_ISSUED}>{WhMatReqLineStatusDisplayValue[WhMatReqLineStatusEnum.MATERIAL_ISSUED]}</Option>
            </>
        }
        if (props.materialStatus == WhMatReqLineStatusEnum.MATERIAL_NOT_AVL) {
            <>
                <Option key={WhMatReqLineStatusEnum.OPEN}
                    value={WhMatReqLineStatusEnum.OPEN}>{WhMatReqLineStatusDisplayValue[WhMatReqLineStatusEnum.OPEN]}</Option>
            </>
        }
        return <></>
    }
    return <>
        <Card title="Material Details">
            <Descriptions
                bordered
                size='small'
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Request No">{props && props.requestNo}</Descriptions.Item>
                <Descriptions.Item label="Job Number">
                    <Tooltip title='Click here to Print Job'>
                        {/* <Button type='link' onClick={() => viewDocket(props.docketGroup)}  >
                            <span style={{ whiteSpace: 'nowrap' }}>{props && props.docketGroup}</span>
                        </Button> */}
                    </Tooltip>
                </Descriptions.Item>
                <Descriptions.Item label="Item Code">{rollsInfo && rollsInfo.materials[0].itemCode}</Descriptions.Item>
                <Descriptions.Item label="Item Description">{rollsInfo && rollsInfo.materials[0].itemDesc}</Descriptions.Item>
                <Descriptions.Item label="Expecting Material by">{rollsInfo?.fulfillentDateTime ? convertBackendDateToLocalTimeZone(rollsInfo.fulfillentDateTime) : 'NA'}</Descriptions.Item>
            </Descriptions>
            <br></br>
            <Table size='small' scroll={{ x: true }} rowKey={(record) => record.barcode + 'd'} pagination={false} bordered dataSource={materials} columns={columns} />
            <br></br>
            {!props.isView &&
                <Form layout="inline" onFinish={onFinish}
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
                            {getOptions()}
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" disabled={!selectedMaterialStatus}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            }
        </Card>
    </>;
};

export default MaterialItemView;
