import { PrinterOutlined, PrinterTwoTone, SyncOutlined } from "@ant-design/icons";
import { CartonPrintReqDto, PackingListIdRequest, PLAndPackJobBarCodeRequest } from "@xpparel/shared-models";
import { PackListService, PackListViewServices } from "@xpparel/shared-services";
import { Button, Space, Table } from "antd";
import { useAppSelector } from '../../../../common';
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import PrintBarCodes from "./print-pack-list";

interface IPackJobViewProps {
    plConfigId: number;
    poId: number;
    getPackListsForPo: () => void
}

export const PackJobView = (props: IPackJobViewProps) => {
    const { plConfigId, poId, getPackListsForPo } = props;
    const [packJobData, setPackJobData] = useState([]);
    const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
    const [cartonData, setCartonData] = useState([]);
    const [printBarcodeReqIds, setPrintBarcodeReqIds] = useState<{ packListId: number, packJobId: number, poId: number }>()

    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;

    const service = new PackListViewServices();
    const pkListService = new PackListService();

    useEffect(() => {
        getPackJobsForPackListId(plConfigId);
    }, [plConfigId]);

    const getPackJobsForPackListId = (packListId: number) => {
        const req = new PackingListIdRequest(packListId, userName, userId, orgData.unitCode, orgData.companyCode);
        service.getPackJobsForPackListId(req)
            .then((res) => {
                if (res.status) {
                    setPackJobData(res.data);
                } else {
                    setPackJobData([]);
                }
            })
            .catch((err) => console.log(err.message));
    };


    const getCartonPrintData = (packListId: number, packJobId: number, poId: number) => {
        const req = new CartonPrintReqDto(poId, packListId, userName, orgData.unitCode, orgData.companyCode, userId, packJobId)
        pkListService.getCartonPrintData(req).then(res => {
            if (res.status) {
                setPrintBarcodeReqIds({ packListId, packJobId, poId })
                setIsPrintModalVisible(res.status);
                setCartonData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => console.log(err.message))
    }

    const printBarcodesForPackJob = () => {
        const req = new PLAndPackJobBarCodeRequest(printBarcodeReqIds.packListId, printBarcodeReqIds.packJobId, userName, orgData.unitCode, orgData.companyCode, userId);
        service.printBarcodesForPackJob(req)
            .then((res) => {
                if (res.status) {
                    getPackJobsForPackListId(plConfigId);
                    getPackListsForPo();
                } else {
                    setCartonData([]);
                }
            })
            .catch((err) => console.log(err.message));
    };

    const releaseBarcodesPrintForPackJob = (packListId: number, packJobId: number) => {
        const req = new PLAndPackJobBarCodeRequest(packListId, packJobId, userName, orgData.unitCode, orgData.companyCode, userId);
        service.releaseBarcodesPrintForPackJob(req)
            .then((res) => {
                if (res.status) {
                    getPackJobsForPackListId(plConfigId);
                    getPackListsForPo();
                } else {
                    setCartonData([]);
                }
            })
            .catch((err) => {
                console.log(err.message);
                AlertMessages.getErrorMessage(err.message);
            });
    };

    const expandedColumns: any[] = [
        {
            title: 'Pack Job',
            dataIndex: 'packJobNumber',
            key: 'packJobNumber',
        },
        {
            title: 'Carton Per Job',
            dataIndex: 'cartons',
            key: 'cartons',
        },
        {
            title: 'Total FG Qty',
            dataIndex: 'totalFgQty',
            key: 'totalFgQty',
        },
        {
            title: 'Actions',
            render: (_, record) =>
                !record.any && (
                    <Space>
                        <Button
                            disabled={record.printStatus}
                            icon={<PrinterTwoTone />}
                            size="small"
                            onClick={() => getCartonPrintData(plConfigId, record.packJobId, poId)}
                        >
                            Print
                        </Button>
                        <Button
                            icon={<SyncOutlined />}
                            size="small"
                            onClick={() => releaseBarcodesPrintForPackJob(plConfigId, record.packJobId)}
                        >
                            Release
                        </Button>
                    </Space>
                ),
        },
    ];

    return (
        <>
            <Table columns={expandedColumns} dataSource={packJobData} pagination={false} />
            {isPrintModalVisible && (
                <PrintBarCodes cartonData={cartonData}
                    printBarCodes={() => {
                        setIsPrintModalVisible(false)
                        printBarcodesForPackJob()
                    }
                    }
                    isPrintModalVisible={isPrintModalVisible}
                    setIsPrintModalVisible={setIsPrintModalVisible}
                />
            )}
        </>
    );
};

export default PackJobView;
