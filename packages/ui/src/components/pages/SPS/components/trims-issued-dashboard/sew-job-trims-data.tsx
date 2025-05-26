import React, { useEffect, useState } from 'react';
import { GetModuleDetailsByModuleCodeModel, GetSectionDetailsBySectionCodeModel, IModuleIdRequest, SectionCodeRequest, SewingIJobNoRequest, SJobFgModel, TrimsGroupsModel, TrimsItemsModel } from '@xpparel/shared-models';
import { ModuleSharedService, SectionSharedService, SewingJobPlanningService, TrimsIssuedDashboardService } from '@xpparel/shared-services';
import { Button, Modal, Typography } from 'antd';
import dayjs from 'dayjs';
import { useAppSelector } from 'packages/ui/src/common';
import logo from '../../../../../assets/images/colorlogo.jpg'

const { Title } = Typography;

interface TrimsSheetProps {
    jobNo: string;

}

const SewJobTrimsData: React.FC<TrimsSheetProps> = ({ jobNo }) => {
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

    useEffect(() => {

        if (jobNo) {
            fetchSectionsAndModulesData(jobNo);
            fetchTrimGroupsAndItems(jobNo);
            fetchFgData(jobNo);
        }
    }, [jobNo]);
    const fetchTrimGroupsAndItems = async (jobNumber: string) => {
        const request = new SewingIJobNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber)
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
        });
    };

    const fetchSectionsAndModulesData = (jobNo: string) => {
        const request = new SewingIJobNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNo);
        jobNoServices.getModuleNoByJobNo(request).then((res) => {
            if (res.status) {
                const request = new IModuleIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, res.data.moduleNo);
                moduleServices.getModuleDataByModuleCode(request).then((res) => {
                    if (res.status) {
                        setModulesData(res.data);
                        // const secCode = res.data.secCode;
                        // const request = new SectionCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, secCode);
                        // sectionServices.getSectionDataBySectionCode(request).then((res) => {
                        //     if (res.status) {
                        //         setSectionData(res.data);
                        //     }
                        // });
                    }
                });
            }
        });
    };
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
        <div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <Title level={3} style={{ textAlign: 'left', marginBottom: '15px' }}>
                        Job Details:
                    </Title>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <tbody>
                                {/* <tr>
                                    <td style={headerStyle}>
                                        <strong>Section :</strong> {sectionData?.secCode}
                                    </td>
                                    <td style={headerStyle}>
                                        <strong>Section Name :</strong> {sectionData?.secName}
                                    </td>
                                    <td style={headerStyle}>
                                        <strong>Section Head :</strong> {sectionData?.secHeadName}
                                    </td>
                                </tr> */}
                                <tr>
                                    <td style={headerStyle}>
                                        <strong>Module :</strong> {modulesData?.moduleCode}
                                    </td>
                                    <td style={headerStyle}>
                                        <strong>Module Name :</strong> {modulesData?.moduleName}
                                    </td>
                                    <td style={headerStyle}>
                                        <strong>Module Head :</strong> {modulesData?.moduleHeadName}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={headerStyle}>
                                        <strong>Product Colors :</strong> {jobFgDetails?.fgColors}
                                    </td>
                                    <td style={headerStyle}>
                                        <strong>Product Name :</strong> {jobFgDetails?.productName}
                                    </td>
                                    <td style={headerStyle}>
                                        <strong>Sizes :</strong> {jobFgDetails?.sizes}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={headerStyle}>
                                        <strong>Quantity :</strong> {jobFgDetails?.quantity}
                                    </td>
                                    <td style={headerStyle}></td>
                                    <td style={headerStyle}></td>
                                </tr>
                            </tbody>
                        </table>

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
    );
}

const cellStyle = {
    padding: '2px',
    border: '2px solid black',
    textAlign: 'center' as const,
};

const headerStyle = {
    padding: '2px',
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
    padding: '2px',
    borderBottom: '2px solid black',
    borderRight: '2px solid black',
    textAlign: 'center' as const,
};

const headerGroupStyle = {
    ...cellStyle,
    fontWeight: 'bold',
    backgroundColor: '#ffff',
    padding: '2px',
    borderBottom: '2px solid black',

};

export default SewJobTrimsData;
