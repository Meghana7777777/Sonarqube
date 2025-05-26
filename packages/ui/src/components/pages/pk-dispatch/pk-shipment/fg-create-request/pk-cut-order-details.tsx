import React, { useEffect, useState } from 'react';
import { Card, Collapse, Button, Tag, Col, Flex, Checkbox, Row, Form, Tooltip, } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { PkDSetCreateRequest, PkDSetFilterRequest, PkDSetItemNosModel, PkDSetPlannedItemContainerModel, GlobalResponseObject, PKMSPackOrderInfoModel, PKMSPackListInfoModel } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { PkDispatchSetService } from '@xpparel/shared-services';
import { AlertMessages } from 'packages/ui/src/components/common';
import PkCutDocketTable from './pk-cut-docket-table';
import { constructPlUniqueAttrs } from '../pk-pending-dispatch/sr-attrs.helper';


interface PackOrderView {
  cutDispatchData: PKMSPackOrderInfoModel[];
  manufacturingOrderPk: number;
  packorderIdPk: number;
}

const PkCutOrderDetails = (props: PackOrderView) => {
  const { cutDispatchData } = props
  const [selectedCutOrders, setSelectedCutOrders] = useState<PKMSPackListInfoModel[]>([]);
  const user = useAppSelector((state) => state.user.user.user);
  const pKdispatchSetService = new PkDispatchSetService();
  const [dSetCreatedCuts, setDSetCreatedCuts] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [selectedCutSubNumber, setSelectedCutSubNumber] = useState<string[]>([]);
  console.log("dataaaaa", cutDispatchData[0]);
  useEffect(() => {
    if (props.manufacturingOrderPk) {
      getCreateSetCodesForManufacturingOrder(props.manufacturingOrderPk);
    }

  }, [props.manufacturingOrderPk]);

  const getCreateSetCodesForManufacturingOrder = async (manufacturingOrder: number) => {
    try {
      const reqObj = new PkDSetFilterRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [`${manufacturingOrder}`], true, true, true, true);
      const dispatchSetsRes = await pKdispatchSetService.getDispatchSetByFilter(reqObj);

      if (dispatchSetsRes.status) {
        if (dispatchSetsRes.data.length === 0) {
          // AlertMessages.getErrorMessage("No dispatch sets found for the selected manufacturing orders.");
        } else {
          const destCreatedForCutIds = dispatchSetsRes.data.flatMap((item) => item.dSetItems.map(d => d.packListId));
          setDSetCreatedCuts(destCreatedForCutIds);
          console.log("dataaaaaa of selected..", dSetCreatedCuts);
        }
      } else {
        AlertMessages.getErrorMessage(dispatchSetsRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
    setSelectedCutOrders([]);
  }


  // const HeaderRow = React.memo((props: CutOrderDataIn) => {
  const renderHeaderRow = (packInfo: PKMSPackListInfoModel, dSetCreatedCutIds: string[]) => {
    const isDSetCreated = dSetCreatedCutIds.includes(packInfo.packListId?.toString());
    console.log("iscreateddddddddddd", isDSetCreated);
    console.log("inside the header rowwww");
    const plAttrs = constructPlUniqueAttrs([packInfo.packListAttrs]);
    return (
      <Flex
        wrap="nowrap"  // Prevent wrapping to a new line
        gap="large"
        justify="start"
        align="center"  // Ensures vertical alignment
        style={{ overflowX: 'auto' }} // Adds horizontal scrolling if content overflows
      >

        {/* <Checkbox
          onChange={handleSelectAll}
          checked={selectedCutOrders.length === cutDispatchData[0]?.packListsInfo.length}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></Checkbox>  */}
        {isDSetCreated ? <Checkbox
          onChange={handleSelectAll}
          checked={selectedCutOrders.length === cutDispatchData[0]?.packListsInfo.length}
          onClick={(e) => {
            e.stopPropagation();
          }}
          disabled={isDSetCreated}
        /> : <span></span>}
        <Tooltip
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
          title={isDSetCreated ? "Dispatch set created!" : "Eligible For Dispatch!"}
        >
          <span className={`indicator ${isDSetCreated ? 'bg-green' : isDSetCreated === false ? 'bg-red' : 'bg-yellow'}`} />
        </Tooltip>
        <Col>Manufacturing Order: <Tag color="black">{plAttrs.moNos}</Tag></Col>
        <Col>MO: <Tag color="black">{packInfo.moId}</Tag></Col>
        <Col>POs : <Tag color="black">{plAttrs.poNos}</Tag></Col>
        <Col>Buyers : <Tag color="black">{plAttrs.buyers}</Tag></Col>
        <Col>Delivery : <Tag color="black">{plAttrs.delDates}</Tag></Col>
        <Col>Destination : <Tag color="black">{plAttrs.dests}</Tag></Col>
        <Col>Total cartons: <Tag color="black">{packInfo.totalCartons}</Tag></Col>
      </Flex>
    );
  };
  // });


  // Handle checkbox selection and deselection
  const handleCheckboxChange = (checked: boolean, item: PKMSPackListInfoModel) => {
    if (checked) {
      console.log("inside ckeckk", item);
      // Add selected item to the state
      setSelectedCutOrders((prevSelected) => [...prevSelected, item]);
      console.log("selecteddddddd", selectedCutOrders);
    } else {
      // Remove deselected item from the state
      setSelectedCutOrders((prevSelected) =>
        prevSelected.filter((selectedItem) => selectedItem.packListId !== item.packListId)
      );
      console.log("delecteddddddd", selectedCutOrders);
    }
  };

  const handleCreateDispatchSet = async () => {
    if (selectedCutOrders.length === 0) {
      AlertMessages.getErrorMessage('Please select at least one item.');
      return;
    }

    console.log("inside the create dispatch", selectedCutOrders);

    try {
      const cutReq: PkDSetItemNosModel[] = [];
      selectedCutOrders.forEach(i => {
        const bgsModel = new PkDSetPlannedItemContainerModel(null, [], '', '');
        cutReq.push(new PkDSetItemNosModel([i.packListId?.toString()], [], props.packorderIdPk?.toString(), ''));
      })
      const reqObj = new PkDSetCreateRequest(cutReq, '', user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      // const response = await pKdispatchSetService.createDispatchSet(reqObj);
      // const res: GlobalResponseObject = response;
      // if (res.status) {
      //   AlertMessages.getSuccessMessage(res.internalMessage);
      //   getCreateSetCodesForManufacturingOrder(props.manufacturingOrderPk);
      // }
      // else {
      //   AlertMessages.getErrorMessage(res.internalMessage);
      // }
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    }
    setSelectedCutOrders([]);
  };

  const handleSelectAll = () => {
    // console.log("length selected orders", selectedCutOrders.length, "length of cutDispatch data", cutDispatchData[0].packListsInfo.length);

    // if (selectedCutOrders.length === cutDispatchData[0]?.packListsInfo?.length) {
    if (selectedCutOrders.length === cutDispatchData[0]?.packListsInfo?.length) {
      setSelectedCutOrders([]);
    } else {
      // const eligibleItems=dSetCreatedCutIds 
      // Filter the packListsInfo based on dSetCreatedCutIds
      let filteredPackLists = cutDispatchData[0]?.packListsInfo?.filter(packList =>
        !dSetCreatedCuts.includes(packList.packListId?.toString())
      );
      setSelectedCutOrders(filteredPackLists);
    }
  };


  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <Col offset={18} xs={12} sm={8} md={4} style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <Button type="primary" className='btn-yellow' onClick={handleCreateDispatchSet} disabled={selectedCutOrders.length === 0} block
            style={{ width: '130%', whiteSpace: 'nowrap', textAlign: 'center' }}>
            Create Dispatch Set
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={8} md={4} style={{ marginBottom: '8px' }}>
          {/* {cutDispatchData?.length > 0 && (
              <Checkbox onChange={handleSelectAll} checked={selectedCutOrders.length === completedCutsCount}>
           {selectedCutOrders.length === completedCutsCount ? 'Deselect All' : 'Select All'}
         </Checkbox>)} */}
          {cutDispatchData.length > 0 && cutDispatchData[0]?.packListsInfo?.length > 0 && (
            <Checkbox onChange={handleSelectAll} checked={selectedCutOrders.length === cutDispatchData[0]?.packListsInfo.length} disabled={dSetCreatedCuts.length === cutDispatchData[0]?.packListsInfo.length}>
              {selectedCutOrders.length === cutDispatchData[0]?.packListsInfo?.length ? 'Deselect All' : 'Select All'}

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
          .map((item, index) => (
            <Collapse.Panel
              header={renderHeaderRow(item, dSetCreatedCuts)}
              key={item.packOrderId}
              style={{}}
            >
              <PkCutDocketTable childData={cutDispatchData[0]?.packListsInfo} />
            </Collapse.Panel>
          ))}
      </Collapse>
    </>
  );
};

export default PkCutOrderDetails;


