import { MinusOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { OrderLinesRequest, PoProdNameModel, PoSummaryModel, ProductIdRequest, ProductItemModel, SewSerialRequest, SewVersionCloneRequest, MoProductStatusEnum, SubProductItemModel } from "@xpparel/shared-models";
import { POService, ProductPrototypeServices, SewingMappingService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Col, Collapse, Flex, Modal, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

import { AlertMessages } from "packages/ui/src/components/common";
import OperationRoutingGrid from "./operation-routing-grid";

interface IProps {
    poObj: SewSerialRequest;
    onStepChange: (step: number, po: SewSerialRequest) => void

}
interface IProductComponentProps {
    orderIdPk: number;
    manufacturingOrderNo: string;
}
const OperationRoutingPage = (props: IProductComponentProps) => {
    // const [PoProdNameModelData, setPoProdNameModelData] = useState<PoProdNameModel[]>(PoProdNameModelData1);
    const [productData, setProductData] = useState<PoProdNameModel[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<PoProdNameModel>(undefined);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<PoProdNameModel[]>([]);
    const productPrototypeServices = new ProductPrototypeServices();
    const [rawProductComponents, setRawProductComponents] = useState<ProductItemModel>();


    useEffect(() => {
        // getPoProductNames(props.poObj.poSerial);
    }, []);

    useEffect(() => {
        if (props.orderIdPk) {
            getProductRmItemComps(props.orderIdPk);
        }
        // constructProductComponentsData(rawProductComponents);
    }, []);

    const getProductRmItemComps = (orderIdPk: number) => {
        const req = new ProductIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, undefined, orderIdPk);
        // productPrototypeServices.getProductRmItemComps(req).then((res => {
        //     if (res.status) {
        //         setRawProductComponents(res.data[0]);
        //         // setIsProdConfirm(res.data[0].productConfirmationStatus == MoProductStatusEnum.CONFIRMED);
        //         // constructProductComponentsData(res.data[0]);
        //         // getUniqueProductTypesAndConstructData(res.data[0]);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })).catch(error => {
        //     AlertMessages.getErrorMessage(error.message)
        // });
    }

    const user = useAppSelector((state) => state.user.user.user);
    const pOService = new POService();
    const sewVersionService = new SewingMappingService();

    /**
     * Get Product Names
     * @param poSerial 
     */
    // const getPoProductNames = (poSerial: number) => {
    //     sewVersionService.getPoProductNamesAndVersionInfo(props)
    //         .then((res) => {
    //             if (res.status) {
    //                 setProductData(res.data);
    //             } else {
    //                 setProductData([]);
    //                 AlertMessages.getErrorMessage(res.internalMessage);
    //             }
    //         })
    //         .catch((err) => {
    //             AlertMessages.getErrorMessage(err.message);
    //         });
    // }


    const renderProducts = (item:SubProductItemModel) => {
        const propItems = {
            manufacturingOrderNo: item.orderNo,
            productName: item.subProdName,
            components: item.components,
            rmComps:item.rmCompMapping
        }
        return (
            <OperationRoutingGrid {...propItems} />
        )

    }

    const HeaderRow = (props: any) => {
        const { productType, productName, color } = props;
        return (
            <div style={{ fontWeight: '500' }}>
                <Flex wrap="wrap" gap="large" justify='start'>
                    <Col>Product Type : <Tag color="black">{productType}</Tag></Col>
                    <Col>Product Name : <Tag color="black">{productName}</Tag></Col>
                    <Col>Color : <Tag color="black">{color}</Tag></Col>
                    {/* <Col>Status : <Tag color="black">{color}</Tag></Col> */}
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
        </div> : <span style={{ color: "red" }}>No Other Products To copy / Products with same components not found!!!</span>;
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
        if (!selectedCheckboxes.length) {
            AlertMessages.getErrorMessage('Product names not selected to copy');
            return;
        }
        const copyToProducts = selectedCheckboxes.map(res => res.productName);
        const req = new SewVersionCloneRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedProduct.opsVersionId, copyToProducts, selectedProduct?.poSerial);
        sewVersionService.copySewingVersionToGivenProductNames(req)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    closeModel();
                    // getPoProductNames(props.poObj?.poSerial);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });

    }
    return <>
        <Card title='Operation Mapping' size="small" extra={<Tooltip title="Reload">
            <Button type='primary'
                icon={<RedoOutlined style={{ fontSize: '20px' }} />}
            // onClick={() => getPoProductNames(props.poObj?.poSerial)}
            />
        </Tooltip>}
        >
            <Collapse
                accordion
                size="small"
                expandIconPosition='end'
                expandIcon={({ isActive }) => isActive ? < MinusOutlined style={{ fontSize: '20px' }} /> : <  PlusOutlined style={{ fontSize: '20px' }} />}
            >
                {rawProductComponents?.subProducts?.map((item, index: number) => (
                    <Collapse.Panel
                        header={
                            <HeaderRow
                                productType={item.subProductType}
                                productName={item.subProdName}
                                color={item.fgColor}
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
                open={modalVisible}
                title={"Clone Operation Mapping"}
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
                {/* {selectedProduct &&
                    renderCloningProductTypes(selectedProduct, productData)
                } */}
            </Modal>
        </Card>
    </>
}
export default OperationRoutingPage;