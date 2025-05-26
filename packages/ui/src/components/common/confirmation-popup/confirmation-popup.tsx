import './confirmation-popup.css';
import React from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import Icon from '@ant-design/icons';

// Confirmation Popup props to set icon and text
export interface ConfirmationPopupProps {
    closable?: boolean;
    type: 'question' | 'check' | 'close-circle';
    visible: boolean;
    iconText: string;
    text: string;
    yesNo: boolean;
    ok: boolean;
    onOk?: () => void;
    onYes?: () => void;
    onNo?: () => void;
}

export const ConfirmationPopup = (props: ConfirmationPopupProps) => {

    const onOk = () => {
        try {
            props.onOk();
        } catch { }
    }

    const onNo = () => {
        try {
            props.onNo();
        } catch { }
    }

    const onYes = () => {
        try {
            props.onYes();
        } catch { }
    }

    const getBackgroundColor = () => {
        switch (props.type) {
            case 'question':
            case 'close-circle':
                return 'red';
            case 'check':
            default:
                return 'green';
        }
    }

    return (
        <Modal
            footer={null}
            closable={props.closable}
            open={props.visible}
        >

            <Row>
                <Row justify='center'>
                    <Icon
                        type={props.type}
                        style={{
                            backgroundColor: getBackgroundColor(),
                        }}
                        className='confirmation-popup-icon'
                    >
                    </Icon>
                </Row>

                <Row justify='center' className='margin-top-10' style={{ textAlign: 'center' }}>
                    <Typography.Title level={4}>{props.iconText}</Typography.Title>
                </Row>
                <Row justify='center' className='margin-top-10' style={{ textAlign: 'center' }}>
                    <Typography.Text>{props.text}</Typography.Text>
                </Row>
                <Row className='margin-top-10'></Row>
                <Row justify='center' className='margin-top-10'>
                    <Col>
                        {props.yesNo ? <Button onClick={onNo} style={{ backgroundColor: '#808080', color: 'white' }}>No</Button> : null}
                    </Col>
                    <Col offset={3}>
                        {props.ok ? <Button onClick={onOk} type='primary'>OK</Button> : null}
                    </Col>
                    <Col offset={3}>
                        {props.yesNo ? <Button onClick={onYes} type='primary'>Yes</Button> : null}
                    </Col>
                </Row>

            </Row>
        </Modal>
    )
}