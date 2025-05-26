import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { DocMaterialAllocationModel, DocketGroupBasicInfoModel, DocketLayModel, PoDocketGroupRequest } from '@xpparel/shared-models';
import { CutReportingService, DocketGenerationServices, DocketMaterialServices, LayReportingService } from '@xpparel/shared-services';
import { Button, Card, Col, Divider, FloatButton, Form, Input, Row, Switch, Table } from 'antd';
import { AllocatedRolls } from '../material-allocation/allocated-rolls';
import { DocketBasicInfo } from './docket-basic-info';
import { LayingComp } from './laying-comp';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

interface ILayReportingProps {
    docketGroup?: string;
}

interface ITotalFabReqGridModel {
    plies: number;
    markerLength: string;
    totalRequirement: number;
    layedPlies: number;
}

const defaultITotalReqGridModel: ITotalFabReqGridModel = {
    plies: 0,
    markerLength: '0',
    totalRequirement: 0,
    layedPlies: 0,
}

const { Search } = Input;

const docketMaterialServices = new DocketMaterialServices();
const docketGenerationServices = new DocketGenerationServices();
const layReportingService = new LayReportingService();
// const cutReportingService = new CutReportingService();

export const LayReporting = (props: ILayReportingProps) => {
    const { docketGroup } = props;
    const [currentDocketNo, setCurrentDocketNo] = useState(undefined);
    const [docketInfo, setDocketInfo] = useState<DocketGroupBasicInfoModel>();
    const [allocatedRollsData, setAllocatedRollsData] = useState<DocMaterialAllocationModel[]>([]);
    // const [layedPliesTableData, setLayedPliesTableData] = useState<ITotalFabReqGridModel>(defaultITotalReqGridModel);
    const [docketLayingInfo, setDocketLayingInfo] = useState<DocketLayModel[]>([]);
    const [alreadyLayedRolls, setAlreadyLayedRolls] = useState<number[]>([]);
    const [showStock, setShowStock] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user.user);
    const [keyCount, setKeyCount] = useState<number>(0);

    const [form] = Form.useForm();
    useEffect(() => {
        if (docketGroup) {
            setCurrentDocketNo(docketGroup);
            docketOnSearch(docketGroup);
            form.setFieldValue('docketGroup', docketGroup)
            form.validateFields().then(() => {
                docketOnSearch(docketGroup);
            }).catch(err => {

            })
        }
    }, [docketGroup]);

    const getDocketMaterialRequests = (docNo: string) => {
        // CORRECT
        const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, docNo, true, false, null);
        docketMaterialServices.getDocketMaterialRequests(req).then((res => {
            if (res.status) {
                setAllocatedRollsData(res.data);
            } else {
                setAllocatedRollsData([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            setAllocatedRollsData([]);
            AlertMessages.getErrorMessage(error.message);
        });
    }

    const getDocketInfo = (docNo: string) => {
        const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, docNo, false, false, undefined, undefined, true);
        docketGenerationServices.getDocketGroupsBasicInfoForDocketGroup(req).then((res => {
            if (res.status) {
                setDocketInfo(res.data?.[0]);
                // setLayedPliesTableData({
                //     plies: res.data?.[0].plies,
                //     markerLength: res.data?.[0].markerInfo.mLength,
                //     totalRequirement: res.data?.[0].materialRequirement,
                //     layedPlies: res.data?.[0].layedPlies
                // })
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setDocketInfo(undefined);
                // setLayedPliesTableData(defaultITotalReqGridModel)
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
            setDocketInfo(undefined);
        });
    }

    const docketOnChange = (docNo: string) => {
        setCurrentDocketNo(docNo);
    }

    const docketOnSearch = (docNo: string) => {
        setShowStock(false)
        form.validateFields().then(e => {
            getDocketMaterialRequests(docNo.trim());
            getDocketInfo(docNo.trim());
            getLayInfoForDocket();
        }).catch(err => {
            // console.log(err)
        })
    }

    const handleStartLaying = () => {
        startLayingForDocket()
    }

    const getLayInfoForDocket = () => {
        const docGroup = props.docketGroup ?? currentDocketNo;
        // CORRECT
        const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, docketInfo?.poSerial, docGroup, true, false, undefined);
        layReportingService.getLayInfoForDocketGroup(req).then((res => {
            if (res.status) {
                setKeyCount(pre=>pre+1);
                setDocketLayingInfo(res.data);
                const layedRolls = new Set<number>();
                res.data.forEach(lay => {
                    lay.layRollsInfo.forEach(roll => {
                        layedRolls.add(roll.rollId);
                    })
                });
                setAlreadyLayedRolls(Array.from(layedRolls));
            } else {
                setDocketLayingInfo([])
                setAlreadyLayedRolls([])
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);

        });
    }

    const startLayingForDocket = () => {
        // CORRECT
        const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, docketInfo?.poSerial, currentDocketNo, undefined, false, undefined);
        layReportingService.startLayingForDocket(req).then((res => {
            if (res.status) {
                getLayInfoForDocket()
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);

        });
    }

    const layedPliesTableColumns = [
        {
            title: 'Plies',
            dataIndex: 'plies',
        },
        // {

        //     title: 'Layed Plies',
        //     dataIndex: 'layedPlies'
        // },
        {
            title: 'Marker Length',
            dataIndex: 'markerLength'
        },
        {
            title: 'Total Requirement',
            dataIndex: 'totalRequirement'
        }
    ];

    const isDisabled = () => {
        if (docketLayingInfo.length) {
            const layedPlies = docketLayingInfo.reduce((sum, rec) => Number(rec.totalLayedPlies) + sum, 0);
            if (layedPlies === docketInfo?.plies)
                return true;
            else
                return false;
        } else {
            return false;
        }
    }


    
    const onChangeStock = (checked: boolean) => {
        setShowStock(checked)
      };
    return (
        <>
            <Card size='small' title='Lay Reporting'>
                <Row justify="space-between">
                    <Form layout="inline" form={form}>
                        <Form.Item
                            label={`Docket No`}
                            name={`docketGroup`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Enter Docket Number',
                                },
                            ]}
                        >
                            <Search id='docketNo' allowClear placeholder="Enter Docket Number" onChange={(e) => docketOnChange(e.target.value)} defaultValue={currentDocketNo} value={currentDocketNo} onSearch={docketOnSearch} enterButton disabled={docketGroup ? true : false} />
                        </Form.Item>
                    </Form>
                </Row>
                <br />
                {docketInfo && <DocketBasicInfo docketInfo={docketInfo} />}
                <br />
                <>
                    <Row>
                        {/* <Col span={12}>
                            { layedPliesTableData?.plies > 0 ? <Table size='small' bordered columns={layedPliesTableColumns} dataSource={[layedPliesTableData]} pagination={false} /> : '' }
                        </Col> */}
                    </Row>
                    {allocatedRollsData.length > 0 && <>
                        <Divider>Already allocated stock   <Switch
                            checkedChildren={<EyeOutlined />}
                            unCheckedChildren={<EyeInvisibleOutlined />}
                            onChange={onChangeStock}
                            checked={showStock}
                        /></Divider>
                       {showStock && <AllocatedRolls isDeleteNeeded={false} docMaterialAllocatedDetails={allocatedRollsData} handleDeleteRequest={() => { }} isMrn={false} /> }
                        <br />
                        <Row justify='end'>
                            <Col>
                                <Button className='btn-green' disabled={isDisabled()} onClick={handleStartLaying}>Start laying</Button>
                            </Col>
                        </Row>
                    </>}
                    {docketLayingInfo.length != 0 && allocatedRollsData.length > 0 && <> <Divider>Lay</Divider><LayingComp docketLayingInfo={docketLayingInfo} keyCount={keyCount} allocatedRollsData={allocatedRollsData} alreadyLayedRolls={alreadyLayedRolls} getLayInfoForDocket={getLayInfoForDocket} /></>}
                </>
            </Card>
            <FloatButton.BackTop />
        </>
    )
}

export default LayReporting;