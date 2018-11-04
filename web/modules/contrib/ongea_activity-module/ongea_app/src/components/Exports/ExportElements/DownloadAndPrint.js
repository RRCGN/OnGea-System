import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import ExportIcon from '@material-ui/icons/OpenInBrowser';
import { CSVLink } from "react-csv";
import Tooltip from '@material-ui/core/Tooltip';




 





export default class DownloadAndPrint extends React.Component {
  constructor(props) {
    super(props);

    
  }
  
handlePrint(){}

  render() {
    //console.log('PROPS',this.props);
    const {dataCSV, headersCSV, csvFilename} = this.props;
console.log('data',dataCSV);
console.log('header',headersCSV);
    
    return (
      <div className='ongeaAct__exports_downloadAndPrint'>

        <Tooltip title="print">
        <Button variant="fab" mini color="primary" onClick={window.print} aria-label="Print" tooltip='print'>
            <PrintIcon />
         </Button>
         </Tooltip>
         &nbsp;
         &nbsp;
         {dataCSV &&
         <Tooltip title="export .csv">
         <CSVLink data={dataCSV} headers={headersCSV} filename={csvFilename} target="_blank">
            <Button variant="fab" mini color="primary" aria-label="Export" tooltip='export .csv'>
            <ExportIcon />
            </Button>
        </CSVLink>
        </Tooltip>}


       

      </div>
    );
  }
}


