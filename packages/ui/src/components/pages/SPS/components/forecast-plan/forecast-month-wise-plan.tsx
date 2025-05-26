import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import {
    ForecastPlanYearDataModel,
    ForecastPlanYearModel,
    ForecastQtyUpdateRequest,
    ForecastYearDataRequest,
    ForecastYearRequest,
} from '@xpparel/shared-models';
import { Button, Card, Col, message, Modal, Row, Table } from 'antd';
import moment, { Moment } from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import EyeIcon from './../../../../../assets/icons/eye.png';
import { ForecastPlanYearMonthModel, ForecastYearMonthRequest } from '@xpparel/shared-models';
import { ForecastPlanningService } from '@xpparel/shared-services';

interface ForecastMonthWiseComponentProps {
    selectedYear: number;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ForecastMonthWiseComponent: React.FC<ForecastMonthWiseComponentProps> = ({
    selectedYear,
    handleFileUpload,
}) => {
    const [currentMonth, setCurrentMonth] = useState<Moment>(moment(`${selectedYear}-01-01`));
    const [yearData, setYearData] = useState<{ [month: number]: ForecastPlanYearModel[] }>({});
    const [yearDateData, setYearDateData] = useState<ForecastPlanYearDataModel[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const service = new ForecastPlanningService();
    const user = useAppSelector((state) => state.user.user.user);
    const monthsOfYear = moment.months();

    useEffect(() => {
        getForecastDatesByYear();
        setCurrentMonth(moment(`${selectedYear}-01-01`));
    }, [selectedYear]);

    const getForecastDatesByYear = async () => {
        try {
            const req = new ForecastYearRequest(
                user?.userName,
                user?.orgData?.unitCode,
                user?.orgData?.companyCode,
                user?.userId,
                selectedYear
            );
            const res = await service.getForecastDatesByYear(req);
            if (res.status) {
                const groupedData = groupByMonths(res.data, selectedYear);
                setYearData(groupedData);
            } else {
                message.error(res.internalMessage || 'Failed to fetch forecast data.');
            }
        } catch (error) {
            message.error('An unexpected error occurred while fetching forecast data.');
        }
    };

    const getForecastPlansByDate = async (monthNumber: number) => {
        try {
            const req = new ForecastYearDataRequest(
                user?.userName,
                user?.orgData?.unitCode,
                user?.orgData?.companyCode,
                user?.userId,
                selectedYear,
                monthNumber
            );
            const res = await service.getForecastPlansByDate(req);

            if (res.status) {
                setYearDateData(res.data);
                setIsModalVisible(true);
            } else {
                message.error(res.internalMessage || 'Error fetching forecast plans.');
            }
        } catch (error) {
            message.error('An unexpected error occurred while fetching forecast plans.');
        }
    };

    const groupByMonths = (
        data: ForecastPlanYearModel[],
        year: number
    ): { [month: number]: ForecastPlanYearModel[] } => {
        const groupedData: { [month: number]: ForecastPlanYearModel[] } = {};
    
        data.forEach((item) => {
            const date = new Date(item.date);
            if (date.getFullYear() === year) {
                const month = date.getMonth();
                if (!groupedData[month]) {
                    groupedData[month] = [];
                }
                groupedData[month].push(item);
            }
        });
    
        return groupedData;
    };
    

    const handleForecastQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, identifier: string) => {
        const value = Number(e.target.value);
        const updatedData = yearDateData.map((item) =>
            item.date === identifier ? { ...item, forecastQty: value } : item
        );
        setYearDateData(updatedData);
    };

    const updateForecastQty = async () => {
        try {
            const updatedRecords = yearDateData.map((record) => {
                const { date, forecastQty } = record;
                return new ForecastQtyUpdateRequest(
                    user?.userName,
                    user?.orgData?.unitCode,
                    user?.orgData?.companyCode,
                    user?.userId,
                    new Date(date),
                    forecastQty
                );
            });
    
            const res = await service.updateForecastQty(updatedRecords);
            if (res.status) {
                message.success('Forecast quantity updated successfully!');
                setIsModalVisible(false);
            } else {
                message.error('Error updating forecast data.');
            }
        } catch (error) {
            message.error('Error occurred while updating forecast data.');
        }
    };
    

    const getIcon = (monthNumber: number) => {
        const yearsData = yearData?.[monthNumber - 1];
        const isUploaded = yearsData?.some((item) => item.isUploaded);

        if (isUploaded) {
            return (
                <>
                    <CheckCircleOutlined
                        style={{ color: 'green', fontSize: '24px', cursor: 'pointer' }}
                    />
                    <img
                        src={EyeIcon}
                        alt="eye outlined"
                        height="20px"
                        width="20px"
                        style={{ marginLeft: '15px', cursor: 'pointer' }}
                        onClick={() => getForecastPlansByDate(monthNumber)}
                    />
                </>
            );
        }

        return (
            <>
                <UploadOutlined
                    onClick={() => document.getElementById('file-input')?.click()}
                    style={{ color: 'blue', fontSize: '24px', cursor: 'pointer' }}
                />
                <input
                    type="file"
                    id="file-input"
                    style={{ display: 'none' }}
                    accept=".xlsx"
                    onChange={handleFileUpload}
                />
            </>
        );
    };

    const viewColumns = [
        { title: 'Module', dataIndex: 'module' },
        { title: 'Workstation Code', dataIndex: 'workstationCode' },
        { title: 'Style or MO', dataIndex: 'styleOrMo' },
        { title: 'Schedule or MO Line', dataIndex: 'scheduleOrMoLine' },
        { title: 'Color', dataIndex: 'color' },
        { title: 'Plan Cut Date', dataIndex: 'planCutDate' },
        { title: 'Plan Delivery Date', dataIndex: 'planDelDate' },
        { title: 'Plan Pieces', dataIndex: 'planPcs' },
        { title: 'Plan SAH', dataIndex: 'planSah' },
        { title: 'SMV', dataIndex: 'smv' },
        { title: 'Plan SMO', dataIndex: 'planSmo' },
        { title: 'Plan Efficiency', dataIndex: 'planEff' },
        { title: 'Plan Type', dataIndex: 'planType' },
        { title: 'Date', dataIndex: 'date' },
        {
            title: 'Forecast Quantity',
            dataIndex: 'forecastQty',
            render: (_, record) => (
                <input
                    type="number"
                    value={record.forecastQty ?? (record.planPcs || 0)}
                    onChange={(e) => handleForecastQuantityChange(e, record.date)}
                    style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
                />
            ),
        },
    ];

    return (
        <div>
            <Card className="dates-card">
                <Row gutter={[16, 16]} justify="center">
                    {monthsOfYear.map((month, index) => (
                        <Col key={index} span={2} xs={6} sm={4} md={2} className="day-col">
                            <Card
                                className="day-card"
                                hoverable
                                onClick={() => setCurrentMonth(moment(`${selectedYear}-${index + 1}-01`))}
                            >
                                <div className="day-content">{month}</div>
                                <div className="day-icon">{getIcon(index + 1)}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
            <Modal
                title="Uploaded Data"
                width="90%"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={updateForecastQty}>
                        Update
                    </Button>,
                ]}
            >
                <Table
                    columns={viewColumns}
                    dataSource={yearDateData}
                    rowKey={(record) => record.date || record.key}
                    pagination={false}
                />
            </Modal>
        </div>
    );
};
