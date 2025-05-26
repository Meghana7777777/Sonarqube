import { GetBinsByRackIdReq } from "@xpparel/shared-models";
import { BinsServices } from "@xpparel/shared-services";
import { ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { useEffect, useState } from "react";


export const PalletAlignment = () => {
    const [showCard, setShowCard] = useState(false);
    const [showLoadedCard, setShowLoadedCard] = useState(false)
  

    const handleMouseEnter = () => {
        setShowCard(true);
        setShowLoadedCard(true);
    };
    const handleMouseEnterCard = () => {
        setShowLoadedCard(true);
    };

    const handleMouseLeave = () => {
        setShowCard(false);
        setShowLoadedCard(false);
    };
    const handleMouseLeaveCard = () => {
        setShowLoadedCard(false);
    };



    return (
        <div>
            <ScxRow>
                <>
                    <a
                        style={{
                            borderStyle: "solid",
                            borderWidth: "0px",
                            borderRadius: "5px",
                            backgroundColor: '#EAF6F7',
                            height: "30px",
                            width: "30px",
                            marginLeft: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></a>
                    {showCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRhGTlwKRofYhJzkAXRn_4SVl5-GWJYHnMl0qg4ANoYc17-bNiHLZTGffV-ISIGxBK1s&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Empty</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13  ',
                        height: "30px",
                        width: "30px",
                        marginLeft: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }} onMouseEnter={handleMouseEnterCard}
                        onMouseLeave={handleMouseLeaveCard}>
                    </a>
                    {showLoadedCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Loaded</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13  ',
                        height: "30px",
                        width: "30px",
                        marginLeft: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }} onMouseEnter={handleMouseEnterCard}
                        onMouseLeave={handleMouseLeaveCard}>
                    </a>
                    {showLoadedCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Loaded</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a
                        style={{
                            borderStyle: "solid",
                            borderWidth: "0px",
                            borderRadius: "5px",
                            backgroundColor: '#EAF6F7',
                            height: "30px",
                            width: "30px",
                            marginLeft: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></a>
                    {showCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRhGTlwKRofYhJzkAXRn_4SVl5-GWJYHnMl0qg4ANoYc17-bNiHLZTGffV-ISIGxBK1s&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Empty</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13  ',
                        height: "30px",
                        width: "30px",
                        marginLeft: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }} onMouseEnter={handleMouseEnterCard}
                        onMouseLeave={handleMouseLeaveCard}>
                    </a>
                    {showLoadedCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Loaded</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
            </ScxRow>
            <ScxRow style={{ marginTop: '10px' }}>
                <>
                    <a
                        style={{
                            borderStyle: "solid",
                            borderWidth: "0px",
                            borderRadius: "5px",
                            backgroundColor: '#EAF6F7',
                            height: "30px",
                            width: "30px",
                            marginLeft: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></a>
                    {showCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRhGTlwKRofYhJzkAXRn_4SVl5-GWJYHnMl0qg4ANoYc17-bNiHLZTGffV-ISIGxBK1s&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Empty</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13  ',
                        height: "30px",
                        width: "30px",
                        marginLeft: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }} onMouseEnter={handleMouseEnterCard}
                        onMouseLeave={handleMouseLeaveCard}>
                    </a>
                    {showLoadedCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Loaded</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13  ',
                        height: "30px",
                        width: "30px",
                        marginLeft: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }} onMouseEnter={handleMouseEnterCard}
                        onMouseLeave={handleMouseLeaveCard}>
                    </a>
                    {showLoadedCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Loaded</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a
                        style={{
                            borderStyle: "solid",
                            borderWidth: "0px",
                            borderRadius: "5px",
                            backgroundColor: '#EAF6F7',
                            height: "30px",
                            width: "30px",
                            marginLeft: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></a>
                    {showCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRhGTlwKRofYhJzkAXRn_4SVl5-GWJYHnMl0qg4ANoYc17-bNiHLZTGffV-ISIGxBK1s&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Empty</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13  ',
                        height: "30px",
                        width: "30px",
                        marginLeft: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }} onMouseEnter={handleMouseEnterCard}
                        onMouseLeave={handleMouseLeaveCard}>
                    </a>
                    {showLoadedCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Loaded</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
            </ScxRow>
            <ScxRow style={{ marginTop: '10px' }}>
                <>
                    <a
                        style={{
                            borderStyle: "solid",
                            borderWidth: "0px",
                            borderRadius: "5px",
                            backgroundColor: '#EAF6F7',
                            height: "30px",
                            width: "30px",
                            marginLeft: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></a>
                    {showCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRhGTlwKRofYhJzkAXRn_4SVl5-GWJYHnMl0qg4ANoYc17-bNiHLZTGffV-ISIGxBK1s&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Empty</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13  ',
                        height: "30px",
                        width: "30px",
                        marginLeft: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }} onMouseEnter={handleMouseEnterCard}
                        onMouseLeave={handleMouseLeaveCard}>
                    </a>
                    {showLoadedCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Loaded</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13  ',
                        height: "30px",
                        width: "30px",
                        marginLeft: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                    }} onMouseEnter={handleMouseEnterCard}
                        onMouseLeave={handleMouseLeaveCard}>
                    </a>
                    {showLoadedCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Loaded</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a
                        style={{
                            borderStyle: "solid",
                            borderWidth: "0px",
                            borderRadius: "5px",
                            backgroundColor: '#EAF6F7',
                            height: "30px",
                            width: "30px",
                            marginLeft: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></a>
                    {showCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRhGTlwKRofYhJzkAXRn_4SVl5-GWJYHnMl0qg4ANoYc17-bNiHLZTGffV-ISIGxBK1s&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Empty</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
                <>
                    <a
                        style={{
                            borderStyle: "solid",
                            borderWidth: "0px",
                            borderRadius: "5px",
                            backgroundColor: '#EAF6F7',
                            height: "30px",
                            width: "30px",
                            marginLeft: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></a>
                    {showCard && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '10px',
                                backgroundColor: 'green',
                                padding: '5px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                opacity: 0.7,
                                margin: '0px'
                            }}
                        >
                            <ScxRow>
                                <ScxColumn span={12}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRhGTlwKRofYhJzkAXRn_4SVl5-GWJYHnMl0qg4ANoYc17-bNiHLZTGffV-ISIGxBK1s&usqp=CAU" alt="Image" style={{ width: '50px', height: '50px' }} />
                                </ScxColumn>
                                <ScxColumn span={12}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', marginLeft: '3px', marginRight: '0px' }}>Empty</p>
                                </ScxColumn>
                            </ScxRow>
                        </div>
                    )}
                </>
            </ScxRow>
        </div>
    )
}

