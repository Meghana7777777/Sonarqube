import React from 'react';
import logo from '../../../../../assets/images/colorlogo.jpg';
import "./Pk-dispatch.css";
import { PkAodAbstarctModel, PkShippingItemsAbstractModel, sizesOrderArray } from '@xpparel/shared-models';


declare const PrintTypes: readonly ["Original", "Acknowledgement", "Security / Gate Copy", "Book Copy", "Duplicate"];
type PrintTypes = typeof PrintTypes[number];

interface IProps {
  shippingInfo: PkAodAbstarctModel[];
  printType: PrintTypes;
}

const PkPrintDispatch = (props: IProps) => {
  const renderCutBarcodeDetails = (shippingInfo: PkAodAbstarctModel[]) => {
    const trs: JSX.Element[] = [];
    let totalBundleQuantity = 0; 
    let totalQuantitySum = 0; 

    shippingInfo.forEach((info, productIndex) => {
      let productBundleQuantity = 0;  
      let productQuantitySum = 0;     
    
      info.shippingItemsAbstractInfo.forEach(item => {
        item.dSetItemsAbstract.forEach(dSetAbstract => {
          // dSetAbstract.dSetItems.sort((a, b) => 
          //   // sizesOrderArray.indexOf(a.quantity) - sizesOrderArray.indexOf(b.sze)
          // )
          

          dSetAbstract?.dSetItems?.forEach((bundle, i) => {
            trs.push(
              // <tr key={`${productIndex}-${i}-${dSetAbstract.cutNumber}${dSetAbstract.dSetId}`}>
              //   <td>{bundle.plantStyleRef}</td>
              //   <td>{dSetAbstract.productName || 'No Product Name'}</td>
              //   <td>{dSetAbstract.cutNumber}</td>
              //   <td>{bundle.bundles}</td> 
              //   <td>{bundle.size}</td>
              //   <td>{bundle.quantity}</td> 
              //   <td></td> 
              // </tr>
            );

            productBundleQuantity += bundle.quantity; 
            productQuantitySum += parseFloat(bundle.quantity.toString()); 
            totalBundleQuantity += bundle.quantity; 
            totalQuantitySum += parseFloat(bundle.quantity.toString());
          });
        });
      });

      trs.push(
        <tr key={`product-total-${productIndex}`}>
          <td colSpan={3}><strong>{info.shippingItemsAbstractInfo[0]?.dSetItemsAbstract[0]?.destinations || 'No Product Name'}</strong></td>
          <td><strong>{productBundleQuantity}</strong></td> 
          <td></td>
          <td><strong>{productQuantitySum.toFixed(2)}</strong></td> 
          <td></td>
        </tr>
      );
    });

    trs.push(
      <tr key="total-row">
        <td></td>
        <td></td>
        <td></td>
        <td><strong>Total Bundle Quantity: {totalBundleQuantity}</strong></td> 
        <td></td>
        <td><strong>Total Quantity: {totalQuantitySum.toFixed(2)}</strong></td> 
        <td></td>
      </tr>
    );

    return trs;
  };
  
  const { truckInfo, shippingInfo } = props.shippingInfo?.[0];
  const { dirverName, licenseNo, truckNumber } = truckInfo?.[0];

  return (
    <>
      <div className="each-page">
        <div className="dipatch-print">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ textAlign: 'center', flexGrow: 1 }}>
                <div style={{ marginBottom: '3px' }}>
                  <img style={{ width: '100px' }} src={logo} alt="Logo" />
                </div>
                <p style={{ margin: '5px 0' }}>
                  No: 100/1, Morahena, Pahala Mapitigama <br />
                  Malwana
                </p>
              </div>
              <div style={{ position: 'absolute', right: 0 }}>
                <span style={{ fontSize: '15px', padding: '15px 20px', fontWeight: '600', border: '1px solid #b3b3b3' }}>
                  {props.printType}
                </span>
              </div>
            </div>

            <h2 style={{ border: '1px solid black', textAlign: 'center' }}>DISPATCH ORDER</h2>

            <table>
              <tbody>
                <tr>
                  <th colSpan={4} className='text-left'>
                    To: {shippingInfo?.vendorInfo?.vAddress}, {shippingInfo?.vendorInfo?.vPlace}
                  </th>
                </tr>
                <tr>
                  <th style={{ width: '25%' }}>Vehicle No</th>
                  <th style={{ width: '25%' }}>{truckNumber}</th>
                  <th style={{ width: '25%' }}>Date</th>
                  <th style={{ width: '25%' }}></th>
                </tr>
              </tbody>
            </table>

            <p style={{ textAlign: 'center' }}>
              The under mentioned goods are dispatched to you, please acknowledge this receipt.
            </p>

            <table className="core-table tbl-border" style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
              <thead>
                <tr>
                  <th>Style Number</th>
                  <th>Product Name</th>
                  <th>Cut Number</th>
                  <th>Total Bundle Quantity</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {renderCutBarcodeDetails(props.shippingInfo)}
              </tbody>
            </table>

            <table className="dispatch-table">
              <tbody>
                <tr>
                  <td colSpan={2}>CCP NORLANKA</td>
                  <td colSpan={1}>ACCEPTED ABOVE GOODS BY</td>
                </tr>
                <tr>
                  <td>Prepared By:</td>
                  <td>The goods taken out are in accordance with the particulars given above</td>
                  <td>Driver Name: <strong>{dirverName}</strong></td>
                </tr>
                <tr>
                  <td>Issued By</td>
                  <td>Name of OIC / MO:</td>
                  <td>ID No / Driver's License No: <strong>{licenseNo}</strong></td>
                </tr>
                <tr>
                  <td>Approved By ((OM/ HOD/ HRM)):</td>
                  <td>Date:</td>
                  <td>Date:</td>
                </tr>
                <tr>
                  <td>Received By:</td>
                  <td rowSpan={2}>Signature / Seal:</td>
                  <td rowSpan={2}>Signature:</td>
                </tr>
                <tr>
                  <td>Signature:</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PkPrintDispatch;
