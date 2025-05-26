import { CommonRequestAttrs, DocketBasicInfoModel, DocketDetailedInfoModel, DocketGroupBasicInfoModel, DocketGroupDetailedInfoModel, ItemCodeRequest, PO_StyleInfoModel, PoDocketGroupRequest, PoDocketNumberRequest, PoProdTypeAndFabModel, PoProdutNameRequest, PoSerialRequest, PoSummaryModel, ProcessingOrderInfoModel, ProductInfoModel, RawOrderNoRequest, RemarkDocketGroupModel, RemarksDocketGroupRequest, SoListModel, SoListRequest, SoStatusEnum, StyleCodeRequest, StyleProductCodeRequest } from '@xpparel/shared-models';
import { CutOrderService, DocketGenerationServices, DocketMaterialServices, OrderManipulationServices, POService, PoMaterialService } from '@xpparel/shared-services';
import { Button, Card, Col, Drawer, Form, Input, Modal, Row, Select, Table, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import CountdownTimer from '../../../common/timer/timer-component';
import AllocationPopUp from './allocation-pop-up';
import { IDocMaterialAllocationColumns, docketBasicInfoModelColumns } from './material-allocation-columns';
// import AllocationPopUp from './allocation-pop-up';
// import CountdownTimer from '../../../common/timer/timer-component';
import { EyeOutlined, PrinterOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { CustomColumn } from 'packages/ui/src/schemax-component-lib';
import { getCssFromComponent } from '../../WMS/print-barcodes';
import React from 'react';
import DocketView from '../docket-gen/docket-view';
import { IDisplayDocketInfo } from './interface';
interface IRowSpanIndex {
  start: number;
  end: number;
}

const { Option } = Select;
export const MaterialAllocation = () => {
  const [styles, setStyles] = useState<PO_StyleInfoModel[]>([]);
  const [selectedStyleCode, setSelectedStyleCode] = useState<string>();
  const [products, setProducts] = useState<ProductInfoModel[]>([]);
  const [selectedProductCode, setSelectedProductCode] = useState<string>();
  const [processingOrders, setProcessingOrders] = useState<ProcessingOrderInfoModel[]>([]);
  const [docketInfo, setDocketInfo] = useState<DocketGroupBasicInfoModel[]>([]);
  const [openMaterialAllocation, setOpenMaterialAllocation] = useState(false);
  const [stateKey, setStateKey] = useState<number>(0);
  const [selectedDocketRecord, setSelectedDocketRecord] = useState<IDisplayDocketInfo>();
  const [selectedProcessingSerial, setSelectedProcessingSerial] = useState<number>(undefined);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [colsSpanMap, setColsSpanMap] = useState<Map<string, IRowSpanIndex>>(new Map<string, IRowSpanIndex>());



  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);


  const omsManipulationService = new OrderManipulationServices();
  const poService = new POService();
  const poMaterialService = new PoMaterialService();
  const docketGenerationServices = new DocketGenerationServices();
  const docketMaterialService = new DocketMaterialServices();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [docketPrintData, setDocketPrintData] = useState<DocketGroupDetailedInfoModel>(undefined);
  const [docTblData, setDocTblData] = useState<IDisplayDocketInfo[]>([]);
  const remarkPoDocketGroupservice = new DocketGenerationServices();
  const cutOrderService = new CutOrderService();
  const [remarks, setRemarks] = useState<string[]>([]);

  useEffect(() => {
    getStyles(new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId));
  }, []);

  const getStyles = (req: CommonRequestAttrs) => {
    cutOrderService.getCutOrderCreatedStyles(req)
      .then((res) => {
        if (res.status) {
          setStyles(res.data);
          setProducts([]);
          setProcessingOrders([]);
        } else {
          setProducts([]);
          setProcessingOrders([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        setProducts([]);
        setProcessingOrders([]);
        AlertMessages.getErrorMessage(err.message);
      });
  }

  const changeStyle = (style: string) => {
    formRef.setFieldValue('productCode', undefined);
    formRef.setFieldValue('processingOrder', undefined);
    setSelectedStyleCode(style);
    setSelectedProductCode(undefined);
    setSelectedProcessingSerial(null);
    fetchProducts(style);
  }

  const fetchProducts = (styleCode: string) => {
    setDocketInfo([]);
    setSelectedProcessingSerial(undefined);
    const request = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode);
    cutOrderService.getProductInfoForGivenStyle(request)
      .then((res) => {
        if (res.status) {
          setProducts(res.data);
          setProcessingOrders([]);
        } else {
          setProducts([]);
          setProcessingOrders([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        setProducts([]);
        setProcessingOrders([]);
        AlertMessages.getErrorMessage(err.message);
      });
  }

  const changeProductCode = (value: string) => {
    setDocketInfo([]);
    setSelectedProductCode(value);
    setSelectedProcessingSerial(undefined);
    formRef.setFieldValue('processingOrder', undefined)

    const req = new StyleProductCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedStyleCode, value);
    cutOrderService.getCutOrderInfoByStyeAndProduct(req)
      .then((res) => {
        if (res.status) {
          setProcessingOrders(res.data);
        } else {
          setProcessingOrders([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        setProcessingOrders([]);
        AlertMessages.getErrorMessage(err.message);
      });

  }

  const changeProcessingOrder = (processingSerial: number) => {
    setSelectedProcessingSerial(processingSerial);
    
    const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, selectedProductCode, null, true);
    docketGenerationServices.getDocketGroupsBasicInfoForPo(req).then((res => {
      if (res.status) {
        setDocketInfo(res.data);
        const displayDocInfo: IDisplayDocketInfo[] = [];
        const colspanTypeMap = new Map<string, IRowSpanIndex>();
        let i = 0;
        res.data.forEach((eachRecord, index) => {
          const uniqueComp = new Set<string>();
          const productNameSet = new Set<string>();
          const docNumbers = [];
          eachRecord.docketNumbers.forEach(docket => {
            docket.components.forEach(c => uniqueComp.add(c));
            docNumbers.push(docket.docketNumber);
          })
          eachRecord.docketNumbers.forEach(docket => {
            displayDocInfo.push({
              sno: index + 1,
              poSerial: eachRecord.poSerial,
              docketNumber: docket.docketNumber,
              cutNumber: docket.cutNumber,
              totalBundles: docket.totalBundles,
              components: docket.components,
              itemCode: docket.itemCode,
              itemDesc: docket.itemDesc,
              productName: docket.productName,
              productDesc: docket.productDesc,
              fgColor: docket.fgColor,
              productType: docket.productType,
              docketGroup: eachRecord.docketGroup,
              plies: eachRecord.plies,
              ratioId: eachRecord.ratioId,
              docketGroupId: eachRecord.docketGroupId,
              ratioName: eachRecord.ratioName,
              ratioDesc: eachRecord.ratioDesc,
              mName: eachRecord.markerInfo.mName,
              mVersion: eachRecord.markerInfo.mVersion,
              mWidth: eachRecord.markerInfo.mWidth,
              mLength: eachRecord.actualMarkerInfo?.markerLength ? eachRecord.actualMarkerInfo?.markerLength : eachRecord.markerInfo.mLength,
              isMainDoc: eachRecord.isMainDoc,
              hasBinding: eachRecord.hasBinding,
              bindingRequirement: eachRecord.bindingRequirement,
              originalDocQuantity: eachRecord.originalDocQuantity,
              allocatedQty: eachRecord.allocatedQty,
              materialRequirement: eachRecord.materialRequirement,
              dgComponents: [...uniqueComp],
              dgDocNumber: docNumbers,
              cutWastage: eachRecord.cutWastage,
              reqWithOutWastage: eachRecord.reqWithOutWastage,
              bindReqWithOutWastage: eachRecord.bindReqWithOutWastage,
              actualMarkerInfo: eachRecord.actualMarkerInfo,
              remark: eachRecord.remark

            });
            const { docketGroup } = eachRecord;
            colspanTypeMap.set(docketGroup, colspanTypeMap.has(docketGroup) ? { start: colspanTypeMap.get(docketGroup).start, end: colspanTypeMap.get(docketGroup).end + 1 } : { start: i, end: 1 });
            i++;
          });

        });
        setColsSpanMap(colspanTypeMap);
        setDocTblData(displayDocInfo);
      } else {
        setDocketInfo([]);
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {
      console.log(error)
      setDocketInfo([]);
      AlertMessages.getErrorMessage(error.message)
    });
  }

  const timerUpHandler = () => {
    console.log('time handler working fine');
    closeMaterialAllocation(false);
  }

  const allocateClickHandler = (record: IDisplayDocketInfo) => {
    setSelectedDocketRecord(record);
    setOpenMaterialAllocation(true);
    setStateKey(preState => preState + 1);
  }

  const closeMaterialAllocation = (isException: boolean, isAutoClose?: boolean) => {
    setOpenMaterialAllocation(false);
    const itemCodeReq = new ItemCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedDocketRecord?.itemCode);
    if (!isException && isAutoClose) {
      docketMaterialService.unlockMaterial(itemCodeReq).then((res) => {
        if (!res.status) {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      })
    }
  };
  const printDocket = () => {
    const divContents = document.getElementById('printArea').innerHTML;
    const element = window.open('', '', 'height=700, width=1024');
    element.document.write(divContents);
    getCssFromComponent(document, element.document);
    element.document.close();
    // Loading image lazy
    setTimeout(() => {
      element.print();
      element.close();
    }, 1000);
    setModalVisible(false);
  }
  const closeModel = () => {
    setModalVisible(false);
  };
  const viewDocket = (docGroup: string) => {
    // CORRECT
    const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, docGroup, true, true, undefined);
    docketGenerationServices.getDocketGroupDetailedInfo(req).then((res => {
      if (res.status) {
        setDocketPrintData(res.data[0]);
        setModalVisible(true);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message)
    });
  }




  // Table Filters
  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  function handleReset(clearFilters) {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button size="small" style={{ width: 90 }}
          onClick={() => {
            handleReset(clearFilters)
            setSearchedColumn(dataIndex);
            confirm({ closeDropdown: true });
          }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : false,
    onFilterDropdownVisibleChange: visible => {
      if (visible) { setTimeout(() => searchInput.current.select()); }
    },
    render: text =>
      text ? (
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : text
      )
        : null

  });


  const getColumnsWithSearchProps = (docketBasicInfoModelColumns: CustomColumn<IDisplayDocketInfo>[], excludedDataIndex: string[], spanMap: Map<string, IRowSpanIndex>): any => {
    const excludeRowSPanColumns = ['productName', 'docketNumber', 'originalDocQuantity'];
    const columns = [];
    docketBasicInfoModelColumns.forEach((rec) => {
      if (!excludedDataIndex.includes(rec.dataIndex)) {
        columns.push({
          ...rec,
          ...getColumnSearchProps(rec.dataIndex),
          sorter: (a, b) => {
            const valueA = typeof a[rec.dataIndex] === 'string' ? a[rec.dataIndex].toLowerCase() : a[rec.dataIndex];
            const valueB = typeof b[rec.dataIndex] === 'string' ? b[rec.dataIndex].toLowerCase() : b[rec.dataIndex];

            if (typeof valueA === 'number' && typeof valueB === 'number') {
              return valueA - valueB;
            } else {

              if (valueA < valueB) {
                return -1;
              }
              if (valueA > valueB) {
                return 1;
              }
              return 0;
            }
          },
          onCell: (doc, index,) => {
            if (excludeRowSPanColumns.includes(rec.dataIndex)) {
              return { rowSpan: 1 };
            } else {
              if (index === spanMap.get(doc.docketGroup).start) {
                return { rowSpan: spanMap.get(doc.docketGroup).end };
              } else {
                return { rowSpan: 0 };
              }
            }
          }
        });
      } else {
        columns.push({
          ...rec,
          onCell: (doc, index,) => {
            if (excludeRowSPanColumns.includes(rec.dataIndex)) {
              return { rowSpan: 1 };
            } else {
              if (index === spanMap.get(doc.docketGroup).start) {
                return { rowSpan: spanMap.get(doc.docketGroup).end };
              } else {
                return { rowSpan: 0 };
              }
            }
          }
        })
      }
    });
    return columns;
  };


  const handleRemarkChange = (value: string, index: number) => {
    setRemarks((prev) => {
      return {
        ...prev,
        [index]: value
      }
    })
  };

  const saveRemark = (docketGroup: string, index: number) => {
    const remarkValue = remarks?.[index]?.trim();
    if (!remarkValue) {
      AlertMessages.getErrorMessage("Remark cannot be empty");
      return;
    }

    const remarkModel: RemarkDocketGroupModel =
      new RemarkDocketGroupModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, docketGroup, remarkValue);

    const req = new RemarksDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, remarkModel);

    remarkPoDocketGroupservice.createRemarksDocketGroup(req)
      .then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch(err => {
        console.log(err);
        AlertMessages.getErrorMessage("Error occurred while saving remarks.");
      });
  };


  return (<>
    <Card size='small' title='Material Allocation' extra={<Tooltip title="Reload"><Button disabled={!selectedProcessingSerial} type='primary' icon={<RedoOutlined style={{ fontSize: '20px' }} />} onClick={() => changeProcessingOrder(selectedProcessingSerial)} /></Tooltip>}>
      <Form form={formRef} layout='inline'>
        <Row gutter={[16, 16]}>
          <Form.Item
            label="Style"
            name='style'
            rules={[{ required: true, message: 'Please Select Style' }]}>
            <Select
              style={{ width: '200px' }}
              placeholder='Select   '
              onChange={changeStyle}
              filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
              showSearch
            >
              {styles.map((style) => (
                <Option key={style.styleCode} value={style.styleCode}>
                  {`${style.styleCode} - ${style.styleName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* </Col> */}
          {/* <Col {...layOutSetting.column2}> */}
          <Form.Item
            label="Product Code"
            name='productCode'
            initialValue={selectedProductCode}
            rules={[{ required: true, message: 'Please Select Product Code' }]}>
            <Select
              style={{ width: '200px' }}
              placeholder='Select Product Code'
              onChange={changeProductCode}
              filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
              showSearch
            >
              {products.map(product => {
                return <Option key={product.productCode} value={product.productCode}>
                  {`${product.productCode} - ${product.productName}`}
                </Option>
              })}
            </Select>
          </Form.Item>
          {/* </Col> */}
          {/* <Col {...layOutSetting.column2}> */}
          <Form.Item
            name='processingOrder'
            label="Processing Order"
            rules={[{ required: true, message: 'Please Select Processing Order' }]}>
            <Select
              style={{ width: '200px' }}
              placeholder='Select Processing Order'
              filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
              showSearch
              onChange={changeProcessingOrder}
            >
              {processingOrders.map((order) => (
                <Option key={order.processingSerial} value={order.processingSerial}>
                  {`${order.processingSerial} - ${order.prcOrdDescription}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* </Col> */}
        </Row>
      </Form>
      <br />

      <Table
        size='small'
        columns={[{
          title: 'S.No',
          dataIndex: 'sno',
          key: 'sno',
          fixed: 'left',
          onCell: (doc, index,) => {
            if (index === colsSpanMap.get(doc.docketGroup).start) {
              return { rowSpan: colsSpanMap.get(doc.docketGroup).end };
            } else {
              return { rowSpan: 0 };
            }
          }
        },
        ...getColumnsWithSearchProps(docketBasicInfoModelColumns, ['productName', 'docketGroup', 'materialRequirement', 'markerInfo', 'plies', 'originalDocQuantity'], colsSpanMap),
        {
          title: 'Material Status',
          dataIndex: 'totalMrCount',
          key: 'totalMrCount',
          fixed: 'right',
          render: (status: number, record: IDisplayDocketInfo) => <Button type='primary' className='btn-orange' onClick={() => allocateClickHandler(record)}>Allocate/De Allocate</Button>,
          onCell: (doc, index,) => {
            if (index === colsSpanMap.get(doc.docketGroup).start) {
              return { rowSpan: colsSpanMap.get(doc.docketGroup).end };
            } else {
              return { rowSpan: 0 };
            }
          }
        },
        {
          title: 'Docket View',
          dataIndex: 'docketView',
          key: 'docketView',
          fixed: 'right',
          render: (status: number, record: IDisplayDocketInfo) => <Button onClick={() => viewDocket(record.docketGroup)} icon={<EyeOutlined />}
          />,
          onCell: (doc, index,) => {
            if (index === colsSpanMap.get(doc.docketGroup).start) {
              return { rowSpan: colsSpanMap.get(doc.docketGroup).end };
            } else {
              return { rowSpan: 0 };
            }
          }

        },
        {
          title: 'Remarks',
          dataIndex: 'remark',
          key: 'remark',
          fixed: 'right',
          render: (text: any, record: IDisplayDocketInfo, index: number) => {
            return <Input
              value={remarks?.[index] !== undefined ? remarks[index] : text || ''}
              onChange={(e) => handleRemarkChange(e.target.value, index)}
              style={{ width: 100 }}
            />
          }
        },
        {
          title: 'Action',
          key: 'action',
          fixed: 'right',
          render: (text: any, record: IDisplayDocketInfo, index: number) => (
            <Button
              type="primary"
              onClick={() => saveRemark(record.docketGroup, index)}
              style={{ marginLeft: 8 }}
            >
              Save
            </Button>
          ),
        },
        ]}
        bordered
        scroll={{ x: true }}
        pagination={false}
        dataSource={docTblData}
      />
      <Drawer
        title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}><h3>Material Allocation</h3><span>Session Closes With IN<CountdownTimer key={Date.now()} timer={480} timerUpHandler={timerUpHandler} /></span></div>}
        placement="right"
        size={'large'}
        onClose={() => closeMaterialAllocation(false, true)}
        open={openMaterialAllocation}
        width='100%'
        extra={
          <Button type="primary" onClick={() => closeMaterialAllocation(false, true)}>
            Close
          </Button>
        }
      >
        <>
          <AllocationPopUp selectedPo={selectedProcessingSerial} selectedDocketRecord={selectedDocketRecord} closeMaterialAllocation={() => closeMaterialAllocation(false)} key={stateKey} />
        </>
      </Drawer>
    </Card>

    <Modal
      className='print-docket-modal'
      key={'modal' + Date.now()}
      width={'100%'}
      style={{ top: 0 }}
      open={modalVisible}
      title={<React.Fragment>
        <Row>
          <Col span={12}>
            Print Docket
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Button type='primary' onClick={() => printDocket()}>Print</Button>
          </Col>
        </Row>
      </React.Fragment>}
      onCancel={closeModel}
      footer={[
        <Button key='back' onClick={closeModel}>
          Cancel
        </Button>,
      ]}
    >
      <DocketView docketData={docketPrintData} />
    </Modal>
  </>
  )
}

export default MaterialAllocation;