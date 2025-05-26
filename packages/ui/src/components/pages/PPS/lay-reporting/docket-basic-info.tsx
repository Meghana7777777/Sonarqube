import { DocketBasicInfoModel, DocketGroupBasicInfoModel } from '@xpparel/shared-models'
import { Card, Descriptions, Table, Tag } from 'antd';
import { docketBindingRequirement, docketRequirementWithoutBinding } from 'packages/libs/shared-calculations/src/common-calculations/common-calcultatoins';
import React from 'react';

export interface IDocketBasicInfoProps {
    docketInfo: DocketGroupBasicInfoModel;
}

export const DocketBasicInfo = (props: IDocketBasicInfoProps) => {
    const { docketInfo } = props;

    const getSizeWiseColumns = () => {
        return [{
            title: 'Plies',
            dataIndex: 'plies',
            width: "5%"
        },
        {
            title: 'Marker Length',
            dataIndex: 'markerLength',
            width: "10%"
        },
        {
            title: 'Total Requirement',
            dataIndex: 'totalRequirement',
            width: "10%"
        },
        ...docketInfo.sizeRatios.map(rec => {
            return {
                title: rec?.size.toLocaleUpperCase(), dataIndex: rec?.size, key: rec?.size, isDefaultSelect: true,
                align: 'center',
                render: (text, record) => {
                    return <div style={{ textAlign: 'end' }}>{Number(text)}</div>
                }
            }
        }),
        {
            title: 'Total Panels',
            dataIndex: 'totalPanels'
        }] as any
    };

    const getRatioData = () => {
        const data = {};
        // TODO: Bad practice of building code
        data['plies'] = docketInfo.plies;
        data['markerLength'] = docketInfo.actualMarkerInfo?.markerLength?docketInfo.actualMarkerInfo?.markerLength:docketInfo.markerInfo.mLength;
        const markerLength = Number(docketInfo.markerInfo.mLength);
        const totalPlies = docketInfo.plies;        
        let totalPanels = 0;
        docketInfo.sizeRatios.forEach(rec => {
            data[rec.size] = rec.ratio;
            totalPanels += docketInfo.plies * rec.ratio;
        });
        data['totalPanels'] = totalPanels * docketInfo.docketNumbers.length;
        const originalDocQuantity = totalPanels;
        const cutWastage = docketInfo.cutWastage;
        const bindingConsumption = docketInfo.bindingConsumption;
        const reqWithOutWastage = docketRequirementWithoutBinding(totalPlies, markerLength);
        const reqWithWastage = docketRequirementWithoutBinding(totalPlies, markerLength, cutWastage);
        const bindReqWithOutWastage = docketBindingRequirement(originalDocQuantity, bindingConsumption);
        const bindReqWithWastage = docketBindingRequirement(originalDocQuantity, bindingConsumption, cutWastage);
        const totalReqWOWastage = Number(reqWithOutWastage) + Number(bindReqWithOutWastage);
        const totalReqWithWastage = Number(reqWithWastage) + Number(bindReqWithWastage);
        data['totalRequirement'] = docketInfo.actualMaterialRequirement ? docketInfo.actualMaterialRequirement : totalReqWithWastage.toFixed(2);
        return [data];
    }
    return (
        <>
            <Descriptions
                bordered
                size='small'
                column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Sale Order No">{docketInfo.mo}</Descriptions.Item>
                <Descriptions.Item label="SO Lines">{docketInfo.moLines?.toString()}</Descriptions.Item>
                <Descriptions.Item label="Cut Order Serial No">{docketInfo.poSerial}</Descriptions.Item>
                <Descriptions.Item label="Cut No">{docketInfo?.docketNumbers?.map(doc => doc.cutNumber)?.toString()}</Descriptions.Item>
                <Descriptions.Item label="Color">{docketInfo?.docketNumbers?.map(doc => doc.fgColor)?.toString()}</Descriptions.Item>
                <Descriptions.Item label="Includes Binding">{docketInfo.hasBinding ? <Tag color='green'>Yes</Tag> : <Tag color='red'>No</Tag>}</Descriptions.Item>
                <Descriptions.Item label="Fabric Code">{[...new Set(docketInfo?.docketNumbers?.map(doc => doc.itemCode))].toString()}</Descriptions.Item>
                <Descriptions.Item label="Fabric Code Desc">{[...new Set(docketInfo?.docketNumbers?.map(doc => doc.itemDesc))].toString()}</Descriptions.Item>
                <Descriptions.Item label="Product Name ">{[...new Set(docketInfo?.docketNumbers?.map(doc => doc.productName))].toString()}</Descriptions.Item>
                <Descriptions.Item label="Sub Docket">{[...new Set(docketInfo?.docketNumbers?.map(doc => doc.docketNumber))].toString()}</Descriptions.Item>
                <Descriptions.Item label="Components">{[...new Set(docketInfo?.docketNumbers?.map(doc => doc.components))].toString()}</Descriptions.Item>
                
            </Descriptions>
            <br />
            <Table size='small' bordered columns={getSizeWiseColumns()} dataSource={getRatioData()} pagination={false} />
        </>
    )
}

export default DocketBasicInfo