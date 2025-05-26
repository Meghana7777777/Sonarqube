import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Select, Space, Collapse, Checkbox, message, Popconfirm, Modal, Table, Tooltip, Tag, Flex } from "antd";
import { PkDSetFilterRequest, PkDSetIdsRequest, PkDSetItemModel, PkDSetModel, MoListModel, MoListRequest, MoStatusEnum, CommonRequestAttrs, MoNumberResDto } from "@xpparel/shared-models";
import { AlertMessages } from "../../../../common";
import { OrderManipulationServices, PkDispatchSetService, PkShippingRequestService, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, InfoCircleOutlined, MinusOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons";
import { PkSelectedDetail, PkShipmentData } from "./pk-shipping-request-interface";
import ShippableSetDetails from "./pk-shipping-request-creation-details";
import modal, { ModalFuncProps } from "antd/es/modal";
import { constructDrUniqueAttrs } from "../pk-pending-dispatch/sr-attrs.helper";

const columns = [
  {
    title: (
      <span style={{ fontWeight: 'bold', color: '#000' }}>Product Name</span>
    ),
    dataIndex: 'productName',
    key: 'productName',
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: (
      <span style={{ fontWeight: 'bold', color: '#000' }}>Manufacturing Order</span>
    ),
    dataIndex: 'manufacturingOrder',
    key: 'manufacturingOrder',
  },
  {
    title: (
      <span style={{ fontWeight: 'bold', color: '#000' }}>Shippable Set Code</span>
    ),
    dataIndex: 'shippableSetCode',
    key: 'shippableSetCode',
  },
]

const PkDispatchPage = () => {
  const [manufacturingOrders, setManufacturingOrders] = useState<MoNumberResDto[]>([]);
  const [dispatchSets, setDispatchSets] = useState<PkDSetModel[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedManufacturingOrders, setSelectedManufacturingOrders] = useState<string[]>([]);
  const [isSelectAllVisible, setIsSelectAllVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dSetPks, setDSetPks] = useState<number[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<PkSelectedDetail[]>([]);

  const { Option } = Select;
  const user = useAppSelector((state) => state.user.user.user);
  const dispatchSet = new PkDispatchSetService();
  const shippingService = new PkShippingRequestService();
  const preIntegrationServicePKMS = new PreIntegrationServicePKMS();


  useEffect(() => {
    getManufacturingOrders();
  }, []);

  /**
   * Get manufacturing orders
   */
  const getManufacturingOrders = async () => {
    try {
      const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      const manufacturingOrderRes = await preIntegrationServicePKMS.getPKMSMoNumbers(reqObj);
      if (manufacturingOrderRes.status) {
        setManufacturingOrders(manufacturingOrderRes.data);
      } else {
        AlertMessages.getErrorMessage(manufacturingOrderRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };


  const searchShippableSet = () => {
    if (selectedManufacturingOrders.length > 0) {
      resetCheckBoxes();
      getDispatchSetByFilter(selectedManufacturingOrders);
      setIsSelectAllVisible(true);
    } else {
      message.warning("Please select at least one Manufacturing Order.");
    }
  };


  const getDispatchSetByFilter = async (manufacturingOrderPks: string[]) => {
    try {
      const reqObj = new PkDSetFilterRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, manufacturingOrderPks, true, true, true, true);
      const dispatchSetsRes = await dispatchSet.getDispatchSetByFilter(reqObj);

      if (dispatchSetsRes.status) {
        if (dispatchSetsRes.data.length === 0) {
          message.info("No dispatch sets found for the selected manufacturing orders.");
        } else {
          // const fetchedData = dispatchSetsRes.data.map((item: any) =>
          //   new DSetModel(item.id, item.moNumber, item.productName, item.dSetCode, item.shippingReqCreated, item.dSetItems)
          // );
          setDispatchSets(dispatchSetsRes.data);
        }
      } else {
        AlertMessages.getErrorMessage(dispatchSetsRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };

  const handleCreateShippingRequest = () => {

    if (selectedRowKeys.length > 0) {
      const dSetPks: number[] = selectedRowKeys.map((id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          throw new Error(`Invalid ID: ${id}`);
        }
        return parsedId;
      });
      const details: PkSelectedDetail[] = dispatchSets
        .filter(record => dSetPks.includes(record.id))
        .map(record => ({
          productName: record.dSetCode,
          manufacturingOrder: record.moNumber,
          shippableSetCode: record.dSetCode,
        }));
      setSelectedDetails(details);
      if (!user || !user.userName || !user.orgData || !user.orgData.unitCode || !user.orgData.companyCode) {
        throw new Error("User data is incomplete or missing.");
      }
      setDSetPks(dSetPks);
      modal.confirm(renderConfirmData(details, dSetPks));
    } else {
      message.warning("Please select at least one row to create a shipping request.");
    }
  };

  const handleConfirmCreateShippingRequest = async (dSetPkIds: number[]) => {
    if (dSetPkIds.length > 0) {
      try {
        const newReqObj = new PkDSetIdsRequest(dSetPkIds, null, true, false, true, false, user.userName, user.orgData.unitCode, user.orgData.companyCode, user.id);
        const createResponse = await shippingService.createShippingRequest(newReqObj);

        if (createResponse.status) {
          Modal.destroyAll();
          resetCheckBoxes();
          AlertMessages.getSuccessMessage(createResponse.internalMessage);
          getDispatchSetByFilter(selectedManufacturingOrders); // Refresh the dispatch sets
          setIsModalVisible(false); // Close modal after successful creation
        } else {
          AlertMessages.getErrorMessage(createResponse.internalMessage);
        }
      } catch (error) {
        AlertMessages.getErrorMessage(error.message);
      }
    }
  };



  const handleDelete = async (record: PkDSetModel) => {
    try {
      const reqObj = new PkDSetIdsRequest([record.id], null, true, true, true, false, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      const deleteResponse = await dispatchSet.deleteDispatchSet(reqObj);
      if (deleteResponse.status) {
        AlertMessages.getSuccessMessage(deleteResponse.internalMessage);
        getDispatchSetByFilter(selectedManufacturingOrders);
      } else {
        AlertMessages.getErrorMessage(deleteResponse.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  };


  const handleCheckboxChange = (key: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys((prevKeys) => [...new Set([...prevKeys, key])]);
    } else {
      setSelectedRowKeys((prevKeys) => prevKeys.filter((k) => k !== key));
    }
  };

  const resetCheckBoxes = () => {
    setSelectedRowKeys([]);
  }

  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    if (checked) {
      const allEnabledKeys = dispatchSets
        .filter((record) => !record.shippingReqCreated)
        .map((record) => String(record.id));
      setSelectedRowKeys(allEnabledKeys);
    } else {
      setSelectedRowKeys([]);
    }
  };


  const isAllSelected = dispatchSets.length > 0 && dispatchSets
    .filter((record) => !record.shippingReqCreated)
    .every((record) => selectedRowKeys.includes(String(record.id)));


  const isMomeSelected = dispatchSets
    .filter((record) => !record.shippingReqCreated)
    .some((record) => selectedRowKeys.includes(String(record.id)));

  const isSelectAllDisabled = dispatchSets.every((record) => record.shippingReqCreated);


  const renderChildItems = (record: PkDSetModel) => {
    const shipmentData = record.dSetItems.map((item: PkDSetItemModel) => ({
      moNum: item.itemAttributes?.l1,
      packListId: item.packListId,
      totalCartons: item.totalSubItems,
      dsetId: item.id,
      dSetItemId: record.id,
      styles: item.itemAttributes?.l2,
      buyers: item.itemAttributes?.lm4,
      delDates: item.itemAttributes?.l8,
      vpos: item.itemAttributes?.l4,
      dSetCode: record.dSetCode,
      // productNames: item.itemAttributes?.lm2,
      destination: item.itemAttributes?.lm2,
      plDesc: item.packListDesc,
    } as PkShipmentData));
    return <ShippableSetDetails data={shipmentData} refreshParentComponent={()=>getDispatchSetByFilter(selectedManufacturingOrders)} />;
  };


  const renderHeader = (record: PkDSetModel) => {
    let totalCartons = 0;
    record.dSetItems.forEach(r => totalCartons+=r.totalSubItems);
    const deAttrs = constructDrUniqueAttrs(record.dSetItems);
    return (
       <Flex wrap="wrap" gap="large" justify="start" align="center" style={{ overflowX: 'auto' }}>
          {/* <Tooltip title={!record.shippingReqCreated ? "" : "Shipping Request Created"}> */}
          {record.shippingReqCreated ? <span className="empty-span" /> :
            <Checkbox
              checked={selectedRowKeys.includes(String(record.id))}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => !record.shippingReqCreated && handleCheckboxChange(String(record.id), e.target.checked)}
              disabled={record.shippingReqCreated} />
          }
          {/* </Tooltip> */}
          <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={record.shippingReqCreated ? "Shipping Request Created" : ""}>
            <span className={`indicator ${record.shippingReqCreated ? 'bg-green' : 'bg-yellow'}`} />
          </Tooltip>
          <Col>Shippable Set Code: <Tag color="black">{record.dSetCode}</Tag></Col>
          <Col>Manufacturing Order: <Tag color="black">{record.moNumber}</Tag></Col>
          <Col>VPO : <Tag color="black">{deAttrs.poNos}</Tag></Col>
          <Col>Buyers : <Tag color="black">{deAttrs.buyers}</Tag></Col>
          <Col>Delivery : <Tag color="black">{deAttrs.delDates}</Tag></Col>
          <Col>Destination : <Tag color="black">{deAttrs.dests}</Tag></Col>
          <Col>Total Cartons: <Tag color="black">{totalCartons}</Tag></Col>
          {/* <Col>Req No : <Tag color="black">{record.id}</Tag></Col> */}
        <Space style={{ marginLeft: "auto" }}>
          <Popconfirm
            title={`Are you sure you want to delete ${record.dSetCode}?`}
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            onCancel={(e)=> {
              e.stopPropagation();
            }}
            okText="Yes"
            cancelText="No">
            <Button disabled={record.shippingReqCreated} size="small" type="primary" onClick={(e) => e.stopPropagation()} danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>

          {/* <Button size="small" type="primary" className="btn-blue" onClick={(e) => e.stopPropagation()} icon={<PrinterOutlined />}> Print All Bundles </Button> */}
          {/* <Button size="small" type="primary" className="btn-orange" onClick={(e) => e.stopPropagation()} icon={<PrinterOutlined />}>  Print All Bags  </Button> */}
        </Space>
      </Flex>
    );
  };


  const renderConfirmData = (selectedSetCodesInfo: PkSelectedDetail[], dSetPksPram: number[]) => {
    return {
      title: 'Are you sure you want to create a shipping request?',
      width: 600,
      footer: <div style={{ float: 'right' }}>
        <Space>
          <Button key="back" onClick={() => Modal.destroyAll()} icon={<CloseCircleOutlined />}> Cancel </Button>
          <Button key="submit" type="primary" className="btn-green" onClick={() => handleConfirmCreateShippingRequest(dSetPksPram)} icon={<CheckCircleOutlined />}> Confirm </Button>
        </Space>
      </div>,
      content: selectedSetCodesInfo.length > 0 ? <Table style={{ margin: '10px 0' }}
        dataSource={selectedSetCodesInfo}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
        size="small"
      // style={{ borderRadius: '8px', overflow: 'hidden', border: '1px molid #d9d9d9' }}
      // onRow={(record, index) => {
      //   return {
      //     style: { backgroundColor: index % 2 === 0 ? '#fafafa' : '#f0f0f0', },
      //   }}}
      />
        : <div>No items selected.</div>
    } as ModalFuncProps;
  }


  return (
    <Card className="ant-card">
      <Form layout="horizontal">
        <Row gutter={[24, 24]} >
          <Col xs={24} sm={24} md={9} lg={8} xl={8}>
            <Form.Item label="Select Manufacturing Order" name="manufacturingOrder" rules={[{ required: true, message: "Select MO/Plant Style Ref" }]} style={{ marginBottom: 0 }} >
              <Select style={{ width: '300px' }} mode="multiple" placeholder="Select MO/Plant Style Ref"
                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} showSearch
                onChange={(value: string[]) => setSelectedManufacturingOrders(value)} dropdownStyle={{ maxHeight: 280, overflowY: 'auto' }}>
                {manufacturingOrders.map((moList) => (
                  <Option value={moList.moId} key={moList.moId}>
                    {moList.moNumber}
                  </Option>))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" onClick={searchShippableSet} > Search </Button>
          </Col>
        </Row>
      </Form>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0", alignItems: 'center' }}>
        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0}
          onClick={() => handleCreateShippingRequest()}
          style={{ margin: "10px 0px" }}
          className="btn-green"
        >
          Create Shipping Request
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0", alignItems: 'center' }}>

        {isSelectAllVisible ? (

          <Checkbox
            defaultChecked={false}
            indeterminate={isMomeSelected && !isAllSelected}
            checked={isAllSelected}
            onChange={handleSelectAllChange}
            disabled={isSelectAllDisabled}
            style={{ marginRight: '8px' }}
          >
            <span style={{ fontSize: '14px' }}>Select All</span>
          </Checkbox>

        ) : <span />}

        {/* <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={handleCreateShippingRequest}
            style={{ float: "right", marginBottom: "10px" }} className="btn-green"> Create Shipping Request
          </Button> */}
      </div>
      <Collapse
        accordion={false} size="small" expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <MinusOutlined style={{ fontSize: "20px" }} />
          ) : (
            <PlusOutlined style={{ fontSize: "20px" }} />
          )
        }
      >
        {dispatchSets.map((record) => (
          <Collapse.Panel key={record.id} header={renderHeader(record)}
          // style={{
          //   backgroundColor: !record.shippingReqCreated ? 'green' : 'transparent',
          // }}
          >
            {renderChildItems(record)}


          </Collapse.Panel>
        ))}
      </Collapse>

    </Card>
  );
};

export default PkDispatchPage;
