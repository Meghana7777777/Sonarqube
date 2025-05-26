import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { CreateDispatchSetRequest, GlobalResponseObject, PKMSPackListInfoModel, PKMSPackOrderInfoModel, PKMSPackingDispatchCartonInfoModel, PKMSPackingDispatchPackJobsInfoModel, PKMSPackingDispatchPackListInfoModel, PackListCartoonIDs, PkDSetFilterRequest } from '@xpparel/shared-models';
import { PkDispatchSetService } from '@xpparel/shared-services';
import { Button, Checkbox, Col, Collapse, Flex, Row, Tag, Tooltip } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect, useState } from 'react';
import PkCutDocketTable from './pk-cut-docket-table';


interface PackOrderView {
  cutDispatchData: PKMSPackOrderInfoModel[];
  manufacturingOrderPk: string;
  packorderIdPk: number;
}

const PkCutOrderDetails = (props: PackOrderView) => {
  const { cutDispatchData } = props
  const [selectedCutOrders, setSelectedCutOrders] = useState<PKMSPackListInfoModel[]>([]);
  const user = useAppSelector((state) => state.user.user.user);

  const pKDispatchSetService = new PkDispatchSetService();
  const [dSetCreatedCuts, setDSetCreatedCuts] = useState<string[]>([]);
  const [packListLevelCartonsSelection, setPackListLevelCartonsSelection] = useState<Map<number, Map<number, Map<number, Map<number, number[]>>>>>(new Map<number, Map<number, Map<number, Map<number, number[]>>>>());
  const [packListLevelChecked, setPackListLevelChecked] = useState<Map<number, Map<number, boolean>>>(new Map<number, Map<number, boolean>>())
  const [expandedIndex, setExpandedIndex] = useState([]);
  const [packListDataFromDocketTable, setPackListDataFromDocketTable] = useState<Map<number, PKMSPackingDispatchPackListInfoModel>>(new Map())
  const [cartonsDataFromDocketTable, setCartonsDataFromDocketTable] = useState<Map<number, number[]>>(new Map());
  const [dispatchedCartonsCount, setDispatchedCount] = useState<Map<number, number[]>>(new Map());
  const [collapseActivateKeys, setCollapseActivateKeys] = useState<string[]>([]);



  useEffect(() => {
    if (props.manufacturingOrderPk) {
      getCreateSetCodesForManufacturingOrder(props.manufacturingOrderPk);
    }

  }, [props.manufacturingOrderPk]);

  const getCreateSetCodesForManufacturingOrder = async (manufacturingOrder: string) => {
    try {
      const reqObj = new PkDSetFilterRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [`${manufacturingOrder}`], true, false, false, false);
      const dispatchSetsRes = await pKDispatchSetService.getDispatchSetByFilter(reqObj);
      if (dispatchSetsRes.status) {
        const destCreatedForCutIds = dispatchSetsRes.data.flatMap((item) => {
          return item.dSetItems.map((d) => {
            if (!dispatchedCartonsCount.has(Number(d.packListId))) {
              dispatchedCartonsCount.set(Number(d.packListId), [d.totalSubItems])
            } else {
              dispatchedCartonsCount.get(Number(d.packListId)).push(d.totalSubItems)
            }
            return d.packListId
          })
        });
        const countMap = new Map<number, number[]>()
        dispatchedCartonsCount.forEach((rec, k) => {
          const total = rec.reduce((a, c) => a + c, 0);
          countMap.set(k, [total])
        });
        setDispatchedCount(countMap)
        setDSetCreatedCuts(destCreatedForCutIds);
      } else {
        AlertMessages.getErrorMessage(dispatchSetsRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
    setSelectedCutOrders([]);
  }



  const renderHeaderRow = (packInfo: PKMSPackListInfoModel) => {
    const isDSetCreated = dispatchedCartonsCount.get(packInfo.packListId)?.[0] === packInfo.totalCartons
    const isChecked = selectedCutOrders.some((order) => order.packListId === packInfo.packListId);

    return (
      <Flex
        wrap="wrap"
        gap="large"
        justify="start"
        align="center"
        style={{ overflowX: 'auto' }}
      >

        {!isDSetCreated ? (
          <Checkbox

            checked={isChecked}
            onChange={(e) => handleCheckboxChange(e.target.checked, packInfo)}
            onClick={(e) => e.stopPropagation()}
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
        <Col>VPO Number: <Tag color="black">{packInfo.packListAttrs?.vpos?.join(", ")}</Tag></Col>
        <Col>Total Cartons: <Tag color="black">{packInfo.totalCartons}</Tag></Col>
        <Col>Packing List Description: <Tag color="black">{packInfo.packListDesc}</Tag></Col>

      </Flex>
    );
  };




  const handleCheckboxChange = (checked: boolean, item: PKMSPackListInfoModel) => {
    if (checked) {
      if (packListDataFromDocketTable?.has(item.packListId)) {
        packListDataFromDocketTable?.get(item.packListId)?.packJobs?.forEach((pj) => {
          pj.cartonsList.forEach((ct, index) => {
            selectedGroupValues([ct], 0, pj.packJobId, item.packListId, Number(item.packOrderId))
          })
        })
      }
    } else {
      packListLevelCartonsSelection?.get(Number(item.packOrderId))?.delete(item.packListId);
    }
    setSelectedCutOrders((prevSelected) => {
      if (checked) {
        // Add selected item
        return [...prevSelected, item];

      } else {
        // Remove deselected item
        return prevSelected.filter((selectedItem) => selectedItem.packListId !== item.packListId);
      }
    });
    // console.log("inisede the check box change ", selectedCutOrders);
  };


  const handleCreateDispatchSet = async () => {
    try {
      const cutReq: PackListCartoonIDs[] = [];
      // selectedCutOrders.forEach(selectedPackLists => {
      //   if (packListLevelCartonsSelection.get(cutDispatchData[0].packListsInfo[0].packOrderId).has(selectedPackLists.packListId)) {
      //     cutReq.push(new PackListCartoonIDs(selectedPackLists.packListId, []));
      //     packListLevelCartonsSelection.get(cutDispatchData[0].packListsInfo[0].packOrderId).delete(selectedPackLists.packListId)
      //   }
      // });
      packListLevelCartonsSelection.get(cutDispatchData[0].packListsInfo[0].packOrderId).forEach((v, plK) => {
        v.forEach((pkjV) => {
          pkjV.forEach((ct) => {
            cutReq.push(new PackListCartoonIDs(plK, ct))
          })
        })
      })
      if (cutReq.length === 0) {
        AlertMessages.getErrorMessage('Please select at least one item.');
        return;
      }
      const reqObj = new CreateDispatchSetRequest(cutReq, false, false, false, false, false, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      const response = await pKDispatchSetService.createDispatchSet(reqObj);
      const res: GlobalResponseObject = response;
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getCreateSetCodesForManufacturingOrder(props.manufacturingOrderPk);
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
      else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    }
    setSelectedCutOrders([]);
  };

  // console.log(packListLevelCartonsSelection,'packListLevelCartonsSelection')

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const packListIds: string[] = []
      cutDispatchData[0]?.packListsInfo.map(rec => {
        packListIds.push(String(rec.packListId))
        handleCheckboxChange(checked, rec);
      });
      setCollapseActivateKeys(packListIds)
      if (packListDataFromDocketTable?.size > 0) {
        packListDataFromDocketTable?.forEach((pkL) => {
          pkL.packJobs.forEach((pj) => {
            pj.cartonsList.forEach((ct, index) => {
              selectedGroupValues([ct], 0, pj.packJobId, pkL.packListId, pkL.packOrderId)
            })
          })
        })
      }
    } else {
      packListLevelCartonsSelection?.delete(cutDispatchData[0].packOrderId);
      setCollapseActivateKeys([])
    }

    const allItems = cutDispatchData[0]?.packListsInfo || [];
    const allEligibleItems = allItems.filter(
      (item) => !dSetCreatedCuts.includes(item.packListId?.toString())
    );
    if (selectedCutOrders.length === allEligibleItems.length) {
      // Deselect all
      setSelectedCutOrders([]);
      // console.log("insiide the deselect all", selectedCutOrders);
    } else {
      // Select all eligible items
      setSelectedCutOrders(allEligibleItems);
      // console.log("inside select all", selectedCutOrders);
    }
  };

  const selectedGroupValues = (cartons: PKMSPackingDispatchCartonInfoModel[], index: number = 0, packJobId: number, packListId: number, packOrderId: number) => {
    const dispatchedCartons = cartonsDataFromDocketTable.get(packListId)
    const cartonsList: PKMSPackingDispatchCartonInfoModel[] = []
    cartons.forEach(rec => {
      if (!dispatchedCartons?.includes(rec.cartonId)) {
        cartonsList.push(rec);
      }
    })
    const filteredCartons = cartonsList.map(rec => rec.cartonId);
    setPackListLevelCartonsSelection((prev) => {
      const previousValues = new Map(prev);
      const packListMap = new Map();
      const packJobsList = new Map();
      const cartonsMap = new Map();
      cartonsMap.set(index, filteredCartons);
      packJobsList.set(packJobId, cartonsMap);
      packListMap.set(packListId, packJobsList);
      const isExistPackOrder = previousValues.has(packOrderId);
      const isExistPackList = previousValues.get(packOrderId)?.has(packListId);
      const isExistPackJob = previousValues?.get(packOrderId)?.get(packListId)?.has(packJobId);
      const isExistCartonJob = previousValues?.get(packOrderId)?.get(packListId)?.get(packJobId)?.has(index);
      if (!isExistPackOrder) {
        previousValues.set(packOrderId, packListMap)
      } else if (isExistPackOrder && !isExistPackList) {
        previousValues.get(packOrderId).set(packListId, packJobsList)
      } else if (isExistPackOrder && isExistPackList && !isExistPackJob) {
        previousValues.get(packOrderId).get(packListId).set(packJobId, cartonsMap)
      } else if (prev?.size && isExistPackOrder && isExistPackList && isExistPackJob && !isExistCartonJob) {
        previousValues?.get(packOrderId)?.get(packListId)?.get(packJobId)?.set(index, filteredCartons)
      } else if (prev?.size && isExistPackOrder && isExistPackList && isExistPackJob && isExistCartonJob) {
        const previousCartons = previousValues?.get(packOrderId)?.get(packListId)?.get(packJobId)?.get(index);
        const duplicates = new Set<number>()
        const cartonIds = filteredCartons;
        [...cartonIds, ...previousCartons].forEach(rec => {
          duplicates.add(rec)
        })
        previousValues?.get(packOrderId)?.get(packListId)?.get(packJobId)?.set(index, [...duplicates])
      }
      return previousValues

    })
  };


  const packJobHeaderCheckBoxOnChange = (selectedRows: PKMSPackingDispatchPackJobsInfoModel, checked: boolean, packListId: number, packOrderId: number) => {
    const packJobMap = new Map();
    packJobMap.set(selectedRows.packJobId, checked)
    const dispatchedCartons = cartonsDataFromDocketTable.get(packListId)
    const selectedRowsFilter = selectedRows.cartonsList.filter((rec) => !dispatchedCartons.includes(rec.cartonId))
    const list = { ...selectedRows, cartonsList: selectedRowsFilter };
    setPackListLevelChecked((prev) => {
      const previousValues = new Map(prev);
      if (!previousValues.has(packListId)) {
        previousValues?.set(packListId, packJobMap)
      } else if (previousValues.has(packListId) && !previousValues.get(packListId).has(list.packJobId)) {
        previousValues.get(packListId).set(list.packJobId, checked)
      } else if (previousValues.has(packListId) && previousValues.get(packListId).has(list.packJobId)) {
        previousValues.get(packListId).set(list.packJobId, checked)
      }
      return previousValues
    })
    if (checked) {
      selectedGroupValues(list.cartonsList, 0, list.packJobId, packListId, Number(packOrderId))
      summaryPreview(true, list);
    } else {
      summaryPreview(false, list);
      setPackListLevelCartonsSelection((prev) => {
        const previousValues = new Map(prev);
        previousValues?.get(packOrderId)?.get(packListId)?.delete(list.packJobId)
        return previousValues
      })
    }

  }


  const summaryPreview = (expand: boolean, record: PKMSPackingDispatchPackJobsInfoModel) => {
    const expandRows = new Set(expandedIndex);
    if (expand) {
      expandRows.add(record?.packJobId);
      setExpandedIndex(Array.from(expandRows));
    } else {
      expandRows.delete(record?.packJobId);
      setExpandedIndex(Array.from(expandRows));
    }
  }; 

  return (
    <>
      <Row justify="end" align="middle" style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={12} md={6} lg={4} style={{ display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            type="primary"
            className='btn-yellow'
            onClick={handleCreateDispatchSet}
            // disabled={activateDeactivateCreateDispatchSet()}
            block
            // style={{ width: '130%', whiteSpace: 'nowrap', textAlign: 'center' }}
          >
            Create Dispatch Set
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={8} md={4} style={{ marginBottom: '8px' }}>
          {cutDispatchData.length > 0 && cutDispatchData[0]?.packListsInfo?.length > 0 && (
            <Checkbox
              onChange={(e) => {
                handleSelectAll(e.target.checked)
              }}
              checked={(() => {
                const allItems = cutDispatchData[0]?.packListsInfo || [];
                const allEligibleItems = allItems.filter(
                  (item) => !dSetCreatedCuts.includes(item.packListId?.toString())
                );
                return selectedCutOrders.length > 0 && selectedCutOrders.length === allEligibleItems.length;
              })()}
              disabled={dSetCreatedCuts.length === cutDispatchData[0]?.packListsInfo.length}
            >
              {selectedCutOrders.length > 0 &&
                selectedCutOrders.length === cutDispatchData[0]?.packListsInfo?.length
                ? 'Deselect All'
                : 'Select All'}
            </Checkbox>
          )}
        </Col>
      </Row>

      <Collapse
        activeKey={collapseActivateKeys}
        accordion={false}
        style={{ width: '100%' }}
        size="small"
        expandIconPosition="end"
        onChange={(e:string[]) => {
          setCollapseActivateKeys(e)

        }}
        expandIcon={({ isActive }) => isActive ? (
          <MinusOutlined style={{ fontSize: '20px' }} />
        ) : (
          <PlusOutlined style={{ fontSize: '20px' }} />)}>
        {cutDispatchData[0]?.packListsInfo
          .map((item, index) => {

            return <Collapse.Panel
              header={renderHeaderRow(item)}
              key={item.packListId}

            >
              <PkCutDocketTable
                childData={item}
                packListLevelCartonsSelection={packListLevelCartonsSelection}
                setPackListLevelCartonsSelection={setPackListLevelCartonsSelection}
                packListId={item.packListId}
                packOrderId={Number(item.packOrderId)}
                selectedGroupValues={selectedGroupValues}
                packListLevelChecked={packListLevelChecked}
                setPackListLevelChecked={setPackListLevelChecked}
                expandedIndex={expandedIndex}
                setExpandedIndex={setExpandedIndex}
                summaryPreview={summaryPreview}
                packJobHeaderCheckBoxOnChange={packJobHeaderCheckBoxOnChange}
                selectedCutOrders={selectedCutOrders}
                setPackListDataFromDocketTable={setPackListDataFromDocketTable}
                packListDataFromDocketTable={packListDataFromDocketTable}
                setCartonsDataFromDocketTable={setCartonsDataFromDocketTable}
                cartonsDataFromDocketTable={cartonsDataFromDocketTable}
              />
            </Collapse.Panel>
          })}
      </Collapse>
    </>
  );
};

export default PkCutOrderDetails;


