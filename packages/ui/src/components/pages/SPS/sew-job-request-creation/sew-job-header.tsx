import React, { useEffect, useState } from 'react';
import { Table, Descriptions, Typography, Card, Button, Divider, Collapse, CollapseProps, Row, Col, Tag, Switch, Space, Affix, Flex } from 'antd';
import { JobSewSerialReq, MoPropsModel, ProcessTypeEnum, PanelReqForJobModel, PanelRequestCreationModel, SewingJobPreviewHeaderInfo, SewingJobPropsModel, SewingJobWisePreviewModel } from '@xpparel/shared-models';
import moment from 'moment';
import { SewingJobGenMOService } from '@xpparel/shared-services';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../../common';

interface IProps {
    jobNumber?: string;
    sewJobSerial: number;
    componentUpdateKey: number | string;
    sewJobHeaderInfo?: SewingJobPropsModel;
}

const SewingJobRequestHeader: React.FC<IProps> = (props: IProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [sewJobHeaderInfo, setSewJobHeaderInfo] = useState<SewingJobPropsModel>(undefined);

    useEffect(() => {
        if (props.jobNumber) {
            getSewingCutDocketInfoForJobFeatures();
        }
        if (props.sewJobHeaderInfo) {
            setSewJobHeaderInfo(props.sewJobHeaderInfo);
        }
    }, [props.componentUpdateKey + props.jobNumber]);
    const sewingJobGenMOService = new SewingJobGenMOService();

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




    return (
        <div style={{ padding: '10px 0' }}>


            {sewJobHeaderInfo && <>
                <Descriptions
                    title=''
                    bordered
                    column={4}
                    style={{ textAlign: 'start', padding: '0px' }}
                    labelStyle={{ width: '10%' }}
                    contentStyle={{ width: '10%' }}
                >
                    <Descriptions.Item label="Order Serial">{sewJobHeaderInfo.sewSerial}</Descriptions.Item>
                    <Descriptions.Item label="Processing Type">{sewJobHeaderInfo.processingType}</Descriptions.Item>
                    <Descriptions.Item label="MO Number">{sewJobHeaderInfo.moNumber}</Descriptions.Item>
                    <Descriptions.Item label="Destination">{sewJobHeaderInfo.destination}</Descriptions.Item>
                    <Descriptions.Item label="Plan Prod Date">{moment(sewJobHeaderInfo.planProductionDate).format('DD-MM-YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Buyer PO">{sewJobHeaderInfo.buyer}</Descriptions.Item>
                    {/* <Descriptions.Item label="Order Description">{sewJobHeaderInfo.sewOrderDesc}</Descriptions.Item> */}
                    <Descriptions.Item label="Style">{sewJobHeaderInfo.style}</Descriptions.Item>
                    <Descriptions.Item label="MO Line">{sewJobHeaderInfo.moLineNumbers}</Descriptions.Item>
                    {/* <Descriptions.Item label="Delivery Date">{moment(sewJobHeaderInfo.plannedDelDate).format('DD-MM-YYYY')}</Descriptions.Item> */}
                    <Descriptions.Item label="Co Line">{sewJobHeaderInfo.coLine}</Descriptions.Item>
                    {/* <Descriptions.Item label="MO Numbers">{sewJobHeaderInfo.moNumbers}</Descriptions.Item> */}
                    <Descriptions.Item label="No of Bundles">{sewJobHeaderInfo.noOfJobBundles}</Descriptions.Item>
                    <Descriptions.Item label="Job Qty">{sewJobHeaderInfo.jobQty}</Descriptions.Item>
                    <Descriptions.Item label="Input Reported Qty">{sewJobHeaderInfo.inputReportedQty}</Descriptions.Item>
                    <Descriptions.Item label="Pending to input Qty">{sewJobHeaderInfo.pendingToInputQty}</Descriptions.Item>
                    <Descriptions.Item label="Output Reported Qty">{sewJobHeaderInfo.outputReportedQty}</Descriptions.Item>
                    <Descriptions.Item label="WIP">{<Tag color='#deac00' style={{fontSize:'16px'}}>  {sewJobHeaderInfo.wip}</Tag>}</Descriptions.Item>
                </Descriptions>


            </>
            }


        </div>
    );
};

export default SewingJobRequestHeader;
