import React, { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Input, Button, Form, Select, message, Modal, Table, Space, Tag, Switch, Row } from 'antd';
import dayjs from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';
import './sewing-barcode-scanner.css';
import manualIcon from '../../../../../assets/images/OperationTracking/settings.png';
import automaticIcon from '../../../../../assets/images/OperationTracking/ai.png'
import goodIcon from '../../../../../assets/images/OperationTracking/quality-control.png'
import rejectedIcon from '../../../../../assets/images/OperationTracking/reject.png'
import { BarcodeReportingModeEnum, BarcodeTransactionTypeEnum } from '@xpparel/shared-models';


export interface ModeAndTypeUpdate {
    setModeAndType: (obj) => void;
}
export const ModeAndTransTypeSection = (props: ModeAndTypeUpdate) => {
    const [state, setState] = useState({
        barcodeTransactionType: null as BarcodeTransactionTypeEnum | null,
        barcodeReportingMode: null as BarcodeReportingModeEnum | null
    });

    const handleSelectorChange = (mode: BarcodeReportingModeEnum) => {
        if (mode === BarcodeReportingModeEnum.AUTOMATIC) {
            setState({
                barcodeReportingMode: mode,
                barcodeTransactionType: BarcodeTransactionTypeEnum.GOOD
            });
        } else {
            setState({ ...state, barcodeReportingMode: mode });
        }
        props.setModeAndType({
            barcodeReportingMode: mode,
            barcodeTransactionType: mode === BarcodeReportingModeEnum.AUTOMATIC ? BarcodeTransactionTypeEnum.GOOD: state.barcodeTransactionType
        });
    };

    const handleStatusChange = (transactionType: BarcodeTransactionTypeEnum) => {
        if (state.barcodeReportingMode === BarcodeReportingModeEnum.MANUAL ||
            (state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC && transactionType === BarcodeTransactionTypeEnum.GOOD)) {
            setState({ ...state, barcodeTransactionType: transactionType });
        }
        props.setModeAndType({
            barcodeReportingMode: state.barcodeReportingMode,
            barcodeTransactionType: transactionType
        });
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: 'space-evenly',flexDirection:'column', margin: "10px 0px", alignItems: 'center', marginLeft: "-24px" }}>
            <Row>
                <div style={{ display: "flex", justifyContent: 'space-around', width: "238px", marginLeft: "8px" }}>
                    <Button className="selection-buttons"
                        type={state.barcodeReportingMode === BarcodeReportingModeEnum.MANUAL ? 'primary' : 'default'}
                        onClick={() => handleSelectorChange(BarcodeReportingModeEnum.MANUAL)}
                        style={{
                            border: state.barcodeReportingMode === BarcodeReportingModeEnum.MANUAL ? 'none' : '2px dotted #047595',
                            backgroundColor: state.barcodeReportingMode === BarcodeReportingModeEnum.MANUAL ? '#047595' : 'none',
                            color: state.barcodeReportingMode === BarcodeReportingModeEnum.MANUAL ? 'white' : 'black',
                            transform: state.barcodeReportingMode === BarcodeReportingModeEnum.MANUAL ? 'scale(1.1)' : 'scale(1)',
                            opacity: state.barcodeReportingMode === BarcodeReportingModeEnum.MANUAL ? 1 : 0.7,
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                        }}
                    >
                        <img src={manualIcon} alt="Manual Icon" style={{ height: "20px", width: "20px", marginRight: '0px', display: "flex", marginLeft: '22px' }} />
                        Manual
                    </Button>
                    <Button className="selection-buttons"
                        type={state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC ? 'primary' : 'default'}
                        onClick={() => handleSelectorChange(BarcodeReportingModeEnum.AUTOMATIC)}
                        style={{
                            border: state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC ? 'none' : '2px dotted #047595',
                            backgroundColor: state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC ? '#047595' : 'none',
                            color: state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC ? 'white' : 'black',
                            transform: state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC ? 'scale(1.1)' : 'scale(1)',
                            opacity: state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC ? 1 : 0.7,
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                            marginLeft: '10px',
                        }}
                    >
                        <img src={automaticIcon} alt="Auto Icon" style={{ height: "20px", width: "20px", marginRight: '0px', display: "flex", marginLeft: '22px' }} />
                        Automatic
                    </Button>
                </div>
            </Row>
            <br/>
            <Row>
                <div style={{ width: "234px", marginLeft: '25px', display: "flex" }}>
                    <Button className="selection-buttons"
                        type={state.barcodeTransactionType === BarcodeTransactionTypeEnum.GOOD ? 'primary' : 'default'}
                        onClick={() => handleStatusChange(BarcodeTransactionTypeEnum.GOOD)}
                        style={{
                            border: state.barcodeTransactionType === BarcodeTransactionTypeEnum.GOOD ? 'none' : '2px dotted rgb(12, 216, 57)',
                            backgroundImage: state.barcodeTransactionType === BarcodeTransactionTypeEnum.GOOD ? "linear-gradient(152deg, rgb(26, 16, 35), rgb(12, 216, 57))" : "none",
                            color: state.barcodeTransactionType === BarcodeTransactionTypeEnum.GOOD ? 'white' : 'black',
                            transform: state.barcodeTransactionType === BarcodeTransactionTypeEnum.GOOD ? 'scale(1.1)' : 'scale(1)',
                            opacity: state.barcodeTransactionType === BarcodeTransactionTypeEnum.GOOD ? 1 : 0.7,
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                            marginRight: '13px',
                        }}
                        disabled={!state.barcodeReportingMode || state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC && state.barcodeTransactionType !== BarcodeTransactionTypeEnum.GOOD}
                    >
                        <img src={goodIcon} alt="Good Icon" style={{ height: "20px", width: "20px", marginRight: '0px', display: "flex", marginLeft: '22px' }} />
                        Good
                    </Button>
                    <Button className="selection-buttons"
                        type={state.barcodeTransactionType === BarcodeTransactionTypeEnum.REJECTION ? 'primary' : 'default'}
                        onClick={() => handleStatusChange(BarcodeTransactionTypeEnum.REJECTION)}
                        disabled={!state.barcodeReportingMode || state.barcodeReportingMode === BarcodeReportingModeEnum.AUTOMATIC}
                        style={{
                            border: state.barcodeTransactionType === BarcodeTransactionTypeEnum.REJECTION ? 'none' : '2px dotted rgb(253, 19, 61)',
                            backgroundImage: state.barcodeTransactionType === BarcodeTransactionTypeEnum.REJECTION ? "linear-gradient(147deg, rgb(94, 5, 4), rgb(253, 19, 61))" : "none",
                            color: state.barcodeTransactionType === BarcodeTransactionTypeEnum.REJECTION ? 'white' : 'black',
                            transform: state.barcodeTransactionType === BarcodeTransactionTypeEnum.REJECTION ? 'scale(1.1)' : 'scale(1)',
                            opacity: state.barcodeTransactionType === BarcodeTransactionTypeEnum.REJECTION ? 1 : 0.7,
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                            marginLeft: '10px',
                        }}
                    >
                        <img src={rejectedIcon} alt="Rejected Icon" style={{ height: "20px", width: "20px", marginRight: '0px', display: "flex", marginLeft: '22px' }} />
                        Rejected
                    </Button>
                </div>
            </Row>
            </div>
        </>
    );
};
