import React, { useEffect, useState } from 'react';
import { Row, Col, Select, Tabs, Card, Tag, Form, Input, Button } from 'antd';
import { SewingJobGenMOService, SewingMappingService, SewingOrderCreationService } from '@xpparel/shared-services';
import { CommonRequestAttrs, JobGroupBundleGroupProcessTypeModel, JobSewSerialReq, ProcessTypeEnum, processTypeEnumDisplayValues, PanelReqForJobModel, SewSerialDataModel, SewSerialProcessTypeReq, SewSerialRequest } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import Table, { ColumnsType } from 'antd/es/table';
import { AppstoreAddOutlined, SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';

const { Option } = Select;


const panelRequests: PanelReqForJobModel[] = [
    {
        jobNumber: "JOB001",
        productColorSizeCompWiseInfo: [
            {
                productName: "T-Shirt",
                fgColor: "Red",
                size: "M",
                componentWiseBundleInfo: [
                    {
                        component: "Front Panel",
                        bundleInfo: [
                            {
                                brcd: "BRC001", orgQty: 100, rQty: 50, iQty: 20,
                                bundleProps: {
                                    color: "",
                                    size: "",
                                    bundleNo: "",
                                    brcd: "",
                                    moNo: "",
                                    jobNo: "",
                                    component: "",
                                    poSerial: 1,
                                    jobGroup: 0
                                },
                                componentName: '',
                                fgNumbers: []
                            },
                            {
                                brcd: "BRC002", orgQty: 80, rQty: 40, iQty: 15,
                                bundleProps: null,
                                componentName: '',
                                fgNumbers: []
                            },
                        ],
                    },
                    {
                        component: "Back Panel",
                        bundleInfo: [
                            {
                                brcd: "BRC003", orgQty: 120, rQty: 60, iQty: 25,
                                bundleProps: null,
                                componentName: '',
                                fgNumbers: []
                            },
                        ],
                    },
                ],
            },
        ],
        resourceDetails: { moduleCode: "MOD001", sectionCode: "SEC001" },
        jobGroup: 1,
        processType: ProcessTypeEnum.LAY,
    },
    {
        jobNumber: "JOB002",
        productColorSizeCompWiseInfo: [
            {
                productName: "Jeans",
                fgColor: "Blue",
                size: "L",
                componentWiseBundleInfo: [
                    {
                        component: "Leg Panel",
                        bundleInfo: [
                            {
                                brcd: "BRC004", orgQty: 150, rQty: 70, iQty: 30,
                                bundleProps: null,
                                componentName: '',
                                fgNumbers: []
                            },
                            {
                                brcd: "BRC005", orgQty: 90, rQty: 45, iQty: 20,
                                bundleProps: null,
                                componentName: '',
                                fgNumbers: []
                            },
                        ],
                    },
                ],
            },
        ],
        resourceDetails: { moduleCode: "MOD002", sectionCode: "SEC002" },
        jobGroup: 1,
        processType: ProcessTypeEnum.CUT,
    },
    {
        jobNumber: "JOB003",
        productColorSizeCompWiseInfo: [
            {
                productName: "Shirt",
                fgColor: "White",
                size: "XL",
                componentWiseBundleInfo: [
                    {
                        component: "Sleeve",
                        bundleInfo: [
                            {
                                brcd: "BRC006", orgQty: 200, rQty: 100, iQty: 50,
                                bundleProps: null,
                                componentName: '',
                                fgNumbers: []
                            },
                        ],
                    },
                ],
            },
        ],
        resourceDetails: { moduleCode: "MOD003", sectionCode: "SEC003" },
        jobGroup: 2,
        processType: ProcessTypeEnum.SEW,
    },
];


const jobGroupBundleGroupProcessTypeModels: JobGroupBundleGroupProcessTypeModel[] = [
    { jobGroup: 1, bundleGroup: 101, processType: ProcessTypeEnum.LAY },
    { jobGroup: 1, bundleGroup: 102, processType: ProcessTypeEnum.CUT },
    { jobGroup: 2, bundleGroup: 201, processType: ProcessTypeEnum.SEW },
    { jobGroup: 2, bundleGroup: 202, processType: ProcessTypeEnum.WASH },
    { jobGroup: 3, bundleGroup: 301, processType: ProcessTypeEnum.FIN },
    { jobGroup: 3, bundleGroup: 302, processType: ProcessTypeEnum.PACK },
    { jobGroup: 4, bundleGroup: 401, processType: ProcessTypeEnum.IRON },
    { jobGroup: 5, bundleGroup: 501, processType: ProcessTypeEnum.INS },
    { jobGroup: 6, bundleGroup: 601, processType: ProcessTypeEnum.DYE },
    { jobGroup: 7, bundleGroup: 701, processType: ProcessTypeEnum.KNIT },
    { jobGroup: 8, bundleGroup: 801, processType: ProcessTypeEnum.LINK },
    { jobGroup: 9, bundleGroup: 901, processType: ProcessTypeEnum.EMBR },
    { jobGroup: 9, bundleGroup: 901, processType: ProcessTypeEnum.EMBR }

];

interface TableItem {
    productName: string;
    color: string;
    size: string;
    component: string;
    availableQty: number;
    bundleInfo: any[];
    [key: string]: any;
}
const InventoryInfo = () => {

    const data:PanelReqForJobModel[]=  [
        {
            jobNumber: null,
            productColorSizeCompWiseInfo: [
                {
                    productName: "Heavy Fleece PO",
                    fgColor: "NA",
                    size: "50/56",
                    componentWiseBundleInfo: [
                        {
                            component: "Front",
                            bundleInfo: [
                                {
                                    brcd: "KNIT-PB-57",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-57",
                                        bundleNo: "KNIT-PB-57",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-58",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-58",
                                        bundleNo: "KNIT-PB-58",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-59",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-59",
                                        bundleNo: "KNIT-PB-59",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-60",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-60",
                                        bundleNo: "KNIT-PB-60",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-61",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-61",
                                        bundleNo: "KNIT-PB-61",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                }
                            ]
                        },
                        {
                            component: "Back",
                            bundleInfo: [
                                {
                                    brcd: "KNIT-PB-67",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-67",
                                        bundleNo: "KNIT-PB-67",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-68",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-68",
                                        bundleNo: "KNIT-PB-68",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-69",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-69",
                                        bundleNo: "KNIT-PB-69",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-70",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-70",
                                        bundleNo: "KNIT-PB-70",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-71",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-71",
                                        bundleNo: "KNIT-PB-71",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                }
                            ]
                        },
                        {
                            component: "Left Sleeve",
                            bundleInfo: [
                                {
                                    brcd: "KNIT-PB-113",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-113",
                                        bundleNo: "KNIT-PB-113",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-114",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-114",
                                        bundleNo: "KNIT-PB-114",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-115",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-115",
                                        bundleNo: "KNIT-PB-115",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-116",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-116",
                                        bundleNo: "KNIT-PB-116",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-117",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-117",
                                        bundleNo: "KNIT-PB-117",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                }
                            ]
                        },
                        {
                            component: "Right Sleeve",
                            bundleInfo: [
                                {
                                    brcd: "KNIT-PB-123",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-123",
                                        bundleNo: "KNIT-PB-123",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-124",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-124",
                                        bundleNo: "KNIT-PB-124",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-125",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-125",
                                        bundleNo: "KNIT-PB-125",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-126",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-126",
                                        bundleNo: "KNIT-PB-126",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-127",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-127",
                                        bundleNo: "KNIT-PB-127",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-128",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-128",
                                        bundleNo: "KNIT-PB-128",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-129",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-129",
                                        bundleNo: "KNIT-PB-129",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-130",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-130",
                                        bundleNo: "KNIT-PB-130",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-131",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-131",
                                        bundleNo: "KNIT-PB-131",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-132",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-132",
                                        bundleNo: "KNIT-PB-132",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                }
                            ]
                        }
                    ]
                },
                {
                    productName: "Light Weight Fleece PO",
                    fgColor: "NA",
                    size: "50/56",
                    componentWiseBundleInfo: [
                        {
                            component: "Front",
                            bundleInfo: [
                                {
                                    brcd: "KNIT-PB-57",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-57",
                                        bundleNo: "KNIT-PB-57",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-58",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-58",
                                        bundleNo: "KNIT-PB-58",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-59",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-59",
                                        bundleNo: "KNIT-PB-59",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-60",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-60",
                                        bundleNo: "KNIT-PB-60",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-61",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-61",
                                        bundleNo: "KNIT-PB-61",
                                        color: "NA",
                                        jobNo: "KNIT-3-117",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                }
                            ]
                        },
                        {
                            component: "Back",
                            bundleInfo: [
                                {
                                    brcd: "KNIT-PB-67",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-67",
                                        bundleNo: "KNIT-PB-67",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-68",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-68",
                                        bundleNo: "KNIT-PB-68",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-69",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-69",
                                        bundleNo: "KNIT-PB-69",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-70",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-70",
                                        bundleNo: "KNIT-PB-70",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-71",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-71",
                                        bundleNo: "KNIT-PB-71",
                                        color: "NA",
                                        jobNo: "KNIT-3-119",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                }
                            ]
                        },
                        {
                            component: "Left Sleeve",
                            bundleInfo: [
                                {
                                    brcd: "KNIT-PB-113",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-113",
                                        bundleNo: "KNIT-PB-113",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-114",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-114",
                                        bundleNo: "KNIT-PB-114",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-115",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-115",
                                        bundleNo: "KNIT-PB-115",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-116",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-116",
                                        bundleNo: "KNIT-PB-116",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-117",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-117",
                                        bundleNo: "KNIT-PB-117",
                                        color: "NA",
                                        jobNo: "KNIT-3-129",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                }
                            ]
                        },
                        {
                            component: "Right Sleeve",
                            bundleInfo: [
                                {
                                    brcd: "KNIT-PB-123",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-123",
                                        bundleNo: "KNIT-PB-123",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-124",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-124",
                                        bundleNo: "KNIT-PB-124",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-125",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-125",
                                        bundleNo: "KNIT-PB-125",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-126",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-126",
                                        bundleNo: "KNIT-PB-126",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-127",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-127",
                                        bundleNo: "KNIT-PB-127",
                                        color: "NA",
                                        jobNo: "KNIT-3-131",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-128",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-128",
                                        bundleNo: "KNIT-PB-128",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-129",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-129",
                                        bundleNo: "KNIT-PB-129",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-130",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-130",
                                        bundleNo: "KNIT-PB-130",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-131",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-131",
                                        bundleNo: "KNIT-PB-131",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                },
                                {
                                    brcd: "KNIT-PB-132",
                                    iQty: 0,
                                    orgQty: 0,
                                    rQty: 10,
                                    bundleProps: {
                                        brcd: "KNIT-PB-132",
                                        bundleNo: "KNIT-PB-132",
                                        color: "NA",
                                        jobNo: "KNIT-3-132",
                                        moNo: "1",
                                        size: "50/56",
                                        poSerial: 3,
                                        component: '',
                                        jobGroup: 0
                                    },
                                    componentName: '',
                                    fgNumbers: []
                                }
                            ]
                        }
                    ]
                }
            ],
            resourceDetails: null,
            jobGroup: null,
            processType: null
        }
    ]
    
    const [selectedSewSerial, setSelectedsewSerial] = useState<number>(null);
    const [inventoryData, setInventoryData] = useState<PanelReqForJobModel[]>(data);
    const [responseData, setResponseData] = useState<JobGroupBundleGroupProcessTypeModel[]>([]);
    const [selectedProcessType, setSelectedProcessType] = useState<ProcessTypeEnum>(ProcessTypeEnum.LAY); // Default to LAY
    const [first, setfirst] = useState<ProcessTypeEnum>()
    const [sewSerialArray, setSewSerialArray] = useState<SewSerialDataModel[]>()
    const sewingOrderService = new SewingOrderCreationService()
    const service = new SewingJobGenMOService();
    const sewingService = new SewingMappingService();
    const user = useAppSelector((state) => state.user.user.user);


    const handleSewSerialChange = (value: number) => {
        setSelectedsewSerial(value);
        getComponentBundlesForSewingJob(null, value, selectedProcessType);
    };

    const getComponentBundlesForSewingJob = (sJobNo: string, sewSerial: number, processType: ProcessTypeEnum) => {
        const req = new SewSerialProcessTypeReq(sewSerial, processType, user?.orgData?.unitCode, user?.orgData?.companyCode);
        service.getAvailableComponentBundlesForProcessType(req).then(
            (res) => {
                console.log(res);
                // setInventoryData(res.data);
            }
        ).catch((err) => {
            AlertMessages.getErrorMessage(err);
        });
    };

    useEffect(() => {
        if (selectedSewSerial) {
            const req1 = new SewSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedSewSerial, 0, true, true);
            sewingService.getGroupAndProcessTypeInfoBySewSerial(req1).then(
                (res) => {
                    console.log(res);
                    setResponseData(res.data);
                    if (res.data.length > 0) {
                        const processTypes = [...new Set(responseData?.map(item => item?.processType))];

                        setfirst(processTypes[0])
                        getComponentBundlesForSewingJob(null, selectedSewSerial, processTypes[0]); // Fetch data for the selected process type

                    }
                }
            ).catch((err) => {
                AlertMessages.getErrorMessage(err);
            });
        }
    }, [selectedSewSerial]);


    useEffect(() => {
        const req2 = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
        sewingOrderService.getAllSewSerials(req2).then(
            (res) => {
                setSewSerialArray(res.data);
            }
        ).catch((err) => {
            AlertMessages.getErrorMessage(err);
        });
    }, [])


    const uniqueProcessTypes = responseData.length > 0 ? [...new Set(responseData?.map(item => item?.processType))] : [];

    const handleTabChange = (processType: ProcessTypeEnum) => {
        setfirst(undefined);
        setSelectedProcessType(processType);
        if (selectedSewSerial) {
            getComponentBundlesForSewingJob(null, selectedSewSerial, processType); // Fetch data for the selected process type
        }
    };

   
    const handleSearch = (
        confirm: FilterDropdownProps['confirm']
    ) => {
        confirm();
    };

    const handleReset = (
        clearFilters: () => void,
        confirm: FilterDropdownProps['confirm']
    ) => {
        clearFilters();
        confirm();
    };

    const getColumnSearchProps = (dataIndex: keyof TableItem) => ({
        filterDropdown: (props: FilterDropdownProps) => {
            const { setSelectedKeys, selectedKeys, confirm, clearFilters } = props;
            return (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Row gutter={8}>
                        <Col span={12}>
                            <Button
                                type="primary"
                                onClick={() => handleSearch(confirm)}
                                icon={<SearchOutlined />}
                                size="small"
                                style={{ width: '100%' }}
                            >
                                Search
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                                size="small"
                                style={{ width: '100%' }}
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </div>
            );
        },
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: string | number | boolean, record: TableItem) =>
            record[dataIndex]?.toString()
                .toLowerCase()
                .includes(value.toString().toLowerCase()) ?? false,
    });

    const columns: ColumnsType<TableItem> = [
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
            ...getColumnSearchProps('productName'),
            sorter: (a, b) => (a.productName || '').localeCompare(b.productName || ''),
        },
        {
            title: "Color",
            dataIndex: "color",
            key: "color",
        },
        {
            title: "Size",
            dataIndex: "size",
            key: "size",
            ...getColumnSearchProps('size'),
            sorter: (a, b) => (a.size || '').localeCompare(b.size || ''),
        },
        {
            title: "Component",
            dataIndex: "component",
            key: "component",
            ...getColumnSearchProps('component'),
            sorter: (a, b) => (a.component || '').localeCompare(b.component || ''),
        },
        {
            title: "Available Qty",
            dataIndex: "availableQty",
            key: "availableQty",
            render: (value) => (<>{value ? <Tag className='s-tag' color="#257d82">{value}</Tag> : '-'}</>),
            sorter: (a, b) => (a.availableQty || 0) - (b.availableQty || 0),
        },
    ];

    const getTableData = (processType: ProcessTypeEnum, inventoryDataParam: PanelReqForJobModel[]) => {
        console.log(processType)
        console.log(inventoryDataParam)
        const abc = inventoryDataParam?.flatMap((request) =>
            request?.productColorSizeCompWiseInfo?.flatMap((product) =>
                product.componentWiseBundleInfo?.map((component) => {
                    const totalRequestedQty = component?.bundleInfo?.reduce((sum, b) => sum + b?.rQty, 0);
                    const totalIssuedQty = component?.bundleInfo?.reduce((sum, b) => sum + b?.iQty, 0);
                    const availableQty = component?.bundleInfo?.reduce((sum, b) => sum + b?.orgQty, 0);

                    return {
                        productType: request?.processType,
                        productName: product?.productName,
                        color: product?.fgColor,
                        size: product?.size,
                        component: component?.component,
                        requestedQty: totalRequestedQty,
                        issuedQty: totalRequestedQty,
                        availableQty: totalRequestedQty,
                        bundleInfo: component?.bundleInfo,
                    };
                })
            )
        );
        console.log(abc);
        return abc
    };
    const getRowKey = (record: TableItem) => {
        return `${record.component}-${record.productName}`.toLowerCase().replace(/\s+/g, '-');
    };
    const expandedRowRender = (record: any) => {
        // Define the columns for the nested table
        const columns = [
            { title: 'Color', dataIndex: 'color', key: 'color' },
            { title: 'Size', dataIndex: 'size', key: 'size' },
            { title: 'Bundle No', dataIndex: 'bundleNo', key: 'bundleNo' },
            { title: 'BRCd', dataIndex: 'brcd', key: 'brcd' },
            { title: 'Job No', dataIndex: 'jobNo', key: 'jobNo' },
            {
                title: "Available Qty",
                dataIndex: "rQty",
                key: "rQty",
                render: (value) => (<>{value ? <Tag className='s-tag' color="#257d82">{value}</Tag> : '-'}</>),

            }
            // { title: 'Component', dataIndex: 'component', key: 'component' },
            // { title: 'PO Serial', dataIndex: 'poSerial', key: 'poSerial' },
        ];

        // Prepare the data for the nested table
        const expandedData = record.bundleInfo.map((bundle: any, index: number) => ({
            key: index,
            color: bundle?.bundleProps?.color || '-',
            size: bundle?.bundleProps?.size || '-',
            bundleNo: bundle?.bundleProps?.bundleNo || '-',
            brcd: bundle?.brcd || '-',
            moNo: bundle?.bundleProps?.moNo || '-',
            jobNo: bundle?.bundleProps?.jobNo || '-',
            component: bundle?.bundleProps?.component || '-',
            poSerial: bundle?.bundleProps?.poSerial || '-',
            rQty: bundle?.rQty
        }));
        
        return (
            <Table
                columns={columns}
                dataSource={expandedData}
                pagination={false}
                size="small"
                rowKey="brcd" // Ensure each row is uniquely keyed
                bordered
            />
        );
    };
    return (
        <>
            <div>

                <Card className="custom-main-card" headStyle={{ backgroundColor: '#01576f', height: '10px' }} title={<span style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>Inventory Details</span>} style={{ minHeight: '100vh' }}>

                    <Form autoComplete="off" layout="inline" size="middle">
                        <Row>
                            <Col>
                                <Form.Item
                                    label="Routing Order "
                                    rules={[{ required: true, message: "Please Select Routing Order " }]}
                                    required
                                >
                                    <Select
                                        showSearch={true}
                                        style={{ width: '200px' }}
                                        placeholder='Select Routing Order'
                                        allowClear={true}
                                        onChange={(value) => handleSewSerialChange(value)}
                                        filterOption={(input, option) =>
                                            (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                                        }
                                    >
                                        {sewSerialArray?.map((line) => (
                                            <Option value={line.sewSerialId} key={line.sewSerialId}>
                                                {`${line.sewSerialId}-${line.sewSerialDesc}`}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                        </Row>
                    </Form>
                    {selectedSewSerial &&
                        <Tabs
                            centered
                            activeKey={first ? first : selectedProcessType}
                            onChange={handleTabChange}
                        >
                            {[ProcessTypeEnum.KNIT, ...uniqueProcessTypes].map((processType) => (
                                <Tabs.TabPane tab={<><AppstoreAddOutlined />{processTypeEnumDisplayValues[processType]}</>} key={processType}>
                                    <Table 
                                        columns={columns} 
                                        rowKey= {getRowKey}
                                        dataSource={getTableData(processType, inventoryData)} 
                                        pagination={false}
                                        expandable={{
                                            expandedRowRender: expandedRowRender,
                                            rowExpandable: (record) => record.bundleInfo && record.bundleInfo.length > 0,
                                        }} 
                                    />
                                </Tabs.TabPane>
                            ))}
                        </Tabs>}
                </Card>
            </div>
        </>
    );
};

export default InventoryInfo;

