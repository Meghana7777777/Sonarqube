import { MinusOutlined, PlusOutlined, TagFilled } from '@ant-design/icons';
import { CommonRequestAttrs, FgWhReqSelectedCartons, GlobalResponseObject, PKMSFgWhereHouseCreateDto, PKMSPackJobsInfoModel, PKMSPackListIdsRequest, PKMSPackListInfoModel, PKMSPackOrderInfoModel, PkmsFgWhReqTypeEnum, WareHouseResponseDto } from '@xpparel/shared-models';
import { PKMSFgWarehouseService, PackListService, WareHouseService } from '@xpparel/shared-services';
import { Button, Checkbox, Col, Collapse, Descriptions, Flex, Form, FormInstance, Modal, Popover, Row, Select, Tag, Tooltip } from 'antd';
import { SequenceUtils, useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import DatePicker from 'packages/ui/src/components/common/data-picker/date-picker';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DeliveryChalanPrint from '../../../__masters__/prints/delivery-chalan-print';
import FgReqPackJobView from './fg-req-pack-job-view';
import PkCutDocketTable from './pkms-cut-docket-table';

export enum LevelOfSelection {
  CARTON = 'Carton',
  PACK_JOB = 'Pack Job',
  PACK_LIST = 'Pack List',
  ALL = 'All'
}


interface PackOrderView {
  cutDispatchData: PKMSPackOrderInfoModel[];
  manufacturingOrderPk: string;
  packOrderIdPk: number;
  form: FormInstance<any>;
  getPackOrderInfo: () => Promise<void>;
  setActiveTab: Dispatch<SetStateAction<string>>;
  viewFieldsOnly: boolean
}

const PkCutOrderDetails = (props: PackOrderView) => {
  const { cutDispatchData, form, getPackOrderInfo, setActiveTab, viewFieldsOnly } = props;
  const [selectedCutOrders, setSelectedCutOrders] = useState<PKMSPackListInfoModel[]>([]);
  const user = useAppSelector((state) => state.user.user.user);
  const pKMSFgWarehouseService = new PKMSFgWarehouseService();
  const wareHouseService = new WareHouseService();
  const [warehouseDropDown, setWarehouseDropDown] = useState<WareHouseResponseDto[]>([]);
  const [floors, setFloors] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [packJobData, setPackJobData] = useState<Map<number, PKMSPackJobsInfoModel[]>>(new Map())
  const [packListLevelCartonsSelection, setPackListLevelCartonsSelection] = useState<Map<number, Map<number, number[]>>>(new Map<number, Map<number, number[]>>);

  const { userName, orgData, userId } = user;
  const packListService = new PackListService();
  const [packListInfoData, setPackListInfoData] = useState<PKMSPackListInfoModel[]>([])

  useEffect(() => {
    if (props.manufacturingOrderPk) {
    }
    getWareHouseDropDown();
  }, [props.manufacturingOrderPk]);




  const getPackListInfoByPackListId = (packListId: number[], levelOfSelection?: LevelOfSelection) => {
    //if select all is selected again and again we have to stop API calls for performance issues
    const removeDuplicatePkListIds = []
    for (const pkId of packListId) {
      if (!packJobData.has(pkId)) {
        removeDuplicatePkListIds.push(pkId)
      }
    };
    if (removeDuplicatePkListIds.length) {
      const req = new PKMSPackListIdsRequest(userName, orgData?.unitCode, orgData?.companyCode, userId, removeDuplicatePkListIds, false, true, true, true, false, true)
      packListService.getPackListInfoByPackListId(req).then(res => {
        if (res.status) {
          //data add to state at first time 
          setPackListInfoData(res.data);
          //data add to state at first time 
          setPackJobData(prev => {
            const previous = new Map(prev);
            res.data.map(rec => {
              previous.set(rec.packListId, rec.packJobs)
            })
            return previous
          });
          if (levelOfSelection === LevelOfSelection.ALL) {
            allCheckBoxesSelectionHandler(true, levelOfSelection, undefined, undefined, undefined, res.data)
          }

        } else {
          AlertMessages.getErrorMessage(res.internalMessage)
          setPackJobData(new Map())
        }
      }).catch(err => console.log(err.message))
    } else {
      if (levelOfSelection === LevelOfSelection.ALL) {
        //data passing to method what we have set the data at first time to packListInfoData state
        allCheckBoxesSelectionHandler(true, levelOfSelection, undefined, undefined, undefined, packListInfoData)
      }
    }


  }


  const callingGetPackListInfoByPackListIdAfterSaving = (packListIds: number[]) => {
    const req = new PKMSPackListIdsRequest(userName, orgData?.unitCode, orgData?.companyCode, userId, packListIds, false, true, true, true, false, true)
    packListService.getPackListInfoByPackListId(req).then(res => {
      if (res.status) {
        setPackJobData(prev => {
          const previous = new Map(prev);
          res.data.map(rec => {
            previous.set(rec.packListId, rec.packJobs)
          })
          return previous
        });
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => console.log(err.message))
  }






  // const headerCheckBoxIndeterminate = (packInfo: PKMSPackListInfoModel): boolean => {
  //   const totalCartonsLength = packInfo.packJobs.reduce((a, c) => a + c.cartonsList.length, 0)
  //   return selectedCartons?.get(packInfo?.packListId)?.cartonIds?.length > 0 && totalCartonsLength !== selectedCartons?.get(packInfo?.packListId)?.cartonIds?.length
  // }


  // const headerCheckBoxIsChecked = (isChecked: boolean, packInfo: PKMSPackListInfoModel): boolean => {
  //   if (isChecked) {
  //     return isChecked
  //   } else {
  //     const totalCartonsLength = packInfo.packJobs.reduce((a, c) => a + c.cartonsList.length, 0)
  //     return selectedCartons?.get(packInfo?.packListId)?.cartonIds?.length === totalCartonsLength
  //   }

  // }

  const getPackListDataByPackListIdForPackListSelection = async (packListId: number[]): Promise<PKMSPackListInfoModel[]> => {
    try {
      const req = new PKMSPackListIdsRequest(userName, orgData?.unitCode, orgData?.companyCode, userId, packListId, false, true, true, true, false, true)
      const data = await packListService.getPackListInfoByPackListId(req);
      if (data.status) {
        return data.data
      } else {
        return []
      }
    } catch (error) {
      console.log(error.message)
      return []
    }

  }

  const packListSelectionChecking = (packListId: number): { checked: boolean; indeterminate: boolean; } => {
    const selectedJobs = packListLevelCartonsSelection.get(packListId);
    const totalJobs = packJobData.get(packListId);

    const selectedCount = selectedJobs?.size || 0;
    const totalCount = totalJobs?.length || 0;

    const checked = selectedCount > 0 && selectedCount === totalCount;
    const indeterminate = selectedCount > 0 && selectedCount < totalCount;
    return { checked, indeterminate }
  }



  const handleCreateDispatchSet = async () => {

    form.validateFields().then(async values => {
      if (packListLevelCartonsSelection.size === 0) {
        AlertMessages.getErrorMessage('Please select at least one item.');
        return;
      }
      try {
        const cutReq: number[] = [];
        const fgWhCartons: FgWhReqSelectedCartons[] = [];
        packListLevelCartonsSelection.forEach((rec, key) => {
          cutReq.push(key)
          rec.forEach(c => {
            fgWhCartons.push(new FgWhReqSelectedCartons(key, c))
          })
        })
        const reqObj = new PKMSFgWhereHouseCreateDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, cutReq, values.toWhCode, values.floor, values.requestDate, PkmsFgWhReqTypeEnum.IN, fgWhCartons);
        const response = await pKMSFgWarehouseService.saveFgWhereHouseReq(reqObj);
        const res: GlobalResponseObject = response;
        if (res.status) {
          callingGetPackListInfoByPackListIdAfterSaving(cutReq)
          AlertMessages.getSuccessMessage(res.internalMessage);
          form.resetFields(['toWhCode', 'floor', 'requestDate']);
          setActiveTab('2')
          setSelectedCutOrders([]);
          getPackOrderInfo();
          setPackListLevelCartonsSelection(new Map());
        }
        else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      } catch (error) {
        AlertMessages.getErrorMessage(error.message);
      }
    }).catch(err => console.log(err))

  };


  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };


  const getWareHouseDropDown = () => {
    const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    wareHouseService.getWareHouseDropDown(req).then(res => {
      if (res.status) {
        setWarehouseDropDown(res.data)
      } else {
        setWarehouseDropDown([])
      }
    }).catch(err => console.log(err.message))
  }

  const wareHouseOnChange = (value: string) => {
    const record = warehouseDropDown.find((rec) => rec.wareHouseCode === value);
    if (record.noOfFloors) {
      setFloors(record.noOfFloors);
    } else {
      setFloors(0);
    }

  };


  const setPackListSelectionToState = (packListData: PKMSPackListInfoModel[]) => {
    setPackListLevelCartonsSelection(prev => {
      const previousMap = new Map(prev);
      for (const pkList of packListData) {
        const packJobs = new Map<number, number[]>();
        for (const pkJData of pkList.packJobs) {
          const cartonIds = pkJData.cartonsList.filter(rec => !rec.isFgWhCartonId).map(rec => rec.cartonId)
          packJobs.set(pkJData.packJobId, cartonIds)
        }
        previousMap.set(pkList.packListId, packJobs)
      }
      return previousMap
    });

  }

  const allCheckBoxesSelectionHandler = (selected: boolean, levelOfSelection: LevelOfSelection, packListId?: number, packJobId?: number, carton?: number, packListData?: PKMSPackListInfoModel[]) => {
    if (levelOfSelection === LevelOfSelection.ALL) {
      setPackListSelectionToState(packListData);
      setPackListLevelCartonsSelection(prev => {
        const previousMap = new Map(prev);
        for (const [pkListId, oldPk] of packJobData) {
          const packJobs = new Map<number, number[]>();
          for (const oldJob of oldPk) {
            const cartonIds = oldJob.cartonsList.filter(rec => !rec.isFgWhCartonId).map(rec => rec.cartonId)
            packJobs.set(oldJob.packJobId, cartonIds)
          }
          previousMap.set(pkListId, packJobs);
        }
        return previousMap
      })
    } else if (levelOfSelection === LevelOfSelection.PACK_LIST) {
      setPackListSelectionToState(packListData);
      if (!packJobData.has(packListId)) {
        setPackJobData(prev => {
          const previous = new Map(prev);
          previous.set(packListId, packListData[0].packJobs)
          return previous
        });
      } else {
        setPackListLevelCartonsSelection(prev => {
          const previous = new Map(prev);
          const packJobs = new Map();
          const oldPackJobs = packJobData.get(packListId);
          for (const oldPk of oldPackJobs) {
            const cartonIds = oldPk.cartonsList.filter(rec => !rec.isFgWhCartonId).map(rec => rec.cartonId)
            packJobs.set(oldPk.packJobId, cartonIds)
          }
          previous.set(packListId, packJobs)
          return previous
        })
      }
    }
  }


  const renderHeaderRow = (packInfo: PKMSPackListInfoModel) => {
    const isDSetCreated = packInfo.isInFgWhLines;
    return (
      <Flex
        wrap="nowrap"
        gap="large"
        justify="start"
        align="center"
        style={{ overflowX: 'auto' }}
      >
        {!isDSetCreated && viewFieldsOnly ? (
          <Checkbox
            checked={packListSelectionChecking(packInfo.packListId).checked}
            indeterminate={packListSelectionChecking(packInfo.packListId).indeterminate}
            onClick={(e) => e.stopPropagation()}
            onChange={async (e) => {
              if (e.target.checked) {
                let packListData = [];
                if (!packJobData.has(packInfo.packListId)) {
                  packListData = await getPackListDataByPackListIdForPackListSelection([packInfo.packListId]);
                }
                allCheckBoxesSelectionHandler(true, LevelOfSelection.PACK_LIST, packInfo.packListId, undefined, undefined, packListData)
              } else {
                setPackListLevelCartonsSelection(prev => {
                  const previous = new Map(prev)
                  previous.delete(packInfo.packListId);
                  return previous
                })
              }
            }}
          />
        ) : (
          <div style={{ marginLeft: '16px' }} />
        )}

        <Tooltip
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
          title={isDSetCreated ? "Dispatch set created!" : "Eligible For Dispatch!"}
        >
          <span
            className={`indicator ${isDSetCreated ? 'bg-green' : isDSetCreated === false ? 'bg-red' : 'bg-yellow'
              }`}
          />
        </Tooltip>
        <Col>Manufacturing Order: <Tag color="black">{packInfo.packListAttrs?.moNos?.toString()}</Tag></Col>
        <Col>Po Number: <Tag color="black">{packInfo.packListAttrs.vpos[0]}</Tag></Col>
        <Col>PL Number: <Tag color="black">{packInfo.packListDesc}</Tag></Col>
        <Col>Total Cartons: <Tag color="black">{packInfo.totalCartons}</Tag></Col>

        <Popover
          content={<PkCutDocketTable childData={packInfo} />}
          trigger={'click'}
        >
          <TagFilled />
        </Popover>
      </Flex>
    );
  };



  return (
    <>
      <Row style={{ display: 'flex', gap: '0px' }}>
        {(packListLevelCartonsSelection.size !== 0 && viewFieldsOnly) && <>
          <Col span={6}>
            <Form.Item
              name={"toWhCode"}
              rules={[{ message: 'Please Select Warehouse Code', required: true }]}
              label={'Warehouse Code'}
            >
              <Select
                placeholder={'Please Select Warehouse Code'}
                allowClear
                showSearch
                style={{ width: '150px' }}
                onChange={wareHouseOnChange}
              >
                {warehouseDropDown.map((rec) => <Select.Option value={rec.wareHouseCode}>{rec.wareHouseCode + "-" + rec.wareHouseDesc}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={'Floor'}
              name={"floor"}
              rules={[{ message: 'Please Select Floor', required: true }]}
              style={{ width: '200px' }}
            >
              <Select
                allowClear
                showSearch
                placeholder={'Select Floor'}
              >
                {Array.from(Array(floors).keys()).map(rec => <Select.Option value={rec + 1}>{'Floor' + " " + (rec + 1)}</Select.Option>)}
              </Select>

            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={'Request Date'}
              name={"requestDate"}
              rules={[{ message: 'Please Select Request Date', required: true }]}
            >
              <DatePicker
                style={{ width: '150' }}
                format={'YYYY-MM-DD HH:MM'}
              />
            </Form.Item>
          </Col>
          <Col offset={selectedCutOrders.length ? 0 : 1} xs={24} sm={12} md={4} lg={4}>
            <Button type="primary"
              className='btn-yellow'
              onClick={handleCreateDispatchSet}
              disabled={packListLevelCartonsSelection.size === 0}
              block
              style={{ width: '130%', whiteSpace: 'nowrap', textAlign: 'center' }}
            >
              Create FG Warehouse Request
            </Button>
          </Col>
        </>

        }
      </Row>
      <Row>
        <Col xs={12} sm={8} md={4} style={{ marginBottom: '8px' }}>
          {viewFieldsOnly && cutDispatchData.length > 0 && cutDispatchData[0]?.packListsInfo?.length > 0 && (
            <Checkbox
              indeterminate={packListLevelCartonsSelection.size !== 0 && (packListLevelCartonsSelection.size !== cutDispatchData[0]?.packListsInfo?.length)}
              checked={packListLevelCartonsSelection.size && (packListLevelCartonsSelection.size === cutDispatchData[0]?.packListsInfo?.length)}
              onChange={(e) => {
                if (e.target.checked) {
                  getPackListInfoByPackListId(cutDispatchData[0].packListsInfo.map(rec => rec.packListId), LevelOfSelection.ALL);
                } else {
                  setPackListLevelCartonsSelection(new Map())
                }
              }
              }
            >
              {packListLevelCartonsSelection.size && (packListLevelCartonsSelection.size === cutDispatchData[0]?.packListsInfo?.length) ? 'Deselect All' : 'Select All'}

            </Checkbox>
          )}

        </Col>
      </Row>

      <Collapse
        accordion={false}
        size="small"
        expandIconPosition="end"
        expandIcon={({ isActive }) => isActive ? (
          <MinusOutlined style={{ fontSize: '20px' }} />
        ) : (
          <PlusOutlined style={{ fontSize: '20px' }} />)}>
        {cutDispatchData[0]?.packListsInfo
          .map((item, index) => {
            const { prodNames, moNos, vpos, destinations, delDates, styles, buyers, } = item.packListAttrs
            return <Collapse.Panel
              header={renderHeaderRow(item)}
              key={item.packListId}

            >
              <Descriptions size='small' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>
                <Descriptions.Item label={<b>{'VPO Number'}</b>} className=''><span style={{ color: "black" }}>{vpos}</span></Descriptions.Item>
                <Descriptions.Item label={<b>{'Buyer Names'}</b>} className=''><span style={{ color: "black" }}>{buyers?.join(', ')}</span></Descriptions.Item>
                <Descriptions.Item label={<b>{'Product Names'}</b>} className=''><span style={{ color: "black" }}>{prodNames?.join(', ')}</span></Descriptions.Item>
                <Descriptions.Item label={<b>{'Destination'}</b>} className=''><span style={{ color: "black" }}>{destinations?.join(', ')}</span></Descriptions.Item>
                <Descriptions.Item label={<b>{'Delivery date'}</b>} className=''><span style={{ color: "black" }}>{delDates?.length ? SequenceUtils.deliveryDatesMethod(delDates[0]) : ''}</span></Descriptions.Item>
                <Descriptions.Item label={<b>{'Packing List Description'}</b>} className=''><span style={{ color: "black" }}>{item.packListDesc}</span></Descriptions.Item>
                <Descriptions.Item label={<b>{'Style'}</b>} className=''><span style={{ color: "black" }}><span color="black">{styles?.join(', ')}</span></span></Descriptions.Item>
                <Descriptions.Item label={''}>{''}</Descriptions.Item>
                <Descriptions.Item label={<b>{'No of cartons'}</b>}><Tag color="green">{item.totalCartons}</Tag></Descriptions.Item>
                <Descriptions.Item label={<b>{'No of Ready cartons'}</b>}><Tag color="green">{item.totalCartons}</Tag></Descriptions.Item>
              </Descriptions>

              <FgReqPackJobView
                key={item.packListId}
                getPackListInfoByPackListId={getPackListInfoByPackListId}
                packListId={item.packListId}
                packJobData={packJobData?.get(item.packListId)}
                selectedPackJobs={packListLevelCartonsSelection?.get(item?.packListId)}
                setPackListLevelCartonsSelection={setPackListLevelCartonsSelection}
              />
            </Collapse.Panel>
          })}
      </Collapse>


      <Modal
        title="Delivery Chalan Print"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
        className="custom-modal"
      >
        <DeliveryChalanPrint whReqHeaderId={2} />
      </Modal>

      <style>
        {`
    .custom-modal .ant-modal-content {
      width: 200%; 
      margin: 0 auto;
      right:50%;
    }
  `}
      </style>

    </>
  );
};

export default PkCutOrderDetails;


