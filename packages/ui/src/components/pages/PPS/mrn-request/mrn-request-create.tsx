import { DocMaterialAllocationModel, DocRollsRequest, DocketBasicInfoModel, DocketGroupBasicInfoModel, ItemCodeRequest, MaterialRequestNoRequest, MrnCreateRequest, MrnIdStatusRequest, MrnStatusEnum, PoDocketGroupRequest, PoDocketNumberRequest, PoProdutNameRequest, PoSummaryModel, StockCodesRequest, StockRollInfoModel, } from "@xpparel/shared-models";
import { DocketGenerationServices, DocketMaterialServices, MrnService, } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Col, Descriptions, DescriptionsProps, Divider, Empty, Form, InputNumber, Row, Select, Skeleton, Table, Tag, Tooltip, } from "antd";
import { useEffect, useState } from "react";
import { returnZeroIfNaN, useAppSelector } from "../../../../common";
import { AlertMessages, getLayoutSettings } from "../../../common";
import AllocatedRolls from "../material-allocation/allocated-rolls";
import { stockRollInfoModelColumns } from "../material-allocation/material-allocation-columns";
import CountdownTimer from "../../../common/timer/timer-component";

interface IAllocationPopUpProps {
  selectedPo?: PoSummaryModel;
}

const { Option } = Select;
type aaa = StockRollInfoModel & {
  checkbox: boolean;
  allocatingQuantity: number;
};
export const MrnRequestCreate = (props?: IAllocationPopUpProps) => {
  const { selectedPo } = props;
  const [openStockInRolls, setOpenStockInRolls] = useState<aaa[]>([]);
  const [currentAllocatedQty, setCurrentAllocatedQty] = useState(0);
  const [previousAllocatedQty, setPreviousAllocatedQty] = useState(0);
  const [allocatedRollsData, setAllocatedRollsData] = useState<
    DocMaterialAllocationModel[]
  >([]);
  const [selectedDocketRecord, setSelectedDocketRecord] = useState<DocketGroupBasicInfoModel>();
  const [docketInfo, setDocketInfo] = useState<DocketGroupBasicInfoModel[]>([]);
  const layOutSetting = getLayoutSettings(3);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useAppSelector((state) => state.user.user.user);
  const docketGenerationServices = new DocketGenerationServices();
  const docketMaterialServices = new DocketMaterialServices();
  const mrnService = new MrnService();
  const [formRef] = Form.useForm();
  useEffect(() => {
    if (selectedDocketRecord) {
      // TODO: CUT
      // getInStockRollsForItemCode(
      //   new StockCodesRequest(
      //     user?.userName,
      //     user?.orgData?.unitCode,
      //     user?.orgData?.companyCode,
      //     user?.userId,
      //     selectedDocketRecord?.docketNumbers[0]?.itemCode,
      //     [],
      //     [],
      //     selectedPo.orderRefNo
      //   )
      // );
      getDocketMaterialRequests();
    }
  }, [selectedDocketRecord]);

  useEffect(() => {
    formRef.setFieldValue('docket', undefined);
    setSelectedDocketRecord(undefined);
    setLoading(false);
    if (selectedPo) {
      setDocketInfo([]);
      setOpenStockInRolls([]);
      setAllocatedRollsData([]);
      productNameOnChange("all")
    };
  }, [selectedPo]);

  const productNameOnChange = (productTypeVal: string) => {
    const productType = productTypeVal === "all" ? undefined : productTypeVal;
    const req = new PoProdutNameRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      selectedPo?.poSerial,
      productType,
      null,
       true
    );
    docketGenerationServices
      .getDocketGroupsBasicInfoForPo(req)
      .then((res) => {
        if (res.status) {
          setDocketInfo(res.data);
        } else {
          setDocketInfo([]);
          // AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((error) => {
        setDocketInfo([]);
        AlertMessages.getErrorMessage(error.message);
      });
  };

  const getDocketMaterialRequests = () => {
    // CORRECT
    const req = new PoDocketGroupRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      selectedPo?.poSerial,
      selectedDocketRecord?.docketGroup,
      true,
      false,
      null
    );
    docketMaterialServices
      .getDocketMaterialRequests(req)
      .then((res) => {
        if (res.status) {
          setAllocatedRollsData(res.data);
          let prevAllocatedQty = 0;
          for (const eachReq of res.data) {
            prevAllocatedQty += eachReq.rollsInfo.reduce((pre, current) => {
              return pre + Number(current.allocatedQuantity);
            }, 0);
            setPreviousAllocatedQty(prevAllocatedQty);
          }
        } else {
          setAllocatedRollsData([]);
          setPreviousAllocatedQty(0);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((error) => {
        setAllocatedRollsData([]);
        setPreviousAllocatedQty(0);
        AlertMessages.getErrorMessage(error.message);
      });
  };

  const getInStockRollsForItemCode = (req: StockCodesRequest) => {
    setLoading(true);
    docketMaterialServices
      .getAvailableRollsForItemCode(req)
      .then((res) => {
        setLoading(false);
        if (res.status) {
          // TODO:CUT
          // setOpenStockInRolls(
          //   res.data.map((rec) => {
          //     rec.leftOverQuantity =
          //       Number(Number(rec.originalQty) - Number(rec.issuedQuantity));
          //       rec.leftOverQuantity = Number(rec.leftOverQuantity.toFixed(2));
          //     let checkBoxEnableLogic = true;
          //     if (rec.leftOverQuantity == 0) {
          //       checkBoxEnableLogic = false;
          //     }
          //     return {
          //       ...rec,
          //       checkbox: false,
          //       allocatingQuantity: undefined,
          //     };
          //   })
          // );
        } else {
          setLoading(false);
          setOpenStockInRolls([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        setLoading(false);
        setOpenStockInRolls([]);
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const createMrnRequest = () => {
    // CORRECT
    const req = new MrnCreateRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      selectedPo?.poSerial,
      selectedDocketRecord?.docketGroup,
      selectedDocketRecord?.docketGroup,
      "",
      openStockInRolls
        .filter((rec) => rec?.checkbox === true)
        .map(
          (filteredRec) =>
            new DocRollsRequest(
              filteredRec.rollId,
              filteredRec.barcode,
              filteredRec.allocatingQuantity
            )
        )
    );
    mrnService
      .createMrnRequest(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          timerUpHandler();
          // TODO:CUT
          // getInStockRollsForItemCode(
          //   new StockCodesRequest(
          //     user?.userName,
          //     user?.orgData?.unitCode,
          //     user?.orgData?.companyCode,
          //     user?.userId,
          //     selectedDocketRecord?.docketNumbers[0]?.itemCode,
          //     [],
          //     [],
          //     selectedPo.orderRefNo
          //   )
          // );
          getDocketMaterialRequests();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((error) => {
        AlertMessages.getErrorMessage(error.message);
      });
  };

  const handleCheckboxChange = (index, checked) => {
    let balanceQty = Number(Number(selectedDocketRecord?.materialRequirement ? selectedDocketRecord?.materialRequirement : 0) - Number(previousAllocatedQty + currentAllocatedQty));
    const updatedOpenStock = [...openStockInRolls];
    updatedOpenStock[index].checkbox = checked;
    if (checked) {
      if (balanceQty <= 0) {
        balanceQty = 0;
      }
    }
    if (checked) {
      const allowedQty = Math.min(updatedOpenStock[index].leftOverQuantity, balanceQty);
      updatedOpenStock[index].allocatingQuantity = allowedQty;
      setCurrentAllocatedQty((prev) => prev + allowedQty);
    } else {
      setCurrentAllocatedQty((prev) => prev - updatedOpenStock[index].allocatingQuantity);
      updatedOpenStock[index].allocatingQuantity = undefined;
    }
    setOpenStockInRolls(updatedOpenStock);
  };

  const handleAllocatingQtyChange = (index, value) => {
    const updatedOpenStock = [...openStockInRolls];
    setCurrentAllocatedQty(
      (prev) => prev - updatedOpenStock[index].allocatingQuantity + value
    );
    updatedOpenStock[index].allocatingQuantity = value;
    setOpenStockInRolls(updatedOpenStock);
  };

  const handleDeleteRequest = (mrnId: string) => {
    const req: MrnIdStatusRequest = new MrnIdStatusRequest(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId,
      Number(mrnId),
      null,
      MrnStatusEnum.OPEN,
      null
    );
    mrnService
      .deleteMrnRequest(req)
      .then((res) => {
        if (res.status) {
          timerUpHandler()
          // TODO:CUT
          // getInStockRollsForItemCode(
          //   new StockCodesRequest(
          //     user?.userName,
          //     user?.orgData?.unitCode,
          //     user?.orgData?.companyCode,
          //     user?.userId,
          //     selectedDocketRecord?.docketNumbers[0]?.itemCode,
          //     [],
          //     [],
          //     selectedPo.orderRefNo
          //   )
          // );
          getDocketMaterialRequests();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((error) => {
        AlertMessages.getErrorMessage(error.message);
      });
  };

  const docketOnchange = (value) => {
    timerUpHandler();
    const item = docketInfo.filter((rec) => rec.docketGroup === value);
    setSelectedDocketRecord(item[0]);
  };

  const timerUpHandler = () => {
    closeMaterialAllocation(false, true);
  }

  const closeMaterialAllocation = (isException: boolean, isAutoClose?: boolean) => {
    setOpenStockInRolls([]);
    setAllocatedRollsData([]);
    const itemCodeReq = new ItemCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedDocketRecord?.docketNumbers[0]?.itemCode);
    if (!isException && isAutoClose) {
      docketMaterialServices.unlockMaterial(itemCodeReq).then((res) => {
        if (!res.status) {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      })
    }

  };
  const renderItems = (selectedDocketRecord: DocketGroupBasicInfoModel) => {
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Item Code',
        children: selectedDocketRecord?.docketNumbers[0]?.itemCode,
      },
      {
        key: '2',
        label: 'Item Description',
        children: selectedDocketRecord?.docketNumbers[0]?.itemDesc,
        span: { xs: 1, sm: 1, md: 2, lg: 3 },
      },
    ];
    return items;
  }



  return (
    <>
      <Form form={formRef}>
        <Row>
          <Col {...layOutSetting.column1}></Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label={"Select Docket"} name={"docket"} initialValue={selectedDocketRecord?.docketGroup}>
              <Select key={`${Date.now()}`} 
              onChange={docketOnchange} 
              placeholder={'Select Docket Number'}
              filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
              showSearch
              >
                {docketInfo.map((rec) => {
                  return (
                    <Option value={rec.docketGroup} key={rec.docketGroup} >{rec.docketGroup}</Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {openStockInRolls.length ? <div>
        <Descriptions
          bordered
          size='small'
          items={renderItems(selectedDocketRecord)}
          column={{ xxl: 4, xl: 4, lg: 3, md: 2, sm: 2, xs: 1 }}
        >
          {/* <Descriptions.Item label="Item Code">{selectedDocketRecord?.itemCode}</Descriptions.Item>
          <Descriptions.Item label="Item Description">{selectedDocketRecord?.itemDesc}</Descriptions.Item>
          <Descriptions.Item label="Lot No">

          </Descriptions.Item>
          <Descriptions.Item label="Batch No">

          </Descriptions.Item>
          <Descriptions.Item label="Allocation type" >

          </Descriptions.Item> */}
        </Descriptions>
        <br />
        {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Form name="wms" layout="inline" style={{ display: 'flex', justifyContent: 'start', rowGap: '10px', columnGap: '10px' }}>
            <Form.Item label={"Lot No"} name={"lotNo"}>
              <Select
                style={{ width: '200px' }}
                placeholder='Select Lot No'
                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                showSearch>
                <Option value='All'>All</Option>
              </Select>
            </Form.Item>
            <Form.Item label={"Batch No"} name={"batchNo"}>
              <Select
                style={{ width: '200px' }}
                placeholder='Select Batch No'
                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                showSearch>
                <Option value='All'>All</Option>
              </Select>
            </Form.Item>
            <Form.Item label={"Allocation Type"} name={"allocationType"}>
              <Select
                style={{ width: '200px' }}
                placeholder='Select Allocation type'
                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                showSearch>
                <Option value='All'>All</Option>
              </Select>
            </Form.Item>
          </Form>
        </div> */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <h3>Allocate Stock</h3>
          <div style={{ display: "flex", alignItems: 'center' }}>Session Closes With IN<CountdownTimer key={selectedDocketRecord?.docketGroup} timer={300} timerUpHandler={timerUpHandler} /></div></div>
        <Descriptions
          bordered
          column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="Required Quantity">
            <Tooltip
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              title={"Required Quantity	"}
            >
              <Tag className="s-tag" color={"#f32c90"}>
                {selectedDocketRecord?.materialRequirement
                  ? selectedDocketRecord?.materialRequirement
                  : 0}
              </Tag>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="Allocated Quantity">
            <Tooltip
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              title={"Total Allocated Qty"}
            >
              <Tag className="s-tag" color={"#5adb00"}>
                {returnZeroIfNaN(
                  Number(previousAllocatedQty + currentAllocatedQty)
                )?.toFixed(2)}
              </Tag>
            </Tooltip>
            <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title="Previous">
              <Tag className="s-tag" color="#1187bc">
                {returnZeroIfNaN(previousAllocatedQty)?.toFixed(2)}
              </Tag>
            </Tooltip>
            <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title="Current">
              <Tag className="s-tag" color="#ffa500">
                {returnZeroIfNaN(currentAllocatedQty)?.toFixed(2)}
              </Tag>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="Balance">
            <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={"Balance"}>
              <Tag className="s-tag" color={"#ea4a4a"}>
                {returnZeroIfNaN(
                  Number(
                    Number(
                      selectedDocketRecord?.materialRequirement
                        ? selectedDocketRecord?.materialRequirement
                        : 0
                    )
                  ) -
                  returnZeroIfNaN(
                    Number(previousAllocatedQty + currentAllocatedQty)
                  )
                ).toFixed(2)}
              </Tag>
            </Tooltip>
          </Descriptions.Item>
        </Descriptions>
        <Table
          bordered
          scroll={{ x: true }}
          pagination={false}
          columns={[
            ...stockRollInfoModelColumns,
            {
              title: "Allocating Qty",
              dataIndex: "allocatingQuantity",
              key: "allocatingQuantity",
              render: (text, record: any, index) => (
                <InputNumber
                  formatter={(value) => {
                    // Remove non-numeric characters and keep up to two decimal places
                    const numericValue = value.replace(/[^0-9.]/g, "");
                    const parts = numericValue.split(".");
                    return parts.length <= 1
                      ? numericValue
                      : `${parts[0]}.${parts[1].slice(0, 2)}`;
                  }}
                  parser={(value) => {
                    // Parse the numeric value and round to two decimal places
                    return parseFloat(value).toFixed(2);
                  }}
                  min={0}
                  max={record.leftOverQuantity}
                  value={text}
                  readOnly={!record?.checkbox}
                  onChange={(value) => handleAllocatingQtyChange(index, value)}
                />
              ),
            },
            {
              title: "Checkbox",
              dataIndex: "checkbox",
              key: "checkbox",
              render: (text, record, index) => (
                <Checkbox
                  checked={text}
                  onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                />
              ),
            },
          ]}
          dataSource={openStockInRolls}
          size="small"
        />
        <Row justify="space-between" style={{ marginTop: "5px" }}>
          <Col></Col>
          <Col>
            <div>
              <Button
                type="primary"
                onClick={createMrnRequest}
                disabled={!currentAllocatedQty}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
        <br />
        <Divider>Already Allocated Stock</Divider>
        <AllocatedRolls
          isDeleteNeeded={true}
          docMaterialAllocatedDetails={allocatedRollsData}
          handleDeleteRequest={handleDeleteRequest}
          isMrn={true}
        />
      </div> : selectedDocketRecord?.docketGroup ?
        loading ? <Skeleton active={loading} paragraph={{ rows: 10 }} /> :
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 60 }}
            description={
              <span style={{ color: "red", fontWeight: "bold" }}>No Stock Found For The Selected Material</span>
            }
          /> : <></>}
    </>
  );
};

export default MrnRequestCreate;
