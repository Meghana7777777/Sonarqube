import { Card, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import truck from './icons/trucks.png';
import { GrnServices } from '@xpparel/shared-services';

export const NoOfVehiclesInThePlantCurrently = () => {
    const service: GrnServices = new GrnServices();
    const [vehiclesData, setVehiclesData] = useState<any>([]);


    useEffect(() => {
        getVehiclesDataInPlants();
    }, [])
    const getVehiclesDataInPlants = () => {
        service.getNoOfVehiclesInPlant().then((res) => {
            if (res.status) {
                setVehiclesData(res.data)
            } else {
                setVehiclesData([])
            }
        }).catch((err) => {
            console.log(err.message)
        })
    }

    return (
        <Card headStyle={{ background: '#fccb9f' }}
            title={<span style={{ color: 'black', fontStyle: 'italic' }}>No Of Vehicles In Plant</span>}
            style={{
                background: 'white',
                borderRadius: '6px',
                height: '130px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={truck} alt="Truck img" style={{ width: '150px', height: '130px', marginRight: '20px' }} />
                <Statistic
                    value={vehiclesData.length}
                    style={{ fontSize: '24px' }}
                    valueStyle={{ color: 'black', marginLeft: '20px', fontWeight: '600' }}
                />
            </div>
        </Card>
    );
};
