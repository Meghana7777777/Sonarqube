import { OpsVersionCloneRequest, PoProdNameModel, PoSerialRequest, PoSummaryModel } from "@xpparel/shared-models";
import { CutOrderService, OpVersionService, POService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { Button, Card, Checkbox, Col, Collapse, Flex, Modal, Row, Tag, Tooltip } from "antd";
import { AlertMessages } from "../../../common";
import OperationVersionFormGrid from "./operation-form-grid";
import { color } from "html2canvas/dist/types/css/types/color";
import { MinusOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import React from "react";
interface IProps {
    poObj: PoSummaryModel;
    onStepChange: (step: number, po: PoSummaryModel) => void
}
const OperationVersionPage = (props: IProps) => {
    const [productData, setProductData] = useState<PoProdNameModel[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<PoProdNameModel>(undefined);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<PoProdNameModel[]>([]);
    useEffect(() => {
        if (props.poObj) {
            getPoProductNames(props.poObj.poSerial);
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const pOService = new CutOrderService();
    const opsVersionService = new OpVersionService();

    /**
     * Get Product Names
     * @param poSerial 
     */
    const getPoProductNames = (poSerial: number) => {
        // user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, null, null, null)
        pOService.getPoProductNames(req)
            .then((res) => {
                if (res.status) {
                    setProductData(res.data);
                } else {
                    setProductData([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }


    const renderProducts = (item) => {
        console.log(item);
        const propItems = {
            poSerial: item.poSerial,
            productName: item.productName,
            style: item.style,
            fgColor: item.color,
            components: item.components,
            
        }
        // Use below component for operation sequence
        // <OperationVersionFormGrid props={propItems}/>
        return (
            <OperationVersionFormGrid {...propItems} />
        )
        
    }

    const HeaderRow = (props: any) => {
        const { productType, productName, color, poSerial } = props;
        return (
            <div style={{ fontWeight: '500' }}>
                <Flex wrap="wrap" gap="large" justify='start'>
                    <Col>Product Type : <Tag color="black">{productType}</Tag></Col>
                    <Col>Product Name : <Tag color="black">{productName}</Tag></Col>
                    <Col>Color : <Tag color="black">{color}</Tag></Col>
                    <Col>Status : <Tag color="black">{color}</Tag></Col>
                    {/* <Col></Col> */}
                </Flex>
            </div>
        )
    }
    const onClone = (e, record: PoProdNameModel) => {
        e.stopPropagation();
        setModalVisible(true);
        setSelectedProduct(record);
    }
    const closeModel = () => {
        setModalVisible(false);
        setSelectedProduct(undefined);
    };
    const renderCloningProductTypes = (selectedProduct: PoProdNameModel, productNames: PoProdNameModel[]) => {
        // Get same components Product records
        const copyProductNames = productNames.filter(record =>
            // record
            record !== selectedProduct 
            && record.opsVersionId == null
            && record.components.length === selectedProduct.components.length && // Check if the number of components is the same
            record.components.every(component => selectedProduct.components.includes(component)) // Check if all components match exactly
        );
        return copyProductNames.length > 0 ? <div>
        Copy version from product : <b>{selectedProduct.productName} </b><br />
        To possible products : {
                copyProductNames.map(e =>
                (<Checkbox
                    key={e.productName}
                    // checked={selectedCheckboxes.includes(e.components)}
                    onChange={() => handleCheckboxChange(e)}
                >
                    {e.productType + '-' + e.productName}
                </Checkbox>)
                )
            }
        </div> : <span style={{color: "red"}}>No Other Products To copy / Products with same components not found!!!</span>;
    }
    const handleCheckboxChange = (product: PoProdNameModel) => {
        if (selectedCheckboxes.includes(product)) {
            setSelectedCheckboxes(selectedCheckboxes.filter(item => item !== product));
        } else {
            setSelectedCheckboxes([...selectedCheckboxes, product]);
        }
    };
    const cloneOpVersionForProduct = () => {
        // Need to call api
        // if (!selectedCheckboxes.length) {
        //     AlertMessages.getErrorMessage('Product names not selected to copy');
        //     return;
        // }
        // const copyToProducts = selectedCheckboxes.map(res => res.productName);
        // const req = new OpsVersionCloneRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedProduct.opsVersionId, copyToProducts, selectedProduct.poSerial);
        // opsVersionService.copyOperationVersionToGivenProductNames(req)
        // .then((res) => {
        //     if (res.status) {
        //         AlertMessages.getSuccessMessage(res.internalMessage);
        //         closeModel();
        //         getPoProductNames(props.poObj.poSerial);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })
        // .catch((err) => {
        //     AlertMessages.getErrorMessage(err.message);
        // });
        
    }
    return <>
        <Card title='Operation Version' size="small" extra={ <Tooltip title="Reload">
            <Button disabled={!props.poObj.poSerial} type='primary' 
            icon={<RedoOutlined style={{ fontSize: '20px' }} />} 
            onClick={() =>  getPoProductNames(props.poObj.poSerial)} /></Tooltip>}>
            <Collapse
                // collapsible="icon"
                accordion
                size="small"
                expandIconPosition='end'
                expandIcon={({ isActive }) => isActive ? < MinusOutlined style={{ fontSize: '20px' }} /> : <  PlusOutlined style={{ fontSize: '20px' }} />}
            // style={{ backgroundColor: 'aliceblue', color: 'black' }}
            >
                {productData.map((item, index: number) => (
                    <Collapse.Panel
                        header={
                            <HeaderRow
                                productType={item.productType}
                                productName={item.productName}
                                color={item.color}
                                poSerial={item.poSerial}
                            />
                        }
                        // extra={item.opsVersionId ? <Button onClick={e => onClone(e, item)} type="primary" className="btn-orange" size="small" >Clone To Other Products</Button> : <></>}
                        key={index}
                    >
                        {renderProducts(item)}
                    </Collapse.Panel>
                ))}
            </Collapse>
            <Modal
                className='print-docket-modal'
                // key={'modal' + Date.now()}
                // width={'100%'}
                // style={{ top: 0 }}
                open={modalVisible}
                title={"Clone Operation Version"}
                onCancel={closeModel}
                footer={[
                    <Button key='clone' type="primary" className="btn-green" onClick={cloneOpVersionForProduct}>
                        Clone To Other Products
                    </Button>,
                    <Button key='back' onClick={closeModel}>
                        Cancel
                    </Button>,
                ]}
            >
                {selectedProduct &&
                    renderCloningProductTypes(selectedProduct, productData)
                }
            </Modal>
        </Card>
    </>
}
export default OperationVersionPage;