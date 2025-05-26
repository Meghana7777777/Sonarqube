import { Card, Col, Row, Statistic } from 'antd'
import React from 'react'

export const NoOfMissedPackLists = () => {

    return (
        <Card headStyle={{ background: '#fccb9f' }}
            title={<span style={{ color: 'black', fontStyle: 'italic' }}>No Of Pack Lists Missed Delivery Dates</span>}
            style={{
                background: 'white',
                borderRadius: '6px',
                height: '100px',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Statistic title="Day" value={50} valueStyle={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }} />
                <Statistic title="Month" value={50} valueStyle={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }} />
                <Statistic title="Year" value={200} valueStyle={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }} />
            </div>
        </Card>
    )
}
