import { useState, useCallback, useEffect } from 'react';
import { Modal, Button, Table, Input, Space, Row, Col, Tag, message, Tooltip } from 'antd';
import { ReloadOutlined, ExpandOutlined, CompressOutlined, PoundCircleOutlined } from '@ant-design/icons';
import { KnittingJobMaterialAllocationService, KnittingReportingService } from '@xpparel/shared-services';
import { KJ_C_KnitJobNumberRequest, KJ_R_LocationKnitJobsSummaryRequest, KJ_R_LocationKnitJobsSummaryModel, KG_JobWiseMaterialAllocationDetail, KJ_C_KnitJobSizeReportingRequest, KJ_C_KnitJobReportingRequest, KJ_MaterialStatusEnum, GbGetAllLocationsDto } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../../common';
import { ColumnsType } from 'antd/es/table';

interface ReportedQty {
    size: string;
    fgColor: string;
    reportedQty: number;
    rejectedQty: number;
    weight: number;
    reportedOn: string;
    reportedBy: string;
}

interface ExtendedJobModel extends KJ_R_LocationKnitJobsSummaryModel {
    pending?: number;
}

interface IProps {
    visible: boolean;
    location: GbGetAllLocationsDto;
    onClose: () => void
    responseSet?: React.ReactNode;
}

const KnittingLocationJobInfo = (props: IProps) => {
    const { location, onClose, visible } = props;
    const [jobData, setJobData] = useState<ExtendedJobModel[]>([]);
    const [materialDetails, setMaterialDetails] = useState<Record<string, KG_JobWiseMaterialAllocationDetail[]>>({});
    const [inputValues, setInputValues] = useState<Record<string, Record<string, string>>>({});
    const [loading, setLoading] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const user = useAppSelector((state) => state.user.user.user);
    const knitService = new KnittingReportingService();
    const knittingJobMaterialAllocationService = new KnittingJobMaterialAllocationService();

    useEffect(() => {
        if (visible) {
            fetchJobSummary();
        } else {
            setJobData([]);
            setMaterialDetails({});
            setInputValues({});
            setExpandedRowKeys([]);
            setIsAllExpanded(false);
        }
    }, [visible]);

    const fetchJobSummary = async () => {
        if (!location?.locationCode) return;

        try {
            setLoading(true);
            const req = new KJ_R_LocationKnitJobsSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, location.locationCode, true, true, true);
            const response = await knitService.getKnitJobReportedSummaryForJobNumbersUnderALocationId(req);
            if (response.status) {
                const updatedJobData = (response.data || []).map((job) => ({
                    ...job,
                    pending: job.jobQty - (job.reportedQtys?.reduce((sum, size) => sum + size.reportedQty, 0) || 0),
                }));
                setJobData(updatedJobData);
            } else {
                AlertMessages.getErrorMessage(response.internalMessage)
            }
        } catch (error) {
            // AlertMessages.getErrorMessage(error.message);
            setJobData([]);
        } finally {
            setLoading(false);
        }
    }

    const fetchMaterialAllocationDetails = useCallback(async (jobNumber: string) => {
        if (!jobNumber || materialDetails[jobNumber]?.length > 0) return;

        try {
            setLoading(true);
            const req = new KJ_C_KnitJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [jobNumber]);
            const response = await knittingJobMaterialAllocationService.getJobWiseMaterialAllocationDetailsForKnitJob(req);
            const newData = response.data || [];
            setMaterialDetails((prev) => ({
                ...prev,
                [jobNumber]: newData.length > 0 ? newData : []
            }));
        } catch (error) {
            // AlertMessages.getErrorMessage(error.message);
            setMaterialDetails((prev) => ({ ...prev, [jobNumber]: [] }));
        } finally {
            setLoading(false);
        }
    }, [user]);

    const handleAutoFillAllPending = () => {
        const newInputValues: Record<string, Record<string, string>> = {};
        jobData.forEach((record) => {
            if (record.pending && record.pending > 0) {
                newInputValues[record.jobNumber] = {};
                record.reportedQtys.forEach((sizeData) => {
                    newInputValues[record.jobNumber][`${sizeData.size}_goodQty`] = record.pending?.toString() || '0';
                });
            }
        });
        setInputValues(newInputValues);
    };

    const handleToggleExpandAll = () => {
        if (isAllExpanded) {
            setExpandedRowKeys([]);
            setIsAllExpanded(false);
        } else {
            const allKeys = jobData.map(job => job.jobNumber || '');
            setExpandedRowKeys(allKeys);
            setIsAllExpanded(true);
            allKeys.forEach(jobNumber => {
                if (jobNumber) {
                    fetchMaterialAllocationDetails(jobNumber);
                }
            });
        }
    };

    const handleInputChange = (recordKey: string, field: string, value: string) => {
        setInputValues((prev) => ({
            ...prev,
            [recordKey]: {
                ...prev[recordKey],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (record: ExtendedJobModel) => {
        console.log(record.rmStatus, KJ_MaterialStatusEnum.OPEN)
        if (record.rmStatus.toString() === KJ_MaterialStatusEnum.OPEN.toString() || record.rmStatus.toString() === KJ_MaterialStatusEnum.REQUESTED.toString()) {
            //return alert message as  job reporting can not be done with out material issuance
            AlertMessages.getErrorMessage('Job reporting can not be done with out material issuance');
            return;

        }
        const sizeQtysArray: KJ_C_KnitJobSizeReportingRequest[] = record.reportedQtys.map((sizeData) => {
            const goodQty = parseInt(inputValues[record.jobNumber]?.[`${sizeData.size}_goodQty`] || '0');
            const rejQty = parseInt(inputValues[record.jobNumber]?.[`${sizeData.size}_rejQty`] || '0');
            const weight = parseFloat(inputValues[record.jobNumber]?.[`${sizeData.size}_weight`] || '0');

            return {
                size: sizeData.size,
                goodQty: isNaN(goodQty) ? 0 : goodQty,
                rejQty: isNaN(rejQty) ? 0 : rejQty,
                weight: isNaN(weight) ? 0 : weight
            };
        });

        const selectedSizes = sizeQtysArray.filter(size => size.goodQty > 0 || size.rejQty > 0 || size.weight > 0);

        if (selectedSizes.length === 0) {
            AlertMessages.getErrorMessage('Please enter at least one valid quantity or weight');
            return;
        }

        const totalGoodQty = selectedSizes.reduce((sum, size) => sum + size.goodQty, 0);
        const totalRejQty = selectedSizes.reduce((sum, size) => sum + size.rejQty, 0);
        const totalWeight = selectedSizes.reduce((sum, size) => sum + size.weight, 0);
        const selectedSizeNames = selectedSizes.map(size => size.size).join(',');

        if ((totalGoodQty + totalRejQty) > (record.pending || 0)) {
            AlertMessages.getErrorMessage(`Total quantity (good + reject = ${totalGoodQty + totalRejQty}) cannot exceed pending quantity (${record.pending})`);
            return;
        }

        const aggregatedSizeQty: KJ_C_KnitJobSizeReportingRequest = {
            size: selectedSizeNames,
            goodQty: totalGoodQty,
            rejQty: totalRejQty,
            weight: totalWeight
        };

        const requestPayload = new KJ_C_KnitJobReportingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, Number(record.procSerial), record.jobNumber, new Date().toISOString(), aggregatedSizeQty);

        try {
            setLoading(true);
            const response = await knitService.reportKnitJob(requestPayload);
            const updatedRecord: ExtendedJobModel = {
                ...record,
                // completedQty: record.reportedQtys.reduce((sum, size) => sum + size.reportedQty, 0) + totalGoodQty,
                pending: Math.max(0, (record.pending || 0) - totalGoodQty),
                reportedQtys: record.reportedQtys.map((sizeData) => {
                    const updatedSize = selectedSizes.find((s) => s.size === sizeData.size);
                    return {
                        ...sizeData,
                        reportedQty: sizeData.reportedQty + (updatedSize?.goodQty || 0),
                        rejectedQty: sizeData.rejectedQty + (updatedSize?.rejQty || 0),
                        weight: sizeData.weight + (updatedSize?.weight || 0),
                        reportedOn: updatedSize ? new Date().toISOString() : sizeData.reportedOn,
                        reportedBy: updatedSize ? (user?.userName || '') : sizeData.reportedBy
                    };
                }),
                rmStatus: (record.pending || 0) - totalGoodQty <= 0 ? KJ_MaterialStatusEnum.COMPLETELY_ISSUED : record.rmStatus,
            };

            setJobData((prevData) =>
                prevData.map((job) => (job.jobNumber === record.jobNumber ? updatedRecord : job))
            );
            setInputValues((prev) => ({
                ...prev,
                [record.jobNumber]: {},
            }));
            AlertMessages.getSuccessMessage(response.internalMessage);
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setLoading(true);
            await fetchJobSummary();
            setInputValues({});
            // setExpandedRowKeys([]);
            // setIsAllExpanded(false);
        } catch (error) {
            AlertMessages.getErrorMessage(error.internalMessage);
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<any> = [
        { title: 'Job Number', dataIndex: 'jobNumber', key: 'jobNumber', align: 'center' },
        { title: 'Sequence', dataIndex: '', key: '', align: 'center' },
        { title: 'Quantity', dataIndex: 'jobQty', key: 'jobQty', align: 'center' },
        {
            title: 'Completed',
            key: 'completedQty',
            render: (_, record: ExtendedJobModel) =>
                record.reportedQtys.reduce((sum, size) => sum + size.reportedQty, 0),
            align: 'center'
        },
        { title: 'Pending', dataIndex: 'pending', key: 'pending', align: 'center' },
        { title: 'Material Status', dataIndex: 'rmStatus', key: 'rmStatus', align: 'center' },
        { title: 'Component', dataIndex: 'component', key: 'component', align: 'center' },
        { title: 'Knit Group', dataIndex: 'knitGroup', key: 'knitGroup', align: 'center' },
    ];

    const expandedRowRender = (record: ExtendedJobModel) => {
        const detailColumns: ColumnsType<any> = [
            { title: 'Size', dataIndex: 'size', key: 'size', width: 100, align: 'center' },
            {
                title: 'Quantity',
                key: 'quantity',
                width: 200,
                render: (_, row: ReportedQty) => (
                    <>
                        <Tooltip title="Job Qty">

                            <Tag color="blue">{record.jobQty}</Tag>
                        </Tooltip>
                        <Tooltip title="Reported Qty">
                            <Tag color="green">{row.reportedQty}</Tag>
                        </Tooltip>
                        <Tooltip title="Pending Qty">
                            <Tag color="red">{record.pending}</Tag>
                        </Tooltip>
                    </>
                ),
                align: 'center'
            },
            {
                title: 'Current Reporting Quantity',
                key: 'currentReporting',
                width: 250,
                render: (_, row: ReportedQty) => (
                    <Space>
                        <Input
                            size="small"
                            style={{ width: 80 }}
                            placeholder="Good Qty"
                            value={inputValues[record.jobNumber]?.[`${row.size}_goodQty`] || ''}
                            onChange={(e) => handleInputChange(record.jobNumber, `${row.size}_goodQty`, e.target.value)}
                            disabled={loading}
                        />
                        <Input
                            size="small"
                            style={{ width: 80 }}
                            placeholder="Rej Qty"
                            value={inputValues[record.jobNumber]?.[`${row.size}_rejQty`] || ''}
                            onChange={(e) => handleInputChange(record.jobNumber, `${row.size}_rejQty`, e.target.value)}
                            disabled={loading}
                        />
                    </Space>
                ),
                align: 'center'
            },
            {
                title: 'Weight',
                key: 'weight',
                width: 150,
                render: (_, row: ReportedQty) => (
                    <Input
                        size="small"
                        style={{ width: 80 }}
                        value={inputValues[record.jobNumber]?.[`${row.size}_weight`] || ''}
                        onChange={(e) => handleInputChange(record.jobNumber, `${row.size}_weight`, e.target.value)}
                        disabled={loading}
                    />
                ),
                align: 'center'
            },
            {
                title: 'Action',
                key: 'action',
                width: 150,
                render: (_, row: ReportedQty) => (
                    <Button
                        type="primary"
                        onClick={() => handleSubmit(record)}
                        loading={loading}
                        disabled={loading}
                        className='btn-green'


                    >
                        Submit
                    </Button>
                ),
                align: 'center'
            },
        ];

        const materialColumns: ColumnsType<any> = [
            { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode', width: 100, align: 'center' },
            { title: 'Allocated Qty', dataIndex: 'allocatedQty', key: 'allocatedQty', width: 100, align: 'center' },
            { title: 'Issued Qty', dataIndex: 'issuedQty', key: 'issuedQty', width: 100, align: 'center' },
        ];

        const materialData = (materialDetails[record.jobNumber] || []).flatMap((detail) =>
            (detail.itemWiseAllocatedDetails || []).map((item) => ({
                key: `${record.jobNumber}-${item.itemCode}`,
                itemCode: item.itemCode || 'N/A',
                allocatedQty: item.totalRequiredQty || 0,
                issuedQty: item.objectWiseDetail?.reduce((sum, obj) => sum + (Number(obj.issuedQuantity) || 0), 0) || 0,
            }))
        );


        return (
            <Row gutter={16} align="top">
                <Col span={17}>
                    <Table
                        columns={detailColumns}
                        dataSource={record.reportedQtys.map((r, i) => ({ key: i, ...r }))}
                        pagination={false}
                        size="small"
                        style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
                        scroll={{ x: 'max-content' }}
                        bordered
                    />
                </Col>
                <Col span={7}>
                    <Table
                        columns={materialColumns}
                        dataSource={materialData.length > 0 ? materialData : []}
                        pagination={false}
                        size="small"
                        style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
                        scroll={{ x: 'max-content' }}
                        locale={{ emptyText: 'No material data available' }}
                    />
                </Col>
            </Row>
        );
    };

    return (
        <Modal
            title={<Space style={{ flexWrap: 'wrap', gap: '8px' }}> Job Details for Location Code :{' '} {location?.locationCode && <Tag color="blue">{location.locationCode}</Tag>}</Space>}
            open={visible}
            onCancel={onClose}
            width="90%"
            style={{ maxWidth: 1600 }}
            footer={[<Button key="close" onClick={onClose} disabled={loading}>Close</Button>]}        >
            <Row justify="space-between" align="middle" gutter={[8, 8]} style={{ flexWrap: 'wrap', marginBottom: '10px' }}>
                <Col xs={24} sm={16} md={18} style={{ display: 'flex', alignItems: 'center' }}>
                    <Space style={{ flexWrap: 'wrap', gap: '8px', width: '100%' }}>
                        <Button
                            type="primary"
                            size="small"
                            className="btn-blue"
                            icon={isAllExpanded ? <CompressOutlined /> : <ExpandOutlined />}
                            onClick={handleToggleExpandAll}
                            disabled={loading || jobData.length === 0}
                            style={{ width: '100%', maxWidth: '150px', fontSize: '14px', padding: '4px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            {isAllExpanded ? 'Collapse All' : 'Expand All'}
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            className="btn-orange"
                            onClick={handleAutoFillAllPending}
                            disabled={
                                loading || jobData.every((record) => !record.pending || record.pending <= 0)
                            }
                            style={{ width: '100%', maxWidth: '150px', fontSize: '14px', padding: '4px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            Auto-Fill Qty
                        </Button>
                    </Space>
                </Col>
                <Col xs={24} sm={8} md={6} style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={loading}
                        disabled={loading}
                        style={{ width: '100%', maxWidth: '50px', fontSize: '14px', padding: '4px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={jobData.map((job, index) => ({ ...job, key: job.jobNumber || index }))}
                expandable={{
                    expandedRowRender,
                    expandedRowKeys,
                    onExpand: (expanded, record) => {
                        const jobNumber = record.jobNumber;
                        if (expanded && jobNumber) {
                            setExpandedRowKeys((prev) => [...prev, jobNumber]);
                            fetchMaterialAllocationDetails(jobNumber);
                        } else if (!expanded && jobNumber) {
                            setExpandedRowKeys((prev) => prev.filter((key) => key !== jobNumber));
                        }
                    },
                }}
                pagination={false}
                size="small"
                style={{ marginTop: '10px', borderRadius: '10px', overflowX: 'auto', fontSize: '14px' }}
                loading={loading}
                bordered
                scroll={{ x: 'max-content' }}
            />
        </Modal>
    );
};

export default KnittingLocationJobInfo;