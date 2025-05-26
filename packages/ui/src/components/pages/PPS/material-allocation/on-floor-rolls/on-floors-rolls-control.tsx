import { CommonRequestAttrs, LockedFabMaterialModel,  OnFloorRollIdsRequest,  RollLocationEnum, RollLocationRequest, rollLocationEnumDisplayValues } from "@xpparel/shared-models"
import { DocketMaterialServices, ReasonssServices } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Col, Form, Input, Row, Select, Table, Tabs, TabsProps, Tag } from "antd"
import { useAppSelector } from '../../../../../common';
import { CustomColumn } from "packages/ui/src/schemax-component-lib"
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../../common";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words'; 
import { OnFloorRollsMovement } from "./on-floor-rolls-movement";
import { OnFloorRollsConfirmation } from "./on-floor-rolls-confirmation";

const { Option } = Select;
export const OnFloorRollsControl = () => {
    type floorRollsWithExtraParams = LockedFabMaterialModel & { checkbox: boolean }
    const [onFloorRolls, setOnFloorRolls] = useState<floorRollsWithExtraParams[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<RollLocationEnum>(null);
    const [onFloorIds, setOnFloorIds] = useState<number[]>([]);
    const service = new DocketMaterialServices();
    const user = useAppSelector((state) => state.user.user.user);
    const userName = user?.userName;
    const unitCode = user?.orgData?.unitCode;
    const companyCode = user?.orgData?.companyCode;
    const userId = user?.userId;
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [categoryReasonsData, setCategoryReasonsData] = useState<any>([]);
    const categoryReasonsService = new ReasonssServices();
    const [form] = Form.useForm()
    const [selectedRows, setSelectedRows] = useState<any>()
    useEffect(() => {
        
    }, [])



    const tabComponents: TabsProps['items'] = [
        {
            key: '1',
            label: 'Change Rolls Location',
            children: <OnFloorRollsMovement />,
        },
        {
            key: '2',
            label: 'Confirm Rolls Location',
            children: <OnFloorRollsConfirmation />,
        },

    ];

    const onTabChange = () => {

    }

    return (
        <>
            <Card title='Pending On Floor Rolls' size="small">
                <Tabs defaultActiveKey="1" className="dispatch-tab" items={tabComponents} onChange={onTabChange} />
            </Card>



        </>
    )
}