import React, { memo, useEffect, useState } from 'react';
import { Card, Collapse, Button, Tooltip, Tag, Col, Flex, Checkbox, Row, message, Modal, Table, Select, Input, Form, InputNumber } from 'antd';
import { CheckCircleOutlined, CheckSquareOutlined, MinusOutlined, PlusOutlined, SelectOutlined } from '@ant-design/icons';
import CutDocketTable from './cut-docket-table';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { PkContainerTypeEnum, CutStatusEnum, PkDSetCreateRequest, PkDSetFilterRequest, PkDSetItemNosModel, PkDSetPlannedItemContainerModel, GlobalResponseObject } from '@xpparel/shared-models';
import { ColumnsType } from 'antd/es/table';
import { CombinedDocketData } from './create-shippable-interfaces';
import { CutOrderDataIn, Docket, ActualDocket } from './create-shippable-interfaces';
import { useAppSelector } from 'packages/ui/src/common';
import { DispatchSetService } from '@xpparel/shared-services';
import { AlertMessages } from 'packages/ui/src/components/common';


interface ICutOrderView {
  cutDispatchData: CutOrderDataIn[];
  manufacturingOrderPk: number;
}

interface ICutBagModel {
  cutId: string,
  cutNumber: string;
  cutSubNumber: string;
  bags: string[];
}

interface HeaderRowProps {
  props: CutOrderDataIn;
  selectedCutOrders: CutOrderDataIn[];
  handleCheckboxChange: (r: boolean, t: CutOrderDataIn) => void;
}

const columns = (formKey: number, handleBagSelection: (val: string | number, cutId: number) => void) => [
  {
    title: 'Cut Number',
    dataIndex: 'cut',
    key: 'cutSubNumber',
    width: '30%',
    align: 'center',
  },
  {
    title: 'Cut Number',
    dataIndex: 'cutSubNumber',
    key: 'cutSubNumber',
    width: '30%',
    align: 'center',
  },
  {
    title: 'No Of Bags',
    dataIndex: 'bags',
    key: 'bags',
    render: (text, record, i) => {
      // const cutObj = selectedCutBagInfo.find(e => e.cutId == `${record.cutId}`);
      return <InputNumber key={formKey + '' + i} onChange={(value) => handleBagSelection(value, record.cutId)} />
      // return <Select
      //   mode="multiple"
      //   placeholder="Select bags"
      //   key={formKey + '' + i}
      //   // value={cutObj ? cutObj.bags : []}
      //   style={{ width: '100%' }}
      //   onChange={(value) => handleBagSelection(value, record.cutId)} // Handle bag selection
      // >
      //   <Select.Option value="Bag1">Bag1</Select.Option>
      //   <Select.Option value="Bag2">Bag2</Select.Option>
      //   <Select.Option value="Bag3">Bag3</Select.Option>
      // </Select>
    }
  },
] as ColumnsType<CutOrderDataIn>;

const CutOrderDetails = (props: ICutOrderView) => {
  const { cutDispatchData } = props
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCutOrders, setSelectedCutOrders] = useState<CutOrderDataIn[]>([]);
  const [remarks, setRemarks] = useState<string>('');
  const user = useAppSelector((state) => state.user.user.user);
  const [selectedCutBagInfo, setSelectedCutBagInfo] = useState<ICutBagModel[]>([]);
  const dispatchSetService = new DispatchSetService();
  const completedCutsCount = cutDispatchData?.filter(item => item.isCutComplete).length || 0;
  const [formKey, setFormKey] = useState<number>(0);
  const [dSetCreatedCuts, setDSetCreatedCuts] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [selectedCutSubNumber, setSelectedCutSubNumber] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCutBagInfo([]);
    if (props.manufacturingOrderPk) {
      getCreateSetCodesForManufacturingOrder(props.manufacturingOrderPk);
    }

  }, [props.manufacturingOrderPk]);

  const getCreateSetCodesForManufacturingOrder = async (manufacturingOrder: number) => {
    try {
      const reqObj = new PkDSetFilterRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [`${manufacturingOrder}`], true, true, true, true);
      const dispatchSetsRes = await dispatchSetService.getDispatchSetByFilter(reqObj);

      if (dispatchSetsRes.status) {
        if (dispatchSetsRes.data.length === 0) {
          // AlertMessages.getErrorMessage("No dispatch sets found for the selected manufacturing orders.");
        } else {
          const destCreatedForCutIds = dispatchSetsRes.data.flatMap((item) => item.dSetItems.map(d => d.id));
          // setDSetCreatedCuts(destCreatedForCutIds);
        }
      } else {
        // AlertMessages.getErrorMessage(dispatchSetsRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  }

  const renderProducts = (item: CutOrderDataIn) => {
    let dockets = item.dockets || [];
    let actualDockets = item.actualDockets || [];
    const result: CombinedDocketData[] = combineDockets(dockets, actualDockets);
    return (
      <>
        {/* Add content for rendering product data */}
        <CutDocketTable childData={result} />
      </>
    );
  };

  // Function to combine dockets and actual dockets to display in inner table 
  const combineDockets = (dockets: Docket[], actualDockets: ActualDocket[]): CombinedDocketData[] => {
    const combinedData: CombinedDocketData[] = [];
    // Create a map for actual dockets for faster lookup
    const actualDocketMap: Record<string, ActualDocket[]> = actualDockets.reduce((map, actualDocket) => {
      const { docketNumber } = actualDocket;
      if (!map[docketNumber]) {
        map[docketNumber] = [];
      }
      map[docketNumber].push(actualDocket);
      return map;
    }, {} as Record<string, ActualDocket[]>);

    // Iterate through the dockets
    dockets.forEach(docket => {
      const { docket: docketNumber, mainDocket, item, itemDesc, plies } = docket;

      // Default entry for the docket
      const docketEntry: CombinedDocketData = {
        docket: docketNumber,
        mainDocket,
        item,
        itemDesc,
        plies,
        layNumber: 0,  // Default value
        layedPlies: 0, // Default value
        cutStatus: CutStatusEnum.OPEN, // Default cut status
      };

      // Check if there are actual dockets for this docket
      if (actualDocketMap[docketNumber]) {
        // Add the docket entry first
        // combinedData.push(docketEntry);

        // Include all matching actual dockets
        actualDocketMap[docketNumber].forEach(actualDocket => {
          combinedData.push({
            docket: docketNumber, // Keep the same docket number
            mainDocket,
            item,
            itemDesc,
            plies,
            layNumber: actualDocket.laynumber,
            layedPlies: actualDocket.layedPlies,
            cutStatus: actualDocket.cutStatus,
          });
        });
      } else {
        // If no actual dockets, just add the docket entry
        combinedData.push(docketEntry);
      }
    });

    return combinedData;
  };

  // const HeaderRow = React.memo((props: CutOrderDataIn) => {
  const renderHeaderRow = (cutInfo: CutOrderDataIn, dSetCreatedCutIds: string[]) => {
    const { cutOrder, cut, totalQuantity, totalPlannedBundles, totalShadeBundles, manufacturingOrder, isCutComplete, cutId, productName } = cutInfo;
    const isDSetCreated = dSetCreatedCutIds.includes(cut);
    return (
      <Flex
        wrap="nowrap"  // Prevent wrapping to a new line
        gap="large"
        justify="start"
        align="center"  // Ensures vertical alignment
        style={{ overflowX: 'auto' }} // Adds horizontal scrolling if content overflows
      >
        {/* <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={!isCutComplete ? "Cut  Not Eligible!" : ""}> */}
        {isCutComplete || isDSetCreated ? <Checkbox
          onChange={(e) => handleCheckboxChange(e.target.checked, cutInfo)}
          checked={selectedCutOrders.some(item => item.cut === cut)}
          onClick={(e) => {
            e.stopPropagation();
          }}
          disabled={!isCutComplete || isDSetCreated}
        /> : <span className="empty-span" />}
        {/* </Tooltip> */}
        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={!isCutComplete ? "Cut Not Eligible!" : isDSetCreated ? "Dispatch created" : ""}>
          <span className={`indicator ${isCutComplete ? isDSetCreated ? 'bg-green' : 'bg-yellow' : 'bg-red'}`} />
        </Tooltip>
        {/* <Col>manufacturing Order: <Tag color="black">{manufacturingOrder}</Tag></Col>         */}
        <Col>Cut No: <Tag color="black">{cut}</Tag></Col>
        <Col>Product Name: <Tag color="black">{productName}</Tag></Col>
        <Col>Cut Sub No: <Tag color="black">{cutOrder}</Tag></Col>
        <Col>Total Quantity: <Tag color="black">{totalQuantity}</Tag></Col>
        <Col>Total Planned Bundles: <Tag color="black">{totalPlannedBundles}</Tag></Col>
        <Col>Total Shade Bundles: <Tag color="black">{totalShadeBundles}</Tag></Col>
      </Flex>
    );
  };
  // });


  // Handle checkbox selection and deselection
  const handleCheckboxChange = (checked: boolean, item: CutOrderDataIn) => {
    if (checked) {
      // Add selected item to the state
      setSelectedCutOrders((prevSelected) => [...prevSelected, item]);
    } else {
      // Remove deselected item from the state
      setSelectedCutOrders((prevSelected) =>
        prevSelected.filter((selectedItem) => selectedItem.cutOrder !== item.cutOrder)
      );
    }
  };

  const handleCreateDispatchSet = () => {
    if (selectedCutOrders.length === 0) {
      AlertMessages.getErrorMessage('Please select at least one item.');
      return;
    }
    else {
      const selectedCutBagInf: ICutBagModel[] = selectedCutOrders.map(order => ({
        cutId: order.cutId.toString(),
        cutNumber: order.cut,
        cutSubNumber: order.cutSubNumber,
        bags: []
      }));
      setSelectedCutBagInfo(selectedCutBagInf);
      setFormKey(pre => pre + 1);
    }
    form.setFieldValue('remarks', undefined);
    setIsModalOpen(true); // Open the modal
  };

  const handleOk = async () => {
    // const poserial: number = selectedCutOrders.length > 0 ? selectedCutOrders[0].selectedPo : null;
    // selectedCutOrders.forEach(
    const cutReq: PkDSetItemNosModel[] = [];
    selectedCutBagInfo.forEach(i => {
      const bgsModel = new PkDSetPlannedItemContainerModel(PkContainerTypeEnum.BAG, i.bags, i.cutId, remarks);
      cutReq.push(new PkDSetItemNosModel([i.cutId], [bgsModel]));
    })
    try {
      const reqObj = new PkDSetCreateRequest(cutReq, '', user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      const response = await dispatchSetService.createDispatchSet(reqObj);
      const res: GlobalResponseObject = response;
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        setIsModalOpen(false);
        getCreateSetCodesForManufacturingOrder(props.manufacturingOrderPk);
        // setSelectedCutBagInfo([]);
      }
      else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    }
    setIsModalOpen(false);
    setSelectedCutOrders([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleBagSelection = (noOfBags: number | string, cutId: number) => {
    const numberOfBagsArray = Array.from({ length: Number(noOfBags) }, (_, index) => `${index + 1}`);
    // Handle bag selection for dispatch data
    // Update the bags for the specific cutId in selectedCutBagInfo
    setSelectedCutBagInfo(prevInfo =>
      prevInfo.map(item => {
        // Check if the current item's cutId matches the provided cutId
        if (item.cutId === cutId.toString()) {
          // Create a new bags array that includes existing bags and the newly selected bags
          // const updatedBags = Array.from(new Set([...item.bags, ...selectedBags])); // Avoid duplicates
          return { ...item, bags: numberOfBagsArray }; // Return updated item
        }
        return item; // Return unchanged item
      })
    );


  };




  const handleSelectAll = () => {
    // Check if all eligible cut orders are selected
    if (selectedCutOrders.length === completedCutsCount) {
      // If all are selected, clear the selection (Deselect All)
      setSelectedCutOrders([]);
    } else {
      // Select only the eligible cut orders (isCutComplete === true)
      const eligibleItems = cutDispatchData.filter(item => item.isCutComplete);
      if (eligibleItems.length === 0) {
        message.warning("Cuts are Not Eligible");
      }
      setSelectedCutOrders(eligibleItems);
    }
  };

  const uniqueCutSubNumbers = Array.from(new Set(cutDispatchData.map(item => item.cutSubNumber)));


  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
 
        <Col xs={12} sm={16} md={5}  >
          <Form.Item label={'Select Cut Sub Number'}>
            <Select
              placeholder="Select Cut Sub Number"
              mode="multiple"
              onChange={(value) => setSelectedCutSubNumber(value)}
              style={{ width: '100%' }}
              allowClear>
              {uniqueCutSubNumbers.map((cutSubNumber) => (
                <Select.Option key={cutSubNumber} value={cutSubNumber}>
                  {cutSubNumber}
                </Select.Option>))}
            </Select>
          </Form.Item>
        </Col>


        <Col xs={12} sm={8} md={4} style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <Button type="primary" className='btn-yellow' onClick={handleCreateDispatchSet} disabled={selectedCutOrders.length === 0} block
            style={{ width: '130%', whiteSpace: 'nowrap', textAlign: 'center' }}>
            Create Dispatch Set
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={8} md={4} style={{ marginBottom: '8px' }}>
          {cutDispatchData?.length > 0 && (
            <Checkbox onChange={handleSelectAll} checked={selectedCutOrders.length === completedCutsCount}>
              {selectedCutOrders.length === completedCutsCount ? 'Deselect All' : 'Select All'}
            </Checkbox>)}
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
        {cutDispatchData
          .filter((item) => selectedCutSubNumber.length === 0 || selectedCutSubNumber.includes(item.cutSubNumber))
          .map((item, index) => (
            <Collapse.Panel
              header={renderHeaderRow(item, dSetCreatedCuts)}
              key={item.cutId}
              style={{}}
            >
              {renderProducts(item)}
            </Collapse.Panel>
          ))}
      </Collapse>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}

        title={<>Manufacturing Order: {selectedCutOrders[0]?.manufacturingOrder}</>}
        footer={null}
        width={600}
      >
        {selectedCutOrders.length > 0 && (
          <Table
            dataSource={selectedCutOrders}

            columns={columns(formKey, handleBagSelection,)}
            rowKey="cutOrder"
            pagination={false}
            size="small"
          />
        )}

        <Row align="middle" style={{ marginTop: 16 }}>
          <Form layout='inline' form={form}>
            <Form.Item label="Remarks" name="remarks">
              <Input.TextArea
                rows={1}
                placeholder="Add remarks here..."
                // value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                style={{ width: '300px', display: 'inline-block', marginLeft: 8, verticalAlign: 'middle' }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleOk} className='btn-green' style={{ marginLeft: 8 }}>
                Confirm
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </Modal>
    </>
  );
};

export default CutOrderDetails;


