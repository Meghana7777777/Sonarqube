import { KnitIdsRequest, PoWhRequestData, PoWhRequestLinesData, PoWhRequestMaterialData } from '@xpparel/shared-models';
import { KnittingJobsService } from '@xpparel/shared-services';
import { Table, Tag, Typography } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
const { Text } = Typography;

export interface CompletedProps {
    selectedProcessingSerial: number;
    searchTrigger: number;
    activeKey: string;
    resetTrigger: number;

}



const CompletedRequests = (props: CompletedProps) => {
    const knittingJobsService = new KnittingJobsService();
    const user = useAppSelector((state) => state.user.user.user);
    const [whReqData, setWhReqData] = useState<PoWhRequestData[]>([]);
    const [poWhRequestLinesData, setPoWhRequestLinesData] = useState<PoWhRequestLinesData[]>([]);
    const [poWhRequestMaterialData, setPoWhRequestMaterialData] = useState<PoWhRequestMaterialData[]>([]);
    const [loadedFirstRows, setLoadedFirstRows] = useState({});
    const [loadedSecondRows, setLoadedSecondRows] = useState({});

    useEffect(() => {
        setWhReqData(() => []);
        setPoWhRequestLinesData(() => []);
        setPoWhRequestMaterialData(() => []);
    }, [props.resetTrigger])

    useEffect(() => {
        console.log('resett trigger..', props.resetTrigger);
        if (props.selectedProcessingSerial !== null && props.activeKey === '2' &&
            props.resetTrigger !== 1) {
            console.log('data method called..', props.resetTrigger);
            getPoWhRequestDataForPoSerial(props.selectedProcessingSerial);
        }
    }, [props.searchTrigger]);





    const getPoWhRequestDataForPoSerial = async (selectedProcessingSerial: number) => {
        const req = new KnitIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [selectedProcessingSerial]);
        const response = await knittingJobsService.getPoWhRequestDataForPoSerial(req);
        if (response.status) {
            setWhReqData(() => []);
            setWhReqData(() => response.data);
        } else {
            setWhReqData(() => []);
            AlertMessages.getErrorMessage(response.internalMessage);
        }
    }

    const getPoWhRequestLinesDataForPoWhRequestId = async (selectedPoWhReqId: number) => {
        const req = new KnitIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [selectedPoWhReqId]);
        const response = await knittingJobsService.getPoWhRequestLinesDataForPoWhRequestId(req);
        if (response.status) {
            setPoWhRequestLinesData(() => []);
            setPoWhRequestLinesData(() => response.data);
            // setPoWhRequestLinesData(prev => [...prev, ...response.data]);
            // setLoadedFirstRows((prev) => ({ ...prev, [selectedPoWhReqId]: true }));
        } else {
            setPoWhRequestLinesData(() => []);
            AlertMessages.getErrorMessage(response.internalMessage);
        }
    }

    const getPoWhRequestMaterialDataForPoWhRequestLinesId = async (selectedPoWhReqLinesId: number) => {
        const req = new KnitIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [selectedPoWhReqLinesId]);
        const response = await knittingJobsService.getPoWhRequestMaterialDataForPoWhRequestLinesId(req);
        if (response.status) {
            setPoWhRequestMaterialData(() => []);
            setPoWhRequestMaterialData(() => response.data);
            // setPoWhRequestMaterialData(prev => [...prev, ...response.data]);
            // setLoadedSecondRows((prev) => ({ ...prev, [selectedPoWhReqLinesId]: true }));

        } else {
            setPoWhRequestMaterialData(() => []);
            AlertMessages.getErrorMessage(response.internalMessage);
        }
    }

    const LastChidcolumns = [
        {
            title: <Text strong>Item Code</Text>,
            dataIndex: 'itemCode',
            key: 'itemCode',
            align: 'center' as 'center',
            render: (text) => <Tag color="purple">{text}</Tag>, // Optional tag styling
        },
        {
            title: <Text strong>Item Type</Text>,
            dataIndex: 'itemType',
            key: 'itemType',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Item Name</Text>,
            dataIndex: 'itemName',
            key: 'itemName',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Object Code</Text>,
            dataIndex: 'objectCode',
            key: 'objectCode',
            align: 'center' as 'center',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: <Text strong>Supplier Code</Text>,
            dataIndex: 'supplierCode',
            key: 'supplierCode',
            align: 'center' as 'center',
            render: (text) => <Tag color="orange">{text}</Tag>,
        },
        {
            title: <Text strong>Object Type</Text>,
            dataIndex: 'objectType',
            key: 'objectType',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Required Qty</Text>,
            dataIndex: 'requiredQty',
            key: 'requiredQty',
            align: 'center' as 'center',
            render: (text) => <Tag color="red">{text}</Tag>,
        },
        {
            title: <Text strong>Allocated Qty</Text>,
            dataIndex: 'allocatedQty',
            key: 'allocatedQty',
            align: 'center' as 'center',
            render: (text) => <Tag color="green">{text}</Tag>,
        },
        {
            title: <Text strong>Issued Qty</Text>,
            dataIndex: 'issuedQty',
            key: 'issuedQty',
            align: 'center' as 'center',
            render: (text) => <Tag color="yellow">{text}</Tag>,
        },
    ];


    const childColumns = [
        {
            title: <Text strong>Processing Serial</Text>,
            dataIndex: 'processingSerial',
            key: 'processingSerial',
            align: 'center' as 'center',
            render: (text) => <Tag color="purple">{text}</Tag>,
        },
        {
            title: <Text strong>Process Type</Text>,
            dataIndex: 'processType',
            key: 'processType',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Job Number</Text>,
            dataIndex: 'jobNumber',
            key: 'jobNumber',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Item Code</Text>,
            dataIndex: 'itemCode',
            key: 'itemCode',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Item Type</Text>,
            dataIndex: 'itemType',
            key: 'itemType',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Item Name</Text>,
            dataIndex: 'itemName',
            key: 'itemName',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Item Color</Text>,
            dataIndex: 'itemColor',
            key: 'itemColor',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Required Qty</Text>,
            dataIndex: 'requiredQty',
            key: 'requiredQty',
            align: 'center' as 'center',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: <Text strong>Allocated Qty</Text>,
            dataIndex: 'allocatedQty',
            key: 'allocatedQty',
            align: 'center' as 'center',
            render: (text) => <Tag color="orange">{text}</Tag>
        },
        {
            title: <Text strong>Issued Qty</Text>,
            dataIndex: 'issuedQty',
            key: 'issuedQty',
            align: 'center' as 'center',
            render: (text) => <Tag color="green">{text}</Tag>
        },
    ];



    const Headercolumns = [
        {
            title: <Text strong>Request Code</Text>,
            dataIndex: 'requestCode',
            key: 'requestCode',
            align: 'center' as 'center',
            render: (text) => <Tag color="green">{text}</Tag>,
        },
        {
            title: <Text strong>Status</Text>,
            dataIndex: 'status',
            key: 'status',
            align: 'center' as 'center',
            render: (status) => {
                let color = 'default';
                switch (status) {
                    case 'OPEN':
                        color = 'blue';
                        break;
                    case 'PARTIALLY_ISSUED':
                        color = 'orange';
                        break;
                    case 'ISSUED':
                        color = 'green';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: <Text strong>Processing Serial</Text>,
            dataIndex: 'processingSerial',
            key: 'processingSerial',
            align: 'center' as 'center',
            render: (text) => <Tag color="purple">{text}</Tag>,
        },
        {
            title: <Text strong>Plan Close Date</Text>,
            dataIndex: 'planCloseDate',
            key: 'planCloseDate',
            align: 'center' as 'center',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: <Text strong>SLA</Text>,
            dataIndex: 'sla',
            key: 'sla',
            align: 'center' as 'center',
            render: (text) => <Tag color="red">{text} days</Tag>,
        },
        {
            title: <Text strong>Requested By</Text>,
            dataIndex: 'requestedBy',
            key: 'requestedBy',
            align: 'center' as 'center',
        },
        {
            title: <Text strong>Created At</Text>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center' as 'center',
            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    const expandedChildRowRender = (record) => {
        return (
            <div style={{ margin: '16px 0', padding: '12px', background: '#fafafa', borderRadius: '8px' }}>
                <Table
                    columns={LastChidcolumns}
                    dataSource={poWhRequestMaterialData}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    bordered
                />
            </div>
        );
    };



    const expandedRowRender = (record) => {
        return (
            <div style={{ margin: '16px 0', padding: '12px', background: '#fafafa', borderRadius: '8px' }}>
                <Table
                    columns={childColumns}
                    dataSource={poWhRequestLinesData}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    bordered
                    expandable={{
                        expandedRowRender: expandedChildRowRender,
                        onExpand: onSecondExpand,
                    }}
                />
            </div>
        );
    };

    const onSecondExpand = async (expanded, record) => {
        if (expanded) {
            setPoWhRequestMaterialData(() => []);
            try {
                getPoWhRequestMaterialDataForPoWhRequestLinesId(record?.id);
            } catch (err) {
                console.error("Error fetching child data:", err);
            }
        }
    };


    const onFirstExpand = async (expanded, record) => {
        if (expanded) {
            setPoWhRequestLinesData(() => []);
            try {
                getPoWhRequestLinesDataForPoWhRequestId(record?.id);
            } catch (err) {
                console.error("Error fetching child data:", err);
            }
        }
    };

    return (
        <div>
            <Table
                columns={Headercolumns}
                dataSource={whReqData}
                rowKey="id"
                pagination={false}
                size="small"
                bordered
                scroll={{ x: 'max-content' }}
                style={{ minWidth: '100%' }}
                expandable={{
                    expandedRowRender,
                    onExpand: onFirstExpand,
                }}
            />
        </div>
    );
};

export default CompletedRequests;
