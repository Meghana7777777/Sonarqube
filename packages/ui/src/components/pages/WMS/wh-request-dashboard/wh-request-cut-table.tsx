import { CutTableIdRequest, CutTableModel, PhItemCategoryEnum, TaskStatusEnum, WhDashMaterialRequesHeaderModel, WhMatReqLineItemStatusEnum, WhMatReqLineStatusDisplayValue, WhMatReqLineStatusEnum, WhReqByObjectEnum } from "@xpparel/shared-models";
import { FabricRequestCreationService } from "@xpparel/shared-services";
import { Button, Card, Descriptions, Modal, Popover, Tag } from "antd";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import './wh-legend.css';
import WarehouseRequestInfoGrid from "./wh-request-info-grid";
import moment from "moment";
interface IProps {
    cutTable: CutTableModel;
    searchableDocket: string;
}


const WarehouseRequestCutTable = (props: IProps) => {
    useEffect(() => {
        if (props.cutTable) {
            getPendingWhFabricRequestsForCutTableId(props.cutTable.id);
        }
    }, []);
    const user = useAppSelector((state) => state.user.user.user);
    const fabricService = new FabricRequestCreationService();
    const [whRequestInfo, setWhRequestInfo] = useState<WhDashMaterialRequesHeaderModel[]>([]);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<WhDashMaterialRequesHeaderModel>(undefined);
    const [loading, setLoading] = useState(true);

    const getPendingWhFabricRequestsForCutTableId = (cutTableId: number) => {
        setLoading(true);
        const req = new CutTableIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, cutTableId);
        fabricService.getPendingWhFabricRequestsForCutTableId(req).then((res => {
            if (res.status) {
                setWhRequestInfo(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setWhRequestInfo([]);
            }
            setLoading(false);
        })).catch(error => {
            setWhRequestInfo([]);
            setLoading(false);
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getClassName = (materialStatus: WhMatReqLineStatusEnum, docket: string) => {
        const blinkClass = docket == props.searchableDocket ? ' blink_me ' : ''
        switch (materialStatus) {
            case WhMatReqLineStatusEnum.OPEN: return blinkClass+'w-gray';
            case WhMatReqLineStatusEnum.PREPARING_MATERIAL: return blinkClass+'w-yellow';
            case WhMatReqLineStatusEnum.MATERIAL_NOT_AVL: return blinkClass+'w-red';
            case WhMatReqLineStatusEnum.MATERIAL_READY: return blinkClass+'w-ready';
            case WhMatReqLineStatusEnum.MATERIAL_ON_TROLLEY: return blinkClass+'w-tro';
            case WhMatReqLineStatusEnum.MATERIAL_IN_TRANSIT: return blinkClass+'w-tran';
            case WhMatReqLineStatusEnum.REACHED_DESITNATION: return blinkClass+'w-lgreen';
            // case WhMatReqLineStatusEnum.MATERIAL_ISSUED: return blinkClass+'w-green';
            default: return ''
        }


    }
    const popOverContent = (d: WhDashMaterialRequesHeaderModel) => {
        return <>
            <Descriptions
                // title={rollInfo.rollNumber}
                bordered
                size='small'
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Status">{WhMatReqLineStatusDisplayValue[d?.reqLines[0]?.materialStatus]}</Descriptions.Item>
                <Descriptions.Item label="Job Number"><Tag color="blue">{d?.reqLines[0]?.job}</Tag></Descriptions.Item>
                <Descriptions.Item label="Request Type">{`Knit Job`}</Descriptions.Item>
                <Descriptions.Item label="Requested Date">{ convertBackendDateToLocalTimeZone(d.reqCreatedOn) }</Descriptions.Item>
                <Descriptions.Item label="Expected Date">{ convertBackendDateToLocalTimeZone(d.reqFulfillWithin) }</Descriptions.Item>
            </Descriptions>
        </>
    }
    const onClose = () => {
        setOpenForm(false);
        getPendingWhFabricRequestsForCutTableId(props.cutTable.id);
    }
    const selectReq = (req: WhDashMaterialRequesHeaderModel) => {
        setSelectedRequest(req);
        setOpenForm(true);
    }

    const getPopOverTitle = (reqNo: string) => {
        return <>Request No : <Tag color='orange'>{reqNo}</Tag></>
    }

    return <>
        <Card size="small" title={props.cutTable.tableName}
        loading={loading}
        // extra={<><Tag>Pending to Lay Material: 30</Tag>
        //     <Tag>Total Material Received Dockets: 20</Tag>
        //     <Tag>Expected Return Yards: 50</Tag>
        //     <Tag>Total on Floor Rolls: 10</Tag>
        // </>}
        >
            {whRequestInfo.map(w =>
                <Popover content={popOverContent(w)} title={getPopOverTitle(w.requestNo)} mouseEnterDelay={0} mouseLeaveDelay={0}>
                    <Button onClick={() => selectReq(w)} id={w?.reqLines[0]?.job} className={getClassName(w?.reqLines[0]?.materialStatus, w?.reqLines[0]?.job) } type="primary"> {w.requestNo}</Button>
                </Popover>
            )}
        </Card>
        <br></br>
        <Modal
            title={`Update Status `}
            style={{ top: 10, width: '100%' }}
            open={openForm}
            onOk={onClose}
            width={'100%'}
            onCancel={onClose}
            footer={[
                <Button key="cancle" onClick={onClose}>
                    Cancel
                </Button>,

            ]}        >

            <WarehouseRequestInfoGrid closePopUp={onClose} docketGroup={selectedRequest ? selectedRequest.reqLines[0].job : undefined} requestNo={selectedRequest ? selectedRequest.requestNo : undefined} materialStatus={selectedRequest?.reqLines[0]?.materialStatus} />
        </Modal>
    </>

}

export default WarehouseRequestCutTable;