import { FGWhRequestsInfoAbstract } from "@xpparel/shared-models";
import moment from "moment";

export const fgWhReqColumns: any[] = [
    {
        title: 'Warehouse Code',
        dataIndex: 'whCode',
        key: 'whCode',
    },
    {
        title: 'Floor',
        dataIndex: 'floor',
        key: 'floor',
    },
    {
        title: 'Request No',
        dataIndex: 'requestNo',
        key: 'requestNo',
    },
    {
        title: 'Planned Date & Time',
        dataIndex: 'plannedDateTime',
        key: 'plannedDateTime',
        render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
        title: 'Packing List Count',
        dataIndex: 'packListCount',
        key: 'packListCount',
    },
    {
        title: 'Carton Count',
        dataIndex: 'cartonCount',
        key: 'cartonCount',
    },
    {
        title: 'Buyer',
        dataIndex: 'buyer',
        key: 'buyer',
    },
    {
        title: 'Destination',
        dataIndex: 'destination',
        key: 'destination',
    },
    {
        title: 'Delivery Date',
        dataIndex: 'deliveryDate',
        key: 'deliveryDate',
    },
];