import { GrnStatusEnumDisplayVlaue, InsInspectionStatusEnumDisplayValue, PackingListSummaryModel } from "@xpparel/shared-models";
import { CustomColumn } from "../../../../schemax-component-lib";
import { getProperDate, getProperDateWithTime } from "../../../common/helper-functions";

export const summaryColumns: CustomColumn<PackingListSummaryModel>[] = [
    { title: 'Supplier Name', dataIndex: 'supplierName', key: 'supplierName', isDefaultSelect: true, align: 'center', },
    { title: 'Supplier Code', dataIndex: 'supplierCode', key: 'supplierCode', isDefaultSelect: true, align: 'center', },
    { title: 'Pack List Code', dataIndex: 'packingListCode', key: 'packingListCode', isDefaultSelect: true, align: 'center', },
    {
        title: 'Pack List Date', dataIndex: 'packingListDate', key: 'packingListDate', isDefaultSelect: true, align: 'center', render: (text, record) => {
            return text ? getProperDate(text) : '-'
        }
    },{
        title: 'Expected Arrival', dataIndex: 'deliveryDate', key: 'expectedArrivalDate', isDefaultSelect: true, align: 'center', render: (text, record) => {
            return text ? getProperDateWithTime(text) : '-';
        }
    },
    { title: 'Pack List Quantity', dataIndex: 'totalQuantity', key: 'totalQuantity', isDefaultSelect: true, align: 'center', },
    { title: 'No of Lots', dataIndex: 'lotCount', key: 'lotCount', isDefaultSelect: true, align: 'center', },
    { title: 'No of Objects', dataIndex: 'rollCount', key: 'rollCount', isDefaultSelect: true, align: 'center', },
    // { title: 'Total Supplier Quantity', dataIndex: 'poQty', key: 'poQty', isDefaultSelect: false },
    // { title: 'UOM', dataIndex: 'uom', key: 'uom', isDefaultSelect: false, },
    { title: 'Security Check In', dataIndex: 'securityCheckIn', key: 'securityCheckIn', isDefaultSelect: true, align: 'center', render: (value) => (value ? 'Yes' : 'No'), },
    {
        title: 'Security Check In At', dataIndex: 'securityCheckInAt', key: 'securityCheckInAt', isDefaultSelect: false, align: 'center', render: (text, record) => {
            return text ? getProperDateWithTime(text) : '-'
        }
    },
    {
        title: 'Security Check Out At', dataIndex: 'securityCheckOutAt', key: 'securityCheckOutAt', isDefaultSelect: false, align: 'center', render: (text, record) => {
            return text ? getProperDateWithTime(text)  : '-'
        }
    },
    { title: 'Grn Status', dataIndex: 'grnStatus', key: 'grnStatus', isDefaultSelect: true, align: 'center', render: (text)=> {
        return GrnStatusEnumDisplayVlaue[text];
    }},
    { title: 'Inspection Status', dataIndex: 'inspectionStatus', key: 'inspectionStatus', isDefaultSelect: false, align: 'center', render: (text)=> {
        return InsInspectionStatusEnumDisplayValue[text];
    }},
    { title: 'Vehicle Number', dataIndex: 'phVehicleNumber', key: 'phVehicleNumber', isDefaultSelect: true, align: 'center', },
    { title: 'Driver Name', dataIndex: 'driverName', key: 'driverName', isDefaultSelect: true, align: 'center', },
    { title: 'Driver Contact', dataIndex: 'driverContact', key: 'driverContact', isDefaultSelect: true, align: 'center', },
    { title: 'Vehicle Came At', dataIndex: 'vehicleCameIn', isDefaultSelect: true, key: 'vehicleCameIn', align: 'center', render: (value) => (value ? 'Yes' : 'No'), },
    { 
        title: 'Unloading Start Time', dataIndex: 'unloadingStartTime', isDefaultSelect: false, key: 'unloadingStartTime',  align: 'center',
        render: (text, record) => { return text ? getProperDateWithTime(text) : '-'},
    },
    {
        title: 'Unloading Completed Time', dataIndex: 'unloadingCompletedTime', isDefaultSelect: false, key: 'unloadingCompletedTime',  align: 'center',
        render: (text, record) => { return text ? getProperDateWithTime(text) : '-' }
    },
    // {
    //     title: 'Vehicle arrival Date ', dataIndex: 'securityCheckInAt', isDefaultSelect: false, key: 'unloadingCompletedTime', render: (text, record) => {
    //         return text ? getProperDateWithTime(text) : '-'
    //     }
    // }
]