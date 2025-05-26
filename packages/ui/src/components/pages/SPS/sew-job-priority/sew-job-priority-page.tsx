import { AllModulesModelForJobPriority, CommonRequestAttrs, IModuleIdRequest, SewingJobPriorityModel } from "@xpparel/shared-models";
import { InspectionHelperService, ModuleSharedService, SewingJobPlanningService } from "@xpparel/shared-services";
import { Button, Card, Form, message, Select, Spin } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import SewingJobPriorityGrid from "./sew-job-priority-grid";
import { AnyARecord } from "dns";


class SewingJobPendingDataModel {
    sewingOrderLineNo: string;
    productName: string;
    productType: string;
    plantStyle: string;
    jobNo: string;
    jobType: string;
    planProductionDate: string;
    deliveryDate: string;
    currentPriority: number;
    changedPriority: number;
}
const mockSewingJobPendingData = [
    {
      sewingOrderLineNo: 'MO12345',
      productName: 'T-Shirt',
      productType: 'Casual Wear',
      plantStyle: 'Classic Fit',
      jobNo: 'J001',
      jobType: 'Assembly',
      planProductionDate: '2025-01-15',
      deliveryDate: '2025-02-01',
      currentPriority: 3,
      changedPriority: 2
    },
    {
      sewingOrderLineNo: 'MO12346',
      productName: 'Jeans',
      productType: 'Denim Wear',
      plantStyle: 'Slim Fit',
      jobNo: 'J002',
      jobType: 'Cutting',
      planProductionDate: '2025-01-20',
      deliveryDate: '2025-02-05',
      currentPriority: 2,
      changedPriority: 1
    },
    {
      sewingOrderLineNo: 'MO12347',
      productName: 'Sweater',
      productType: 'Winter Wear',
      plantStyle: 'V-neck',
      jobNo: 'J003',
      jobType: 'Sewing',
      planProductionDate: '2025-02-01',
      deliveryDate: '2025-02-15',
      currentPriority: 4,
      changedPriority: 3
    },
    {
      sewingOrderLineNo: 'MO12348',
      productName: 'Shirt',
      productType: 'Formal Wear',
      plantStyle: 'Button-up',
      jobNo: 'J004',
      jobType: 'Finishing',
      planProductionDate: '2025-01-25',
      deliveryDate: '2025-02-10',
      currentPriority: 1,
      changedPriority: 2
    },
    {
      sewingOrderLineNo: 'MO12349',
      productName: 'Shorts',
      productType: 'Casual Wear',
      plantStyle: 'Sporty',
      jobNo: 'J005',
      jobType: 'Assembly',
      planProductionDate: '2025-01-18',
      deliveryDate: '2025-02-03',
      currentPriority: 5,
      changedPriority: 4
    },{
        sewingOrderLineNo: 'MO12345',
        productName: 'T-Shirt',
        productType: 'Casual Wear',
        plantStyle: 'Classic Fit',
        jobNo: 'J006',
        jobType: 'Assembly',
        planProductionDate: '2025-01-15',
        deliveryDate: '2025-02-01',
        currentPriority: 3,
        changedPriority: 2
      },
      {
        sewingOrderLineNo: 'MO12346',
        productName: 'Jeans',
        productType: 'Denim Wear',
        plantStyle: 'Slim Fit',
        jobNo: 'J007',
        jobType: 'Cutting',
        planProductionDate: '2025-01-20',
        deliveryDate: '2025-02-05',
        currentPriority: 2,
        changedPriority: 1
      },
      {
        sewingOrderLineNo: 'MO12347',
        productName: 'Sweater',
        productType: 'Winter Wear',
        plantStyle: 'V-neck',
        jobNo: 'J008',
        jobType: 'Sewing',
        planProductionDate: '2025-02-01',
        deliveryDate: '2025-02-15',
        currentPriority: 4,
        changedPriority: 3
      },
      {
        sewingOrderLineNo: 'MO12348',
        productName: 'Shirt',
        productType: 'Formal Wear',
        plantStyle: 'Button-up',
        jobNo: 'J009',
        jobType: 'Finishing',
        planProductionDate: '2025-01-25',
        deliveryDate: '2025-02-10',
        currentPriority: 1,
        changedPriority: 2
      },
      {
        sewingOrderLineNo: 'MO12349',
        productName: 'Shorts',
        productType: 'Casual Wear',
        plantStyle: 'Sporty',
        jobNo: 'J010',
        jobType: 'Assembly',
        planProductionDate: '2025-01-18',
        deliveryDate: '2025-02-03',
        currentPriority: 5,
        changedPriority: 4
      },
      {
        sewingOrderLineNo: 'MO12345',
        productName: 'T-Shirt',
        productType: 'Casual Wear',
        plantStyle: 'Classic Fit',
        jobNo: 'J015',
        jobType: 'Assembly',
        planProductionDate: '2025-01-15',
        deliveryDate: '2025-02-01',
        currentPriority: 3,
        changedPriority: 2
      },
      {
        sewingOrderLineNo: 'MO12346',
        productName: 'Jeans',
        productType: 'Denim Wear',
        plantStyle: 'Slim Fit',
        jobNo: 'J011',
        jobType: 'Cutting',
        planProductionDate: '2025-01-20',
        deliveryDate: '2025-02-05',
        currentPriority: 2,
        changedPriority: 1
      },
      {
        sewingOrderLineNo: 'MO12347',
        productName: 'Sweater',
        productType: 'Winter Wear',
        plantStyle: 'V-neck',
        jobNo: 'J012',
        jobType: 'Sewing',
        planProductionDate: '2025-02-01',
        deliveryDate: '2025-02-15',
        currentPriority: 4,
        changedPriority: 3
      },
      {
        sewingOrderLineNo: 'MO12348',
        productName: 'Shirt',
        productType: 'Formal Wear',
        plantStyle: 'Button-up',
        jobNo: 'J013',
        jobType: 'Finishing',
        planProductionDate: '2025-01-25',
        deliveryDate: '2025-02-10',
        currentPriority: 1,
        changedPriority: 2
      },
      {
        sewingOrderLineNo: 'MO12349',
        productName: 'Shorts',
        productType: 'Casual Wear',
        plantStyle: 'Sporty',
        jobNo: 'J014',
        jobType: 'Assembly',
        planProductionDate: '2025-01-18',
        deliveryDate: '2025-02-03',
        currentPriority: 5,
        changedPriority: 4
      },
      {
        sewingOrderLineNo: 'MO12349',
        productName: 'Shorts',
        productType: 'Casual Wear',
        plantStyle: 'Sporty',
        jobNo: 'J016',
        jobType: 'Assembly',
        planProductionDate: '2025-01-18',
        deliveryDate: '2025-02-03',
        currentPriority: 5,
        changedPriority: 4
      },
      {
        sewingOrderLineNo: 'MO12349',
        productName: 'Shorts',
        productType: 'Casual Wear',
        plantStyle: 'Sporty',
        jobNo: 'J017',
        jobType: 'Assembly',
        planProductionDate: '2025-01-18',
        deliveryDate: '2025-02-03',
        currentPriority: 5,
        changedPriority: 4
      },
      {
        sewingOrderLineNo: 'MO12349',
        productName: 'Shorts',
        productType: 'Casual Wear',
        plantStyle: 'Sporty',
        jobNo: 'J018',
        jobType: 'Assembly',
        planProductionDate: '2025-01-18',
        deliveryDate: '2025-02-03',
        currentPriority: 5,
        changedPriority: 4
      },
      {
        sewingOrderLineNo: 'MO12349',
        productName: 'Shorts',
        productType: 'Casual Wear',
        plantStyle: 'Sporty',
        jobNo: 'J019',
        jobType: 'Assembly',
        planProductionDate: '2025-01-18',
        deliveryDate: '2025-02-03',
        currentPriority: 5,
        changedPriority: 4
      }
  ];
  
const { Option } = Select;
const SewingJobPriorityPage = () => {
    const [form] = Form.useForm();
    const [modules, setModules] = useState<AllModulesModelForJobPriority[]>([]);
    const [dates, setDates] = useState<SewingJobPriorityModel[]>();
    const [loadingDates, setLoadingDates] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [sewJobData, setSewJobData] = useState(mockSewingJobPendingData);
    const moduleService = new ModuleSharedService();
    const user = useAppSelector((state) => state.user.user.user);
    const sewingPlanningService = new SewingJobPlanningService();
const service = new InspectionHelperService()
    useEffect(() => {
      getAllModulesForJobPriority()
    }, []);

    const getAllModulesForJobPriority = () => {
        try {
          const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,)
          moduleService.getAllModulesForJobPriority(req).then(res => {
                if (res.status) {
                    const modules = res.data.map(module => ({
                        moduleCode: module.moduleCode,
                        moduleName: module.moduleName,
                    }));
                    setModules(res.data);
                }
            })
        } catch (err) {
            message.error(err.message);
        }
    }
    const handleModuleChange = (value) => {
        setLoadingDates(true);
        const req = new IModuleIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, value)
        sewingPlanningService.getInprogressJobForJobPriority(req).then(res => {
          if (res.status) {
            const deliveryDates = res.data.map(date => ({
              deliveryDate: date.deliveryDate
            }))
            setDates(res.data);
          }
                setDates(res.data);
                setLoadingDates(false);
            })
            .catch(error => {
                setLoadingDates(false);
                message.error(error.message);
            });
    };

    const handleSearch = () => {
        form.validateFields().then((values) => {
            setLoadingSearch(true);

        }).catch(err => console.log(err.message));

    };

    return <>
        <Card title={<span style={{ display: 'flex', justifyContent:'center', color: 'white'}}>Sewing Job Priority</span>} size="small" headStyle={{ backgroundColor:'#01576f' }}>
            <Form form={form} layout="inline">
                <Form.Item
                    name="module"
                    label="Select Module"
                    rules={[{ required: true, message: "Please select a module" }]}
                >
                    <Select placeholder="Select Module" onChange={handleModuleChange} style={{ minWidth: 200 }}>
                        {modules.map(module => (
                            <Option key={module.moduleCode} value={module.moduleCode}>
                                {module.moduleCode}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Select Date"
                    rules={[{ required: false, message: "Please select a date" }]}
                >
                    {/* <Select placeholder="Select Date" loading={loadingDates} disabled={dates.length === 0} style={{ minWidth: 200 }}>
                        {loadingDates ? (
                            <Spin size="small" />
                        ) : (
                            dates.map(date => (
                                <Option key={date} value={date}>
                                    {date}
                                </Option>
                            ))
                        )}
                    </Select> */}
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleSearch}
                        loading={loadingSearch}
                    >
                        Search
                    </Button>
                </Form.Item>
            </Form>
            <br />
            <SewingJobPriorityGrid sewJobData={sewJobData} />

        </Card>
    </>
}
export default SewingJobPriorityPage;