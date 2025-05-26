import { FileExcelFilled } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import moment from 'moment';
import { TableExport } from 'tableexport';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface IPackListTemplate {
}


export const PackListTemplate = (props: IPackListTemplate) => {
    const downloadTemplate = () => {
        const table = document.getElementById('packingListTemplate') as HTMLElement
        // Apply CSS styles to the header cells
        const headerCells = table.querySelectorAll('.header-cell');
        headerCells.forEach((cell: any) => {
            cell.style.backgroundColor = '#e2e2e2'; // Apply the same background color as defined in CSS
            cell.style.color = '#333'; // Apply the same text color as defined in CSS
            cell.style.fontWeight = 'bold'; // Apply the same font weight as defined in CSS
        });
        const fileName = 'packing-list-template' + '-' + moment(new Date()).unix();
        const tableExport = new TableExport(table, {
            headers: true, // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
            footers: true, // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
            formats: ['xlsx'], // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
            filename: fileName, // (id, String), filename for the downloaded file, (default: 'id')
            bootstrap: true, // (Boolean), style buttons using bootstrap, (default: true)
            exportButtons: false, // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
            position: 'bottom', // (top, bottom), position of the caption element relative to table, (default: 'bottom')
            ignoreRows: undefined, // (Number, Number[]), row indices to exclude from the exported file(s) (default: undefined)
            ignoreCols: undefined, // (Number, Number[]), column indices to exclude from the exported file(s) (default: undefined)
            trimWhitespace: true, // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
            RTL: false, // (Boolean), set direction of the worksheet to right-to-left (default: false)
            sheetname: 'Sheet1' // (id, String), sheet name for the exported spreadsheet, (default: 'id')
        });

        // Export the table to XLSX format
        const exportData = tableExport.getExportData();
        const xlsxData = exportData['packingListTemplate'].xlsx;
        const dataWithoutIndexes = xlsxData.data.map(row => Object.values(row));
        const sheet = XLSX.utils.aoa_to_sheet(dataWithoutIndexes, {
            cellStyles: true,
        });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

        // Convert the workbook to an array buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Create a Blob from the array buffer
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Save the XLSX file
        saveAs(blob, fileName + '.xlsx');
    }

    const downloadExcel = () => {
        const uniqueFilename = `packing-list-template-${moment(new Date()).unix()}.xlsx`;
        const link = document.createElement('a');
        link.href = './assets/template.xlsx';
        link.download = uniqueFilename;
        link.click();
      };
    return (
        <div>
            <table className="packing" id="packingListTemplate" style={{ display: 'none', border: '1px solid black', backgroundColor: '#ffffff' }} border={1} cellPadding={1} cellSpacing={2} >
                <thead>
                    <tr >
                        <td className='header-cell' style={{ borderStyle: "inset" }}>
                            packing list number
                        </td>
                        <td style={{ borderStyle: "inset" }}>

                        </td>
                    </tr>
                    <tr>
                        <td style={{ borderStyle: "inset" }}>
                            packing list date
                        </td>
                        <td style={{ borderStyle: "inset" }}>

                        </td>
                    </tr>
                    <tr></tr>
                    <tr>
                        <td style={{ borderStyle: "inset" }}>
                            PO Number
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            PO Line Item Number
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Material Item Code
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Object Type
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Object Qty
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            UoM
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Mill Shade Reference
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Object Width
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Width UOM
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            GSM
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Object Number
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Lot Number
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            net-weight-Kg
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            gross-weight-Kg
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Color
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Style-ref-number
                        </td>
                        <td style={{ borderStyle: "inset" }}>
                            Lot remarks
                        </td>
                    </tr>
                </thead>
            </table>
            <Tooltip placement="topRight" title="Download Excel Template">
                <Button
                    size='small'
                    type="default"
                    className={"export-excel-btn"}
                    onClick={downloadExcel}
                    icon={<FileExcelFilled />}
                >Download Template</Button>
            </Tooltip>

        </div>
    )
}

export default PackListTemplate