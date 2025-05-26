import { Card, Statistic } from 'antd';
import React, { useState } from 'react';
import packLists from './icons/packing-lists.png';

export const NoOfPacklistsYetToCome = () => {

    return (
        <>
            <Card headStyle={{ background: '#fccb9f' }}
                title={<span style={{ color: 'black', fontStyle: 'italic' }}>No Of Pack Lists Count</span>}
                style={{
                    background: 'white',
                    borderRadius: '6px',
                    height: '130px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={packLists} alt="Packing Lists img" style={{ width: '80px', height: '80px' }} />
                    <Statistic
                        value={10}
                        style={{ marginRight: '20px', fontWeight: 600, fontSize: '24px' }}
                        valueStyle={{ color: 'black' }}
                    />
                </div>
            </Card>
        </>
    )
}
