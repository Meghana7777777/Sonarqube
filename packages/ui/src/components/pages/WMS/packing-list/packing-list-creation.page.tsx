import Icon, { SolutionOutlined } from '@ant-design/icons';
import { BatchInfoModel, ItemCodeInfoModel, ItemCodes, ItemIdRequest, ItemModel, PackingListInfoModel, PackingListUploadTypeEnum, PhBatchLotRollRequest, SpoLogDownloadMethodEnum, SupplierCodeReq } from '@xpparel/shared-models';
import { ItemSharedService, PackingListService, PreIntegrationService } from '@xpparel/shared-services';
import { Affix, Button, Card, Form, Radio, Space, Steps } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useAppSelector } from '../../../../common';
import { ReactComponent as Carry } from '../../../../assets/icons/carry.svg';
import { ReactComponent as CheckList } from '../../../../assets/icons/checklist.svg';
import { AlertMessages } from '../../../common';
import { defaultDateTimeFormat } from '../../../common/data-picker/date-picker';
import { PackingListPreview } from './pack-list-preview';
import PackListSummery from './pack-list-summery';
import { PackListTemplate } from './pack-list-template';
import './pack-list.css';
import PackingListFileUpload from './packing-list-file-upload';
import PackingListHeaderForm from './packing-list-header-form';
import { SupplierPoDropDownComponent } from './supplier-po-dropdown';


export const PackingListCreationPage = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [formRef] = Form.useForm();
    const [selectedSpo, setSelectedSpo] = useState<string>();
    const [selectedSpoName, setSelectedSpoName] = useState<string>();
    const [itemCodes, setItemCodes] = useState<ItemCodes[]>([]);
    const [packListUpdateType, setPackListUpdateType] = useState<PackingListUploadTypeEnum>();
    const [current, setCurrent] = useState(0);
    const [packListInfoData, setPackListInfoData] = useState<PackingListInfoModel>();
    const [viewOnly, setViewOnly] = useState(false);
    const [dummyRefresh, setDummyRefresh] = useState(1);
    const [itemCodeInfoMap, setItemCodeInfoMap] = useState<Map<string, ItemCodeInfoModel>>(new Map());
    const [nlPoNumberInfoMap, setNLPoNumberInfoMap] = useState<Map<string, Set<string>>>(new Map());

    const service = new PackingListService();
    const itemsService: ItemSharedService = new ItemSharedService()

    const getItemCodes = (spoCode: string) => {
        const req = new ItemIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, undefined);
        setSelectedSpo(spoCode);
        setSelectedSpoName(spoCode);
        getMaterialItemInfo(req);
        resetFields();
        setDummyRefresh(0);
    }

    const getMaterialItemInfo = (reqObj: ItemIdRequest) => {
        itemsService
            .getAllItem(reqObj)
            .then((res) => {
                if (res.status) {
                    processMaterialInfoData(res.data);
                } else {
                    setItemCodes([]);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const processMaterialInfoData = (data: ItemModel[]) => {
        const itemCodeInfoMapLocal = new Map<string, ItemCodeInfoModel>();
        data.forEach(rec => {
            if (!itemCodeInfoMapLocal.has(rec.itemCode)) {
                itemCodeInfoMapLocal.set(rec.itemCode, new ItemCodeInfoModel(rec.itemCode, rec.itemName, rec.itemDescription, 0, rec.itemColor, undefined, undefined, undefined, undefined));
            }

        });
        setItemCodes(Array.from(itemCodeInfoMapLocal.keys()).map(item => {
            return new ItemCodes(item)
        }));
        setItemCodeInfoMap(itemCodeInfoMapLocal);
    }

    // const items = Object.keys(PackingListUploadTypeEnum).map(rec => {
    //     return {
    //         key: PackingListUploadTypeEnum[rec],
    //         label: PackingListUploadTypeEnum[rec],
    //     }
    // });

    const previewHandler = (batchInfo: BatchInfoModel[]) => {
        formRef.validateFields().then((values) => {
            const delivery: any = moment(values?.deliveryDate).utc().format(defaultDateTimeFormat);
            setPackListInfoData(new PackingListInfoModel(undefined, selectedSpo, values.supplierName, delivery, values.packListDate, values.packListCode, values.description, values.remarks, undefined, undefined, undefined, batchInfo, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, packListUpdateType, packListUpdateType == PackingListUploadTypeEnum.FILE ? SpoLogDownloadMethodEnum.EXCEL : SpoLogDownloadMethodEnum.API, undefined, undefined, undefined));
            setViewOnly(false);
            setCurrent(2);
        }).catch(err => {
            console.log(err.message)
        })
    }

    const handleSave = () => {
        service
            .createPackList(packListInfoData)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage('Pack list created successfully');
                    resetFields();
                    setCurrent(1)
                    setPackListInfoData(undefined);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const resetFields = () => {
        formRef.setFieldValue('batchInfo', [{ rollInfo: [''] }]);
        formRef.setFieldValue('deliveryDate', '');
        formRef.setFieldValue('packListDate', '');
        formRef.setFieldValue('packListCode', '');
        formRef.setFieldValue('description', '');
        formRef.setFieldValue('remarks', '');
        setPackListInfoData(undefined);
    }

    const getPackListInfo = (req: PhBatchLotRollRequest) => {
        service
            .getPackListInfo(req)
            .then((res) => {
                if (res.status) {
                    setPackListInfoData(res.data[0]);
                    setViewOnly(true);
                    setCurrent(2);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const deletePackList = (req: PhBatchLotRollRequest) => {
        service
            .validateAndDeletePackingList(req)
            .then((res) => {
                if (res.status) {
                    setDummyRefresh(pre => pre + 1)
                    setCurrent(1);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    const changePackListCreation = (e) => {
        // setIsManualCreation(isManv);        
        setPackListUpdateType(e.target.value)
    }

    const changeTab = (step: number) => {
        setCurrent(step);
    }

    return (
        <>
            <Card title="Packing List Creation" size='small' extra={<>
                <PackListTemplate />
            </>}>
                <SupplierPoDropDownComponent formRef={formRef} getItemCodes={getItemCodes} />
            </Card>
            {selectedSpo && <><Steps
                type="navigation"

                current={current}
                onChange={changeTab}
                items={[
                    {
                        title: 'Create Packing List',
                        status: 'finish',
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: 'Packing List Summary',
                        status: 'finish',
                        icon: <Icon component={CheckList} style={{ fontSize: '20px' }} />,
                    },
                    {
                        title: 'Preview Packing List',
                        status: 'finish',
                        icon: <Icon component={Carry} style={{ fontSize: '20px' }} />,
                    },
                ]}
            />
                {current === 1 && <PackListSummery spoCode={selectedSpo} key={Date.now() + dummyRefresh} getPackListInfo={getPackListInfo} deletePackList={deletePackList} />}
                {
                    current === 0 && <>
                        <Card title='Create PackList' size='small' extra={<>
                            <Space>
                                <>Select Pack list Creation Type : </>
                                <Radio.Group defaultValue={packListUpdateType} onChange={changePackListCreation} buttonStyle="solid">
                                    <Radio.Button value={PackingListUploadTypeEnum.MANUAL}>Manual</Radio.Button>
                                    <Radio.Button value={PackingListUploadTypeEnum.FILE}>File Upload</Radio.Button>
                                </Radio.Group>
                            </Space>
                        </>}>
                            {(packListUpdateType && packListUpdateType == PackingListUploadTypeEnum.MANUAL) && <PackingListHeaderForm formRef={formRef} itemCodes={itemCodes} previewHandler={previewHandler} itemCodeInfoMap={itemCodeInfoMap} nlPoNumberInfoMap={nlPoNumberInfoMap} />}
                            {(packListUpdateType && packListUpdateType == PackingListUploadTypeEnum.FILE) && <PackingListFileUpload previewHandler={previewHandler} formRef={formRef} itemCodeInfoMap={itemCodeInfoMap} nlPoNumberInfoMap={nlPoNumberInfoMap} />}
                        </Card>
                    </>
                }
                {
                    current === 2 && <Card><PackingListPreview packListInfoData={packListInfoData} />
                        <Affix offsetBottom={0}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {!viewOnly && <Button type='primary' disabled={!packListInfoData} onClick={handleSave}>Save</Button>}
                                {viewOnly && <Button type='primary' onClick={() => { setCurrent(1) }}>back</Button>}
                            </div>
                        </Affix>
                    </Card>
                }
            </>}
            {/* </Card> */}
        </>
    )
}

export default PackingListCreationPage;
