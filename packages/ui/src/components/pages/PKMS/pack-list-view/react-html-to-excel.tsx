import React, { Component } from 'react';

interface ReactHTMLTableToExcelProps {
  table: string;
  filename: string;
  sheet: string;
  id?: string;
  className?: string;
  buttonText?: string;
}

class ReactHTMLTableToExcel extends Component<ReactHTMLTableToExcelProps> {
  static defaultProps = {
    id: 'button-download-as-xls',
    className: 'button-download',
    buttonText: 'Download',
  };

  constructor(props: ReactHTMLTableToExcelProps) {
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
  }

  static base64(s: string) {
    return window.btoa(unescape(encodeURIComponent(s)));
  }

  static format(s: string, c: { [key: string]: string }) {
    return s.replace(/{(\w+)}/g, (m, p) => c[p]);
  }
  

  handleDownload = () => {
    const tableElement = document.getElementById(this.props.table);
    if (!tableElement || tableElement.nodeName !== 'TABLE') {
      console.error('Provided table property is not an HTML table element');
      return;
    }

    const table = tableElement.outerHTML;
    const sheet = String(this.props.sheet);
    const filename = `${String(this.props.filename)}.xls`;
    //TODO: check
    //open-office
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">

        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>{worksheet}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        {table}
      </body>
      </html>`;

    const context = {
      worksheet: sheet || 'Worksheet',
      table,
    };

    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //   const fileData = [
    //     template.replace('{worksheet}', sheet).replace('{table}', table),
    //   ];
    //   const blob = new Blob(fileData);
    //   window.navigator.msSaveOrOpenBlob(blob, filename);
    //   return;
    // }

    const element = document.createElement('a');
    element.href = uri + ReactHTMLTableToExcel.base64(ReactHTMLTableToExcel.format(template, context));
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  override render() {
    const { id, className, buttonText } = this.props;

    return (
      <button
        id={id}
        className={className}
        type="button"
        onClick={this.handleDownload}
      >
        {buttonText}
      </button>
    );
  }
}

export default ReactHTMLTableToExcel;
