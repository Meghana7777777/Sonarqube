import React, { useEffect, useState } from "react";
import { Row, Col, Select, Button, Form, Input, Table, Checkbox } from "antd";
import { ColumnsType } from "antd/es/table";
import SewingOrderHeaderInfo from "./mo-header-info-1";
import { SewingCreationOptionsModel, MoLineInfo, SewingOrderCreationRequest, FeatureGrouping, SubLineInfo, SewingCreationOptionsEnum, MoListRequest, MoStatusEnum } from "@xpparel/shared-models";
import { OrderManipulationServices, SewingOrderCreationService } from "@xpparel/shared-services";
import { useAppSelector } from '../../../../../common';
import { MoListModel } from "@xpparel/shared-models";
import './table.css'
import { AlertMessages } from "packages/ui/src/components/common";
import { sewingCreationDisplayName } from "../../sewing-job-gen/support";

const { Option } = Select;

interface SubLineInfoWithSizes extends SubLineInfo {
  sizes: { [key: string]: number };
  groupKey: string;
  groupIndex: number;
  totalRowsInGroup: number;
  rowIndexInGroup: number;
}

const CreateMO = ({ onOrderSuccess }: { onOrderSuccess: () => void }) => {
  const [moList, setMoList] = useState<MoListModel[]>([]);
  const [MOLines, setMOLines] = useState<string[]>([]);
  const [CutSerials, setCutSerials] = useState<number[]>([]);
  const [sewingOrderData, setSewingOrderData] = useState<SewingCreationOptionsModel[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedMOLine, setSelectedMOLine] = useState<string | null>(null);
  const [selectedCutSerial, setSelectedCutSerial] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SewingCreationOptionsModel>();
  const [selectedOptions, setSelectedOptions] = useState<SewingCreationOptionsEnum[]>([]);
  // const [triggeredData, setTriggeredData] = useState<SewingCreationOptionsModel[]>([]);
  const [selectedSubLineInfoRows, setSelectedSubLineInfoRows] = useState<SubLineInfoWithSizes[]>([]);
  const [selectedMoLineRows, setSelectedMoLineRows] = useState<MoLineInfo[]>([]);
  const [sewingDescription, setSewingDescription] = useState<string>('');
  const user = useAppSelector((state) => state.user.user.user);


  const OMSService = new OrderManipulationServices()
  const SPSService = new SewingOrderCreationService()

  useEffect(() => {
    const reqObj2 = new MoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, MoStatusEnum.IN_PROGRESS)
    OMSService.getListOfMo(reqObj2).then((response) => {
      if (response.status) {
        setMoList(response?.data)
      }
      else {
        // console.log('No data found')
        AlertMessages.getErrorMessage(response.internalMessage)
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage(err.message)

    })

  }, [])

  const handleOrderChange = (orderId: number) => {
    setSelectedOrderId(orderId);
    setMOLines([]);
    setCutSerials([]);
    setSelectedMOLine(null);
    setSelectedCutSerial(null);
    setSewingOrderData([]);
    setSelectedOrder(null);
    // const selectedOrder = moList.find((order) => order.orderId === orderId);
    if(orderId){
    const reqObj = new SewingOrderCreationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, orderId)

    OMSService.getListofMoLines(reqObj).then(
      (response) => {
        if (response.status) {

          setMOLines(response.data?.moLines);
          setCutSerials(response.data?.poSerial)
        }
        else {
          AlertMessages.getErrorMessage(response.internalMessage)
        }


      }
    ).catch((err) => {
      AlertMessages.getErrorMessage(err.message)

    })
  }

  };

  const handleMOLineChange = (moLine: string) => {
    setSelectedMOLine(moLine);
    // setSelectedCutSerial(null);

    // const selectedLine = MOLines.find((line) => line === moLine);
    // setCutSerials(selectedLine ? [selectedLine.] : []);
  };

  const handleCutSerialChange = (cutSerial: string | null) => {
    setSelectedCutSerial(cutSerial);
  };

  const handleOptionsChange = (options: SewingCreationOptionsEnum[]) => {
    setSelectedOptions(options);
  };

  const handleSubmit = () => {
    if (selectedOrderId) {
      const reqObj = new SewingOrderCreationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, selectedOrderId, selectedMOLine || null, selectedCutSerial || null, selectedOptions || [])
      // console.log("Generated Request:", reqObj);

      OMSService.getOrderInfoByOrderId(reqObj).then(
        (response) => {
          if (response.status) {
            // console.log(response.data, "Order Info");
            setSewingOrderData(response?.data);
            setSelectedOrder(response?.data?.find((item) => item?.orderid === selectedOrderId));
            // AlertMessages.getSuccessMessage(response.internalMessage)
          }
          else {

            AlertMessages.getErrorMessage(response.internalMessage);
          }
        }
      ).catch((err) => {
        AlertMessages.getErrorMessage(err.message)

      })
    }

  };

  const handleCreateSewingOrder = () => {
    if (selectedMoLineRows && selectedSubLineInfoRows) {
      const modifiedData: SewingCreationOptionsModel[] = sewingOrderData.map((order) => {
        const modifiedMoLineInfo = order?.moLineInfo?.map((moLine) => {
          const isParentSelected = selectedMoLineRows.some(
            (selectedRow) => selectedRow.moLine === moLine.moLine
          );

          if (isParentSelected) {
            return {
              ...moLine,
              featureGrouping: moLine?.featureGrouping?.map((group) => ({
                ...group,
                subLineInfo: group.subLineInfo?.map((subLine) => {
                  const selectedSubLine = selectedSubLineInfoRows.find(
                    (row) => row.subLineId === subLine.subLineId
                  );
                  return {
                    ...subLine,
                    quantity: selectedSubLine?.sizes?.[subLine.size] || subLine.quantity
                  };
                }) || []
              })) || []
            };
          }

          const hasSelectedChildren = moLine?.featureGrouping?.some((group) =>
            group.subLineInfo?.some((subLine) =>
              selectedSubLineInfoRows.some((selected) => selected.subLineId === subLine.subLineId)
            )
          );

          if (!hasSelectedChildren) {
            return {
              ...moLine,
              featureGrouping: []
            };
          }

          return {
            ...moLine,
            featureGrouping: moLine.featureGrouping?.map((group) => ({
              ...group,
              subLineInfo: group.subLineInfo
                ?.filter((subLine) =>
                  selectedSubLineInfoRows.some((selected) => selected.subLineId === subLine.subLineId)
                )
                .map((subLine) => {
                  const selectedSubLine = selectedSubLineInfoRows.find(
                    (row) => row.subLineId === subLine.subLineId
                  );
                  return {
                    ...subLine,
                    quantity: selectedSubLine?.sizes?.[subLine.size] || subLine.quantity
                  };
                }) || []
            }))
              .filter((group) => group.subLineInfo.length > 0) || []
          };
        });

        return {
          ...order,
          description: sewingDescription,
          moLineInfo: modifiedMoLineInfo
        };
      });

      // console.log("Modified Data for Submission:", modifiedData);



      const requestObject = new SewingCreationOptionsModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, modifiedData[0].orderid, (modifiedData[0].orderNumber), modifiedData[0].quantity, modifiedData[0].style, modifiedData[0].externalSystemRefNo, modifiedData[0].customerStyle, modifiedData[0].customerStyleRef, modifiedData[0].customerNo, modifiedData[0].customerName, modifiedData[0].deliveryDate, modifiedData[0].destination, modifiedData[0].PlannedCutDate, modifiedData[0].coLine, modifiedData[0].buyerPo, modifiedData[0].packMethod, modifiedData[0].productType, modifiedData[0].productName, modifiedData[0].productCategory, modifiedData[0].garmentVendorPo, modifiedData[0].description, modifiedData[0].moLineInfo, modifiedData[0].mOrderId, modifiedData[0].sewSerial, modifiedData[0].planProductionDate)

      SPSService.saveSewingOrderCreation(requestObject).then(
        (res) => {
          if (res.status) {
            // console.log("Sewing Order Created Successfully");
            AlertMessages.getSuccessMessage("Routing Order Created Successfully");
            setSewingOrderData([])
            onOrderSuccess();
          }
          else {
            AlertMessages.getErrorMessage(res.internalMessage)
          }
        }
      ).catch((err) => {
        AlertMessages.getErrorMessage(err.message)
      })

    }
    else {
      AlertMessages.getErrorMessage(`Please select at least one MOLine or  one SubLineInfo to proceed with creating the Routing order!!!`);
    }
  };

  const handleSelectAllMoRows = () => {
    if (selectedMoLineRows.length === (sewingOrderData[0]?.moLineInfo?.length)) {
      setSelectedMoLineRows([]); // Deselect all if all are selected
    } else {
      const allRows = sewingOrderData.flatMap(order =>
        order?.moLineInfo
      );

      setSelectedMoLineRows(allRows); // Select all rows
    }
  };

  const handleSelectMoRow = (selectedRowKey) => {
    const newSelectedRows = [...selectedMoLineRows];
    const index = newSelectedRows.indexOf(selectedRowKey);
    if (index > -1) {
      newSelectedRows.splice(index, 1);
    } else {
      newSelectedRows.push(selectedRowKey);
    }
    setSelectedMoLineRows(newSelectedRows);
  };
  const parentColumns: ColumnsType<any> = [
    {
      title: <Checkbox onChange={handleSelectAllMoRows} checked={selectedMoLineRows.length === (sewingOrderData[0]?.moLineInfo?.length)} />,
      key: 'selectAll',
      render: (_, record) => (
        <Checkbox
          checked={selectedMoLineRows.includes(record)}
          onChange={() => handleSelectMoRow(record)}
        />
      ),
      width: 50,
    },
    { title: "MO Line", dataIndex: "moLine", key: "moLine" },
    { title: "Product Type", dataIndex: "productType", key: "productType" },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => (
        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#6b6b6b', backgroundColor: '#fafafa', padding: '4px 8px', borderRadius: '4px' }}>
          {quantity}
        </span>
      )
    },
    { title: "Cut Serial", dataIndex: "cutSerial", key: "cutSerial" },
  ];

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSewingDescription(e.target.value);
  };

  const getNonNullKeysFromFeatureGrouping = (featureGrouping: FeatureGrouping[]): string[] => {
    const nonNullKeys: Set<string> = new Set();

    featureGrouping.forEach(feature => {
      Object.keys(feature).forEach(key => {
        if (feature[key] !== null && feature[key] !== undefined && !Array.isArray(feature[key])) {
          nonNullKeys.add(key);
        }
      });
    });

    return Array.from(nonNullKeys);
  };


  const expandedRowRender = (record: MoLineInfo) => {
    const selectableKeys = getNonNullKeysFromFeatureGrouping(record.featureGrouping || []);

    const filteredFeatureGrouping: SubLineInfoWithSizes[] = record.featureGrouping?.flatMap((fg: FeatureGrouping) =>
      fg.subLineInfo?.map((subLine: SubLineInfo) => ({
        ...subLine,
        sizes: {
          [subLine.size]: subLine.quantity,
        },
        groupKey: selectedOptions.length ? selectableKeys.map(key => subLine[key]).join('_') : subLine.subLineId.toString(),
        groupIndex: 0,
        totalRowsInGroup: 0,
        rowIndexInGroup: 0
      })) || []
    );

    const groupedRows = filteredFeatureGrouping.reduce((acc, current) => {
      const existing = acc.find(item => item.groupKey === current.groupKey);
      if (existing) {
        existing.rows.push(current);
      } else {
        acc.push({
          groupKey: current.groupKey,
          rows: [current],
        });
      }
      return acc;
    }, [] as Array<{ groupKey: string, rows: SubLineInfoWithSizes[] }>);

    const sizes = Array.from(
      new Set(
        filteredFeatureGrouping?.flatMap((subLine: SubLineInfoWithSizes) => subLine.size)
      )
    );

    const handleGroupSelection = (groupKey: string, checked: boolean) => {
      const updatedSelectedRows = [...selectedSubLineInfoRows];
      const groupIndex = groupedRows.findIndex(group => group.groupKey === groupKey);
      if (groupIndex === -1) return;

      const currentGroup = groupedRows[groupIndex];
      currentGroup.rows.forEach(row => {
        if (checked && !updatedSelectedRows.some(selected => selected.subLineId === row.subLineId)) {
          // When selecting, add the row with its current sizes
          const existingSelectedRow = selectedSubLineInfoRows.find(selected => selected.subLineId === row.subLineId);
          updatedSelectedRows.push(existingSelectedRow || {
            ...row,
            sizes: { [row.size]: row.quantity }
          });
        } else if (!checked) {
          // Remove row from selection
          const indexToRemove = updatedSelectedRows.findIndex(selected => selected.subLineId === row.subLineId);
          if (indexToRemove !== -1) updatedSelectedRows.splice(indexToRemove, 1);
        }
      });

      setSelectedSubLineInfoRows(updatedSelectedRows);
    };

    // Check if all rows in a group are selected
    const isGroupSelected = (groupKey: string) => {
      const group = groupedRows.find(group => group.groupKey === groupKey);
      if (group) {
        return group.rows.every(row => selectedSubLineInfoRows.some(selected => selected.subLineId === row.subLineId));
      }
      return false;
    };

    // Prepare processed rows with group information
    const processedRows: SubLineInfoWithSizes[] = groupedRows.flatMap((group, groupIndex) =>
      group.rows.map((row, rowIndex) => ({
        ...row,
        sizes: { [row.size]: row.quantity },
        groupKey: group.groupKey,
        groupIndex,
        rowIndexInGroup: rowIndex,
        totalRowsInGroup: group.rows.length
      }))
    );

    // Create non-null key column definitions
    const nonNullKeyColumns = selectableKeys.map(key => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key: key,
      render: (_: any, row: SubLineInfoWithSizes) => row[key],
      onCell: (record: SubLineInfoWithSizes) => ({
        rowSpan: record.rowIndexInGroup === 0 ? record.totalRowsInGroup : 0,
        className: isGroupSelected(record.groupKey) ? 'selected-group-row' : '',
      }),
    }));

    const innerColumns = [
      // { title: "MO Line", dataIndex: "moLine", key: "moLine" },  
      // { title: "Cut Serial", dataIndex: "cutSerial", key: "cutSerial" },
      { title: "Delivery Date", dataIndex: "deliveryDate", key: "deliveryDate" },
      { title: "Destination", dataIndex: "destination", key: "destination" },
      { title: "Planned Cut Date", dataIndex: "PlannedCutDate", key: "PlannedCutDate" },
      { title: "CO Line", dataIndex: "coLine", key: "coLine" },
      { title: "Buyer PO", dataIndex: "buyerPo", key: "buyerPo" },
      // { title: "Product Type", dataIndex: "productType", key: "productType" },
      // { title: "Product Name", dataIndex: "productName", key: "productName" },
      { title: "Product Category", dataIndex: "productCategory", key: "productCategory" },
      { title: "Garment Vendor PO", dataIndex: "garmentVendorPo", key: "garmentVendorPo" },
      { title: "Color", dataIndex: "color", key: "color" },
      // Dynamically generate size columns
      // ...sizes.map((size: string) => ({
      //   title: size,
      //   dataIndex: size,
      //   key: size,
      //   render: (_: any, row: SubLineInfoWithSizes) => {
      //     return (
      //       <Input
      //         type="number"
      //         style={{ width: '60px' }}
      //         defaultValue={row?.sizes?.[size] || 0}
      //         onChange={(e) => {
      //           const value = Number(e.target.value) || 0;

      //           // Update or add the row to selectedSubLineInfoRows
      //           const updatedSelectedRows = [...selectedSubLineInfoRows];
      //           const existingRowIndex = updatedSelectedRows.findIndex(
      //             selected => selected.subLineId === row.subLineId
      //           );

      //           if (existingRowIndex !== -1) {
      //             // Update existing row
      //             updatedSelectedRows[existingRowIndex] = {
      //               ...updatedSelectedRows[existingRowIndex],
      //               sizes: {
      //                 ...updatedSelectedRows[existingRowIndex].sizes,
      //                 [size]: value
      //               }
      //             };
      //           } else {
      //             // Add new row
      //             updatedSelectedRows.push({
      //               ...row,
      //               sizes: { [size]: value }
      //             });
      //           }

      //           setSelectedSubLineInfoRows(updatedSelectedRows);
      //         }}
      //       />
      //     );
      //   },
      // })),
      { title: "Size", dataIndex: "size", key: "size" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },


    ];


    const filteredInnerColumns = innerColumns.filter(column => !selectableKeys.includes(column.dataIndex));

    const hidableFields = ["moLine", "productType", "productName", "cutSerial"];

    const filteredNonNullkeyColumns = nonNullKeyColumns.filter(column => !hidableFields.includes(column.dataIndex))





    return (
      <Table
        size="small"
        rowKey={(record) => `${record.subLineId}`}
        dataSource={processedRows}
        columns={[
          {
            title: 'Select Group',
            key: 'selectGroup',
            width: 100,
            render: (_, row: SubLineInfoWithSizes) => {
              if (row.rowIndexInGroup === 0) {
                return (
                  <Checkbox
                    checked={isGroupSelected(row.groupKey) || selectedMoLineRows.includes(record)}
                    onChange={(e) => handleGroupSelection(row.groupKey, e.target.checked)}
                  />
                );
              }
              return null;
            },
            onCell: (record: SubLineInfoWithSizes) => ({
              rowSpan: record.rowIndexInGroup === 0 ? record.totalRowsInGroup : 0,
              className: isGroupSelected(record.groupKey) ? 'selected-group-row' : '',
            }),
          },
          ...filteredNonNullkeyColumns,
          ...filteredInnerColumns,
        ]}
        pagination={false}
        bordered
        rowClassName={(record: SubLineInfoWithSizes) => {
          return isGroupSelected(record.groupKey) ? 'selected-group-row' : '';
        }}
        className="collapsed-group-table"
      />
    );
  };



  const handleCancel = () => {
    setSewingOrderData(null);
    setSelectedOrder(null);
  }


  return (
    <>
      <Row gutter={[16, 16]}>
        <Col>
          MO/Plant Style Ref :
          <Select showSearch={true}
            style={{ width: '200px' }}
            placeholder='Select Manufacturing Order'
            optionFilterProp="label"
            onChange={(value) => handleOrderChange(value)}
            allowClear={true}
            onClear={()=>setSewingOrderData([])}
            filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
          >
            {moList.map(moList => {
              return <Option value={moList.orderId} key={`${moList.orderId}`}>{moList.plantStyle ? moList.orderNo + ' - ' + moList.plantStyle : moList.orderNo}</Option>
            })}
          </Select>
        </Col>

        <Col>
          <label style={{ marginRight: '10px' }}>MO Line:</label>
          <Select
            style={{ width: "150px" }}
            placeholder="Select MO Line"
            allowClear
            onChange={(value) => handleMOLineChange(value)}
            disabled={!selectedOrderId}
          >
            {MOLines.map((line) => (
              <Option value={line} key={line}>
                {line}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <label style={{ marginRight: '10px' }}>Cut Serial:</label>
          <Select
            style={{ width: "150px" }}
            placeholder="Select Cut Serial"
            allowClear
            onChange={(value) => handleCutSerialChange(value)}
            disabled={!selectedOrderId}
          >
            {CutSerials.map((cutSerial) => (
              <Option value={cutSerial} key={cutSerial}>
                {cutSerial}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <label style={{ marginRight: '10px' }}>Group By:</label>
          <Select
            mode="multiple"
            style={{ width: "250px" }}
            placeholder="Select Options"
            onChange={(value) => handleOptionsChange(value as SewingCreationOptionsEnum[])}
          >
            {Object.values(SewingCreationOptionsEnum).map((option) => (
              <Option value={option} key={option}>
                {sewingCreationDisplayName[option]}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <Button type="primary" disabled={!selectedOrderId} onClick={handleSubmit}>
            Submit
          </Button>
        </Col>
      </Row>

      <br />
      <SewingOrderHeaderInfo rawSewingOrderInfoModel={selectedOrder || null} />


      <Table
        className="custom-table"
        size="small"
        rowKey={(record) => `${record.moLine}-${record.productName}`}
        dataSource={sewingOrderData.flatMap((order) => order?.moLineInfo) || null}
        columns={parentColumns}
        pagination={false}
        bordered
        expandable={{
          expandedRowRender,
        }}
      />


      <br />

      <Form autoComplete="off" layout="inline" size="middle">
        <Row>
          <Col>
            <Form.Item
              name="description"
              label="Routing Order Description"
              rules={[{ required: true, message: "Please Enter Routing Order Description" }]}
            >
              <Input value={sewingDescription}
                onChange={handleDescriptionChange} placeholder="Only 30 characters are accepted" maxLength={30} />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" className="btn-green" onClick={handleCreateSewingOrder}>Create Routing Order</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default CreateMO;