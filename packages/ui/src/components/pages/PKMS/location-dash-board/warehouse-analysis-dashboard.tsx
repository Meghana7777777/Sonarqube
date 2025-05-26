import { SearchOutlined } from '@ant-design/icons';
import { FgRackCreationModel, FgRackFilterRequest } from '@xpparel/shared-models';
import { FgRackServices } from '@xpparel/shared-services';
import { Button, Descriptions, Form, Input, InputRef, Select, Table, Tag, Tooltip } from 'antd';
import { CommonRequestAttrs } from 'packages/libs/shared-models/src/common/common-request-attr.model';
import AlertMessages from 'packages/ui/src/components/common/notifications/notification-messages';
import React, { useEffect, useRef, useState } from 'react';
import './material-table.css';
import FGRackCard from './rack-cards';
import './warehouse.css';

import dayjs from 'dayjs';
import { useAppSelector } from 'packages/ui/src/common';

const { Option } = Select;

interface IFGWareHouseAnalysisDashboard {
    whId: number;
    selectedRackBarcodeId: number;
}

export const FGWareHouseAnalysisDashboard = (props: IFGWareHouseAnalysisDashboard) => {
    const { whId } = props;
    const [rackIds, setRackIds] = useState<FgRackCreationModel[]>([]);
    const [selectedRackId, setSelectedRackIds] = useState<any>();
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const user = useAppSelector((state) => state.user.user.user);
    const unitCode = user?.orgData?.unitCode;
    const companyCode = user?.orgData?.companyCode;
    const userName = user?.userName;
    const userId = user?.userId;

    const rackIdService = new FgRackServices();

    useEffect(() => {
        setSelectedRackIds(props.selectedRackBarcodeId);
    }, [props.selectedRackBarcodeId]);
    


    useEffect(() => {
        getRackIds()
    }, []);


    const getRackIds = () => {
        const rackIDReq = new FgRackFilterRequest(companyCode, unitCode, userName, userId, whId);
        rackIdService.getAllRacksData(rackIDReq).then((res) => {
            if (!res.status) {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
            setRackIds(res.data);

        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            return;
        });
    }


    const FGRackCardComponents = () => {
        const FGRackCards = [];
        for (const eachRackId of rackIds) {
            if (selectedRackId) {
                if (eachRackId.barcodeId === selectedRackId)
                    FGRackCards.push(<FGRackCard selectedRackId={selectedRackId} key={eachRackId.id} rackId={eachRackId.id} selectedMaterial={selectedMaterial ? selectedMaterial : undefined} />);
            } else {
                FGRackCards.push(<FGRackCard selectedRackId={selectedRackId} key={eachRackId.id} rackId={eachRackId.id} selectedMaterial={selectedMaterial ? selectedMaterial : undefined} />);
            }
        }
        return FGRackCards;
    };

    const BinLegend = () => {
        const colors = ['green', 'orange', 'red'];
        const tags = ["Empty Pallet Bin", "Partially Occupied Bin", "Fully Occupied Bin"]

        return (
            <div className='bin-legend-container' style={{ display: 'flex', gap: '10px' }}>
                {colors.map((color, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                            className="bin-legend-boxes"
                            style={{
                                backgroundColor: color,
                                width: '15px',
                                height: '15px',
                                borderRadius: '2px',
                            }}
                        ></div>
                        <Tag color={color}>{tags[index]}</Tag>
                    </div>
                ))}
            </div>
        );
    };

    const MaterialCard = ({ material }) => {
        if (!material) return null;

        return (
            <div style={{ margin: '10px 10px 10px 0px' }}>
                <Descriptions className='materialCard-description' title={material.materialName} layout="vertical" bordered>
                    <Descriptions.Item label="Total Length">{material.materialTotalLength.toFixed(2)} mts</Descriptions.Item>
                    <Descriptions.Item label="Number of Rolls">{material.numberOfRolls}</Descriptions.Item>

                    <Descriptions.Item label="GRN Status (rolls/mts)">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                            <span>Completed: <strong>{material.materialGRNStatus?.completedRolls} / {material.materialGRNStatus.completedLength.toFixed(2)} </strong></span><br />
                            <span>Pending: <strong> {material.materialGRNStatus?.pendingRolls} / {material.materialGRNStatus.pendingLength.toFixed(2)} </strong> </span>
                        </div>
                    </Descriptions.Item>

                    <Descriptions.Item label="Relaxation Status (rolls/mts)">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                            <span>Completed: <strong> {material.materialInspectionStatus.approvedRolls} / {material.materialInspectionStatus.approvedLength.toFixed(2)} </strong></span><br />
                            <span>Pending: <strong> {material.materialInspectionStatus.pendingRolls} / {material.materialInspectionStatus.pendingLength.toFixed(2)} </strong> </span>
                        </div>
                    </Descriptions.Item>

                    <Descriptions.Item label="Allocation Status (rolls/mts)">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                            <span>Allocated: <strong> {material.materialAllocationStatus.allocatedRolls} / {material.materialAllocationStatus.allocatedLength.toFixed(2)} </strong> </span><br />
                            <span>Pending: <strong> {material.materialAllocationStatus.pendingAllocatedRolls} / {material.materialAllocationStatus.pendingAllocatedLength.toFixed(2)} </strong> </span>
                        </div>
                    </Descriptions.Item>

                    <Descriptions.Item label="Issued Status (rolls/mts)">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                            <span>Issued: <strong> {material.issued.issuedRolls} / {material.issued.issuedLength.toFixed(2)} </strong></span><br />
                            <span>Pending:  <strong>{material.issued.pendingIssuedRolls} / {material.issued.pendingIssuedLength.toFixed(2)} </strong></span>
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        );
    };


    return (
        <>
            <div className={`warehouse_container`}>
                <div style={{ display: 'flex', justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "baseline" }}>
                    <BinLegend />
                    <div style={{ display: "flex" }} >
                        <div className="filters-container">
                            <Select
                                style={{ width: '200px', marginRight: "5px" }}
                                placeholder="Select Rack Code"
                                allowClear
                                showSearch
                                onChange={(selectedRackIds) => {
                                    setSelectedRackIds(selectedRackIds)
                                }}
                            >
                                {rackIds?.map((rec) => (
                                    <Option key={rec.barcodeId} value={rec.barcodeId}>
                                        {rec.barcodeId}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
                <div style={{ minHeight: "500px", padding: "0px", background: "", overflow: "scroll", scrollbarWidth: "none" }} >
                    {FGRackCardComponents()}
                </div>
            </div>
        </>
    );
};

export default FGWareHouseAnalysisDashboard;