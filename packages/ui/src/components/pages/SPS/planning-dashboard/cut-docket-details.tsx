import { GetModuleDetailsByModuleCodeModel, GetSectionDetailsBySectionCodeModel, IModuleIdRequest, SectionCodeRequest, SewingIJobNoRequest, SJobFgModel } from '@xpparel/shared-models';
import { ModuleSharedService, SectionSharedService, SewingJobPlanningService } from '@xpparel/shared-services';
import { Button, Modal } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import React, { useEffect, useState } from 'react';
import logo from '../../../../assets/images/colorlogo.jpg';
import dayjs from 'dayjs';

interface DocketSheetProps {
    setSheetVisible: (visible: boolean) => void;
}

const DocketSheet: React.FC<DocketSheetProps> = ({ setSheetVisible }) => {
    const user = useAppSelector((state) => state.user.user.user);
    const JobFgDetailsServices = new SewingJobPlanningService();
    const [jobFgDetails, setJobFgDetails] = useState<SJobFgModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sectionData, setSectionData] = useState<GetSectionDetailsBySectionCodeModel | null>(null);
    const [modulesData, setModulesData] = useState<GetModuleDetailsByModuleCodeModel | null>(null);
    const sectionServices = new SectionSharedService();
    const moduleServices = new ModuleSharedService();
    const jobNoServices = new SewingJobPlanningService();
    const jobNo = 'SJ-1-1';

    const colorSizeCutPanelInfo = {
        jobNumber: "JOB55443",
        fgColor: "Purple",
        size: "S",
        productName: "Sweater",
        cutEligibleQty: 40,
        requiredQty: 60,
        cutBundleInfo: [
            { poSerial: "PO007", docketNumber: "DN001", bundleNumber: "B049", component: "Body", cutNumber: "C049", quantity: 10 },
            { poSerial: "PO007", docketNumber: "DN001", bundleNumber: "B050", component: "Sleeve", cutNumber: "C050", quantity: 15 },
            { poSerial: "PO007", docketNumber: "DN002", bundleNumber: "B051", component: "Collar", cutNumber: "C051", quantity: 20 },
            { poSerial: "PO007", docketNumber: "DN002", bundleNumber: "B052", component: "Cuff", cutNumber: "C052", quantity: 10 },
            { poSerial: "PO007", docketNumber: "DN002", bundleNumber: "B053", component: "Tag", cutNumber: "C053", quantity: 5 },
            { poSerial: "PO007", docketNumber: "DN003", bundleNumber: "B054", component: "Label", cutNumber: "C054", quantity: 10 },
            { poSerial: "PO007", docketNumber: "DN003", bundleNumber: "B055", component: "Pocket", cutNumber: "C055", quantity: 5 },
            { poSerial: "PO007", docketNumber: "DN003", bundleNumber: "B056", component: "Hem", cutNumber: "C056", quantity: 5 }
        ]
    };

    const handleExportPDF = async () => {
        const printAreaElement = document.getElementById("cutDetailsId") as HTMLElement | null;
        const divContents = printAreaElement?.innerHTML ?? "";
        const element = window.open("", "", "height=700, width=1070");
        element?.document.write(divContents);
        element?.document.close();
        setTimeout(() => {
            element?.print();
            element?.close();
        }, 1000);
    };

    useEffect(() => {
        if (!jobNo) return;

        const fetchFgData = async (jobNo: string) => {
            try {
                setLoading(true);
                const request = new SewingIJobNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNo);
                const res = await JobFgDetailsServices.getSJobFgDataByJobNo(request);
                if (res.status) {
                    setJobFgDetails(res.data);
                } else {
                    console.error(res.errorCode);
                }
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        const fetchSectionsAndModulesData = async (jobNo: string) => {
            try {
                const request = new SewingIJobNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNo);
                const res = await jobNoServices.getModuleNoByJobNo(request);
                if (res.status) {
                    const moduleRequest = new IModuleIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, res.data.moduleNo);
                    const moduleRes = await moduleServices.getModuleDataByModuleCode(moduleRequest);
                    if (moduleRes.status) {
                        setModulesData(moduleRes.data);
                        const secCode = moduleRes.data.secCode
                        const request = new SectionCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, secCode);
                        sectionServices.getSectionDataBySectionCode(request).then((res) => {
                            if (res.status) {
                                setSectionData(res.data)
                            }
                        })
                    }
                }
            } catch (err) {
                setError('Failed to fetch section/module data.');
            }
        };

        fetchSectionsAndModulesData(jobNo);
        fetchFgData(jobNo);
    }, [jobNo, user]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    const groupedData = colorSizeCutPanelInfo.cutBundleInfo.reduce((acc, item) => {
        if (!acc[item.docketNumber]) {
            acc[item.docketNumber] = [];
        }
        acc[item.docketNumber].push(item);
        return acc;
    }, {} as Record<string, typeof colorSizeCutPanelInfo.cutBundleInfo>);

    return (
        <Modal
            open={true}
            onCancel={() => setSheetVisible(false)}
            footer={null}
            closable={true}
            width="100vw"
            style={{ top: 0, padding: 0 }}
            styles={{
                body: {
                    height: '100vh',
                    overflowY: 'auto',
                    padding: '20px',
                    backgroundColor: '#ffffff',
                    scrollbarWidth: 'none',
                },
            }}
        >
            <div id="cutDetailsId">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    {/* <img style={{ width: '100px' }} src={logo} /> */}
                    <h1 style={{ margin: 0, textAlign: 'center', flexGrow: 1 }}>Cut Panels Requirement Sheet</h1>
                    <div style={{ textAlign: 'start', flexShrink: 0 }}>
                        <h6 style={{ margin: 0, fontSize: '14px' }}>
                            Date: <span style={{ paddingLeft: '6px' }}>{dayjs().format('DD-MM-YYYY')}</span>
                        </h6>
                        <h6 style={{ margin: 0, fontSize: '14px' }}>
                            Time: <span style={{ paddingLeft: '6px' }}>{dayjs().format('HH:mm:ss')}</span>
                        </h6>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <tbody>
                            <tr>
                                <td style={headerStyle}><strong>Section :</strong> {sectionData?.secCode}</td>
                                <td style={headerStyle}><strong>Section Name :</strong> {sectionData?.secName}</td>
                                <td style={headerStyle}><strong>Section Head :</strong> {sectionData?.secHeadName}</td>
                            </tr>
                            <tr>
                                <td style={headerStyle}><strong>Module :</strong> {modulesData?.moduleCode}</td>
                                <td style={headerStyle}><strong>Module Name :</strong> {modulesData?.moduleName}</td>
                                <td style={headerStyle}><strong>Module Head :</strong> {modulesData?.moduleHeadName}</td>
                            </tr>
                            <tr>
                                <td style={headerStyle}><strong>Product Colors :</strong> {jobFgDetails?.fgColors ?? 'N/A'}</td>
                                <td style={headerStyle}><strong>Product Name :</strong> {jobFgDetails?.productName ?? 'N/A'}</td>
                                <td style={headerStyle}><strong>Sizes :</strong> {jobFgDetails?.sizes ?? 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style={headerStyle}><strong>Quantity :</strong> {jobFgDetails?.quantity}</td>
                                <td style={headerStyle}></td>
                                <td style={headerStyle}></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ width: '160px', height: '160px', border: '1px solid grey', marginLeft: '40px', marginRight: '30px' }}>
                        <img src="image_url" alt="Product_logo" style={{ width: '100%', height: '100%' }} />
                    </div>
                </div>

                {Object.keys(groupedData).map((docketNumber) => (
                    <div key={docketNumber}>
                        <h3 style={{ marginBottom: '10px' }}>Docket Number: {docketNumber}</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid grey' }}>
                            <thead>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={headerGroupStyle}>PO Serial</th>
                                    <th style={headerGroupStyle}>Docket No</th>
                                    <th style={headerGroupStyle}>Bundle No</th>
                                    <th style={headerGroupStyle}>Component</th>
                                    <th style={headerGroupStyle}>Cut No</th>
                                    <th style={headerGroupStyle}>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedData[docketNumber].map((item, index) => (
                                    <tr key={index}>
                                        <td style={cellStyle}>{item.poSerial}</td>
                                        <td style={cellStyle}>{item.docketNumber}</td>
                                        <td style={cellStyle}>{item.bundleNumber}</td>
                                        <td style={cellStyle}>{item.component}</td>
                                        <td style={cellStyle}>{item.cutNumber}</td>
                                        <td style={cellStyle}>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <div style={{ textAlign: 'right', marginRight: '40px' }}>
                <Button style={{ marginRight: '10px' }} onClick={handleExportPDF}>Print</Button>
                <Button type='primary' onClick={() => setSheetVisible(false)}>Close</Button>
            </div>

        </Modal>
    );
};

const cellStyle = {
    padding: '8px',
    border: '2px solid black',
    textAlign: 'center' as const,
};

const headerStyle = {
    padding: '10px',
    border: '1px solid grey',
    backgroundColor: '#ffff',
};
const headerGroupStyle = {
    ...cellStyle,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
};

export default DocketSheet;
