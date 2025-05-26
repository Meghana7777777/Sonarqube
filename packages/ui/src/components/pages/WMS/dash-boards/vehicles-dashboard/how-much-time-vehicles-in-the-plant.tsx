import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { GrnServices } from '@xpparel/shared-services';

export const VehicleTimeInPlant = () => {
    const [vehicleData, setVehicleData] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState<string>(moment().format('MMMM DD, YYYY'));
    const service = new GrnServices();

    useEffect(() => {
        getVehicleData();
    }, []);

    const getVehicleData = () => {
        service.getHowMuchTimeVehicleInThePlant()
            .then((res) => {
                if (res.status) {
                    const dataWithAverageTime = res.data.map((item) => ({
                        ...item,
                        averageTime: calculateAverageTime(item.inAt, item.outAt),
                    }));
                    setVehicleData(dataWithAverageTime);
                } else {
                    throw new Error(res.internalMessage);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const calculateAverageTime = (inAt: string, outAt: string): string => {
        const entryDate = new Date(`${inAt}`);
        const exitDate = new Date(`${outAt}`);
        const timeDifference = exitDate.getTime() - entryDate.getTime();
        const averageTimeMinutes = timeDifference / (1000 * 60);

        const hours = Math.floor(averageTimeMinutes / 60);
        const remainingMinutes = Math.round(averageTimeMinutes % 60);

        return `${hours}h ${remainingMinutes}m`;
    };

    const columns: any = [
        {
            title: 'Vehicle Number',
            dataIndex: 'vehicleNumber',
            key: 'vehicleNumber',
            fixed: 'top',
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
        },
        // {
        //     title: 'No of Rolls',
        //     dataIndex: 'rollCount',
        //     key: 'rolls',
        // },
        {
            title: 'Entry Time',
            dataIndex: 'entryTime',
            key: 'entryTime',
            render: (entryTime) => moment(entryTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Exit Time',
            dataIndex: 'exitTime',
            key: 'exitTime',
            render: (exitTime) => moment(exitTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Average Time',
            dataIndex: 'averageTime',
            key: 'averageTime',
        },
        {
            title: 'Current Date',
            dataIndex: 'currentDate',
            key: 'currentDate',
            render: (_, record) => currentDate,
        },
    ];

    return (
        <div style={{ maxWidth: '800px', padding: '16px', margin: '8px', backgroundColor: '#F0FFFF' }}>
            <div>
                <Table
                    dataSource={vehicleData}
                    columns={columns}
                    pagination={false}
                    style={{ backgroundColor: '#F0FFFF' }}
                    scroll={{ y: 140 }}
                />
            </div>
        </div>
    );
};
