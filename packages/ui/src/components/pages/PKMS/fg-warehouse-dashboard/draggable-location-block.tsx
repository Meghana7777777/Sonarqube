import { CartonBasicInfoUIModel, ContainerCartonsUIModel, LocationIdRequest, FgLocationModel, RackLocationContainersModel, WarehouseContainerCartonsModel, LocationContainerMappingRequest } from "@xpparel/shared-models";
import { Button, Card, Descriptions, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { getCssFromComponent } from "../__masters__/print-barcodes";
import ContainerBox from "./container-box";
import { FGLocationAllocationService } from "@xpparel/shared-services";
interface RackBlockProps {
    rackId: number;
    rackLevel: number;
    column: number;
    locationInfo: FgLocationModel;
    filterVal: string;
    draggable: boolean;
    droppable: boolean;
    refreshBoth: () => void
}
export const DraggableLocationBlock = (props: RackBlockProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const { rackId, rackLevel, column, locationInfo, filterVal } = props;
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (locationInfo) {
            getLocationContainersWithoutCartons(locationInfo);
        }
    }, []);

    const locationService = new FGLocationAllocationService();
    const [locationContainerInfo, setLocationContainerInfo] = useState<RackLocationContainersModel>();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedContainerInfo, setSelectedContainerInfo] = useState<ContainerCartonsUIModel>();
    const getLocationContainersWithoutCartons = (locationObj: FgLocationModel) => {
        setLoading(true);
        const locationReq = new LocationIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, locationObj.locationId, locationObj.locationCode);
        locationService.getLocationContainersWithoutCartons(locationReq).then((res => {
            if (res.status) {
                setLocationContainerInfo(res.data[0]);
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage);
                setLocationContainerInfo(undefined);
            }
            setLoading(false);
        })).catch(error => {
            setLoading(false);
            setLocationContainerInfo(undefined);
            AlertMessages.getErrorMessage(error.message)
        })
    }

    const closeModel = () => {
        setModalOpen(false);
        setSelectedContainerInfo(undefined);
    }
    const selectContainer = (containerInfo: ContainerCartonsUIModel) => {
        if (containerInfo) {
            setSelectedContainerInfo(containerInfo);
            setModalOpen(true);
        }
    }
    const renderTitle = (containerInfoParam: ContainerCartonsUIModel) => {
        let containerCode = containerInfoParam.containerCode;
        let noOfcartons = containerInfoParam.cartonsInfo.length;
        return <Descriptions bordered size={'small'} title={<Space size='middle'><>Container Code : {containerCode} </>No Of Cartons : {noOfcartons} </Space>}
        // extra={<Button type="primary">Print</Button>}
        >

        </Descriptions>
    }
    const columns: ColumnsType<CartonBasicInfoUIModel> = [
        {
            title: 'Carton No',
            dataIndex: 'externalRollNumber',
        },
        {
            title: 'Barcode ',
            dataIndex: 'barcode',
        },
        {
            title: 'Lot No',
            dataIndex: 'lotNo',
        },
        {
            title: 'Batch No',
            dataIndex: 'batchNo',
        },

        {
            title: 'Qty',
            dataIndex: 'supplierQuantity',
        },

        {
            title: 'Width',
            dataIndex: 'supplierWidth',
        },
        {
            title: 'Length',
            dataIndex: 'supplierLength',
        },
        {
            title: 'Shade',
            dataIndex: 'shade',
        }
    ]
    const print = () => {
        const printAreaElement = document.getElementById('printArea') as HTMLElement | null;
        const divContents = printAreaElement?.innerHTML ?? '';
        const element = window.open('', '', 'height=700, width=1024');
        element?.document.write(divContents);
        getCssFromComponent(document, element?.document);
        element?.document.close();
        // Loading image lazy
        setTimeout(() => {
            element?.print();
            element?.close()
        }, 1000);
        // clsoeModel();
    }
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, whContainer: WarehouseContainerCartonsModel) => {
        event.dataTransfer.setData('whContainer', JSON.stringify(whContainer));
    };


    return (
        <>
            <Card loading={loading} size="small" bordered={false} title={`${locationInfo?.locationCode}`} style={{ boxShadow: 'none' }} headStyle={{ minHeight: 0, background: 'cadetblue', textAlign: 'center', color: '#f2f2f2' }} bodyStyle={{ padding: 0, width: '134px' }} >
                {locationContainerInfo ?
                    <>
                        {locationContainerInfo.locationInfo.map((location) => {
                            return <div >
                                {
                                    location.containersInfo.map((containerObj, index) => {
                                        return <div
                                            draggable={props.draggable}
                                            onDragStart={(event) => handleDragStart(event, containerObj)}>
                                            <ContainerBox key={`ware-${'ref' + location.locationCode + '-' + index}`} selectContainer={selectContainer} containerObj={containerObj} filterVal={filterVal}
                                            />
                                        </div>
                                    })
                                }
                            </div>
                        })}</> : ''}
            </Card>
            <Modal
                // title={<Button type="primary">Print</Button>}
                style={{ top: 20 }}
                width={'100%'}
                open={modalOpen}
                onOk={closeModel}
                onCancel={closeModel}
                footer={[<Button key="back" type="primary" onClick={print}>Print</Button>, <Button onClick={closeModel} >Close</Button>]}
            >
                <div id='printArea'>
                    {selectedContainerInfo && renderTitle(selectedContainerInfo)}
                    <Table columns={columns} pagination={false} scroll={{ x: true, }} bordered dataSource={selectedContainerInfo ? selectedContainerInfo.cartonsInfo : []} size="small" />
                </div>
            </Modal>
        </>
    )
}

export default DraggableLocationBlock;