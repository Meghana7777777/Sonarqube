import { CartonBarcodeRequest, CartonHeadInfoModel, CartonHeadInfoResponse, FgWhReqHeaderDetailsModel, FgWhReqHeaderFilterReq, PKMSFgWhReqIdDto, cartonBarcodePatternRegExp, cartonBarcodeRegExp } from '@xpparel/shared-models';
import { PKMSFgWarehouseService } from '@xpparel/shared-services';
import { Button, Card, Form, Input, Switch, Table, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../common';
import { CopyOutlined } from '@ant-design/icons';
import { copyToCliBoard } from '../../../common/handle-to-cliboard-copy/handle-cliboard-write-text';

interface Props {
  pendingCartonsDefault?: number;
  onSessionEnd?: () => void;
  whreqHeadId?: number;
  ScanstatusUpdate?: () => void;
  scanStartTime?: string;
  selectedRecord?: FgWhReqHeaderDetailsModel;
  sessionStarted?: boolean;
  setSessionStarted?: React.Dispatch<React.SetStateAction<boolean>>;
  setDummyRefresh?: React.Dispatch<React.SetStateAction<number>>
}
const FgInScan = ({ pendingCartonsDefault, onSessionEnd, whreqHeadId, ScanstatusUpdate, scanStartTime, selectedRecord, sessionStarted, setSessionStarted, setDummyRefresh }: Props) => {
  const user = useAppSelector((state) => state.user.user.user);
  const [username, setUsername] = useState(user?.userName);
  const [sessions, setSessions] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [view, setView] = useState('card');
  const [scannedBarcodeDetails, setScannedBarcodeDetails] = useState<any>([]);
  const barcodeInputRef = useRef(null);
  const service = new PKMSFgWarehouseService()
  const [fgInBarcodeData, setFgInBarcodedata] = useState<CartonHeadInfoModel>()
  const [pendingCartons, setPendingCartons] = useState<number>(pendingCartonsDefault)
  const [scannedCartons, setScannedCartons] = useState<number>(0)
  const [barcodeScanResp, setBarcodeScanResp] = useState<CartonHeadInfoResponse>();
  const [pendingBarCodes, setPendingBarCodes] = useState<Set<string>>(new Set(selectedRecord?.pendingCartonBarCodes));
  const [form] = Form.useForm();

  useEffect(() => {
    if (pendingCartonsDefault) {
      setScannedCartons(0);
    }
  }, [pendingCartonsDefault]);




  const fgWarehouseInBarcodeFgIn = async (value: string): Promise<CartonHeadInfoModel | null> => {
    try {
      const request = new CartonBarcodeRequest(value, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, whreqHeadId);
      const res = await service.FgWarehouseInBarcodeFgIn(request);
      barcodeInputRef.current = null;
      barcodeInputRef.current?.focus();
      setBarcodeScanResp(res);
      if (!res.status) {
        AlertMessages.getErrorMessage(res.internalMessage);
        return null;
      }
      if (res?.status) {
        setPendingBarCodes((prev) => {
          const previous = new Set(prev);
          previous.delete(value)
          return previous
        })
        form.resetFields();
        setTimeout(() => barcodeInputRef.current?.focus(), 2);
        return res.data as CartonHeadInfoModel;
      } else {
        form.resetFields();
        setTimeout(() => barcodeInputRef.current?.focus(), 2);
        console.warn('Service responded with a failure status:', res);
        return null;
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
      console.error('Error in FgWarehouseInBarcodeFgIn:', err);
      return null;
    }
  };


  useEffect(() => {
    let timer = null;
    if (sessionStarted) {
      timer = setInterval(() => {
        if (sessionStartTime) {
          const time = new Date();
          setSessionDuration(Math.floor((time.getTime() - sessionStartTime.getTime()) / 1000));
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sessionStarted, sessionStartTime]);

  const handleStartSession = () => {
    setDummyRefresh(prev => prev + 1)
    if (!user.userName) {
      message.error('Username is required to start a session.');
      return;
    }
    if (!scanStartTime) {
      startFgInReqSession();
    }


    setSessionStarted(true);
    setSessionStartTime(new Date());
    setSessionDuration(0);

    const newSession = { id: Date.now(), username, startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), duration: 0, endTime: null };

    setSessions([...sessions, newSession]);
    setFgInBarcodedata(null);
    setScannedBarcodeDetails([]);


    setTimeout(() => barcodeInputRef.current?.focus(), 100);
  };

  const startFgInReqSession = () => {
    const req = new PKMSFgWhReqIdDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, whreqHeadId);
    service.startFgInReqSession(req).then(res => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => console.log(err.message))
  }


  const handleEndSession = () => {
    setDummyRefresh(prev => prev + 1)
    setSessionStarted(false);
    message.info(
      `Session ended. Total duration: ${Math.floor(sessionDuration / 60)} minutes ${sessionDuration % 60
      } seconds.`

    );

    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.startTime === dayjs(sessionStartTime).format('YYYY-MM-DD HH:mm:ss')) {
          return { ...session, endTime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
        }
        return session;
      })
    );
    onSessionEnd()
  };

  const handleBarcodeScanChange = async (value: string) => {
    try {
      if (!value.length) return;
      const response = await fgWarehouseInBarcodeFgIn(value);
      if (response) {
        setFgInBarcodedata(response);
        setScannedCartons((prev) => prev + 1)
        setPendingCartons(response.pendingCartonsForFgIn)
        setScannedBarcodeDetails((prevDetails) => [...prevDetails, { ...response, status: true }]);
        form.setFieldValue('cartonBarcode', '')
        setTimeout(() => barcodeInputRef.current?.focus(), 2);
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
  };

  const toggleView = (newView) => {
    setView(newView);
  };

  const columns = [
    { title: "Barcode", dataIndex: 'barcode', key: 'barcode', },
    { title: 'MO', dataIndex: 'mo', key: 'mo', },
    { title: 'MO Line', dataIndex: 'moLine', key: 'moLine', },
    // { title: 'No of Cartons', dataIndex: 'noOfCartons', key: 'noOfCartons', },
    { title: 'Style', dataIndex: 'style', key: 'style', },
    { title: 'Buyer PO', dataIndex: 'buyerPo', key: 'buyerPo', },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName', },
    { title: 'Planned Delivery Date', dataIndex: 'plannedDeliveryDate', key: 'plannedDeliveryDate' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    // { title: 'Pending Cartons', dataIndex: 'pendingCartons', key: 'pendingCartons' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={getStatusColor(status)}>{status ? "Success" : "Failed"}</Tag> },
  ];

  const getStatusColor = (status) => {
    if (status) return "green";
    if (status) return "red";
    return "blue";
  }

  const handleCopy = (text) => {
    copyToCliBoard(text, 'Copied to clipboard!');

  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {!sessionStarted && (
        <Card
          title="Start Fg Scan Session"
          headStyle={{ background: '#047595', color: 'white', marginBottom: '15px' }}
          className="fg-input-field-card"
        >
          <Form className="input-field-card-content" layout="horizontal">
            <Form.Item hidden noStyle label="Username">

              <Input hidden placeholder="Enter username" value={"admin"} onChange={(e) => setUsername(e.target.value)} disabled={sessionStarted} defaultValue={"admin"} />
            </Form.Item>
            <Button
              style={{ width: '100px' }}
              className="fg-session-button"
              type="primary"
              onClick={handleStartSession}
              block
              disabled={sessionStarted}
            >
              <span style={{ marginLeft: '-4px' }}> Start Session </span>
            </Button>
          </Form>
        </Card>
      )}

      {sessionStarted && (
        <div style={{ margin: '-20px 0px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', marginTop: '15px', }}  >
              <Switch
                checked={view === 'table'}
                onChange={(checked) => toggleView(checked ? 'table' : 'card')}
                checkedChildren="Session Transaction"
                unCheckedChildren="Barcode Scanner"
              />
            </div>

            {view === 'card' && (
              <Card
                title="FG In Operation Reporting"
                headStyle={{ background: '#047595', color: 'white' }}
                style={{ marginTop: '0px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 10px', }}   >
                  <p className="session-details-p"> Username: <strong>{user.userName}</strong>  </p>
                  <p className="session-details-p"> Session ID: <strong>{sessions.length > 0 && sessions[sessions.length - 1].id}</strong>  </p>
                  <p className="session-details-p"> Session Start Time:{' '} <strong>{sessionStartTime && dayjs(sessionStartTime).format('YYYY-MM-DD HH:mm:ss')}</strong>  </p>
                  <p className="session-details-p"> Session Duration:{' '} <strong> {Math.floor(sessionDuration / 60)} mins and {sessionDuration % 60} secs </strong>  </p>
                  <Button
                    style={{ width: '120px', display: 'flex' }}
                    type="primary"
                    onClick={handleEndSession}
                    block
                  >
                    <span style={{ display: 'flex', margin: 'auto' }}> End Session </span>
                  </Button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  {[...pendingBarCodes].slice(0, 8).map((barcode) => {
                    return <Tag bordered color='green' icon={<CopyOutlined />} style={{ cursor: 'pointer' }} onClick={() => handleCopy(barcode)}>{barcode}</Tag>
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '0px', alignItems: 'center' }}  >

                  <span style={{ fontSize: 'large', fontWeight: "bold", fontFamily: "emoji" }}>Cartons Pending:  </span>
                  <div className='increment-number-div'>
                    <span style={{ fontSize: "63px", marginTop: "-4px" }} >
                      {pendingCartons}
                    </span>
                  </div>
                  <div className="barcode-scanner-input">
                    <Form form={form}>
                      <Form.Item
                        style={{ marginLeft: '3px' }}
                        label="Scan Barcode"
                        rules={[{
                          required: true,
                          pattern: new RegExp(cartonBarcodeRegExp),
                          message: 'Please Provide Valid Carton Barcode'
                        }]}
                        name={'cartonBarcode'}
                      >
                        <Input
                          onChange={(v) => {
                            const pattern = cartonBarcodePatternRegExp;
                            if (pattern.test(v.target.value)) {
                              handleBarcodeScanChange(v.target.value)
                            } else {
                              AlertMessages.getErrorMessage('Please Provide Valid Carton Barcode')
                            }
                          }}
                          style={{ width: '172px' }}
                          ref={barcodeInputRef}
                          placeholder="Scan barcode here"
                        />
                      </Form.Item>
                    </Form>

                  </div>

                  <span style={{ fontSize: 'large', fontWeight: "bold", fontFamily: "emoji" }}>Cartons Scanned:  </span>
                  <div className='increment-number-div'>
                    <span style={{ fontSize: "63px", marginTop: "-4px" }} >
                      {scannedCartons}
                    </span>
                  </div>

                  <div className='barcode-details-div' >
                    {fgInBarcodeData ? (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <table style={{ display: 'flex', flexWrap: "wrap" }} className='barcode-details-table' >
                          <tbody>
                            <tr> <td>MO </td><td className='barcode-details-table-td' >:  {fgInBarcodeData.mo}</td>  </tr>
                            <tr> <td>Customer</td><td className='barcode-details-table-td' >:  {fgInBarcodeData.customerName}</td></tr>
                            <tr> <td>Buyer PO </td> <td className='barcode-details-table-td' >:   {fgInBarcodeData.buyerPo}</td>  </tr>
                            <tr> <td>Planned Delivery Date</td> <td className='barcode-details-table-td' >:   {fgInBarcodeData.plannedDeliveryDate}</td>  </tr>
                          </tbody>
                        </table>
                        <table style={{ display: 'flex', flexWrap: "wrap" }} className='barcode-details-table' >
                          <tbody>
                            <tr> <td>MO Line</td> <td className='barcode-details-table-td' >:  {fgInBarcodeData.moLine}</td> </tr>
                            <tr> <td>Style </td> <td className='barcode-details-table-td' >:  {fgInBarcodeData.style} </td> </tr>
                            <tr> <td>Carton Quantity </td> <td className='barcode-details-table-td' >:  {fgInBarcodeData.cartonQty}</td> </tr>
                            <tr> <td>Status</td> <td className='barcode-details-table-td' >: <Tag color={getStatusColor(barcodeScanResp.status)} > {barcodeScanResp.internalMessage} </Tag>  </td> </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      'No details found for this barcode'
                    )}
                  </div>
                </div>
              </Card>
            )}

            <Table
              columns={columns}
              dataSource={view !== 'table' ? [...scannedBarcodeDetails].reverse() : scannedBarcodeDetails.map((item, index) => ({ ...item, key: index, }))}
              style={{ marginTop: '20px' }}
              size="small"
              pagination={view !== 'table' ? false : { pageSize: 15 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FgInScan;
