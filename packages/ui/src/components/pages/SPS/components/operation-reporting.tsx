import { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Input, Button, Form, message, Modal, Table, Space, Tag, Switch, Flex, Select } from 'antd';
import dayjs from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';
import './sewing-barcode-scanner.css';
import { ModeAndTransTypeSection } from './barcode-sacnning';
import BarcodeManualReportingForm from './barcode-sacnning/barcode-manual-reporting-form';
import { BarcodeScanResultComp } from './barcode-sacnning/barcode-scan-result-comp';
import { BarcodeDetailsForBundleScanning, BarcodeReportingModeEnum, BarcodeScanningResultResponse, BarcodeScanningStatusModel, BarcodeTransactionTypeEnum, BundleScanningRequest, CommonRequestAttrs, FixedOpCodeEnum, JobBarcodeTypeEnum, OperationCategoryFormRequest, OperationModel, OpFormEnum, PTS_C_BundleReportingRequest, PTS_R_BundleScanModel, PTS_R_BundleScanResponse } from '@xpparel/shared-models';
import { useAppSelector } from "packages/ui/src/common";
import { FgReportingService, FgRetrievingService, OperationService, OpReportingService } from '@xpparel/shared-services';
import { AlertMessages } from '../../../common';
import Timer from './trims-issued-dashboard/timer';
import { render } from 'react-dom';

const { Option } = Select;
const OperationTracking = () => {
  const user = useAppSelector((state) => state.user.user.user);
  // Need to write an api to get these details
  const [opCodes, setOpCodes] = useState<OperationModel[]>([]);
  const [barcodeScanResult, setBarcodeScanResult] = useState<PTS_R_BundleScanResponse>();
  const [state, setState] = useState({
    barcodeTransactionType: null as BarcodeTransactionTypeEnum | null,
    barcodeReportingMode: null as BarcodeReportingModeEnum | null
  });
  const [barcodeDetailsForBundleScanning, setBarcodeDetailsForBundleScanning] = useState<BarcodeDetailsForBundleScanning>(null);
  const [username, setUsername] = useState(user?.userName);
  const [operationCode, setOperationCode] = useState('');
  const [sessions, setSessions] = useState([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  // const [filteredData, setFilteredData] = useState([]);
  const [readOnlyOperationCode, setReadOnlyOperationCode] = useState(false);
  const [selectorType, setSelectorType] = useState('');
  const [status, setStatus] = useState('');
  const [barcode, setBarcode] = useState('');
  const [barcodeForDisplay, setBarcodeForDisplay] = useState('');
  const barcodeInputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [barCodeTableData, setBarCodeTableData] = useState<any>([]);

  const [sessionTransactions, setSessionTransactions] = useState<PTS_R_BundleScanModel[]>([]);
  const [updateKey, setUpdateKey] = useState<number>(0);
  const [isSecondTableVisible, setSecondTableVisible] = useState(false);
  const [view, setView] = useState("card");

  // const [data, setData] = useState<Array<{ sessionId: string; key: string } & BarcodeScanningStatusModel>>(
  //   barCodeTableData.flatMap((session) =>
  //     sessionTransactions.map((detail, index) => ({
  //       ...detail,
  //       sessionId: session.sessionId,
  //       key: `${session.sessionId}-${detail.barcode}-${index}`,
  //     }))
  //   )
  // );
  // const [filteredData, setFilteredData] = useState(data);
  const operationService = new OperationService();
  const barcodeScanningService = new OpReportingService();
  const barcodeRetrievalService = new FgRetrievingService();

  // useEffect(() => {
  //   const sessionData = data.filter((item) => item.sessionId === `session-${sessionCount}`);
  //   setFilteredData(sessionData);
  // }, [data, sessionCount]);


  // useEffect(() => {
  //   let timer = null;
  //   if (sessionStarted) {
  //     timer = setInterval(() => {
  //       if (sessionStartTime) {
  //         const time = new Date();
  //         setSessionDuration(Math.floor((time.getTime() - sessionStartTime.getTime()) / 1000));
  //       }
  //     }, 1000);
  //   } else {
  //     clearInterval(timer);
  //   }
  //   return () => {
  //     if (timer) clearInterval(timer);
  //   };

  // }, [sessionStarted, sessionStartTime]);

  useEffect(() => {
    getOperationCodes();
  }, [])

  const handleStartSession = () => {
    if (username) {
      setSessionStarted(true);
      setSessionStartTime(new Date());
      setSessionDuration(0);
      setSessionCount((prevCount) => prevCount + 1);
      const generatedSessionId = `session-${sessionCount + 1}`;
      message.success('Session started successfully!');
      const newSession = {
        id: generatedSessionId,
        username,
        operationCode,
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        duration: 0,
        endTime: null,
      };
      // const sessionData = data.filter((item) => item.sessionId === generatedSessionId);
      // setFilteredData(sessionData); // Update filteredData for the table
      setSessions([...sessions, newSession]);
      setReadOnlyOperationCode(operationCode !== '');
    }
  };
  const handleEndSession = () => {
    setSessionStarted(false);
    setOperationCode('');
    message.info(`Session ended. Total duration: ${Math.floor(sessionDuration / 60)} minutes ${sessionDuration % 60} seconds.`);
    // setFilteredData([]);

    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === `session-${sessionCount}`) {
          return { ...session, endTime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
        }
        return session;
      })
    );
  };

  const handleOperationCodeChange = (value) => {
    setOperationCode(value);
    if (!sessionStarted) {
      setReadOnlyOperationCode(false);
    }
  };

  // const handleSearchOperationCode = (searchText) => {
  //   return opCodes?.filter((code) =>
  //     code.toLowerCase().includes(searchText.toLowerCase())
  //   ) || [];
  // };

  const barcodeInputFocus = () => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }
  const setModeAndType = (obj) => {
    setState(obj);
    barcodeInputFocus();
  }

  const getBgColor = (status: boolean) => {
    if (status === true) return "linear-gradient(152deg, #f5f5f5, #0cd839)"
    if (status === false) return "linear-gradient(177deg, #ffecec, rgb(253, 19, 61))"
    return "#eeeeee"
  }

  const handleBarcodeScanChange = (value: string) => {
    console.log(value);
    console.log(state)
    if (value) {
      setUpdateKey(pre => pre + 1);
      setBarcode(value);
      setBarcodeForDisplay(value);
      // NEED TO CALL THE RESPECTIVE API USING BARCODE , MODE, TRANSACTION TYPE
      if (!state.barcodeReportingMode || !state.barcodeTransactionType) {
        AlertMessages.getErrorMessage('Please Select Transaction Mode and Type');
        setBarcode(undefined);
        barcodeInputFocus();
        return;
      }
      const companyCode = user?.orgData?.companyCode;
      const unitCode = user?.orgData?.unitCode;
      const username = user?.orgData?.username;
      const userId = user?.userId;

      const scanDateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      if (state.barcodeReportingMode == BarcodeReportingModeEnum.AUTOMATIC) {
        const m1 =new PTS_C_BundleReportingRequest(
          username,         // username
          unitCode,         // unitCode
          companyCode,      // companyCode
          userId,           // userId
          value,            // barcode (string)
          operationCode,    // opCode (string)
          userId,                // operatorId (number)
          undefined,            // locationCode (string)
          false,            // forceReportPartial (boolean)
          'A',              // shift (string)
          scanDateTime,     // scannedDate (string)
          0,                // incomingQty (number)
          undefined,     // rejQty (number)
          sessionCount                // sessionId (number)
        );;
        barcodeScanningService.reportBundleForAnOp(m1).then((res) => {
          setBarcode(undefined);
          setBarcodeScanResult(res);
          if (!res.status || !res.data) {
            // AlertMessages.getErrorMessage(res.internalMessage);
          };
          // sessionTransactions.push(res.data);
          if (res.data) {
            setSessionTransactions(pre => [...pre, res.data]);
          }
          barcodeInputFocus()
        }).catch((err) => {
          AlertMessages.getErrorMessage(err.message);
          return;
        })
      } else {
        // TODO
        const reportingObj = new BundleScanningRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, value, state.barcodeTransactionType, state.barcodeReportingMode, operationCode, sessionCount);
        barcodeRetrievalService.getBarcodeDetailsForManualScanning(reportingObj).then((res) => {
          if (!res.status || !res.data) {
            AlertMessages.getErrorMessage(res.internalMessage);
            barcodeInputFocus()
            return;
          }
          setBarcodeDetailsForBundleScanning(res.data);
          setIsModalVisible(true);
          barcodeInputFocus()
        }).catch((err) => {
          AlertMessages.getErrorMessage(err.message);
          return;
        })
      }
      // const barcodeDetailsPopover = barcodePopoverData.find((job) => job.barcodeNo === value);
      // const barcodeDetailsSewing = sewingJobsBarcodeData.find((job) => job.barcodeNo === value);

      // setSelectedBarcodeData(barcodeDetailsPopover || null);
      // setSelectedBarcodeDataDiv(barcodeDetailsSewing || null);

      // if (selectorType === 'manual' && status === 'good' && barcodeDetailsSewing) {
      //   setIsModalVisible(true);
      // }
      // if (selectorType === 'manual' && status === 'rejected' && barcodeDetailsSewing) {
      //   setIsAnotherModalVisible(true);
      // }
    }
  };

  const manualBarcodeScanSubmit = (reqObj: BarcodeDetailsForBundleScanning) => {
    console.log(reqObj);
    const companyCode = user?.orgData?.companyCode;
    const unitCode = user?.orgData?.unitCode;
    const username = user?.orgData?.username;
    const scanDateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const m1 = new PTS_C_BundleReportingRequest(username, unitCode, companyCode, 0, reqObj.barcode, reqObj.operationCode, 1, 'NAM', false, 'A', scanDateTime, 0, sessionCount, 0);
    barcodeScanningService.reportBundleForAnOp(m1).then((res) => {
      setBarcodeScanResult(res);
      setBarcode(undefined);
      if (!res.status || !res.data) {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
      // sessionTransactions.push(res.data);
      if (res.data) {
        setSessionTransactions(pre => [...pre, res.data]);
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage(err.message);
      return;
    });
    handleCancel();
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    setBarcode(undefined);
    barcodeInputFocus();
  };

  const getOperationCodes = () => {
    const operationReq = new CommonRequestAttrs(user?.username, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    operationService.getAllOperations(operationReq).then((res) => {
      if (!res.status || !res.data) {
        AlertMessages.getErrorMessage(res.internalMessage);
        return;
      }
      // const opCodes = res.data.map((opCode) => {
      //   return opCode.opCode;
      // });
      setOpCodes(res.data);
    }).catch((err) => {
      AlertMessages.getErrorMessage(err?.message)
    })
  }

  // session history data only 10 data table.
  const columns = [
    { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: 100 },
    { title: 'Op Group', dataIndex: 'opGroup', key: 'opGroup', width: 100 },
    {
      title: 'Barcode Type',
      dataIndex: 'barcodeType',
      key: 'barcodeType',
      width: 120,
      render: (barcodeType) => {
        if (barcodeType === JobBarcodeTypeEnum.ROUTING_JOB) {
          return <Tag color="blue">Routing Job</Tag>;
        } else if (barcodeType === JobBarcodeTypeEnum.JOB_BUNDLE) {
          return <Tag color="green">Job Bundle</Tag>;
        }
        return <Tag>{barcodeType}</Tag>;
      },
    },
    { title: 'Operation', dataIndex: 'operation', key: 'operation', width: 100, 
      render: (operation: FixedOpCodeEnum) => {
        return operation == FixedOpCodeEnum.IN ? 'Input' : 'Output'
      }
     },
    {
      title: 'Process Type',
      dataIndex: 'processType',
      key: 'processType',
      width: 100,
      render: (processType) => {
        const colors = {
          LAY: 'purple',
          CUT: 'blue',
          EMB: 'orange',
          SEW: 'green',
          WASH: 'cyan',
          FIN: 'pink',
          INS: 'gold',
          IRON: 'gray',
          DYE: 'red',
          FOLD: 'lime',
          PACK: 'magenta',
          KNIT: 'teal',
          LINK: 'brown',
        };
        return <Tag color={colors[processType] || 'default'}>{processType}</Tag>;
      },
    },
    // {
    //   title: 'MO Properties',
    //   dataIndex: 'barcodeProps',
    //   key: 'barcodeProps',
    //   width: 300,
    //   render: (barcodeProps) => {
    //     const {
    //       soNumber,
    //       style,
    //       soLineNo,
    //       destination,
    //       plannedDelDate,
    //       planProdDate,
    //       planCutDate,
    //       coLine,
    //       buyerPo,
    //       moNumbers,
    //       productName,
    //       fgColor,
    //       size,
    //     } = barcodeProps;

    //     return (
    //       <div>
    //         <div><strong>SO Number:</strong> {soNumber}</div>
    //         <div><strong>Style:</strong> {style}</div>
    //         <div><strong>Line No:</strong> {soLineNo}</div>
    //         <div><strong>Destination:</strong> {destination}</div>
    //         <div><strong>Planned Delivery:</strong> {plannedDelDate}</div>
    //         <div><strong>Product Name:</strong> {productName}</div>
    //         <div><strong>Color:</strong> {fgColor}</div>
    //         <div><strong>Size:</strong> {size}</div>
    //       </div>
    //     );
    //   },
    // },
    { title: 'Good Quantity', dataIndex: 'gQtyScanned', key: 'gQtyScanned', width: 100 },
    { title: 'Rejected Quantity', dataIndex: 'rQtyScanned', key: 'rQtyScanned', width: 100 },
    { title: 'Session ID', dataIndex: 'sessionId', key: 'sessionId', width: 100 },
    // { title: 'Quality Type', dataIndex: 'qualityType', key: 'qualityType', width: 100 },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   width: 150,
    //   render: (_, record) => (
    //     <Space size="middle">
    //       {record?.qualityType !== 'FAILED' && (
    //         <Button
    //           style={{
    //             color: 'white',
    //             border: 'none',
    //             backgroundImage: 'linear-gradient(147deg, rgb(94, 5, 4), rgb(253, 19, 61))',
    //           }}
    //           type="link"
    //           danger
    //           onClick={() => {
    //             console.log('Revert button clicked for record:', record);
    //             // handleDelete(record.sessionId);
    //           }}
    //         >
    //           Revert
    //         </Button>
    //       )}
    //       {record?.qualityType === 'FAILED' && (
    //         <Button
    //           style={{
    //             color: 'white',
    //             border: 'none',
    //             backgroundImage: 'linear-gradient(147deg, rgb(56,68,81), rgb(197,112,111))',
    //           }}
    //           type="link"
    //           onClick={() => handleRetry(record.sessionId)}
    //         >
    //           Retry
    //         </Button>
    //       )}
    //     </Space>
    //   ),
    // },
  ];


  // const handleDelete = (key: string) => {
  //   const newData = data.filter((item) => item.key !== key);
  //   console.log('Deleting record with key:', key);
  //   setData(newData);
  // };



  // console.log(handleDelete, "handleDelete");


  const handleRetry = (key) => {
    alert('Retrying for the selected row');
  };

  const handleRefresh = () => {

  };

  const toggleView = (newView) => {
    setView(newView);
  };
  const getOperationName = (opCode: string) => {
    const opNameObj = opCodes.find(op => op.opCode == opCode);
    return opNameObj ? opNameObj.opName : '';

  }
  return (
    // <div style={{ padding: '20px', margin: 'auto' }}>
      <div>
        {!sessionStarted && (
          <Flex justify='center'>
            <Card title="Start Operation Session" size='small' headStyle={{ background: "#047595", color: "white", marginBottom: "15px" }} className='input-field-card'>
              <div>
                <Form className='input-field-card-content' layout="horizontal">
                  {/* <Form.Item label="Username" required>
                  <AutoComplete
                    value={username}
                    onChange={(value) => setUsername(value)}`
                    // onSearch={(searchText) => handleSearch(searchText)}
                    // options={handleSearch(username).map((name) => ({
                    //   value: name,
                    // }))}
                    disabled={sessionStarted}
                  >
                    <Input placeholder="Enter username" />
                  </AutoComplete>
                </Form.Item> */}
                  <Form.Item label="Operation Code">
                    <Select
                      style={{ width: '300px' }}
                      placeholder='Select Product Name'
                      filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                      showSearch
                      onChange={handleOperationCodeChange}
                      disabled={sessionStarted}
                      defaultValue={operationCode}
                    >
                      {opCodes.map(opObj => <Option key={opObj.eOpCode} value={opObj.opCode}>{`${opObj.opCode}-${opObj.opName}`}</Option>)}
                    </Select>
                    {/* <AutoComplete
                      value={operationCode}
                      onChange={handleOperationCodeChange}
                      onSearch={(searchText) => handleSearchOperationCode(searchText)}
                      options={opCodes
                        .filter((code) => code.toLowerCase().includes(operationCode.toLowerCase()))
                        .map((code) => ({
                          value: code,
                        }))}
                      disabled={sessionStarted}
                    >
                      <Input placeholder="Enter operation code" />
                    </AutoComplete> */}
                  </Form.Item>

                  <Button style={{ width: "70px" }} className='session-button' type="primary" onClick={handleStartSession} block disabled={sessionStarted}>
                    Start
                  </Button>
                </Form>
              </div>
            </Card>
          </Flex>
        )}
        <div style={{ margin: "-20px 0px" }} >
          {sessionStarted && (
            <>
              <div style={{ display: 'flex', justifyContent: "space-between" }} >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", marginTop: "7px" }}>
                  <Switch
                    checked={view === "table"}
                    onChange={(checked) => {
                      if (checked) {
                        toggleView("table");
                        setSecondTableVisible(true);
                      } else {
                        toggleView("card");
                        setSecondTableVisible(false);
                      }
                      setTimeout(() => {
                        barcodeInputFocus();
                      }, 400)

                    }}
                    checkedChildren="Session Transaction"
                    unCheckedChildren="Barcode Scanner"
                  />
                </div>
                <div style={{ marginRight: "0.5px" }} >
                  {/* <Button className='refresh-btn' icon={<ReloadOutlined style={{ marginLeft: "8px", color: "white" }} />} onClick={handleRefresh} > </Button> */}
                </div>
              </div>
              {view === "card" && (
                <Card title="Operation Reporting" headStyle={{ background: "#047595", color: "white" }} style={{ marginTop: '0px' }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0px 10px" }} >
                    <div style={{ display: 'flex', alignItems: "center", background: "#eeeeee", borderRadius: "15px", padding: "0px 10px", height: "50px", width: "35.5%" }} >
                      <p style={{ margin: "0px", display: "contents" }}> Username: {""} <strong style={{ marginLeft: "6px" }} >  {username} </strong> </p>
                      <div style={{ height: "30px", marginLeft: "5px" }} >
                        <Form.Item label="Operation Code">
                          <Input style={{ width: "156px" }}
                            value={`${operationCode} - ${getOperationName(operationCode)}`}
                            onChange={(e) => handleOperationCodeChange(e.target.value)}
                            readOnly={readOnlyOperationCode}
                            placeholder="Enter operation code"
                            disabled
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div style={{ display: 'flex', background: "", borderRadius: "15px", padding: "0px 10px", width: "48%", justifyContent: "end", alignItems: "center" }}  >

                      <p style={{ display: "flex", flexDirection: "column", background: "#eeeeee", padding: "10px 13px", borderRadius: "15px", margin: "0px 5px", alignItems: "center", height: "fit-content" }}> Session ID: <strong>   {sessionCount}</strong>   </p>
                      <p style={{ marginLeft: "10px", display: "flex", flexDirection: "column", background: "#eeeeee", padding: "10px 13px", borderRadius: "15px", margin: "0px 5px", alignItems: "center", height: "fit-content" }} > Session Start Time: <strong> {sessionStartTime && dayjs(sessionStartTime).format('HH:mm:ss')}</strong> </p>
                      <p style={{ marginLeft: "10px", display: "flex", flexDirection: "column", background: "#eeeeee", padding: "10px 13px", borderRadius: "15px", margin: "0px 5px", alignItems: "center", height: "fit-content" }} > Session Duration: <strong> <Timer startTime={sessionStartTime} />

                        {/* {Math.floor(sessionDuration / 60)} mins and {sessionDuration % 60} secs  */}
                      </strong>  </p>
                      <Button style={{ margin: "14px 6px 10px 4px", width: "120px", display: 'flex', }} type="primary" onClick={handleEndSession} block>
                        <span style={{ display: 'flex', margin: "auto" }} > End Session </span>
                      </Button>
                    </div>
                  </div>
                  {/* Mode and Quality Selection */}
                  <div style={{ display: 'flex', justifyContent: '', margin: '15px' }}>
                    <div style={{ margin: "0 10px", display: "flex", justifyContent: 'space-evenly', alignItems: "baseline" }} >
                      <div style={{ display: "flex", justifyContent: 'space-evenly', margin: "10px 0px", alignItems: 'center', marginLeft: "-24px" }}>

                        <ModeAndTransTypeSection setModeAndType={setModeAndType} />

                        <div style={{ background: "#eeeeee", borderRadius: "15px", height: "51px", padding: "10px", width: "310px", marginLeft: "7px", display: "flex", alignItems: "" }} >
                          {/* <Form.Item style={{ marginLeft: "3px" }} label="Scan Barcode"> */}
                          {/* <Input style={{ width: "172px" }} ref={barcodeInputRef} placeholder="Scan barcode here" onChange={() => handleBarcodeScanChange} defaultValue={barcode}/> */}
                          {/* <AutoComplete value={barcode}
                              onChange={handleBarcodeScanChange}
                              options={sewingJobsBarcodeData.map((job) => ({ value: job.barcodeNo }))} >
                              <Input style={{ width: "172px" }} ref={barcodeInputRef} placeholder="Scan barcode here" disabled={!(status === "good" || status === "rejected")} />
                            </AutoComplete> */}
                          {/* </Form.Item> */}
                          <Form.Item style={{ marginLeft: "3px" }} name='barcode' label="Scan Barcode">
                            <Input
                              style={{ width: "172px" }}
                              ref={barcodeInputRef}
                              placeholder="Scan barcode here"
                              value={barcode} // Bind the value to the state
                              onChange={(e) => handleBarcodeScanChange(e.target.value)} // Trigger the barcode change handler
                            // disabled={(state.barcodeTransactionType === BarcodeTransactionTypeEnum.GOOD || state.barcodeTransactionType === BarcodeTransactionTypeEnum.REJECTION)} // Control the input's disabled state
                            />
                          </Form.Item>

                        </div>
                        <Modal
                          width={'100%'}
                          style={{ top: '0' }}
                          title={`Barcode No: ${barcodeDetailsForBundleScanning?.barcode || 'N/A'}`}
                          visible={isModalVisible}
                          onCancel={handleCancel}
                          footer={[<></>
                            // <Button key="close" onClick={handleCancel}>
                            //   Close
                            // </Button>,
                          ]}
                        >
                          {barcodeDetailsForBundleScanning ? (
                            <div>
                              <BarcodeManualReportingForm updatedKey={updateKey} barcodeDetails={barcodeDetailsForBundleScanning} manualBarcodeScanSubmit={manualBarcodeScanSubmit} />
                            </div>
                          ) : (
                            <p>No data available for the selected barcode.</p>
                          )}
                        </Modal>
                      </div>

                    </div>
                    <div style={{
                      width:'50%', justifyContent: "start", margin: "0 0 0 10px", background: "#eeeeee", borderRadius: "10px",
                      backgroundImage: barcodeScanResult ? getBgColor(barcodeScanResult?.status) : "#eeeeee",
                    }} >
                      {barcodeScanResult && (
                        <BarcodeScanResultComp barcodeForDisplay={barcodeForDisplay} key={barcodeScanResult.data?.barcode} reportingMode={state?.barcodeReportingMode} transactionType={state?.barcodeTransactionType} barcodeScanResult={barcodeScanResult.data} status={barcodeScanResult.status} internalMessage={barcodeScanResult.internalMessage} updateKey={updateKey} />
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
        {sessionStarted && view !== "table" && (
          <Table
            className="barcode-table"
            style={{ marginTop: "38px" }}
            columns={columns}
            dataSource={sessionTransactions}
            rowKey="key"
            size="small"
            pagination={{ pageSize: 15 }}
          />
        )}
        {sessionStarted && view === "table" && isSecondTableVisible && (
          <div style={{ marginTop: "20px" }}>
            <Table
              className="barcode-table"
              columns={columns}
              dataSource={sessionTransactions ? sessionTransactions : []}
              rowKey="key"
              size="small"
              pagination={{ pageSize: 15 }}
            />
          </div>
        )}
      </div >
    // </div>
  );
};
export default OperationTracking;


