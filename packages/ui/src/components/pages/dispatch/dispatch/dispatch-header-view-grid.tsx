import { CutDispatchStatusEnum, CutDispatchStatusRequest, CutDispatchRequestModel, ICutDipatchCutWiseQtyHelperModel, CutDispatchIdStatusRequest, CutDispatchVendorTransUpdateRequest, VendorModel, VendorCategoryRequest, VendorCategoryEnum } from "@xpparel/shared-models";
import { CutDispatchService, VendorService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, CheckboxProps, Col, Collapse, CollapseProps, Divider, Form, Modal, Row, Select, Space, Table, Tag, Tooltip } from "antd";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { MinusOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons";

import React from "react";

import { ColumnType, ColumnsType } from "antd/es/table";
import moment from "moment";
import DispatchViewChildGrid from "./dispatch-view-child-grid";
import VendorSelectionPage from "../../pk-dispatch/pk-dispatch/vendor-selection-page";
// import VendorSelectionPage from "../../PPS/embellishment-jobs/vendor-selection-page";
interface IProps {
    dispatchStatus: CutDispatchStatusEnum
} 
const DispatchHeaderViewGrid = (props: IProps) => {
    useEffect(() => {
        getCutDispatchRequestsByStatus(props.dispatchStatus);        
        getVendorInfo()
    }, [])
    const { dispatchStatus } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [dispatchInfo, setDispatchInfo] = useState<CutDispatchRequestModel[]>([]);
    const [selectedDispatchId, setSelectedDispatchId] = useState<number>();
    const [vendorInfo, setVendorInfo] = useState<VendorModel[]>([]);
    const cutDispatchService = new CutDispatchService();
    const vendorService = new VendorService();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const { Option } = Select;

    /**
     * Get Dispatch Info
     */
    const getCutDispatchRequestsByStatus = (dispatchStatus: CutDispatchStatusEnum) => {
        const req = new CutDispatchStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, dispatchStatus, true);
        cutDispatchService.getCutDispatchRequestsByStatus(req).then((res => {
            if (res.status) {
                setDispatchInfo(res.data);
            } else {
                setDispatchInfo([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getVendorInfo = () => {
        const req = new VendorCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, VendorCategoryEnum.EMBELLISHMENT);
        vendorService.getAllVendorsByVendorCategory(req).then((res => {
            if (res.status) {
                setVendorInfo(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }


    const updateCutDispatchRequestStatus = (dispatchId: number) => {
        const req = new CutDispatchIdStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, dispatchId, CutDispatchStatusEnum.SENT);
        cutDispatchService.updateCutDispatchRequestStatus(req).then((res => {
            if (res.status) {
                getCutDispatchRequestsByStatus(props.dispatchStatus);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const updateVendorAndTransportInfoForCutDrId = (dispatchId: number, vendorId: number) => {
        const req = new CutDispatchVendorTransUpdateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, dispatchId, vendorId, undefined);
        cutDispatchService.updateVendorAndTransportInfoForCutDrId(req).then((res => {
            if (res.status) {
                setSelectedDispatchId(undefined);
                setIsModalOpen(false);
                getCutDispatchRequestsByStatus(props.dispatchStatus);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }


    const openModalForUpdateVendor = (dispatchId: number) => {
        setIsModalOpen(true);
        setSelectedDispatchId(dispatchId);
    }
    
    const columns: ColumnsType<CutDispatchRequestModel> = [
        {
            title: 'Dispatch No',
            dataIndex: 'dispatchReqNo',
            align: 'center',
        },
        {
            title: 'MO No',
            dataIndex: 'moNo',
            align: 'center',
        },
        {
            title: 'MO Lines',
            dataIndex: 'moLines',
            align: 'center',
            render: (v) => v.join()

        },
        {
            title: 'Cut No\'s',
            dataIndex: 'cutNumbers',
            align: 'center',
            render: (v) => v.join()

        },
        {
            title: 'Vendor',
            dataIndex: 'vendorId',
            align: 'center',
            render: (v) => {
                const vendorObj = vendorInfo.find(e => e.id == v);
                return vendorObj?.vName;
             }
        },
        {
            title: dispatchStatus == CutDispatchStatusEnum.OPEN ? 'Dispatch Request Created On' : 'Dispatched On', 
            dataIndex: dispatchStatus == CutDispatchStatusEnum.OPEN ? 'reqCreatedOn' : 'dispatchedOn',
            align: 'center',
            render: (v) => convertBackendDateToLocalTimeZone(v)
        },
        {
            title: 'Dispatch total Qty',
            dataIndex: 'dipatchQtys',
            align: 'center',
            render: (v: ICutDipatchCutWiseQtyHelperModel[]) => v.reduce((accumulator, currentValue) => accumulator + currentValue.qty, 0)
        }
    ]
    // TODO: add cut dispatch ID
    const actionColumns: ColumnType<CutDispatchRequestModel> = {
        title: 'Action',
        align: 'center',
        render: (_, record) => (
            <Space>
                <Button onClick={() => openModalForUpdateVendor(record.cutDispatchId)} className="btn-orange" size="small">Update Vendor</Button>
                <Button onClick={() => updateCutDispatchRequestStatus(record.cutDispatchId)} className="btn-green" size="small">Checkout</Button>
                <Button size="small" icon={<PrinterOutlined />} />
            </Space>
        ),

    }

    const renderChildItems = (record: CutDispatchRequestModel) => {
        return <DispatchViewChildGrid dispatchId={record.cutDispatchId} />
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return <>


        <Table size="small" rowKey={r => r.cutNumbers.join()} bordered pagination={false}
            columns={dispatchStatus == CutDispatchStatusEnum.OPEN ? [...columns, actionColumns] : columns}
            dataSource={dispatchInfo}
            expandable={{
                expandedRowRender: renderChildItems,
                // expandedRowKeys: expandedIndex,
                // onExpand: setIndex
            }}
        />
        <Modal title="Vendor" open={isModalOpen} onOk={handleCancel} onCancel={handleCancel} footer={''}>
            {/* TODO:CUT Done*/}
            <VendorSelectionPage venderInfo={vendorInfo} buttonText='Update Vendor' updateVendorDetails={(e) => updateVendorAndTransportInfoForCutDrId(selectedDispatchId, e.id)} />
        </Modal>

    </>
}

export default DispatchHeaderViewGrid;
