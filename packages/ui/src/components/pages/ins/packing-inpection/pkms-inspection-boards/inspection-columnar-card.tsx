import { ReloadOutlined } from "@ant-design/icons";
import { InsInspectionBasicInfoModel, InsInspectionActivityStatusEnum, InsPackListAndPoIdsReqDto, PKMSPendingMaterialResponse, PackActivityStatusEnum, PackFabricInspectionRequestCategoryEnum, PackListAndPoIdsReqDto } from "@xpparel/shared-models";
import { Button, Card, Row, Space, Tooltip, notification } from "antd";
import { FabricInspectionInfoService, FgInspectionInfoService, InspectionPreferenceService, InsService } from "@xpparel/shared-services";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../../../common";
import { AlertMessages } from "../../../../common";
import { PKMSInspectionInfoCard } from "./inspection-info-card";


interface InspectionColumnarCardProps {

    columnarHeading: string;
    inspectionCurrentActivity: InsInspectionActivityStatusEnum;
    typeOfInspection: PackFabricInspectionRequestCategoryEnum;
    refreshKey?: number;
    reloadDashboard: () => void;
    searchData: string;
    selectedSearchData: {
        poNumber: number;
        packListNo: number;
    }
}

const TOTAL_REC_COUNT = 40;
const scrollFieldRef: any = React.createRef();


export const PKMSInspectionColumnarCard = (props: InspectionColumnarCardProps) => {

    const [scrollableContainerRef] = useState<any>(useRef(null));
    const { searchData, selectedSearchData, inspectionCurrentActivity, typeOfInspection,
        refreshKey, columnarHeading,
        reloadDashboard, } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [fromRecord] = useState<any>(useRef(0));
    const checkedBatchCodes = useRef(new Set<string>());
    const inspectionPreferenceService = new InspectionPreferenceService();
    const fabricInspectionInfoService = new FgInspectionInfoService();
    const [insPendingMaterials, setPendingMaterials] = useState<PKMSPendingMaterialResponse[]>()


    useEffect(() => {
        const container = scrollableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, true);
        } else {
            window.removeEventListener('scroll', handleScroll);

        }
        getInspectionMaterialPendingData(selectedSearchData?.poNumber, selectedSearchData?.packListNo, false)
    }, [refreshKey]);

    // useEffect(() => {
    //     getInspectionMaterialPendingData(selectedSearchData?.poNumber, selectedSearchData?.packListNo, false)
    // }, [selectedSearchData]) 

    
    const getInspectionMaterialPendingData = (poId: number, pkListId: number, loadStatus: boolean) => {

        let req: InsPackListAndPoIdsReqDto;
        if (loadStatus) {
            req = new InsPackListAndPoIdsReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poId, pkListId, inspectionCurrentActivity, typeOfInspection, 0, TOTAL_REC_COUNT);
        }
        else {
            req = new InsPackListAndPoIdsReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poId, pkListId, inspectionCurrentActivity, typeOfInspection, fromRecord.current, TOTAL_REC_COUNT);
        }

        fabricInspectionInfoService.getInspectionMaterialPendingData(req)
            .then(res => {
                if (res.status) {
                    if (res.data.length === 0) {
                        notification.error({ message: 'NO Data Found!' });
                    }
                    
                    setPendingMaterials(prev => {
                        const safePrev = Array.isArray(prev) ? prev : [];
                        const total = filterIrsInfo(res.data, safePrev);
                        fromRecord.current = total.length;
                        return total;
                    });
                    
                } else {
                    setPendingMaterials([]);
                }
            })
            .catch(err => AlertMessages.getErrorMessage(err.message));

    }


    //for filtering data
    function filterIrsInfo(newData: PKMSPendingMaterialResponse[], existingData: PKMSPendingMaterialResponse[]) {
        const ids = existingData?.map(rec => rec.insReqId);
        const nonExistData: PKMSPendingMaterialResponse[] = [];

        newData?.forEach(rec => {
            if (!ids?.includes(rec.insReqId)) {
                nonExistData.push(rec);
            }
        });

        return [...existingData, ...nonExistData];
    }

    function renderIrCards(insMaterials: PKMSPendingMaterialResponse[]) {
        return (
            <>
                {
                    insMaterials?.map(req => {
                        return <PKMSInspectionInfoCard reloadDashboard={reloadDashboard} inspectionRollsInfo={req} typeOfInspection={typeOfInspection} insProgress={inspectionCurrentActivity} searchData={searchData} />
                    })
                }
            </>
        );
    }

    // Declare lastscroll outside the handleScroll function
    let lastscroll = false;
    //function to handle scroll
    const handleScroll = (event) => {
        const container = scrollableContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = event.target;

            // Check if the user has scrolled to the end
            const threshold = clientHeight * 0.1;

            if (scrollTop + clientHeight > scrollHeight - threshold) {
                // Allow for a small tolerance
                if (!lastscroll) {
                    //("Reached the end...", irsInfo);
                    // Trigger data fetch or other actions here
                    getInspectionMaterialPendingData(selectedSearchData?.poNumber, selectedSearchData?.packListNo, false)
                    lastscroll = true; // Prevent multiple triggers
                }
            } else {
                lastscroll = false; // Reset when scrolling up or if not at the end
            }
        }
    };

    return (
        <div>
            <Card
                size="small" style={{ textAlign: "center" }}
                headStyle={{ background: "#eee" }}

                bodyStyle={{ height: "80vh", overflowY: "scroll" }}
                ref={scrollableContainerRef}

                title={
                    <div style={{ display: "inline-flex", alignItems: "center" }}>
                        <span>{columnarHeading}</span>
                    </div>
                }
                extra={
                    <Space>
                        <Tooltip title="Load All Data">
                            <Button
                                onClick={() => {
                                    getInspectionMaterialPendingData(selectedSearchData?.poNumber, selectedSearchData?.packListNo, true)
                                }}
                                icon={<ReloadOutlined />}
                                style={{ fontSize: '16px' }}
                            />
                        </Tooltip>
                    </Space>
                }
            >
                <Row gutter={4}>
                    {renderIrCards(insPendingMaterials)}
                </Row>
            </Card>
        </div>
    );
};

