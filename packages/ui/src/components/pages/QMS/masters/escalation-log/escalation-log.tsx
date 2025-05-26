import { CommonRequestAttrs, SewingDefectFilterReq } from "@xpparel/shared-models";
import { QualityConfigurationService } from "@xpparel/shared-services";
import { Button, Card, Form, Modal, Select, Table, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
const { Option } = Select

export const EscalationLogView = () => {
    const service = new QualityConfigurationService();
    const [escalationData, setEscalationData] = useState<any[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(1);
    const [form] = Form.useForm()
    const user = useAppSelector((state) => state.user.user.user);




    useEffect(() => {
        getAllEsclations()
    }, [])
    console.log(user)

    const getAllEsclations = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
        service.getAllEsclations(req).then((res) => {
            if (res.status) {
                setEscalationData(res.data)
            } else {
                setEscalationData([])
            }
        })
    }

    const columns: any = [
        {
            title: 'Escalation Name',
            dataIndex: 'name',
            align: 'center',

        },
        {
            title: 'Style Code',
            dataIndex: 'styleCode',
            align: 'center',

        },
        {
            title: 'Process Type',
            dataIndex: 'processType',
            align: 'center',

        },
        {
            title: 'Quality Type',
            dataIndex: 'qualityType',
            align: 'center',
        },
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            align: 'center',
        },
        {
            title: 'Inspected By',
            dataIndex: 'inspectedBy',
            align: 'center',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            align: 'center',
        },
        {
            title: 'Action Status',
            dataIndex: 'actionStatus',
            align: 'center',
        },
    ];

    // const showModals = () => {
    // }

    return (

        <Card title='Escalation'
        //  extra={<Button onClick={() => showModals()} type="primary">Create</Button>}
        >
            <Table columns={columns} dataSource={escalationData} style={{ borderRadius: "9px" }} className="custom-table" scroll={{ x: 'max-content' }} size='small'
                bordered
                pagination={{
                    pageSize: 20,
                    onChange(current, pageSize) {
                        setPage(current);
                        setPageSize(pageSize);
                    }
                }} /></Card>

    )

}

export default EscalationLogView;