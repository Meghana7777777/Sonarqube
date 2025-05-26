import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { GroupedSewingJobFeatureResult, JobSewSerialReq, ProcessTypeEnum, PanelReqForJobModel, SewingJobPreviewHeaderInfo, SewingJobPropsModel, SewingJobSummaryFeatureGroupForMo, SewJobGenReqForBgMOAndFeatureGroup, TrimsIssuedJobModel } from '@xpparel/shared-models';
import moment from 'moment';
import dayjs from 'dayjs';
import SewJobTrimsData from '../components/trims-issued-dashboard/sew-job-trims-data';
import { useAppSelector } from 'packages/ui/src/common';
import { SewingJobGenMOService } from '@xpparel/shared-services';
import AlertMessages from '../../../common/notifications/notification-messages';

const handleExportPDF = async () => {
  const printAreaElement = document.getElementById("printArea") as HTMLElement | null;
  const divContents = printAreaElement?.innerHTML ?? "";
  const element = window.open("", "", "height=700, width=1070");
  element?.document.write(divContents);
  element?.document.close();
  setTimeout(() => {
    element?.print();
    element?.close();
  }, 1000);
};
interface IProps {
  job: TrimsIssuedJobModel,
  closePopUp: () => void;
}

const SewJobCompBundles: React.FC<IProps> = ({ job, closePopUp }) => {
  const user = useAppSelector((state) => state.user.user.user);
  const [invData, setInvData] = useState<SewingJobPropsModel>(null);
  const [bundleData, setBundleData] = useState<PanelReqForJobModel[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobNo, setJobNo] = useState<string>(undefined)
  const [sheetVisible, setSheetVisible] = useState(true);
  const sewingJobRMervice = new SewingJobGenMOService();
  useEffect(() => {
    if (job) {
      setJobNo(job.jobNo);
      fetchData(job.jobNo);
      fetchBundlesData(job.jobNo);
      setLoading(true)
    }
  }, [job.jobNo]);


  const fetchData = async (jobNumber: string) => {

    try {
      const req = new JobSewSerialReq(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, jobNumber, job.sewSerial, false);
      const res = await sewingJobRMervice.getSewingJobQtyAndPropsInfoByJobNumber(req);
      if (res.status) {
        setInvData(res.data);

      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBundlesData = async (jobNumber: string) => {

    try {
      const req = new JobSewSerialReq(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, jobNumber, job.sewSerial, false);
      const res = await sewingJobRMervice.getComponentBundlesForSewingJob(req);
      if (res.status) {
        setBundleData(res.data);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


  const headerDetails = [
    { label: 'Order Serial', value: invData?.sewSerial || '-' },
    { label: 'Processing Type', value: invData?.processingType || '-' },
    { label: 'MO Number', value: invData?.moNumber || '-' },
    { label: 'Destination', value: invData?.destination || '-' },
    { label: 'Plan Prod Date', value: invData?.planProductionDate || '-' },
    { label: 'Buyer PO', value: invData?.buyer || '-' },
    // { label: 'Order Description', value: '-' },
    { label: 'Style', value: invData?.style || '-' },
    // { label: 'Delivery Date', value: '-' },
    { label: 'MO Line', value: invData?.moLineNumbers || '-' },
    { label: 'Co Line', value: invData?.coLine || '-' },
    // { label: 'MO Numbers', value: '-' },
  ];

  const additionalDetails = [
    // { label: 'Multicolor', value: '-' },
    { label: 'Sewing Job Quantity', value: invData?.jobQty || '-' },
    { label: 'No. of Jobs', value: invData?.noOfJobBundles?.toString() || '-' },
    // { label: 'Operations', value: '-' },
    // { label: 'Multisize', value: '-' },
    // { label: 'Logical Bundle Qty', value: '-' },
    // { label: 'Total Job Groups', value: '-' },
    { label: 'No. of Bundles', value: invData?.noOfJobBundles.toString() || '-' },
  ];

  const renderDetails = (details) => {
    const rows = [];
    for (let i = 0; i < details.length; i += 4) {
      rows.push(
        <tr key={i}>
          {details.slice(i, i + 4).map((detail, idx) => (
            <React.Fragment key={idx}>
              <td style={headerGroupStyle}>{detail.label}</td>
              <td style={cellStyle}>{detail.value}</td>
            </React.Fragment>
          ))}
        </tr>
      );
    }
    return rows;
  };

  const renderProductInfo = (productInfo: any) => {
    return (
      <div
        key={productInfo?.productColorSizeCompWiseInfo?.[0]?.productName || 'N/A'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          width: '100%',
          padding: '10px',
        }}
      >
        {Array.isArray(productInfo?.productColorSizeCompWiseInfo) &&
          productInfo.productColorSizeCompWiseInfo.map((info: any, idx: number) => {
            const jobNo = info?.componentWiseBundleInfo?.[0]?.bundleInfo?.[0]?.bundleProps?.jobNo || 'N/A';
            const productName = info?.productName || 'N/A';
            const color = info?.fgColor || 'N/A';
            const size = info?.size || 'N/A';

            return (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  marginBottom: '15px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      padding: '8px',
                      border: '1px solid grey',
                      textAlign: 'center',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  >
                    Job No : <span style={{ marginLeft: '5px' }}>{jobNo}</span>
                  </div>
                  <div
                    style={{
                      padding: '8px',
                      border: '1px solid grey',
                      textAlign: 'center',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  >
                    Product : <span style={{ marginLeft: '5px' }}>{productName}</span>
                  </div>
                  <div
                    style={{
                      padding: '8px',
                      border: '1px solid grey',
                      textAlign: 'center',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  >
                    Color : <span style={{ marginLeft: '5px' }}>{color}</span>
                  </div>
                  <div
                    style={{
                      padding: '8px',
                      border: '1px solid grey',
                      textAlign: 'center',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  >
                    Size : <span style={{ marginLeft: '5px' }}>{size}</span>
                  </div>
                </div>

                {Array.isArray(info?.componentWiseBundleInfo) &&
                  info.componentWiseBundleInfo.map((bundle: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                      <h4
                        style={{
                          margin: '0 0 5px 0',
                          color: '#555',
                          fontWeight: 'bold',
                          marginTop: '15px'
                        }}
                      >
                        Component: {bundle?.component || 'N/A'}
                      </h4>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(5, 1fr)',
                          gap: '10px',
                          marginTop: '20px',
                          marginLeft: '20px'
                        }}
                      >
                        {Array.isArray(bundle?.bundleInfo) &&
                          bundle.bundleInfo.map((bundleItem: any, idx: number) => (
                            <div
                              key={idx}
                              style={{
                                border: '1px solid black',
                                borderRadius: '4px',
                                padding: '8px',
                                backgroundColor: '#fff',
                                textAlign: 'center',
                              }}
                            >
                              {`${bundleItem?.bundleProps?.bundleNo || 'N/A'} - ${bundleItem?.rQty || bundleItem?.orgQty || 'N/A'
                                }`}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>

            );
          })}
      </div>
    );
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }


  return (

    <Modal
      visible={sheetVisible}
      onCancel={() => { setSheetVisible(false); closePopUp(); }}
      footer={null}
      closable={true}
      title={<> <Button type="primary"
        onClick={handleExportPDF}
        style={{ marginRight: '10px' }}>
        Print
      </Button></>}
      width="100vw"
      style={{ top: 0, padding: 0 }}
      bodyStyle={{
        height: '100vh',
        overflowY: 'auto',
        padding: '20px 30px',
        backgroundColor: '#ffffff',
        scrollbarWidth: 'none',
      }}
    >
      <div  id="printArea">
      <div
       
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '2px solid black'
        }}
      >
        <h1 style={{ margin: 0, textAlign: 'center', flexGrow: 1 }}>
          RM Requirement Sheet
        </h1>
        <div style={{ textAlign: 'start', flexShrink: 0 }}>
          <h6 style={{ margin: 0, fontSize: '14px' }}>
            Date: <span style={{ paddingLeft: '6px' }}>{dayjs().format('DD-MM-YYYY')}</span>
          </h6>
          <h6 style={{ margin: 0, fontSize: '14px' }}>
            Time: <span style={{ paddingLeft: '6px' }}>{dayjs().format('HH:mm:ss')}</span>
          </h6>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div
          style={{
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',

          }}
        >
          <div style={{ padding: '15px 0px', backgroundColor: 'white' }}>
            {/* Header Details Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', tableLayout: 'fixed', }}>
              <tbody>{renderDetails(headerDetails)}</tbody>
            </table>

            {/* Additional Details Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', tableLayout: 'fixed', }}>
              <tbody>{renderDetails(additionalDetails)}</tbody>
            </table>

          </div>
          <SewJobTrimsData jobNo={jobNo} />

          {bundleData.map((productData) => renderProductInfo(productData))}
          {/* <div style={{ textAlign: 'right' }}>

            <Button type="primary" onClick={() => setSheetVisible(false)}>
              Close
            </Button>
          </div> */}
        </div>

      )}
      </div>
    </Modal>
  );
}
const headerGroupStyle: React.CSSProperties = {
  fontWeight: 'bold',
  backgroundColor: '#fff',
  padding: '2px',
  border: '1px solid black',
  // paddingLeft: '20px'
  textAlign: 'center'
};

const cellStyle: React.CSSProperties = {
  fontWeight: 'normal',
  backgroundColor: '#fff',
  padding: '2px',
  border: '1px solid black',
  // paddingLeft: '20px'
  textAlign: 'center'
};

export default SewJobCompBundles;
