import { Checkbox, Modal } from "antd";
import { ScxCard, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { useEffect, useState } from "react";

export const RequestStatus = () => {
    const [pendingRequest, setPendingRequest] = useState<any[]>([]);
    const [acknowledge, setAcknowledge] = useState<any[]>([]);
    const [inProgress, setInProgress] = useState<any[]>([]);
    const [completed, setCompleted] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [nextStatus, setNextStatus] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    // const [updateStatus, setUpdateStatus] = useState(false);

    const handleModal = (status) => {
        setShowModal(true);
        setNextStatus(status)
    };



    const handleStatusClick = (status) => {
        if (selectedData) {
            if (selectedData.status === "Pending Requests") {
                setPendingRequest((prevPending) =>
                    prevPending.filter((data) => data["rollNo"] !== selectedData["rollNo"])
                );
            } else if (selectedData.status === "Acknowledge") {
                setAcknowledge((prevAcknowledge) =>
                    prevAcknowledge.filter((data) => data["rollNo"] !== selectedData["rollNo"])
                );
            } else if (selectedData.status === "In Progress") {
                setInProgress((prevInProgress) =>
                    prevInProgress.filter((data) => data["rollNo"] !== selectedData["rollNo"])
                );
            }
            if (status === "Acknowledge") {
                setAcknowledge((prevAcknowledge) => [...prevAcknowledge, selectedData]);
            } else if (status === "In Progress") {
                setInProgress((prevInProgress) => [...prevInProgress, selectedData]);
            } else if (status === "Completed") {
                setCompleted((prevCompleted) => [...prevCompleted, selectedData]);
            }

            setShowModal(false);
            setSelectedData(null);
        }
    };
    const statusUpdate = [
        {
            "rollNo": 3636,
            "created at": "2-2-2",
            // status: RequestStatusEnum.PENDING_REQUESTS,
            'status': 'Pending Requests'
        },
        {
            "rollNo": 36367,
            "created at": "2-2-2",
            // status: RequestStatusEnum.ACKNOWLEGE,
            'status': 'Acknowledge'
        },
        {
            "rollNo": 36365,
            "created at": "2-2-2",
            // status: RequestStatusEnum.IN_PROGRESS,
            'status': 'Completed'
        },
        {
            "rollNo": 3696,
            "created at": "2-2-2",
            // status: RequestStatusEnum.COMPLETED,
            'status': 'In Progress'
        },
        {
            "rollNo": 388636,
            "created at": "2-2-2",
            // status: RequestStatusEnum.PENDING_REQUESTS,
            'status': 'Pending Requests'
        },
    ];

    const filterDataByStatus = (status: string) => {
        return statusUpdate.filter((data) => data.status === status);
    };

    const updateStatus = () => {
        setPendingRequest(filterDataByStatus("Pending Requests"));
        setAcknowledge(filterDataByStatus("Acknowledge"));
        setInProgress(filterDataByStatus("In Progress"));
        setCompleted(filterDataByStatus("Completed"));
    };

    useEffect(() => {
        updateStatus();
    }, []);

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    return (
        <ScxCard>
            <ScxRow>
                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                    <ScxCard
                        title={<div style={{ textAlign: "center" }}>Pending Requests</div>}
                        style={{ height: "90vh", marginRight: '1rem' }}
                    >
                        <ScxRow gutter={[16, 16]}>

                            {pendingRequest?.map((data) => (
                                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}
                                    onClick={() => {
                                        setSelectedData({ ...data, status: "Pending Requests" });
                                        handleModal("Acknowledge")
                                    }}

                                    style={{
                                        margin: '7px',
                                        textAlign: "center",
                                        borderStyle: "solid",
                                        borderRadius: "5px",
                                        backgroundColor: 'gray',
                                        borderWidth: '0px',
                                        height: '30px',
                                        width: '80px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                    }}
                                    key={data["rollNo"]}
                                >
                                    <div style={{ marginTop: '5px', color: 'white', fontWeight: '500' }}>{data["rollNo"]}</div>
                                    {/* <div>Created At: {data["created at"]}</div> */}
                                </ScxColumn>
                            ))}
                        </ScxRow>
                    </ScxCard>
                </ScxColumn>
                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                    <ScxCard
                        title={<div style={{ textAlign: "center" }}>Acknowledge</div>}
                        style={{ height: "90vh", marginRight: '1rem' }}
                    >
                        <ScxRow>
                            {acknowledge?.map((data) => (
                                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}
                                    onClick={() => {
                                        setSelectedData({ ...data, status: "Acknowledge" });
                                        handleModal("In Progress");
                                    }}
                                    style={{
                                        margin: '7px',
                                        textAlign: "center",
                                        borderStyle: "solid",
                                        borderRadius: "5px",
                                        backgroundColor: 'gray',
                                        borderWidth: '0px',
                                        height: '30px',
                                        width: '80px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                    }}
                                    key={data["rollNo"]}
                                >
                                    <div style={{ marginTop: '5px', color: 'white', fontWeight: '500' }}>{data["rollNo"]}</div>
                                    {/* <div>Created At: {data["created at"]}</div> */}
                                </ScxColumn>
                            ))}
                        </ScxRow>
                    </ScxCard>
                </ScxColumn>
                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                    <ScxCard
                        title={<div style={{ textAlign: "center" }}>In Progress</div>}
                        style={{ height: "90vh", marginRight: '1rem' }}
                    >
                        <ScxRow>
                            {inProgress?.map((data) => (
                                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}
                                    onClick={() => {
                                        setSelectedData({ ...data, status: "In Progress" });
                                        handleModal("Completed");
                                    }}
                                    style={{
                                        margin: '7px',
                                        textAlign: "center",
                                        borderStyle: "solid",
                                        borderRadius: "5px",
                                        backgroundColor: 'gray',
                                        borderWidth: '0px',
                                        height: '30px',
                                        width: '80px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                    }}
                                    key={data["rollNo"]}
                                >
                                    <div style={{ marginTop: '5px', color: 'white', fontWeight: '500' }}>{data["rollNo"]}</div>
                                    {/* <div>Created At: {data["created at"]}</div> */}
                                </ScxColumn>
                            ))}
                        </ScxRow>
                    </ScxCard>
                </ScxColumn>
                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                    <ScxCard
                        title={<div style={{ textAlign: "center" }}>Completed</div>}
                        style={{ height: "90vh", marginRight: '1rem' }}
                    >
                        <ScxRow>
                            {completed?.map((data) => (
                                <ScxColumn xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}
                                    onClick={() => {
                                        setSelectedData({ ...data, status: "Completed" });
                                    }}
                                    style={{
                                        margin: '7px',
                                        textAlign: "center",
                                        borderStyle: "solid",
                                        borderRadius: "5px",
                                        backgroundColor: 'gray',
                                        borderWidth: '0px',
                                        height: '30px',
                                        width: '80px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                    }}
                                    key={data["rollNo"]}
                                >
                                    <p style={{ marginTop: '5px', color: 'white', fontWeight: '500' }}>{data["rollNo"]}</p>
                                    {/* <div>Created At: {data["created at"]}</div> */}
                                </ScxColumn>
                            ))}
                        </ScxRow>
                    </ScxCard>
                </ScxColumn>
            </ScxRow>
            <Modal open={showModal} onCancel={() => { setShowModal(false); }} footer={null}>
                <div>
                    {nextStatus === "Acknowledge" && (
                        <>
                            <button style={{ marginRight: "1rem" }} onClick={() => handleStatusClick("Acknowledge")}>
                                Acknowledge
                            </button>
                            <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
                                Click To Change Status
                            </Checkbox>
                        </>
                    )}
                    {nextStatus === "In Progress" && (
                        <>
                            <button style={{ marginRight: "1rem" }} onClick={() => handleStatusClick("In Progress")}>
                                In Progress
                            </button>
                            <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
                                Click To Change Status
                            </Checkbox>
                        </>
                    )}
                    {nextStatus === "Completed" && (
                        <div style={{ alignItems: 'center' }}>
                            <button style={{ marginRight: "1rem" }} onClick={() => handleStatusClick("Completed")}>
                                Completed
                            </button>
                            <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
                                Click To Change Status
                            </Checkbox>
                        </div>
                    )}
                </div>
            </Modal>
        </ScxCard>
    );
};


