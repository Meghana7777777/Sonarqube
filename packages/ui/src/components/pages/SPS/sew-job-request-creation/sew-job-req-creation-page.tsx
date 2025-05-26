import React, { useEffect, useState } from 'react';
import { Table, Descriptions, Typography, Card, Button, Divider, Collapse, CollapseProps, Row, Col, Tag, Switch, Space, Affix, Flex } from 'antd';
import { JobRmStatusModel, JobSewSerialReq, MoPropsModel, ProcessTypeEnum, PanelReqForJobModel, PanelRequestCreationModel, SewingJobPreviewHeaderInfo, SewingJobPropsModel, SewingJobWisePreviewModel, TrimStatusEnum } from '@xpparel/shared-models';
import moment from 'moment';
import { SewingJobGenMOService, TrimsIssuedDashboardService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../../common';
import BundleCard from './bundle-card';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import SewingJobRequestHeader from './sew-job-header';

interface IProps {
    jobNumber: string;
    sewJobSerial: number;
    componentUpdateKey: number | string;
    closePopUp?: () => void;
    isRequest?: boolean;
}


const SewingJobRequestCreationPage: React.FC<IProps> = (props: IProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [sewJobHeaderInfo, setSewJobHeaderInfo] = useState<SewingJobPropsModel>(undefined);
    const [sewJobBundleInfo, setSewJobBundleInfo] = useState<PanelReqForJobModel[]>([]);
    const [activeKeys, setActiveKeys] = useState<string[]>([]);
    const [showStock, setShowStock] = useState<boolean>(true);
    const [fulfillmentDate, setFulFillmentDate] = useState(undefined);
    useEffect(() => {
        // setSewJobHeaderInfo(mockSewingJobData);
        // setSewJobBundleInfo(kindaData);
        // getAllKeys(kindaData);
        if (props.jobNumber) {
            getSewingCutDocketInfoForJobFeatures();
            getComponentBundlesForSewingJob();
        }
    }, [props.componentUpdateKey])
    const sewingJobGenMOService = new SewingJobGenMOService();
    const trimsIssuedDashboardService = new TrimsIssuedDashboardService();

    const getSewingCutDocketInfoForJobFeatures = () => {
        const req = new JobSewSerialReq(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, props.jobNumber, props.sewJobSerial, false);
        sewingJobGenMOService.getSewingJobQtyAndPropsInfoByJobNumber(req).then((res => {
            if (res.status) {
                setSewJobHeaderInfo(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getComponentBundlesForSewingJob = () => {
        const req = new JobSewSerialReq(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, props.jobNumber, props.sewJobSerial, false);
        sewingJobGenMOService.getComponentBundlesForSewingJob(req).then((res => {
            if (res.status) {
                setSewJobBundleInfo(res.data);
                getAllKeys(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getAllKeys = (sewJobBundleInfo: PanelReqForJobModel[]) => {
        const keys = sewJobBundleInfo.map(b =>{return getKey(b)});
        setActiveKeys(keys);
    }

    const getKey = (sewJobBunObj: PanelReqForJobModel) => {
        return `${sewJobBunObj.jobGroup}-${sewJobBunObj.processType}-${sewJobBunObj.jobNumber}`;
    }
    const getItems = (sewJobBundleInfo: PanelReqForJobModel[]) => {
        const items: CollapseProps['items'] = sewJobBundleInfo.map((sewJobBunObj, index) => {

            return {
                key: getKey(sewJobBunObj),
                label: <Row style={{ flexWrap: 'nowrap' }} justify='space-between'>
                    <Col>{`Job Group:  ${sewJobBunObj.jobGroup}`}</Col>

                    <Col> Processing Type : <Tag style={{ fontSize: '14px' }} color={"#87d068"}> {sewJobBunObj.processType}</Tag> </Col>
                    <Col></Col>
                </Row>,
                children: <>
                    <BundleCard sewJobBundleInfo={sewJobBunObj} />
                </>,
                extra: <></>
            }
        });
        return items;
    };
    const IssueJob = () => {
        const req = new PanelRequestCreationModel(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, fulfillmentDate, sewJobBundleInfo, props.sewJobSerial, props.jobNumber);
        sewingJobGenMOService.createPanelFormRequestForSewingJob(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.closePopUp();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const createRequest = () => {
        const req = new JobRmStatusModel(user?.userName,user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sewJobHeaderInfo?.jobNumber,TrimStatusEnum.REQUESTED );    
            trimsIssuedDashboardService.updateRmStatusForJobNumber(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.closePopUp();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    return (
        <div style={{ padding: '10px' }}>

            <Card title={<div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                <span> {props.isRequest ? 'Request Creation for Routing Job' : 'RM issuance '}</span>
                <span>Job Number: <Tag color='#54a631' style={{ fontSize: '16px' }}> {sewJobHeaderInfo?.jobNumber}</Tag></span>
                <span>Eligible Quantity to give input: <Tag color='#54a631' style={{ fontSize: '16px' }}> {sewJobHeaderInfo?.eligibleToReportQty}</Tag></span>

            </div>} headStyle={{ backgroundColor: '#01576f' }}>
                {/* <SewingJobRequestHeader componentUpdateKey={props.componentUpdateKey + '' + (sewJobHeaderInfo ? sewJobHeaderInfo.jobNumber : '0')} sewJobSerial={props.sewJobSerial} sewJobHeaderInfo={sewJobHeaderInfo} /> */}
                <Divider> <Space size={'large'}><span>Dependent Jobs available  bundles</span>
                    <span style={{ fontSize: '14px' }} >{!showStock ? "Expand all" :"Collapse all"} <Switch
                        checkedChildren={<PlusOutlined />}
                        unCheckedChildren={<MinusOutlined />}
                        onChange={e => setShowStock(e)}
                        checked={showStock}
                    /></span>
                </Space>
                </Divider>
                <Collapse bordered={true} key={showStock + `1` + activeKeys.toString()} defaultActiveKey={showStock ? activeKeys : []} size="small" items={getItems(sewJobBundleInfo)}
                // key={compKeyCount + 1 + `${showStock}`}
                ></Collapse>
                {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' ,padding:'30px '}}>
          <Button type="primary">Confirm Sewing Jobs</Button>
        </div> */}
            </Card>
            {props.isRequest ?
            <Affix offsetBottom={10}>
                <Flex justify='end'> <Button className='btn-green' type="primary" onClick={() => props.isRequest ? createRequest() : IssueJob()}>
                    {props.isRequest ? 'Create Request' : 'Issue RM'}
                </Button>
                </Flex>
            </Affix> : <></>}
        </div>
    );
};

export default SewingJobRequestCreationPage;
