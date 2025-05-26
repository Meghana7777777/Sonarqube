import React, { useEffect, useState } from 'react';
import { GetModuleDetailsByModuleCodeModel, GetSectionDetailsBySectionCodeModel, IModuleIdRequest, SectionCodeRequest, SewingIJobNoRequest, SJobFgModel, TrimsGroupsModel, TrimsItemsModel } from '@xpparel/shared-models';
import { ModuleSharedService, SectionSharedService, SewingJobPlanningService, TrimsIssuedDashboardService } from '@xpparel/shared-services';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import { useAppSelector } from 'packages/ui/src/common';
import logo from '../../../../../assets/images/colorlogo.jpg';

interface TrimsSheetProps {
    jobNo: string;
    setSheetVisible: (visible: boolean) => void;
}

const TrimsSheet: React.FC<TrimsSheetProps> = ({ jobNo, setSheetVisible }) => {
    const [sectionData, setSectionData] = useState<GetSectionDetailsBySectionCodeModel>();
    const [modulesData, setModulesData] = useState<GetModuleDetailsByModuleCodeModel>();
    const [jobFgDetails, setJobFgDetails] = useState<SJobFgModel>();
    const [trimGroupsData, setTrimGroupsData] = useState<TrimsGroupsModel[]>([]);
    const [trimItemsData, setTrimItemsData] = useState<TrimsItemsModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [groupsTotalQuantity, setGroupsTotalQuantity] = useState({});
    const [groupPendingQuantity, setGroupPendingQuantity] = useState({});
    const user = useAppSelector((state) => state.user.user.user);
    const sectionServices = new SectionSharedService();
    const moduleServices = new ModuleSharedService();
    const jobNoServices = new SewingJobPlanningService();
    const TrimGroupsAndItemsService = new TrimsIssuedDashboardService();
    const JobFgDetailsServices = new SewingJobPlanningService();

    const handleExportPDF = async () => {
        const printAreaElement = document.getElementById("trimDetailsId") as HTMLElement | null;
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
        const fetchTrimGroupsAndItems = async () => {
            const request = new SewingIJobNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNo)
            try {
                setLoading(true);
                const groupsResponse = await TrimGroupsAndItemsService.getTrimSheetGroupsDataByJobNo(request);
                if (groupsResponse.status) {
                    setTrimGroupsData(groupsResponse.data);

                    const allItems: TrimsItemsModel[] = [];
                    const totalQuantities: { [key: number]: number } = {};
                    const pendingQuantities: { [key: number]: number } = {};

                    for (const group of groupsResponse.data) {
                        const itemsResponse = await TrimGroupsAndItemsService.getTrimItemsByGroupId(group.id);
                        if (itemsResponse.status) {
                            const groupItems = itemsResponse.data;
                            allItems.push(...groupItems);
                            const groupTotalQuantity = groupItems.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
                            const groupPendingQuantity = groupItems.reduce((sum, item) => sum + ((item.totalQuantity || 0) - (item.issuedQuantity || 0)), 0);
                            totalQuantities[group.id] = groupTotalQuantity;
                            pendingQuantities[group.id] = groupPendingQuantity;
                        }
                    }

                    setTrimItemsData(allItems);
                    setGroupsTotalQuantity(totalQuantities);
                    setGroupPendingQuantity(pendingQuantities);
                } else {
                    setError(`Error: ${groupsResponse.internalMessage}`);
                }
            } catch (err) {
                setError('Failed to fetch trim groups and items data.');
            } finally {
                setLoading(false);
            }
        };

        const fetchFgData = (jobNo: string) => {
            const request = new SewingIJobNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNo);
            JobFgDetailsServices.getSJobFgDataByJobNo(request).then((res) => {
                if (res.status) {
                    setJobFgDetails(res.data);
                } else {
                    console.error(error);
                }
            }).catch(err => console.log(err.message));

        };

        const fetchSectionsAndModulesData = (jobNo: string) => {
            const request = new SewingIJobNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNo);
            jobNoServices.getModuleNoByJobNo(request).then((res) => {
                if (res.status) {
                    const request = new IModuleIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, res.data.moduleNo);
                    moduleServices.getModuleDataByModuleCode(request).then((res) => {
                        if (res.status) {
                            setModulesData(res.data);
                            const secCode = res.data.secCode;
                            const request = new SectionCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, secCode);
                            sectionServices.getSectionDataBySectionCode(request).then((res) => {
                                if (res.status) {
                                    setSectionData(res.data);
                                }
                            }).catch(err => console.log(err.message));

                        }
                    }).catch(err => console.log(err.message));

                }
            }).catch(err => console.log(err.message));

        };

        fetchSectionsAndModulesData(jobNo);
        fetchTrimGroupsAndItems();
        fetchFgData(jobNo);
    }, [jobNo]);

    const getItemsByGroupAndUOM = (groupId: number) => {
        const groupItems = trimItemsData.filter(item => item.sJobTrimGroupId === groupId);
        return groupItems.reduce<{ [uom: string]: TrimsItemsModel[] }>((acc, item) => {
            if (!acc[item.uom]) {
                acc[item.uom] = [];
            }
            acc[item.uom].push(item);
            return acc;
        }, {});
    };


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

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
            <div id="trimDetailsId">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    {/* <img style={{ width: '100px' }} src={logo} alt="Logo" /> */}
                    <h1 style={{ margin: 0, textAlign: 'center', flexGrow: 1 }}>
                        Trims Requirement Sheet ({jobNo})
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
                    <>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                                <tbody>
                                    <tr>
                                        <td style={headerStyle}>
                                            <strong>Section:</strong> {sectionData?.secCode}
                                        </td>
                                        <td style={headerStyle}>
                                            <strong>Section Name:</strong> {sectionData?.secName}
                                        </td>
                                        <td style={headerStyle}>
                                            <strong>Section Head:</strong> {sectionData?.secHeadName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={headerStyle}>
                                            <strong>Module:</strong> {modulesData?.moduleCode}
                                        </td>
                                        <td style={headerStyle}>
                                            <strong>Module Name:</strong> {modulesData?.moduleName}
                                        </td>
                                        <td style={headerStyle}>
                                            <strong>Module Head:</strong> {modulesData?.moduleHeadName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={headerStyle}>
                                            <strong>Product Colors:</strong> {jobFgDetails?.fgColors}
                                        </td>
                                        <td style={headerStyle}>
                                            <strong>Product Name:</strong> {jobFgDetails?.productName}
                                        </td>
                                        <td style={headerStyle}>
                                            <strong>Sizes:</strong> {jobFgDetails?.sizes}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={headerStyle}>
                                            <strong>Quantity:</strong> {jobFgDetails?.quantity}
                                        </td>
                                        <td style={headerStyle}></td>
                                        <td style={headerStyle}></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div
                                style={{
                                    width: '160px',
                                    height: '160px',
                                    border: '1px solid grey',
                                    marginLeft: '40px',
                                    marginRight: '30px',
                                }}
                            >
                                <img
                                    src="image_url"
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        </div>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                marginBottom: '20px',
                                border: '1px solid grey',
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: '#f0f0f0' }}>
                                    <th style={headerGroupStyle}>Job No</th>
                                    <th style={headerGroupStyle}>Trim Group</th>
                                    <th style={headerGroupStyle}>Total Quantity</th>
                                    <th style={headerGroupStyle}>Pending Quantity</th>
                                    <th style={headerGroupStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trimGroupsData.map((group) => {
                                    const itemsByUOM = getItemsByGroupAndUOM(group.id);
                                    return (
                                        <React.Fragment key={group.id}>
                                            <tr>
                                                <td style={cellStyle}>{group.jobNo}</td>
                                                <td style={cellStyle}>{group.trimGroup}</td>
                                                <td style={cellStyle}>{groupsTotalQuantity[group.id] || 0}</td>
                                                <td style={cellStyle}>{groupPendingQuantity[group.id] || 0}</td>
                                                <td style={cellStyle}>{group.status}</td>
                                            </tr>

                                            {/* Nested items for each UOM */}
                                            {Object.entries(itemsByUOM).map(([uom, items]) => {
                                                const totalIssuedQuantity = items.reduce(
                                                    (sum, item) => sum + (item.issuedQuantity || 0),
                                                    0
                                                );

                                                return (
                                                    <tr key={`${group.id}-${uom}`}>
                                                        <td colSpan={5} style={{ textAlign: 'left', padding: '10px 65px' }}>
                                                            <table
                                                                style={{
                                                                    width: '100%',
                                                                    border: '1px solid black',
                                                                    borderBottom: 'none',
                                                                    borderRight: 'none',
                                                                }}
                                                            >
                                                                <thead>
                                                                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                                                                        <th style={headerCellStyle}>Item Code</th>
                                                                        <th style={headerCellStyle}>Total Quantity</th>
                                                                        <th style={headerCellStyle}>Issued Quantity</th>
                                                                        <th style={headerCellStyle}>Consumption</th>
                                                                        <th style={headerCellStyle}>UOM</th>
                                                                        <th style={headerCellStyle}>Status</th>
                                                                        <th style={headerCellStyle}>Remarks</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {items.map((item) => (
                                                                        <tr key={item.id}>
                                                                            <td style={innerCellStyle}>{item.itemCode}</td>
                                                                            <td style={innerCellStyle}>{item.totalQuantity}</td>
                                                                            <td style={innerCellStyle}>{item.issuedQuantity}</td>
                                                                            <td style={innerCellStyle}>{item.consumption}</td>
                                                                            <td style={innerCellStyle}>{item.uom}</td>
                                                                            <td style={innerCellStyle}>{item.status}</td>
                                                                            <td style={innerCellStyle}>{item.remarks || '-'}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>

                                                            <div style={{ display: 'flex', justifyContent: 'right' }}>
                                                                <h4>
                                                                    Total Issued Quantity:{' '}
                                                                    <span
                                                                        style={{
                                                                            width: '300px',
                                                                            height: '32px',
                                                                            padding: '5px 15px',
                                                                            border: '1px solid grey',
                                                                        }}
                                                                    >
                                                                        {totalIssuedQuantity}
                                                                    </span>
                                                                </h4>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
            <div style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleExportPDF} style={{marginRight:'10px'}}>
                    Download
                </Button>
                <Button type="primary" onClick={() => setSheetVisible(false)}>
                    Close
                </Button>
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
    padding: '8px 8px 8px 20px',
    border: '2px solid black',
    textAlign: 'left' as const,
};

const headerCellStyle = {

    textAlign: 'center' as const,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: '10px',
    borderBottom: '2px solid black',
    borderRight: '2px solid black',
};

const innerCellStyle = {
    padding: '8px',
    borderBottom: '2px solid black',
    borderRight: '2px solid black',
    textAlign: 'center' as const,
};

const headerGroupStyle = {
    ...cellStyle,
    fontWeight: 'bold',
    backgroundColor: '#ffff',
    padding: '10px',
    borderBottom: '2px solid black',

};

export default TrimsSheet;
