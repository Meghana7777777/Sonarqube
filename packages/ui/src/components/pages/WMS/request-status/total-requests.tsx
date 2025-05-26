import { ScxCard, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib"
import { RequestCard } from "./request-component"
import { RequestStatusEnum } from "@xpparel/shared-models"
import { useEffect, useState } from "react"

export const TotalRequests = () => {
    const [pendingRequest, setPendingRequest] = useState<any[]>([]);
    const [acknowledge, setAcknowledge] = useState<any[]>([]);
    const [inProgress, setInProgress] = useState<any[]>([]);
    const [completed, setCompleted] = useState<any[]>([]);
    // const service = new InspectionService()

    useEffect(() => {
        updateStatus();
        getDataAgainstToStatus();
    }, []);


    const getDataAgainstToStatus = () => {
        // service.getRequestStatus().then((res) => {
        //     if (res.status) {
        //         const filterDataByStatus = (status: string) => {
        //             return statusUpdate.filter((data) => data.status === status);
        //         };
        //         setPendingRequest(filterDataByStatus(RequestStatusEnum.PENDING_REQUESTS));
        //         setAcknowledge(filterDataByStatus(RequestStatusEnum.ACKNOWLEGE));
        //         setInProgress(filterDataByStatus(RequestStatusEnum.IN_PROGRESS));
        //         setCompleted(filterDataByStatus(RequestStatusEnum.COMPLETED));
        //     }
        // }).catch((err) => {
        //     console.log(err.message);
        // })
    }

    const statusUpdate = [
        {
            "rollNo": 3636,
            "createdAt": "2-2-2",
            status: RequestStatusEnum.PENDING_REQUESTS,
        },
        {
            "rollNo": 36367,
            "createdAt": "2-2-2",
            status: RequestStatusEnum.PENDING_REQUESTS,
        },
        {
            "rollNo": 36365,
            "createdAt": "2-2-2",
            status: RequestStatusEnum.PENDING_REQUESTS,
        },
        {
            "rollNo": 3696,
            "createdAt": "2-2-2",
            status: RequestStatusEnum.PENDING_REQUESTS,
        },
        {
            "rollNo": 388636,
            "createdAt": "2-2-2",
            status: RequestStatusEnum.PENDING_REQUESTS,
        },
    ];

    const filterDataByStatus = (status: string) => {
        return statusUpdate.filter((data) => data.status === status);
    };

    const updateStatus = () => {
        setPendingRequest(filterDataByStatus(RequestStatusEnum.PENDING_REQUESTS));
        setAcknowledge(filterDataByStatus(RequestStatusEnum.ACKNOWLEGE));
        setInProgress(filterDataByStatus(RequestStatusEnum.IN_PROGRESS));
        setCompleted(filterDataByStatus(RequestStatusEnum.COMPLETED));
    };

    return (
            <ScxRow >
                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} >
                    <RequestCard title={RequestStatusEnum.PENDING_REQUESTS} statusRequest={pendingRequest} requestType={RequestStatusEnum.ACKNOWLEGE} getDataAgainstToStatus={getDataAgainstToStatus} />
                </ScxColumn>
                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} >
                    <RequestCard title={RequestStatusEnum.ACKNOWLEGE} statusRequest={acknowledge} requestType={RequestStatusEnum.IN_PROGRESS} getDataAgainstToStatus={getDataAgainstToStatus} />
                </ScxColumn>
                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} >
                    <RequestCard title={RequestStatusEnum.IN_PROGRESS} statusRequest={inProgress} requestType={RequestStatusEnum.COMPLETED} getDataAgainstToStatus={getDataAgainstToStatus} />
                </ScxColumn>
                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} >
                    <RequestCard title={RequestStatusEnum.COMPLETED} statusRequest={completed} />
                </ScxColumn>
            </ScxRow>
    )
}