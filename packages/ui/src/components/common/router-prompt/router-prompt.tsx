import { useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Icon, { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export interface IRouterPrompt {
    type: "question" | "check";
    title: string;
    subText: string;
    showDialog: boolean
    cancelNavigation: any
    confirmNavigation: any
}

export const RouterPrompt = (props: IRouterPrompt) => {
    const { showDialog, confirmNavigation, cancelNavigation, title, subText } = props;
    const location = useLocation();
    const navigate = useNavigate();

    const [showPrompt, setShowPrompt] = useState(false);
    const [currentPath, setCurrentPath] = useState("");

    useEffect(() => {
        setCurrentPath(location.pathname);
        setShowPrompt(showDialog);
    }, [location, showDialog]);

    const handleOK = useCallback(async () => {
        if (confirmNavigation) {
            const canRoute = await Promise.resolve(confirmNavigation());
            if (canRoute) {
                navigate(currentPath);
            }
        }
    }, [currentPath, navigate, confirmNavigation]);

    const handleCancel = useCallback(async () => {
        if (cancelNavigation) {
            const canRoute = await Promise.resolve(cancelNavigation());
            if (canRoute) {
                navigate(currentPath);
            }
        }
        setShowPrompt(false);
    }, [currentPath, navigate, cancelNavigation]);

    return (<Modal
        open={showPrompt}
        onOk={handleOK}
        onCancel={handleCancel}
        closable={false}
        footer={null}
    >
        <Row justify="center">
            {props.type === 'question' ? <QuestionCircleOutlined style={{ backgroundColor: 'red' }}
                className="confirmation-popup-icon" /> : <CheckCircleOutlined style={{ backgroundColor: 'green' }}
                    className="confirmation-popup-icon" />}
        </Row>


        <Row
            justify="center"
            className="margin-top-10"
            style={{ textAlign: "center" }}
        >
            <Col span={24}><Typography.Title level={4}>{title}</Typography.Title></Col>
            <Col span={24}><Typography.Text>{subText}</Typography.Text></Col>
        </Row>
        <Row className="margin-top-10"></Row>
        <Row justify="center" className="margin-top-10">
            <Col>
                <Button onClick={handleCancel} style={{ backgroundColor: "#808080", color: "white" }}>
                    No
                </Button>
            </Col>

            <Col offset={3}>
                <Button onClick={handleOK} type="primary">
                    Yes
                </Button>
            </Col>
        </Row>
    </Modal>
    );
};

export default RouterPrompt;
