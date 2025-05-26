import { Card, Statistic } from 'antd';
import React, { useState } from 'react';

export const OnTimeDeliveriesCount = () => {

    return (
        <Card headStyle={{ background: '#fccb9f' }}
            title={<span style={{ color: 'black', fontStyle: 'italic' }}>On Time Deliveries Count</span>}
            style={{
                background: 'white',
                borderRadius: '6px',
                height: '100px',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Statistic title="Day" value={75} valueStyle={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }} />
                <Statistic title="Month" value={50} valueStyle={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }} />
                <Statistic title="Year" value={100} valueStyle={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }} />
            </div>
        </Card>
    )
}
