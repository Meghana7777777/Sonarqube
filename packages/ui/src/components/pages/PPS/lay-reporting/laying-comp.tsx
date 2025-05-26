import { CommonRequestAttrs, CutReportRequest, CutStatusEnum, DocMaterialAllocationModel, DocketLayModel, LayIdRequest, LayRollInfoModel, LayingPauseRequest, LayingStatusEnum, LayingStatusEnumDisplayValues, MasterdataCategoryEnum, ReasonCategoryEnum, ReasonCategoryRequest, ReasonModel, ReasonsCategoryRequest, ReasonsCreationModel, ShadePliesModel, cutStatusEnumDisplayValues } from '@xpparel/shared-models';
import { Button, Col, Collapse, CollapseProps, Descriptions, Form, Input, Modal, Row, Select, Switch, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import LayingTable from './laying-table';
import { CutReportingService, LayReportingService, ReasonsService } from '@xpparel/shared-services';
import { convertBackendDateToLocalTimeZone, useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import moment from 'moment';
import { defaultDateTimeFormat } from '../../../common/data-picker/date-picker';
import { EyeInvisibleOutlined, EyeOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface ILayingCompProps {
    docketLayingInfo: DocketLayModel[];
    allocatedRollsData: DocMaterialAllocationModel[];
    alreadyLayedRolls: number[];
    getLayInfoForDocket: () => void,
    keyCount: number;
}
export interface ILayIngTableDto {
    rollNo: string;
    shade: string;
    shrinkage: string;
    rollWidth: string;
    fabricReceived: string;
    fabricReturn: string;
    layedPlies: number;
    itemId: number;
    barcode: string;
    shortage: number;
    endBits: number;
    damages: number;
    remarks: string;
    layStartTime: string;
    layEndTime: string;
    breakTime: string;
    mLength: number;
    allocatedQty: number;
    actualUtilizedQty: number;
    iWidth: string; //  the input or the supplier width
    mWidth: string; // the measured width
    aWidth: string; // the actual width
    isEditable: boolean;
    batch: string;
    plWidth: string;
    rollQty: number;
    sequence: number;
    markerLength: number;
    jointsOverlapping?: number;
    noOfJoints?: number;
    reuseRemains?: number;
    halfPlie?: number;
    usableRemains?: number;
    unUsableRemains?: number;
    layedYardage?: number;
    rollLocation: string;
    pallet?: string;
    tray?: string;
    trolly?: string;
    relaxWidth: number;
    plies: number;
    isError?: boolean;
    shadePlies: ShadePliesModel[]
}

export const layIngTableDefaultData: ILayIngTableDto = {
    rollNo: '',
    shade: '',
    shrinkage: '',
    rollWidth: '',
    fabricReceived: '',
    fabricReturn: '',
    layedPlies: 0,
    itemId: null,
    barcode: '',
    shortage: 0,
    endBits: null,
    damages: null,
    remarks: '',
    layStartTime: '',
    layEndTime: '',
    breakTime: '',
    mLength: 1,
    allocatedQty: 0,
    actualUtilizedQty: 0,
    iWidth: '',
    mWidth: '',
    aWidth: '',
    isEditable: false,
    batch: '',
    plWidth: '',
    rollQty: undefined,
    markerLength: 1,//TODO
    sequence: undefined,
    plies: undefined,
    relaxWidth: undefined,
    rollLocation: '',
    isError: false,
    shadePlies: []
};
const { Option } = Select;
export const LayingComp = (props: ILayingCompProps) => {
    const { docketLayingInfo, allocatedRollsData, alreadyLayedRolls, getLayInfoForDocket, keyCount } = props;
    const [activeKeys, setActiveKeys] = useState<string[]>([]);
    const [allocatedRollsMap, setAllocatedRollsMap] = useState<Map<number, ILayIngTableDto>>(new Map());
    const [openModal, setOpenModal] = useState(false);
    const [reasons, setReasons] = useState<ReasonModel[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [showStock, setShowStock] = useState<boolean>(false);

    const user = useAppSelector((state) => state.user.user.user);

    const layReportingService = new LayReportingService();
    const reasonService = new ReasonsService();
    const cutReportingService = new CutReportingService();
    const [form] = Form.useForm();
    const [compKeyCount, setCompKeyCount] = useState<number>(0);

    useEffect(() => {
        const layedRollsMap = new Map<number, LayRollInfoModel>();
        const layIds = [];
        docketLayingInfo.forEach(rec => {
            rec.layRollsInfo.forEach(layedRoll => {
                layedRollsMap.set(layedRoll.rollId, layedRoll);
            })
            layIds.push(rec.layId.toString());
        });

        const allocatedRollsMapLocal: Map<number, ILayIngTableDto> = new Map();
        allocatedRollsData.forEach(rec => {
            rec.rollsInfo.forEach(roll => {
                const { otherAttributes, layedPlies } = layedRollsMap.has(roll.rollId) ? layedRollsMap.get(roll.rollId) : {} as LayRollInfoModel;
                const data: ILayIngTableDto = { ...layIngTableDefaultData };
                data.rollNo = roll.externalRollNumber;
                data.rollWidth = roll.aWidth;
                data.shade = roll.shade;
                data.shrinkage = roll.shrinkageGroup;
                data.barcode = roll.rollBarcode;
                data.itemId = roll.rollId;
                data.allocatedQty = roll.allocatedQuantity;
                data.actualUtilizedQty = roll.actualUtilizedQty;
                data.mWidth = roll.mWidth ? roll.mWidth.toString() : '';
                data.iWidth = roll.iWidth ? roll.iWidth.toString() : '';
                // data.aWidth = roll.aWidth;
                data.aWidth = roll?.mWidth?.toString();
                data.batch = roll.batch;
                data.plWidth = roll.plWidth;
                data.rollQty = roll.rollQty;
                data.markerLength = roll?.markerLength;
                data.plies = Number((Number(roll.allocatedQuantity) / Number(roll.markerLength)).toFixed(2)) ?? 1;
                // data.relaxWidth = roll?.relaxWidth;
                data.relaxWidth = Number(roll?.aWidth);
                data.rollLocation = (roll?.palletCode || "N" )+ "|" + (roll?.trayCode || "N") + "|" + (roll?.trolleyCode || "N");
                data.sequence = otherAttributes?.sequence;
                data.jointsOverlapping = otherAttributes?.jointsOverlapping;
                data.noOfJoints = otherAttributes?.noOfJoints;
                data.reuseRemains = otherAttributes?.remnantsOfOtherLay;
                data.halfPlie = otherAttributes?.halfPlieOfPreRoll;
                data.damages = otherAttributes?.damages;
                data.usableRemains = otherAttributes?.usableRemains;
                data.unUsableRemains = otherAttributes?.unUsableRemains;
                data.endBits = otherAttributes?.endBits;
                data.remarks = otherAttributes?.remarks;
                data.shortage = otherAttributes?.shortage;
                data.layedPlies = layedPlies;
                data.layStartTime = otherAttributes?.layStartTime;
                data.layEndTime = otherAttributes?.layEndTime;
                data.layedYardage = Number(((Number(roll?.markerLength || 0) * layedPlies || 0) + Number(otherAttributes?.jointsOverlapping || 0)).toFixed(3));
                data.pallet = roll?.palletCode;
                data.tray = roll?.trayCode ;
                data.trolly = roll?.trolleyCode;
                allocatedRollsMapLocal.set(roll.rollId, data);
            })
        });
        setAllocatedRollsMap(allocatedRollsMapLocal);
        setCompKeyCount(pre => pre + keyCount + 1);
        getReasons();
    }, [keyCount]);

    const pauseClickHandler = (layId: number) => {
        form.resetFields();
        setOpenModal(true);
        setFormData({ layId });
    }

    const pauseLayingForDocket = () => {
        const req = new LayingPauseRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, formData.layId, formData.reason, formData.remarks);
        layReportingService.pauseLayingForDocket(req).then((res => {
            if (res.status) {
                handleCancel();
                getLayInfoForDocket();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }

    const resumeLayingForDocket = (layId: number) => {
        const req = new LayIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, layId, false, false);
        layReportingService.resumeLayingForDocket(req).then((res => {
            if (res.status) {
                getLayInfoForDocket();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }


    const validateAndTriggerReportCutForLay = (layId: number) => {
        const req = new CutReportRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, layId);
        cutReportingService.validateAndTriggerReportCutForLay(req).then((res => {
            if (res.status) {
                getLayInfoForDocket();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }

    const getReasons = () => {
        const req = new ReasonCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, ReasonCategoryEnum.LAYING_DOWNTIME);
        reasonService.getReasonsByCategory(req).then(res => {
            if (res.status) {
                setReasons(res.data);
            } else {
                setReasons([]);
            }
        }).catch(err => {
            setReasons([]);
            AlertMessages.getErrorMessage(err.message);
        })
    }


    const getCutStatusLabel = (cutStatus: CutStatusEnum) => {
        const color = cutStatus == CutStatusEnum.COMPLETED ? "#87d068" : "#e0a844";
        return <>
            Cut Status : <Tag style={{ fontSize: '14px' }} color={color}>{cutStatusEnumDisplayValues[cutStatus]}</Tag>
        </>
    }

    const getItems = (allocatedRollsMapLocal: Map<number, ILayIngTableDto>) => {
        const items: CollapseProps['items'] = docketLayingInfo.map((layInfo, index) => {
            // const disableCutRepButton = layInfo.cutStatus == CutStatusEnum.COMPLETED || layInfo.currentLayStatus != LayingStatusEnum.COMPLETED;

            return {
                key: `${layInfo.layId.toString()}`,
                label: <Row style={{ flexWrap: 'nowrap' }} justify='space-between'><Col>{`LAY  ${index + 1}`}</Col>
                    {/* <Col> Laying Started On : <Tag style={{ fontSize: '14px' }} color="#f50">  {convertBackendDateToLocalTimeZone(layInfo.layStartedOn)}</Tag></Col>
                    <Col> Laying Completed On : <Tag style={{ fontSize: '14px' }} color="#f50">  {layInfo.layCompletedOn ? convertBackendDateToLocalTimeZone(layInfo.layCompletedOn) : null}</Tag></Col> */}
                    <Col> Status : <Tag style={{ fontSize: '14px' }} color={layInfo.currentLayStatus == LayingStatusEnum.COMPLETED ?"#87d068" : "#be0076"}> {LayingStatusEnumDisplayValues[layInfo.currentLayStatus]}</Tag> </Col>
                    <Col></Col>
                </Row>,
                children: <>
                    <LayingTable layInfo={layInfo} keyCount={compKeyCount + 1} allocatedRollsMap={allocatedRollsMapLocal} alreadyLayedRolls={alreadyLayedRolls} getLayInfoForDocket={getLayInfoForDocket} />
                </>,
                extra: <>
                    {layInfo.currentLayStatus === 1 && <>
                        <Button size='small' danger type="primary" onClick={(event) => { event.stopPropagation(); pauseClickHandler(layInfo.layId) }}>Pause Laying</Button></>
                    }
                    {layInfo.currentLayStatus === 99 && <Button size='small' className='btn-orange' type="primary" onClick={(event) => { event.stopPropagation(); resumeLayingForDocket(layInfo.layId) }}>Resume laying</Button>}

                    {
                        layInfo.currentLayStatus === 2 ?
                            layInfo.cutStatus == CutStatusEnum.OPEN ?
                                <Button size='small' type="primary" className='btn-green' onClick={(event) => { event.stopPropagation(); validateAndTriggerReportCutForLay(layInfo.layId) }}>Report Cut For Lay</Button>
                                : getCutStatusLabel(layInfo.cutStatus)
                            : <></>
                    }
                </>
            }
        });
        return items;
    };


    const handleCancel = () => {
        setOpenModal(false);
        setFormData({});
    }

    const onChange = (val, name: string) => {
        setFormData(prev => {
            return {
                ...prev,
                [name]: val
            }
        });
    }

    let totalLayedPlies = 0;
    let totalCutReportedPlies = 0;
    docketLayingInfo.forEach(lay => {
        totalCutReportedPlies += lay.cutStatus == CutStatusEnum.COMPLETED ? lay.totalLayedPlies : 0;
        totalLayedPlies += lay.totalLayedPlies;
    });

    return (
        <div>
            <Row>
                <Col span={4}><span style={{ fontSize: '14px' }} >Total Layed Plies : </span><Tag style={{ fontSize: '14px' }} color="blue-inverse">{totalLayedPlies}</Tag></Col>
                <Col span={4}><span style={{ fontSize: '14px' }} >Total Cut Reported Plies : </span><Tag style={{ fontSize: '14px' }} color="blue-inverse">{totalCutReportedPlies}</Tag></Col>
                {/* <Col span={4}><span style={{ fontSize: '14px' }} >Expand all : <Switch
                    checkedChildren={<PlusOutlined />}
                    unCheckedChildren={<MinusOutlined />}
                    onChange={e => setShowStock(e)}
                // checked={showStock}
                /></span></Col> */}
            </Row>
            <br />
            <Collapse bordered={true} defaultActiveKey={showStock ? activeKeys : []} size="small" items={getItems(allocatedRollsMap)}
                // key={compKeyCount + 1 + `${showStock}`}
            ></Collapse>
            <Modal open={openModal} onCancel={handleCancel} footer={null}>
                <Form form={form} onFinish={pauseLayingForDocket}
                    layout="horizontal" name="PO"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}>

                    <Form.Item label="Downtime Reason" name="reason" rules={[{ required: true, message: 'Select Reason' }]} initialValue={formData.reason}>
                        <Select
                            value={formData.reason}
                            onChange={(val) => onChange(val, 'reason')}
                            filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                            showSearch style={{ width: '250px' }} placeholder='Please Select'>
                            {reasons.map(reason => {
                                return <Option value={reason.id}>{reason.reasonName}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Remarks" name="remark" rules={[{ required: false, message: 'Enter remark' }]} initialValue={formData.remarks}>
                        <Input.TextArea
                            value={formData.remarks}
                            onChange={(e) => onChange(e.target.value, 'remarks')}
                            placeholder="Enter remarks"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default LayingComp;