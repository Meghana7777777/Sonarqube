import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd"
import { useEffect, useState } from "react"
import ProductTypeForm from "./product-type-form";
import { useAppSelector } from "packages/ui/src/common";
import { ComponentServices, ProductTypeServices } from "@xpparel/shared-services";
import { CommonRequestAttrs, ComponentModel, ProductTypeCompModel, ProductTypeIdRequest, ProductTypeModel, ProductTypeRequest } from "@xpparel/shared-models";
import { AlertMessages } from "../../../common";
import { ColumnsType } from "antd/lib/table";

export const CreateProductType = ()=> {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [oktext,setOkText]=useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<ProductTypeModel>();
    const service= new ProductTypeServices();
    const compservice= new ComponentServices();
    const [resData,setResData] = useState<ProductTypeModel[]>([]);
    const [compData,setCompData] = useState([]);
    const [prodTypes, setprodTypes] = useState(false);
    const [istitle, setIsTitle] = useState("Create Product Type");

    useEffect(() => {
      getProductTypes();
    }, []);
    ;
    const fieldsReset = () => {
      formRef.resetFields();
    };
    const showModal = (record) => {
      setprodTypes(true);
      setSelectedRecord(record);
      setIsModalOpen(true);
      setOkText("Update");
      setIsTitle("Update Prodcut Type");
    };
    const showModals=()=>{
        fieldsReset();
        setprodTypes(false);
        setSelectedRecord(null);
        setOkText("Create");
        setIsTitle("Create Prodcut Type");
        setIsModalOpen(true);
      
    }
    const onClose=()=>{
        setIsModalOpen(false);
        setSelectedRecord(null);
       
    }
   
    const getProductTypes = () => {
      const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      service.getAllProductTypes(obj).then(res => {
        if (res.status) {
          setResData(res.data);
          // AlertMessages.getSuccessMessage(res.internalMessage);
        }
        else {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch(err => {
        //AlertMessages.getErrorMessage(err.message);
      })
    }
    const handleOk = () => {
        formRef.validateFields().then(values => {
            const  productTypeModel:ProductTypeModel[]=[];
            const componentModel:ProductTypeCompModel[]=[];
            values.components.forEach(comp=>{
              componentModel.push(new ProductTypeCompModel(comp));
            })
          const prodType=new ProductTypeModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,values.id,values.productType,values.productName,values.refNo,values.desc,componentModel);

            productTypeModel.push(values);
            const req = new ProductTypeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,[prodType]);
            service.mapCompsToProductType(req).then(res => {
              if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                fieldsReset();
                setIsModalOpen(false);
                getProductTypes();
              } else {
                AlertMessages.getErrorMessage(res.internalMessage)
              }
            }).catch(err => {
            console.log(err);
            fieldsReset();
          })
    }).catch((err) => {
      AlertMessages.getErrorMessage("Please fill all the required fileds before creation.")
  })
    
      };
      
      const deleteProductType = (recod) => {
        const obj = new ProductTypeIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,recod.id,recod.productType);
        
        service.deleteProductType(obj).then(res => {
          if (res.status) {
            AlertMessages.getSuccessMessage(res.internalMessage);
            getProductTypes();            
          }
          else{
            AlertMessages.getErrorMessage(res.internalMessage)
          }
        }).catch(err => {
          
          console.log(err.message)
        })
      }
      
    const productColumns:ColumnsType<any> = [
        {
          title: 'Product Type',
          dataIndex: 'productType',
          align: 'center',
          key: 'productType',
        },
        {
            title: 'Product Description',
            dataIndex: 'desc',
            align: 'center',
            key: 'desc',
        },
        {
          title: 'Components',
          dataIndex: 'components',
          align: 'center',
          key: 'components',
          render: (components, record) => (
            <>
              {components.map((component, index) => (
                <span key={component.compId}>
                  {component.compName}
                  {index !== components.length - 1 && ', '}
                </span>
              ))}
            </>
          ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render : (value,recod)=>{
             return<>
             <EditOutlined onClick={() => showModal(recod)} /><Divider type="vertical" />
             <DeleteOutlined onClick={()=>deleteProductType(recod)}/>
             

             </>
            }
        }
    ]
    return<>
    <Card title='Product Types' extra={ <Button onClick={()=>showModals()} type="primary">Create</Button>}>
   
    <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={istitle} style={{textAlign:"center"}}open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close">
        <Divider type='horizontal'></Divider>
        <ProductTypeForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} prodTypes={prodTypes}/>
    </Modal>
    <Table dataSource={resData} columns={productColumns} size="small" bordered scroll={{ x: 'max-content' }}  style={{ minWidth: '100%' }}/>
    </Card>
    
    </>

}

export default CreateProductType;