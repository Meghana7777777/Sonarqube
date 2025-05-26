import React from "react";
interface IHeaderTable {
    sizes: {
        size: string;
    }[]
    details: any
}
export const HeaderTable = (props: IHeaderTable) => {
    const { sizes, details } = props;
    return <table style={{ borderCollapse: 'collapse', borderBlockColor: 'black', width: '100%', border: '2px solid black', verticalAlign: 'top', padding: 0 }} cellSpacing="0" cellPadding='3' border={1} >
        <tr>
            <td colSpan={1} width={'30%'} style={{ background: '#b6ff2d59' }}><h4>{``}</h4></td>
            <td colSpan={3} style={{ textAlign: 'center', background: '#b6ff2d59' }} >
                <h2>SQ BIRICHINA LTD</h2>
            </td>
            <td colSpan={1}  width={'30%'} style={{ background: '#b6ff2d59' }}><h4>{``}</h4></td>
        </tr>
        <tr>
            <td colSpan={1} width={'30%'} style={{ background: '#b6ff2d59' }}><h4>{``}</h4></td>
            <td colSpan={3} style={{ textAlign: 'center', background: '#b6ff2d59' }} >
                <h4>PLOT 221,222,223, JAMIRDIA, VALUKA, MYMENSHINGH, BANGLADESH</h4>
            </td>
            <td colSpan={1}  width={'30%'} style={{ background: '#b6ff2d59' }}><h4>{``}</h4></td>
        </tr>
        <tr>
            <td width={'30%'} className="heightScaling" >
                <table style={{ borderCollapse: 'collapse', border: '0px solid black', borderBlockColor: 'black', height: '100%' }} border={1} width={'100%'} >
                    <tr >
                        <td><strong>Buyer</strong></td>
                        <td>{details.buyer}</td>
                    </tr>
                    <tr>
                        <td><strong>ORDER NO</strong></td>
                        <td>{details.PONo}</td>
                    </tr>
                    <tr>
                        <td><strong>ITEM</strong></td>
                        <td>{details.item}</td>
                    </tr>
                    <tr>
                        <td><strong>ORDER QTY</strong></td>
                        <td>{details.quantity}</td>
                    </tr>
                    <tr>
                        <td><strong>TODAY INSP</strong></td>
                        <td>{''}</td>
                    </tr>
                    <tr>
                        <td><strong>SHORT/EXCESS</strong></td>
                        <td>{''}</td>
                    </tr>
                    <tr>
                        <td><strong>PERCENTAGE(%)</strong></td>
                        <td>{''}</td>
                    </tr>
                </table>
            </td>
            <td width={'5%'}></td>
            <td width={'30%'} className="heightScaling" style={{border: '0px solid black'}}>
              
            </td>
            <td width={'5%'}></td>
            <td width={'30%'} className="heightScaling" >
                <table style={{ borderCollapse: 'collapse', border: '0px solid black', borderBlockColor: 'black', height: '100%' }} width={'100%'}>
                    <tr>
                        <td><strong>Date :-</strong>
                            {details.exfactory}
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>;
};

export default HeaderTable;
