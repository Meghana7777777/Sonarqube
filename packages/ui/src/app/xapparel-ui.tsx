import { SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { PackingListCreationPage } from '../components/pages/WMS';
import { ScxColumn, ScxLayout, ScxRow } from '../schemax-component-lib';
import './app.module.css';

const { Header, Content } = Layout;
type MenuItem = {
    key: string;
    // icon: React.ReactElement;
    title: string;
    path: string;
    componentName: JSX.Element | null;
    children: MenuItem[];
};


const menuData: MenuItem[] = [
    {
        key: "packListCreation",
        // icon: <UserOutlined />,
        title: "Packing List Creation",
        path: "packListCreation",
        componentName: <PackingListCreationPage />,
        children: [],
    },

    // todo:
    // {
    //     key: "reports",
    //     // icon: <TableOutlined />,
    //     title: "Reports",
    //     path: "reports",
    //     componentName: null,
    //     children: [
    //         {
    //             key: "widthSegregation",
    //             title: "Width Segregation Report",
    //             path: "reports/widthSegregation",
    //             componentName: null,
    //             children: [
    //                 {
    //                     key: "widthSegregation",
    //                     title: "Width Segregation Report",
    //                     path: "reports/widthSegregation/widthSegregation",
    //                     componentName: <WidthSegregationReport />,
    //                     children: [],
    //                 },
    //                 {
    //                     key: "supplierWiseWidthSegregation",
    //                     title: "Supplier Wise Width Segregation Report",
    //                     path: "reports/widthSegregation/supplierWiseWidthSegregation",
    //                     componentName: <SupplierWiseWidthSegregationReport />,
    //                     children: [],
    //                 },
    //             ],
    //         },
    //     ],
    // },
];


const XapparalUi: React.FC = () => {
    const [showNewMenu, setShowNewMenu] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(null);
    const [currentComponent, setCurrentComponent] = useState<JSX.Element | null>(null);
    const [showImage, setShowImage] = useState(false);
    const [showSubmenus, setShowSubmenus] = useState(false);


    const handleMenuClick = (key: string) => {
        if (key === "packListCreation") {
            setShowSubmenus(!showSubmenus);
        } else {
            setShowSubmenus(false);
            const menuItem = findMenuItemByKey(menuData, key);
            if (menuItem) {
                setCurrentComponent(menuItem.componentName);
                setShowNewMenu(false);
            }
        }
    };

    const handleImageClick = () => {
        setShowNewMenu(true);
        setShowSubmenus(false);
        setCurrentComponent(null);
    };

    const renderMenuItems = (items: MenuItem[]): JSX.Element[] => {
        return items.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    <Menu.SubMenu key={item.key} title={item.title} >
                        {renderMenuItems(item.children)}
                    </Menu.SubMenu>
                );
            } else {
                return (
                    <Menu.Item key={item.key} onClick={() => handleMenuClick(item.key)}>

                        {item.title}
                    </Menu.Item>
                );
            }
        });
    };

    const findMenuItemByKey = (items: MenuItem[], key: string): MenuItem | undefined => {
        for (const item of items) {
            if (item.key === key) {
                return item;
            } else if (item.children && item.children.length > 0) {
                const childItem = findMenuItemByKey(item.children, key);
                if (childItem) {
                    return childItem;
                }
            }
        }
        return undefined;
    };


    return (
        <ScxLayout>
            {/* <Header style={{ position: 'absolute', zIndex: 1, width: '100%', background: 'rgba(0, 0, 0, 0)' }}>
                {showNewMenu ? (
                    <Menu theme="dark" mode="horizontal" style={{ width: '100%' }}>
                        {menuData.map((item) => (
                            <Menu.Item key={item.key} onClick={() => handleMenuClick(item.key)}>
                                {item.icon}
                                {item.title}
                            </Menu.Item>
                        ))}
                        <Menu.Item key="3" onClick={() => setShowNewMenu(false)}>
                            Allocation 2
                        </Menu.Item>
                        <Menu.Item key="4" onClick={() => setShowNewMenu(false)}>
                            Allocation 3
                        </Menu.Item>
                    </Menu>
                ) : (
                    <Menu theme="dark" mode="horizontal" style={{ float: 'right', background: 'rgba(0, 0, 0, 0)' }}>
                        <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => setShowNewMenu(true)}></Menu.Item>
                    </Menu>
                )}
            </Header> */}
            <Header style={{ position: 'absolute', zIndex: 1, width: '100%', background: 'rgba(0, 0, 0, 0)' }}>
                {showNewMenu ? (
                    <Menu theme="dark" mode="horizontal" style={{ width: '100%' }}>
                        {renderMenuItems(menuData)}
                    </Menu>
                ) : (
                    <Menu theme="dark" mode="horizontal" style={{ float: 'right', background: 'rgba(0, 0, 0, 0)' }}>
                        <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => setShowNewMenu(true)}></Menu.Item>
                    </Menu>
                )}
            </Header>


            <Content
                style={{
                    // backgroundColor: 'gray',
                    // backgroundImage:"url('https://blog.icons8.com/wp-content/uploads/2020/02/how-to-create-gradient-article.jpg')",
                    // backgroundImage: "to bottom right, lightgray, lightblue)",
                    backgroundImage: `
                    linear-gradient(to bottom right, rgba(211,211,211,0.6), rgba(211,211,211,0.5)),
                    url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgelg_as_QCGE_VPnHYT0l1CYu97QbonWW6i5gysXXoP5qGNLmMQiat-NGdc4JjhkS_5A&usqp=CAU'),
                    linear-gradient(to bottom left, rgba(211,211,211,0.3), rgba(211,211,211,0.4)),
                    url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm5ui2TrUl7-oOJptsvm8xsIR1oFuO5JvJVOWbje6alLgkuhSsjCnk9Lqq62sEqNp0CYg&usqp=CAU'),
                    linear-gradient(to bottom left, rgba(211,211,211,0.2), rgba(211,211,211,0.1)),
                    url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrDG_dKWmfSw2Hu1cUwWHN2dgtDFAV-ASx2xJbAQEdYNaWic0v84vggWujJJGkDxcdKLI&usqp=CAU')
                     `,
                    display: 'flex',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    paddingTop: '64px',
                }}
            >
                {selectedComponent}
                {!showImage && (

                    <ScxRow justify="center" gutter={[16, 16]}>
                        <div
                            style={{
                                padding: '0 20px',
                                transition: 'transform 0.2s ease',
                            }}
                        >
                            <ScxColumn xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <img
                                        src="https://media.istockphoto.com/id/1208067405/photo/3d-warehouse-building.jpg?s=612x612&w=0&k=20&c=O899Ef2CKm3zw7H3RAbHFpAkYx3miVhIJOlSjysP7tE="
                                        alt="Image 1"
                                        style={{ width: '100px', height: '100px', transition: 'transform 0.2s ease', borderRadius: '4%' }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                        onClick={handleImageClick}
                                    />
                                    <h1 style={{ textAlign: 'center', color: 'white', marginTop: '10px', fontSize: '17px', fontWeight: '500' }}>WMS</h1>
                                </div>
                            </ScxColumn>
                        </div>
                        <div style={{
                            padding: '0 20px',
                            transition: 'transform 0.2s ease',
                        }}>
                            <ScxColumn xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrLaAmFNezQclDKHfeTWBhVvs-Uau-CWKQ5QpFa9H6_6Go7fMP_EfwTr17qrE6fbsSUgg&usqp=CAU" alt="Image 1" style={{ width: '100px', height: '100px', transition: 'transform 0.2s ease', borderRadius: '4%', }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    />
                                    <h1 style={{ textAlign: 'center', color: 'white', marginTop: '10px', fontSize: '17px', fontWeight: '500' }}>Packing</h1>
                                </div>
                            </ScxColumn>
                        </div>
                        <div style={{
                            padding: '0 20px',
                            transition: 'transform 0.2s ease',
                        }}>
                            <ScxColumn xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGYYKxAkMyjJsDMoyRLip6ARkT-NpzXNGBMAqfOuRE_cvezjD1Xqa7k6noK_fOxSPG44Q&usqp=CAU" alt="Image 1" style={{ width: '100px', height: '100px', transition: 'transform 0.2s ease', borderRadius: '4%' }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    />
                                    <h1 style={{ textAlign: 'center', color: 'white', marginTop: '10px', fontSize: '17px', fontWeight: '500' }}>GRN</h1>
                                </div>
                            </ScxColumn>
                        </div>
                        <div style={{
                            padding: '0 20px',
                            transition: 'transform 0.2s ease',
                        }}>
                            <ScxColumn xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfGmI7tlcdZIlxO5rVREwK2_FtPDCe2O_We7JfeTC4l_AA_FMnzbTqiL4UnphdVES6fSw&usqp=CAU" alt="Image 1" style={{ width: '100px', height: '100px', transition: 'transform 0.2s ease', borderRadius: '4%' }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    />
                                    <h1 style={{ textAlign: 'center', color: 'white', marginTop: '10px', fontSize: '17px', fontWeight: '500' }}>RMW</h1>
                                </div>
                            </ScxColumn>
                        </div>
                        <div style={{
                            padding: '0 20px',
                            transition: 'transform 0.2s ease',
                        }}>
                            <ScxColumn xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg" alt="Image 1" style={{ width: '100px', height: '100px', transition: 'transform 0.2s ease', borderRadius: '4%' }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    />
                                    <h1 style={{ textAlign: 'center', color: 'white', marginTop: '10px', fontSize: '17px', fontWeight: '500' }}>Inspection</h1>
                                </div>
                            </ScxColumn>
                        </div>
                    </ScxRow>
                )}
            </Content>

        </ScxLayout>
    );
};

export default XapparalUi;
