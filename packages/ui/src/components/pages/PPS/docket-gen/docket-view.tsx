import { DocRollsModel, DocketAndFabHelperModel, DocketDetailedInfoModel, DocketGroupDetailedInfoModel, DocketLayModel, PoMarkerModel, PoRatioSizeModel, sizesOrderArray } from "@xpparel/shared-models";
import { Flex } from "antd";
import moment from "moment";
import logo from '../../../../assets/images/colorlogo.jpg';
import { docketBindingRequirement, docketRequirementWithoutBinding } from '../../../../../../libs/shared-calculations/src/common-calculations/common-calcultatoins';

interface IProps {
    docketData: DocketGroupDetailedInfoModel
}
const DocketView = (props: IProps) => {
    const { docketData } = props;

    const getRequireMents = (markerLength: number, totalPlies: number, cutWastage: number = 0, bindingConsumption: number = 0, originalDocQuantity: number) => {
        const reqWithOutWastage = docketRequirementWithoutBinding(totalPlies, markerLength);
        const reqWithWastage = docketRequirementWithoutBinding(totalPlies, markerLength, cutWastage);
        const bindReqWithOutWastage = docketBindingRequirement(originalDocQuantity, bindingConsumption);
        const bindReqWithWastage = docketBindingRequirement(originalDocQuantity, bindingConsumption, cutWastage);
        const totalReqWOWastage = Number(reqWithOutWastage) + Number(bindReqWithOutWastage);
        const totalReqWithWastage = Number(reqWithWastage) + Number(bindReqWithWastage);
        return <>
            <td>{bindReqWithWastage.toFixed(2)}</td>
            <td>{bindReqWithOutWastage.toFixed(2)}</td>
            <td>{reqWithWastage.toFixed(2)}</td>
            <td>{reqWithOutWastage.toFixed(2)}</td>
            <td>{totalReqWithWastage.toFixed(2)}</td>
            <td>{totalReqWOWastage.toFixed(2)}</td>
        </>
    }
    const constructSizeBreakDownArray = (sizeRatios: PoRatioSizeModel[]): { [key: string]: number }[] => {

        const sizeRatioMap: Map<string, PoRatioSizeModel> = new Map<string, PoRatioSizeModel>();
        sizeRatios.forEach(s => {
            sizeRatioMap.set(s.size, s);
        });

        // const sizes: string[] = []
        // const extraSizes = new Set<string>();
        // sizesOrderArray.forEach(sO => {
        //     [...sizeRatioMap.keys()].forEach(aS => {
        //         if (sO == aS) {
        //             sizes.push(aS)
        //         } else {
        //             extraSizes.add(aS)
        //         }
        //     })
        // });
        // const sizeOrderSet = new Set([...sizes, ...extraSizes]);

        const sizeBreakDownArray: { [key: string]: number }[] = [];
        let tempSizeBreakDown: { [key: string]: number } = {};
        const sizeBreakDownCount = 15;
        [...sizeRatios].forEach((s, i) => {
            if (i > 0 && i % sizeBreakDownCount === 0) {
                sizeBreakDownArray.push(tempSizeBreakDown);
                tempSizeBreakDown = {};
            }
            // tempSizeBreakDown[s] = sizeRatioMap.get(s).ratio;
            tempSizeBreakDown[s.size] = s.ratio;
        });

        if (Object.keys(tempSizeBreakDown).length > 0) {
            sizeBreakDownArray.push(tempSizeBreakDown);
        }

        return sizeBreakDownArray;

    }
    const renderSizeWiseData = (sizeRatios: PoRatioSizeModel[], plies: number, totalSubDockets: number) => {
        const sizeBreakDownArr = constructSizeBreakDownArray(sizeRatios);
        return sizeBreakDownArr.map(eT => {
            let totalRatioPlies = 0;
            // let noOfDockets = docketData.docketGroupBasicInfo.docketNumbers.length;
            let noOfDockets = 1;
            return <table className="core-table tbl-border" style={{ marginBottom: '10px' }}>
                <thead>
                    <tr>
                        <th>Size</th>
                        {Object.keys(eT).map(size => <th>{size}</th>)}
                        <th>Total Bundles</th>
                        <th>Plies</th>
                        <th>Sub Dockets</th>
                        <th>Total Quantity</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Ratio</th>
                        {Object.values(eT).map((r, i) => {
                            r = r * noOfDockets;
                            totalRatioPlies += r;
                            return <td>{r}</td>
                        })}
                        <th rowSpan={2}>{totalRatioPlies}</th>
                        <th rowSpan={2}>{plies}</th>
                        <th rowSpan={2}>{(totalSubDockets)}</th>
                        <th rowSpan={2}>{Number(plies) * totalRatioPlies * totalSubDockets}</th>
                    </tr>
                    <tr>
                        <th>Quantity</th>
                        {Object.values(eT).map((r, i) => {
                            return <td>{r * Number(plies) * noOfDockets}</td>
                        })}
                    </tr>

                </tbody>
            </table>
        })
    }

    // const displayShortMessageIfClubbed = (docketInfo: DocketAndFabHelperModel[]) => {
    //     if (docketInfo.length > 1) {
    //         const uniqueDocketNumbers = [...new Set(docketInfo.map(d => d.docketNumber))];
    //         return (
    //             <table className="core-table tbl-border" style={{ marginBottom: '10px' }}>
    //                 <thead>                    
    //                     <tr>
    //                         <td colSpan={2}>* Displaying the ratio with multiply of no of product involved in the clubbing.</td>
    //                     </tr>
    //                     <tr>
    //                         <td>No Of Products involved in the Club dockets are:</td>
    //                         <td>{uniqueDocketNumbers.join(', ')}</td>
    //                     </tr>
    //                 </thead>
    //             </table>
    //         );
    //     }
    //     return null; // Return null if docketInfo length is 1 or less
    // }

    const renderRollData = (allocatedRolls: DocRollsModel[], markerInfo: PoMarkerModel) => {
        const rollShadeMap = new Map<string, DocRollsModel[]>();
        const tblData = [];
        allocatedRolls.forEach(roll => {
            if (!rollShadeMap.has(roll.shade)) {
                rollShadeMap.set(roll.shade, []);
            }
            rollShadeMap.get(roll.shade).push(roll);
        });
        const sortingShades = Array.from(rollShadeMap.keys()).sort();
        let totalTicketLength = 0;
        let totalPlies = 0;

        sortingShades.forEach(shade => {
            let subTicketLength = 0;
            let subPlies = 0;
            rollShadeMap.get(shade).forEach(roll => {
                subTicketLength += Number(roll.allocatedQuantity);
                totalTicketLength += Number(roll.allocatedQuantity);
                const plies = Number(roll.allocatedQuantity) /
                    (docketGroupBasicInfo?.actualMarkerInfo?.markerLength? Number(docketGroupBasicInfo?.actualMarkerInfo?.markerLength) : Number(markerInfo.mLength));
                subPlies += plies;
                totalPlies += plies;
                const tr = <tr>
                    <td></td>
                    <td>
                        {roll?.palletCode}<br/> 
                        {roll?.binCode}<br/> 
                        {roll?.trayCode}<br/> 
                        {roll?.trolleyCode}
                    </td>
                    <td>{roll.rollBarcode}</td>
                    <td>{roll.externalRollNumber}</td>
                    <td>{roll.batch}</td>
                    <td>{roll.shade}</td>
                    <td>{roll.rollQty}</td>
                    <td>{roll.allocatedQuantity}</td>
                    <td>{roll.plWidth}</td>
                    <td>{roll.aWidth}</td>
                    <td></td>
                    <td>{plies.toFixed(2)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                tblData.push(tr);
            });
            const tr = <tr style={{ fontWeight: 500 }}>
                <th colSpan={7}>Total Allocated Qty of Shade - {shade}</th>
                <th>{subTicketLength.toFixed(2)}</th>
                <th colSpan={3}>Total Plies of Shade - {shade}</th>
                <th>{subPlies.toFixed(2)}</th>
                <th colSpan={11}></th>
            </tr>
            tblData.push(tr);
        });
        // Grand Total
        const tr = <tr style={{ fontWeight: 500 }}>
            <th colSpan={7}>Grand Total Allocated Qty</th>
            <th>{totalTicketLength.toFixed(2)}</th>
            <th colSpan={3}>Grand Total Plies</th>
            <th>{totalPlies.toFixed(2)}</th>
            <th colSpan={11}></th>
        </tr>;

        tblData.push(tr);
        return tblData;
    }

    const renderEmptyRows = () => {
        return Array.from({ length: 15 }, (_, index) => <tr>
            {Array.from({ length: 23 }, (_, index) => <td style={{ height: '15px' }}></td>)}
        </tr>)
    }
    const currentDate = moment();
    const formattedDate = currentDate.format('DD-MM-YYYY');
    const time = currentDate.format('HH:mm:ss');
    const formattedDate2 = currentDate.format('DD/MM/YYYY');
    const { docketGroupBasicInfo, 
        // soAndCustomerInfo TODO:CUT
    } = docketData;
    const { docketNumbers } = docketGroupBasicInfo;
    const uniqueProductNames = [...new Set(docketNumbers.map(d => d.productName))];
    const uniqueColorNames = [...new Set(docketNumbers.map(d => d.fgColor))];
    const uniqueComponents = [...new Set(docketNumbers.flatMap(d => d.components))];
    const fabricCodes = [...new Set(docketNumbers.flatMap(d => d.itemCode))];
    const fabricReferences = [...new Set(docketNumbers.flatMap(d => d.itemDesc))];
    const noOfDocketsData = [...new Set(docketNumbers.flatMap(d => d.docketNumber))];
    const productTypes = [...new Set(docketNumbers.flatMap(d => d.productType))];
    return <>
        {docketData && <div id="printArea">
            <Flex justify={'space-between'} align={'center'}>
                <div><img style={{ width: '100px' }} src={logo} /></div>
                <div>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '20px' }}>CUTTING DOCKET(NORLANKA CCP-MALWANA)</div>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>Document No: CUT {`${docketGroupBasicInfo?.docketNumbers?.[0].cutSubNumber} | Docket-${docketGroupBasicInfo.docketGroup} | ${formattedDate2}`}</div>
                </div>
                <div>
                    <table className="core-table">
                        <thead>
                            <tr>
                                <th>Date : </th>
                                <th>{formattedDate}</th>
                            </tr>
                            <tr>
                                <th>Time : </th>
                                <th>{time}</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </Flex>
            <hr />
            <Flex justify={'space-between'} align={'center'}>
                <div style={{ flex: '1 1 auto' }}>
                    <table className="core-table doc-header-tbl">
                        <tbody>
                            <tr>
                                {/* TODO:CUT */}
                                {/* <th >Style : {docketData.soAndCustomerInfo[0].styleCode}</th>
                                <th >Buyer PO : {docketData.soAndCustomerInfo[0].buyerPoNumber}</th>
                                <th >Sale Order : {docketData.docketGroupBasicInfo.so}</th> */}
                            </tr>
                            <tr>
                                <th style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>SO Lines : {docketGroupBasicInfo.moLines.join(', ')}</th>
                                <th style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Color : {uniqueColorNames.join(', ')}</th>
                                <th style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Product Type : {productTypes.join(', ')}</th>
                            </tr>
                            <tr>
                                <th style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Product Name : {uniqueProductNames.join(', ')}</th>
                                {/* TODO:CUT */}
                                {/* <th style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Plant Style Reference No : {soAndCustomerInfo[0].plantStyle}</th> */}
                                <th style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Fabric PO :</th>
                            </tr>
                            <tr>
                                <th colSpan={2} style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Components : {uniqueComponents.join(', ')}</th>
                                {/* TODO:CUT */}
                                {/* <th colSpan={1} style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Customer : {soAndCustomerInfo[0].customerName}</th> */}
                            </tr>
                            <tr>
                                <th style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Fabric Code : {fabricCodes}</th>
                                <th colSpan={2} style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>Fabric Reference  : {fabricReferences}</th>
                            </tr>
                        </tbody>

                    </table>
                </div>
                <div style={{ flex: '0 0 200px', marginLeft: '5px' }}>
                    <div style={{ width: '100%', height: '163px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>
                        FABRIC SWATCH
                    </div>
                </div>
            </Flex>

            <br />
            <Flex>
                <table className="core-table tbl-border">
                    <thead>
                        <tr>
                            <th rowSpan={2}>Marker Name (P/A)	</th>
                            <th rowSpan={2}>Marker Length (P/A)</th>
                            <th rowSpan={2}>Marker Width (P/A)</th>
                            <th rowSpan={2}>Marker Consumption</th>
                            <th rowSpan={2}>Marker Perimeter(CM)</th> {/* Not capturing and  Coming */}
                            <th rowSpan={2}>End Allowance</th>  {/* Not capturing and Coming */}
                            <th rowSpan={2}>Cut Wastage %</th>  {/* Not Coming */}
                            <th rowSpan={2}>Binding Consumption</th> {/* Not Coming */}
                            <th colSpan={2}>Binding Requirement</th>
                            <th colSpan={2}>Requirement</th>
                            <th colSpan={2}>Total Requirement</th>
                            <th rowSpan={2}>Pattern</th>
                        </tr>
                        <tr>
                            <th>WW</th>
                            <th>WO/W</th>
                            <th>WW</th>
                            <th>WO/W</th>
                            <th>WW</th>
                            <th>WO/W</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{docketGroupBasicInfo.markerInfo.mName}<hr />{docketGroupBasicInfo?.actualMarkerInfo?.markerName}</td>
                            <td>{docketGroupBasicInfo.markerInfo.mLength}<hr />{docketGroupBasicInfo?.actualMarkerInfo?.markerLength}</td>
                            <td>{docketGroupBasicInfo.markerInfo.mWidth}<hr />{docketGroupBasicInfo?.actualMarkerInfo?.markerWidth}</td>
                            <td>{(Number(docketGroupBasicInfo.markerInfo.mLength) / Number(docketData.docketGroupBasicInfo.docketNumbers?.map(item => item.totalBundles).reduce((prev, next) => prev + next))).toFixed(2)}</td>
                            <td> {(Number(docketGroupBasicInfo.markerInfo.perimeter)).toFixed(2)} </td>
                            <td> {docketGroupBasicInfo.markerInfo.endAllowance} </td>
                            <td>{docketData.fabricInfo?.[0].wastage}</td> {/* Not Coming */}
                            <td>{docketData.fabricInfo?.[0].bindingConsumption}</td> {/* Not Coming */}
                            {getRequireMents(
                                Number(docketGroupBasicInfo?.actualMarkerInfo?.markerLength) || Number(docketGroupBasicInfo.markerInfo.mLength)
                                , docketGroupBasicInfo.plies, docketData.fabricInfo?.[0].wastage, docketData.fabricInfo?.[0].bindingConsumption, (docketGroupBasicInfo.originalDocQuantity*docketData.docketGroupBasicInfo.docketNumbers.length))}
                            <td>{docketGroupBasicInfo.markerInfo.pVersion}</td>
                        </tr>
                    </tbody>
                </table>
                {/* <div style={{ flex: '0 0 200px', marginLeft: '5px' }}>
                    <div style={{ width: '90%', height: '163px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>

                    </div>
                </div> */}
            </Flex>
            <br />
            {/* {displayShortMessageIfClubbed(docketGroupBasicInfo.docketNumbers)}                       */}
            {/* <br /> */}
            {/* {renderSizeWiseData(docketGroupBasicInfo.sizeRatios, docketGroupBasicInfo.plies,docketGroupBasicInfo.docketNumbers.length)} */}
            {/* <br /> */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div>
                    {renderSizeWiseData(docketGroupBasicInfo.sizeRatios, docketGroupBasicInfo.plies, docketGroupBasicInfo.docketNumbers.length)}
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <table className="core-table tbl-border">
                        <thead>
                            <tr>
                                <th style={{ width: '500px' }}>Remarks</th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        width: docketGroupBasicInfo?.remark
                                            ? `${Math.min(docketGroupBasicInfo.remark.length * 10, 1000)}px` 
                                            : '500px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',height:'40px' 
                                    }}
                                >
                                    {docketGroupBasicInfo?.remark}
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <table className="core-table tbl-border" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ width: '120px', textAlign: 'left' }}>Special Comment</th>
                        <th> {docketGroupBasicInfo.markerInfo.cadRemarks} || {docketGroupBasicInfo.markerInfo.docRemarks}</th>
                    </tr>
                </thead>
            </table>
            <br />
            <table className="core-table tbl-border">
                <thead>
                    <tr>
                        <th className='t-rotate-90'><p>Sequence No</p></th>
                        <th className='t-rotate-90'><p>Location</p></th>
                        <th className='t-rotate-90'><p>Barcode #</p></th>
                        <th className='t-rotate-90'><p>Roll No #</p></th>
                        <th className='t-rotate-90'><p>Batch #</p></th>
                        <th className='t-rotate-90'><p>Shade</p></th>
                        <th className='t-rotate-90'><p>Ticket Length</p></th>
                        <th className='t-rotate-90'><p>Allocated Qty</p></th>
                        <th className='t-rotate-90'><p>PL Width</p></th>
                        <th className='t-rotate-90'><p>Relax Width</p></th>
                        <th className='t-rotate-90'><p>Actual Width</p></th>
                        <th className='t-rotate-90'><p>Plies</p></th>
                        <th className='t-rotate-90'><p>Actual Plies</p></th>
                        <th className='t-rotate-90'><p>Layed Yardage</p></th>
                        <th className='t-rotate-90'><p>OverLapping Joint</p></th>
                        <th className='t-rotate-90'><p> Of Joints Number</p></th>
                        <th className='t-rotate-90'><p>Plie for Next Roll Half</p></th>
                        <th className='t-rotate-90'><p> of Previous Roll Half Plie</p></th>
                        <th className='t-rotate-90'><p>Fabric Defects</p></th>
                        <th className='t-rotate-90'><p>Usable Remains</p></th>
                        <th className='t-rotate-90'><p> Remains Unusable</p></th>
                        <th className='t-rotate-90'><p>Shortage</p></th>
                        <th className='t-rotate-90'><p>Remarks</p></th>
                    </tr>
                </thead>
                <tbody>
                    {docketData.allocatedRolls.length > 0 ? renderRollData(docketData.allocatedRolls, docketGroupBasicInfo.markerInfo) : renderEmptyRows()}
                </tbody>
            </table>
            <br />
            <Flex justify={'space-between'} align={'center'} style={{ fontWeight: 500 }}>
                <table className="core-table tbl-border">
                    <tbody>
                        <tr>
                            <td colSpan={2}>For Stores</td>
                            <td colSpan={2}>For Cutting</td>
                        </tr>
                        <tr>
                            <td >Fabric Issued Person</td>
                            <td style={{ width: '130px' }} ></td>
                            <td >Spreader Operator</td>
                            <td style={{ width: '130px' }} ></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>For Cutting</td>
                            <td colSpan={1}>Cutter</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td >Received Person</td>
                            <td style={{ width: '130px' }} ></td>
                            <td >Bundle Ticket</td>
                            <td style={{ width: '130px' }} ></td>
                        </tr>
                    </tbody>
                </table>
                <table className="core-table tbl-border" style={{ fontWeight: 500 }}>
                    <tbody>
                        <tr>
                            <td colSpan={2}>For CAD</td>

                        </tr>
                        <tr>
                            <td >Plotter Operator</td>
                            <td style={{ width: '130px' }} ></td>

                        </tr>
                        <tr>
                            <td colSpan={2}>For Quality</td>
                        </tr>
                        <tr>
                            <td >QC</td>
                            <td style={{ width: '130px' }} ></td>

                        </tr>
                    </tbody>
                </table>
            </Flex>
            <br />
            <table className="core-table tbl-border" style={{ fontWeight: 500 }}>
                <tbody>
                    <tr>
                        <td>Laying Start Time</td>
                        <td style={{ width: '130px' }} ></td>
                        <td>Laying End Time</td>
                        <td style={{ width: '130px' }} ></td>
                    </tr>
                </tbody>
            </table>
        </div>}
    </>
}

export default DocketView;