import { CartonBarcodeRequest, CartonHeadInfoModel, CartonHeadInfoResponse, FgWhReqHeaderDetailsModel } from '@xpparel/shared-models';
import { PKMSFgWarehouseService } from '@xpparel/shared-services';
import { Button, Card, Form, Input, Switch, Table, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../common';
import { CopyOutlined } from '@ant-design/icons';

interface Props {
  pendingCartonsDefault?: number;
  onSessionEnd?: () => void;
  whreqHeadId?: number;
  selectedRecord?: FgWhReqHeaderDetailsModel;
  sessionStarted?: boolean;
  setSessionStarted?: React.Dispatch<React.SetStateAction<boolean>>

}
const FgOutScan = ({ pendingCartonsDefault, onSessionEnd, whreqHeadId, selectedRecord, setSessionStarted, sessionStarted }: Props) => {
  const user = useAppSelector((state) => state.user.user.user);
  const [username, setUsername] = useState(user?.username);
  const [sessions, setSessions] = useState([]); 
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [view, setView] = useState('card');
  const [scannedBarcodeDetails, setScannedBarcodeDetails] = useState<any>([]);
  const barcodeInputRef = useRef(null);
  const service = new PKMSFgWarehouseService()
  const [fgOutBarcodeData, setFgOutBarcodedata] = useState<CartonHeadInfoModel>()
  const [barcodeScanResp, setBarcodeScanResp] = useState<CartonHeadInfoResponse>();
  const [pendingCartons, setPendingCartons] = useState<number>(pendingCartonsDefault)
  const [scannedCartons, setScannedCartons] = useState<number>(0);
  const [pendingBarCodes, setPendingBarCodes] = useState<Set<string>>(new Set(selectedRecord?.pendingCartonBarCodes));
    const [form] = Form.useForm();
  

  const fgWarehouseInBarcodeFgOut = async (value: string): Promise<CartonHeadInfoModel | null> => {
    try {
      const request = new CartonBarcodeRequest(value, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, whreqHeadId);
      const res = await service.FgWarehouseInBarcodeFgOut(request);
      setBarcodeScanResp(res);
      barcodeInputRef.current = null;
      barcodeInputRef.current?.focus()
      if (res?.status) {
        setPendingBarCodes((prev) => {
          const previous = new Set(prev);
          previous.delete(value)
          return previous
        })
        return res.data as CartonHeadInfoModel;
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
        console.warn('Service responded with a failure status:', res);
        return null;
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message)
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
    if (!user.userName) {
      message.error('Username is required to start a session.');
      return;
    }

    setSessionStarted(true);
    setSessionStartTime(new Date());
    setSessionDuration(0);

    const newSession = { id: Date.now(), username, startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), duration: 0, endTime: null };

    setSessions([...sessions, newSession]);
    setFgOutBarcodedata(null);
    setScannedBarcodeDetails([]);
    message.success('Session started successfully!');

    setTimeout(() => barcodeInputRef.current?.focus(), 100);
  };

  const handleEndSession = () => {
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
      const response = await fgWarehouseInBarcodeFgOut(value);

      if (response) {
        setFgOutBarcodedata(response);
        setScannedCartons((prev) => prev + 1)
        setPendingCartons(response.pendingCartonsForFgOut)
        setScannedBarcodeDetails((prevDetails) => [...prevDetails, response]);
        form.setFieldValue('cartonBarcode', '')


      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
  };

  const toggleView = (newView) => {
    setView(newView);
  };

  const columns = [
    { title: "Barcode", dataIndex: 'barcodeNo', key: 'barcodeNo', },
    { title: 'MO', dataIndex: 'mo', key: 'mo', },
    { title: 'MO Line', dataIndex: 'moLine', key: 'moLine', },
    { title: 'Carton Quantity', dataIndex: 'noOfCartons', key: 'noOfCartons', },
    { title: 'Style', dataIndex: 'style', key: 'style', },
    { title: 'Buyer PO', dataIndex: 'buyerPo', key: 'buyerPo', },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName', },
    { title: 'Planned Delivery Date', dataIndex: 'plannedDeliveryDate', key: 'plannedDeliveryDate' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Pending Cartons', dataIndex: 'pendingCartons', key: 'pendingCartons' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={getStatusColor(status)}>Success</Tag> },
  ];

  const getStatusColor = (status) => {
    if (status) return "green";
    if (!status) return "green";
    return "blue";
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success('Copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {!sessionStarted && (
        <Card
          title="Start Fg Scan Session"
          headStyle={{ background: '#047595', color: 'white', marginBottom: '25px' }}
          className="fg-input-field-card"
        >
          <Form className="input-field-card-content" layout="horizontal">
            <Form.Item label="Username" hidden noStyle>

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
                title="FG Out Operation Reporting"
                headStyle={{ background: '#047595', color: 'white' }}
                style={{ marginTop: '0px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 10px', }}   >
                  <p className="session-details-p"> Username: <strong>{user.userName}</strong>  </p>
                  <p className="session-details-p"> Session ID : <strong>{sessions.length > 0 && sessions[sessions.length - 1].id}</strong>  </p>
                  <p className="session-details-p"> Session Start Time :{' '} <strong>{sessionStartTime && dayjs(sessionStartTime).format('YYYY-MM-DD HH:mm:ss')}</strong>  </p>
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
                    <Form.Item style={{ marginLeft: '3px' }} label="Scan Barcode" name={'cartonBarcode'}>
                      <Input
                        onChange={(v) => handleBarcodeScanChange(v.target.value)}
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
                    {fgOutBarcodeData ? (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <table style={{ display: 'flex', flexWrap: "wrap" }} className='barcode-details-table' >
                          <tbody>
                            <tr> <td>MO </td><td className='barcode-details-table-td' >:  {fgOutBarcodeData.mo}</td>  </tr>
                            <tr> <td>Customer</td><td className='barcode-details-table-td' >:  {fgOutBarcodeData.customerName}</td></tr>
                            <tr> <td>Buyer PO </td> <td className='barcode-details-table-td' >:   {fgOutBarcodeData.buyerPo}</td>  </tr>
                            <tr> <td>Planned Delivery Date</td> <td className='barcode-details-table-td' >:   {fgOutBarcodeData.plannedDeliveryDate}</td>  </tr>
                          </tbody>
                        </table>
                        <table style={{ display: 'flex', flexWrap: "wrap" }} className='barcode-details-table' >
                          <tbody>
                            <tr> <td>MO Line</td> <td className='barcode-details-table-td' >:  {fgOutBarcodeData.moLine}</td> </tr>
                            <tr> <td>Style </td> <td className='barcode-details-table-td' >:  {fgOutBarcodeData.style} </td> </tr>
                            <tr> <td> No of Cartons </td> <td className='barcode-details-table-td' >:  {fgOutBarcodeData.cartonQty}</td> </tr>
                            <tr> <td>Status</td> <td className='barcode-details-table-td' >: <Tag color={getStatusColor(barcodeScanResp.status)} > Success </Tag>  </td> </tr>
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

            {view !== 'table' && (
              <Table
                columns={columns}
                dataSource={[...scannedBarcodeDetails].slice(-10).reverse().map((item, index) => ({ ...item, key: index, }))}
                style={{ marginTop: '20px' }}
                size="small"
                pagination={false}
              />
            )}

            {view === 'table' && (
              <Table
                columns={columns}
                dataSource={scannedBarcodeDetails.map((item, index) => ({ ...item, key: index, }))}
                style={{ marginTop: '20px' }}
                size="small"
                pagination={{ pageSize: 15 }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FgOutScan;
