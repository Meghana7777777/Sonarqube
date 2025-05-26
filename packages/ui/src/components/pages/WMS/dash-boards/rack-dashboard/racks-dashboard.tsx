import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, RacksCreationModel } from "@xpparel/shared-models";
import { RacksServices } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { ScxCard, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../common";
import { EmptySquareBin } from "./empty-square-bins";
import { LoadStatusInRack } from "./packlist-item-boxes";
import { RackList } from "./racks-list";
import DonutChart from "./racks-storage-donut";

export const RacksDashboard = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [racksData, setRacksData] = useState<RacksCreationModel[]>([]);
    const [searchedText, setSearchedText] = useState("");
    const [activeTab, setActiveTab] = useState('received');
    const [selectedRack, setSelectedRack] = useState<number | null>(null);
    const rackService = new RacksServices();


    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    useEffect(() => {
        getAllRacks();
    }, [])

    const getAllRacks = () => {
        const commonReq = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        rackService.getAllRacksData(commonReq).then(res => {
            if (res.status) {
                setRacksData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        });
    }


    const dummyData2 = [
        {
            tabName: "received",
            palletNo: "888",
            status: "Received",
        },
        {
            tabName: "sent",
            palletNo: "999",
            status: "Sent",
        },
        {
            tabName: "expected",
            palletNo: "777",
            status: "Expected",
        },
        {
            tabName: "expected",
            palletNo: "787",
            status: "Expected",
        },
        {
            tabName: "sent",
            palletNo: "667",
            status: "Sent",
        },
        {
            tabName: "received",
            palletNo: "333",
            status: "Received",
        },
    ];

    const handleCheckboxChange = (rackNo: number) => {
        if (selectedRack === rackNo) {
            setSelectedRack(null);
        } else {
            setSelectedRack(rackNo);
        }
    };

    return (
        <ScxCard style={{ borderRadius: '8px', backgroundColor: '#f0f0f0' }}>
            <ScxRow>
                <ScxCard style={{ width: '69vw', borderRadius: '10px' }}>
                    <ScxRow>
                        <ScxColumn xs={24} lg={12}>
                            <h1 style={{ fontSize: '24px', fontWeight: '500', marginTop: '3px' }}>Warehouse Logistics</h1>
                        </ScxColumn>
                        <ScxColumn xs={24} lg={12}>
                            <div style={{ position: 'relative', height: '35px', marginLeft: '40px' }}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchedText}
                                    onChange={(e) => setSearchedText(e.target.value)}
                                    style={{
                                        marginBottom: '10px',
                                        borderRadius: '8px',
                                        paddingLeft: '10px',
                                        border: '1px solid #ccc',
                                        outline: 'none',
                                        width: '60%',
                                        height: '100%',
                                        backgroundColor: '#f0f0f0',
                                        flex: '1'
                                    }}
                                />
                                <SearchOutlined
                                    style={{
                                        position: 'absolute',
                                        top: '36%',
                                        right: '10px',
                                        marginRight: '210px',
                                        marginTop: '5px',
                                        transform: 'translateY(-50%)',
                                        fontSize: '16px',
                                        color: '#999',
                                    }}
                                />
                            </div>
                        </ScxColumn>
                    </ScxRow>
                    <ScxRow>
                        <ScxColumn span={16}>
                            {selectedRack && (
                                <h1>
                                    Rack {selectedRack}
                                </h1>
                            )}
                        </ScxColumn>
                        <ScxColumn span={6}>
                            <h1 >{formattedDate}<CalendarOutlined style={{ fontSize: '20px', marginLeft: '15px', color: 'gray', marginBottom: '4px' }} /></h1>
                        </ScxColumn>
                    </ScxRow>
                    <ScxRow>
                        <ScxColumn>
                            <ScxRow style={{ width: '100%' }}>
                                <EmptySquareBin lRackId={selectedRack} />
                            </ScxRow>
                        </ScxColumn>
                    </ScxRow>
                    <ScxRow>
                        <ScxColumn >
                            <p style={{
                                borderStyle: "solid",
                                borderWidth: "0px",
                                borderRadius: "5px",
                                backgroundColor: '#EAF6F7 ',
                                height: "30px",
                                width: "30px",
                                marginLeft: '10px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                            }}>
                            </p>
                        </ScxColumn>
                        <ScxColumn>
                            <p style={{ marginLeft: '20px', fontSize: '13px', color: 'gray', fontWeight: '500', marginTop: '20px' }}>Free Place</p>
                        </ScxColumn>
                        <ScxColumn>
                            <p style={{
                                borderStyle: "solid",
                                borderWidth: "0px",
                                borderRadius: "5px",
                                backgroundColor: '#E4EA13 ',
                                height: "30px",
                                width: "30px",
                                marginLeft: '20px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                            }}>
                            </p>
                        </ScxColumn>
                        <ScxColumn>
                            <p style={{ marginLeft: '20px', fontSize: '13px', color: 'gray', fontWeight: '500', marginTop: '20px' }}>Loaded Place</p>
                        </ScxColumn>
                    </ScxRow>
                    <ScxRow>
                        <ScxColumn span={18}>
                            <h1 style={{ fontSize: '15px' }}>List Of Racks</h1>
                        </ScxColumn>
                        <ScxColumn span={6}>
                        </ScxColumn>
                    </ScxRow>
                    <ScxRow>
                        <ScxColumn span={24}>
                            {racksData.map((data) => (
                                <RackList
                                    key={data.name}
                                    rackNo={data.name}
                                    // date={data.}
                                    storagePercentage={data.id}
                                    checked={selectedRack === data.id}
                                    onCheckboxChange={() => handleCheckboxChange(data.id)}
                                />
                            ))}
                        </ScxColumn>
                    </ScxRow>
                </ScxCard>
                <div>
                    <ScxCard style={{
                        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4PojmMKRUa4tsGqj-7_TtYGxoc7MN5Ns53w&usqp=CAU")', height: '400px', width: '400px', borderRadius: '8px', marginLeft: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }}>
                        <h1 style={{ color: 'white', fontSize: '15px', fontWeight: '600', textAlign: 'center' }}>Rack 001 Useage</h1>
                        <DonutChart storagePercentage={80} />
                        <ScxRow>
                            <ScxColumn span={12}>
                                <h1 style={{ color: 'white', fontSize: '15px', fontWeight: '600', textAlign: 'center', marginBottom: '2px' }}>Loaded Bins</h1>
                            </ScxColumn>
                            <ScxColumn span={12}>
                                <h1 style={{ color: 'white', fontSize: '15px', fontWeight: '600', textAlign: 'center', marginBottom: '2px' }}>Empty Bins</h1>
                            </ScxColumn>
                        </ScxRow>
                        <ScxRow>
                            <ScxColumn span={12}>
                                <h1 style={{ color: 'white', fontSize: '15px', fontWeight: '600', textAlign: 'center', marginTop: '0px' }}>80</h1>
                            </ScxColumn>
                            <ScxColumn span={12}>
                                <h1 style={{ color: 'white', fontSize: '15px', fontWeight: '600', textAlign: 'center', marginTop: '0px' }}>20</h1>
                            </ScxColumn>
                        </ScxRow>
                    </ScxCard>
                    <ScxCard style={{ marginLeft: '10px', marginTop: '20px', borderRadius: '8px' }}>
                        <ScxRow style={{ marginTop: "0px" }}>
                            <ScxColumn span={10} style={{ marginLeft: "0px" }}>
                                <h1
                                    className={`tab ${activeTab === "received" ? "active" : ""}`}
                                    onClick={() => setActiveTab("received")}
                                >
                                    Received
                                </h1>
                            </ScxColumn>
                            <ScxColumn span={7}>
                                <h1
                                    className={`tab ${activeTab === "sent" ? "active" : ""}`}
                                    onClick={() => setActiveTab("sent")}
                                >
                                    Sent
                                </h1>
                            </ScxColumn>
                            <ScxColumn span={7}>
                                <h1
                                    className={`tab ${activeTab === "expected" ? "active" : ""}`}
                                    onClick={() => setActiveTab("expected")}
                                >
                                    Expected
                                </h1>
                            </ScxColumn>
                            <style>
                                {`
                                  .tab {
                                      cursor: pointer;
                                      font-size: 15px;
                                      margin: 0;
                                      padding: 10px;
                                      color: black; 
                                 }

                                 .tab.active {
                                      color: navy; 
                                  }
                               `}
                            </style>
                        </ScxRow>
                        {dummyData2.map((data, index) => (
                            activeTab === data.tabName && (
                                <LoadStatusInRack
                                    key={index}
                                    tabName={data.tabName}
                                    palletNo={data.palletNo}
                                    status={data.status}
                                />
                            )
                        ))}
                    </ScxCard>
                </div>
            </ScxRow>
        </ScxCard>
    )
}