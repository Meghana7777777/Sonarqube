import React from 'react';
import { Card, Tag, Space } from 'antd';
import { MoPslIdsOrderFeatures } from '@xpparel/shared-models';
import { ProCard } from '@ant-design/pro-components';

// Sample data - Replace with your prop or state
interface Props {
    data: MoPslIdsOrderFeatures[]
}
const tagColors = ['#533B4D', '#537D5D'];

const SizeWiseQuantityCard = (props: Props) => {
    const { data } = props
    // Group and sum quantities by size
    const sizeMap: Record<string, number> = data.reduce((acc, item) => {
        const { size, quantity } = item;
        acc[size] = (acc[size] || 0) + quantity;
        return acc;
    }, {} as Record<string, number>);


    


    return (
        <ProCard ghost bordered={false} style={{ borderRadius: 10 }}>
            <Space wrap>
                <b>MO Quantities by Size</b>
                {Object.entries(sizeMap).map(([size, totalQty], index) => (
                    <Tag
                        key={size}
                        color={tagColors[index % tagColors.length]}
                        style={{ fontSize: '16px', padding: '5px 10px' }}
                    >
                        {size}: {totalQty}
                    </Tag>
                ))}
            </Space>
        </ProCard>
    );
};

export default SizeWiseQuantityCard;
