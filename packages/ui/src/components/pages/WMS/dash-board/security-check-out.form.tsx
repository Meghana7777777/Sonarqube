import { Card, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import unloadingImg from './icons/unloading.png';
import completed from './icons/men-removebg-preview.png';
import unloadingcompleted from './icons/done.png';
import waitingtruck from './icons/waitingtruck.png';
import securitygate from './icons/securitygate.png';
import { GrnServices } from '@xpparel/shared-services';

export const VehicleSecurityCheckOut = () => {

    const [vehiclesNotAtCheckoutData, setVehiclesNotAtCheckoutData] = useState<any>([]);
    const service = new GrnServices();

    useEffect(() => {
        getVehiclesNotAtSecurityCheckoutData();
    }, [])
    const getVehiclesNotAtSecurityCheckoutData = () => {
        service.getUnloadingCompletedNotAtSecurityCheckOutVehicles().then((res) => {
            if (res.status) {
                setVehiclesNotAtCheckoutData(res.data)
            } else {
                setVehiclesNotAtCheckoutData([])
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }
    return (
        <div>
            <Card headStyle={{ background: '#fccb9f' }}
                title={<span style={{ color: 'black', fontStyle: 'italic' }}>Vehicls Which Are Completed Unloading And Not At Security Check Out</span>}
                style={{
                    background: 'white',
                    borderRadius: '6px',
                    height: '130px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={unloadingImg} alt="Packing Lists img" style={{ width: '80px', height: '80px' }} />
                    <img src={completed} alt="Packing Lists img" style={{ width: '80px', height: '80px' }} />
                    <img src={unloadingcompleted} alt="Packing Lists img" style={{ width: '80px', height: '80px' }} />
                    <img src={waitingtruck} alt="Packing Lists img" style={{ width: '80px', height: '80px' }} />
                    <img src={securitygate} alt="Packing Lists img" style={{ width: '80px', height: '80px' }} />

                    <Statistic
                        value={vehiclesNotAtCheckoutData.length}
                        style={{ fontSize: '24px', marginRight: '50px', fontWeight: '600' }}
                        valueStyle={{ color: 'black' }}
                    />
                </div>
            </Card >
        </div >
    )
}
