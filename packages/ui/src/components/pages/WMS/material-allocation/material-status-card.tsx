import { CheckOutlined, DislikeFilled, ExperimentOutlined, EyeFilled, LikeFilled, ReloadOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { MaterialReqStatusEnum, MaterialReqStatusEnumDisplayValue, MRStatusRequest, WhDashMaterialRequesHeaderModel, WhReqByObjectEnum } from "@xpparel/shared-models";
import { FabricRequestCreationService } from "@xpparel/shared-services";
import { Button, Card, Col, Descriptions, Modal, Popover, Row, Space, Tooltip } from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "../../../../common";
import { AlertMessages } from "../../../common";
import MaterialItemView from "./material-item-view";

interface IMaterialIssuanceStepContentProps {
    activeMainTab: WhReqByObjectEnum;
    subTab: MaterialReqStatusEnum;
    searchData: string;
    refreshWholeState: () => void
}
let defaultColor = "radial-gradient(circle at 0% 7.4%, rgb(20 136 255) 10%, rgb(0 136 255) 90%)";
const buttonsStyle = {
    width: "50%",
    align: "center",
    justifyContent: "center"
}
export const MaterialStatusCard = (props: IMaterialIssuanceStepContentProps) => {
    const { activeMainTab, subTab, searchData, refreshWholeState } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [matRequests, setMatRequests] = useState<WhDashMaterialRequesHeaderModel[]>([]);
    const [color, setColor] = useState(defaultColor);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [matReqNo, setMatReqNo] = useState<string>(null);
    const [matReqId, setMatReqId] = useState<number>(null);
    const [isView, setIsView] = useState<boolean>(true);



    const fabricRequestCreationService = new FabricRequestCreationService();

    useEffect(() => {
        if (subTab === MaterialReqStatusEnum.MATERIAL_ISSUED) {
            setColor("linear-gradient(107deg, rgb(68 196 107) 8.1%, rgb(16 196 94) 79.5%)")
        }
        getMaterialRequests();
    }, []);

    const getMaterialRequests = () => {
        fabricRequestCreationService.getWhMaterialRequests(new MRStatusRequest(user.userName, user.unitCode, user.companyCode, user.userId, [subTab], activeMainTab)).then((response) => {
            if (response.status) {
                setMatRequests(response.data);
            } else {
                AlertMessages.getErrorMessage(response.internalMessage);
                setMatRequests([]);
            }
        })
    }

    const viewOnClick = (reqNo: string, isView: boolean, matReqId: number) => {
        setShowModal(true);
        setMatReqNo(reqNo);
        setMatReqId(matReqId);
        setIsView(isView)
    }

    const clearModal = () => {
        setShowModal(false);
        setMatReqNo(null);
        setMatReqId(null);
        setIsView(true)
        refreshWholeState();
    }

    const getActions = (subTab: MaterialReqStatusEnum, matReqNo: string, matReqId: number) => {
        switch (subTab) {
            case MaterialReqStatusEnum.OPEN:
                return <><CheckOutlined key="confirm" title="confirm material received" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, false, matReqId) }} />
                    <EyeFilled key="view" title="view items" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, true, matReqId) }} />
                </>;
            case MaterialReqStatusEnum.PREPARING_MATERIAL:
                return <><ShoppingCartOutlined key="confirm" title="confirm material received" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, false, matReqId) }} />
                    <EyeFilled key="view" title="view items" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, true, matReqId) }} />
                </>;
            case MaterialReqStatusEnum.MATERIAL_NOT_AVL:
                return <><ExperimentOutlined key="confirm" title="confirm material received" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, false, matReqId) }} />
                    <EyeFilled key="view" title="view items" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, true, matReqId) }} />
                </>;
            case MaterialReqStatusEnum.MATERIAL_ISSUED:
                return <>
                    <EyeFilled key="view" title="view items" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, true, matReqId) }} />
                </>;
            default:
                return <><CheckOutlined key="confirm" title="confirm material received" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, false, matReqId) }} />
                    <EyeFilled key="view" title="view items" style={{ ...buttonsStyle }} onClick={() => { viewOnClick(matReqNo, true, matReqId) }} />
                </>;
        }
    }

    return <Card
        size="small" style={{ textAlign: "center" }}
        headStyle={{ background: "#eee" }}
        bodyStyle={{ height: "80vh", overflowY: "scroll" }}
        title={
            <div style={{ display: "inline-flex", alignItems: "center" }}>
                {MaterialReqStatusEnumDisplayValue[subTab]}
            </div>
        }
        extra={
            <Space>
                <Tooltip title="Reload & Clear">
                    <Button onClick={() => { getMaterialRequests() }} icon={<ReloadOutlined />} />
                </Tooltip>
            </Space>
        }
    >
        <Row gutter={4}>
            {
                matRequests.map((materialReq) => (<Col xs={24} sm={24} md={24} lg={12} xl={8}>
                    <Card size="small" className="pd5" id="ins-card" hoverable={true} bodyStyle={{ overflow: 'hidden' }}
                        style={{ width: "100%", background: color, border: "1px solid #d7cece", margin: "4px", color: "white", borderRadius: "8px", overflowY: "scroll", fontSize: '4px' }}
                    >
                        <Popover placement="rightTop" content={<>
                            <p><b>Request No</b> : {materialReq?.requestNo}</p>
                            <p><b>Created On</b> : {convertBackendDateToLocalTimeZone(materialReq?.reqCreatedOn, true)}</p>
                            <p><b>Fulfillment Date</b> : {convertBackendDateToLocalTimeZone(materialReq?.reqFulfillWithin, true)}</p>
                            <p><b>Requested Material</b> : {materialReq?.reqMaterialType}</p>

                        </>} overlayInnerStyle={{ background: '#ffffee' }}>
                            <Meta
                                avatar={""}
                                style={{ fontSize: '12px' }}
                                title={<><span style={{ color: "white", fontSize: '12px' }} className={`truncated ${searchData === materialReq.requestNo ? 'search-highlight' : ''}`} data-fulltext={materialReq.requestNo}>B:{materialReq.requestNo}</span></>}
                                description={<></>}
                            />
                        </Popover>
                        <hr />
                        <Row style={{ color: "#000" }}>
                            {getActions(subTab, materialReq.requestNo, materialReq.id)}
                        </Row>
                    </Card>

                </Col>))
            }
            {matReqNo && <Modal
                open={showModal}
                onCancel={() => {
                    setShowModal(false)
                }}
                width={'95%'}
                title={'Are you sure to proceed ?'}
                style={{ top: 20 }}
                maskClosable={true}
                closable={true}
                okButtonProps={{
                    onClick: () => {
                        clearModal();
                    }
                }}
                key={matReqNo}
            >
                <MaterialItemView requestNo={matReqNo} materialStatus={subTab as any} activeMainTab={activeMainTab} isView={isView} matReqId={matReqId} clearModal={clearModal} />
            </Modal>}
        </Row>
    </Card>;
};

export default MaterialStatusCard;
