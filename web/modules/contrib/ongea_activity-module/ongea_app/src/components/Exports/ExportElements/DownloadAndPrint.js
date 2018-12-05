import React from 'react';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import ExportIcon from '@material-ui/icons/OpenInBrowser';
import { CSVLink } from "react-csv";
import Tooltip from '@material-ui/core/Tooltip';




 





export default class DownloadAndPrint extends React.Component {
  

  render() {
    //console.log('PROPS',this.props);
    const {t,dataCSV, headersCSV, csvFilename, print} = this.props;

    
    return (
      <div className='ongeaAct__exports_downloadAndPrint'>

        {(print === false )? null : <Tooltip title={t("print")}>
                <Button variant="fab" mini color="primary" onClick={window.print} aria-label="Print" tooltip={t('print')}>
                    <PrintIcon />
                 </Button>
                 </Tooltip>}
         &nbsp;
         &nbsp;
         {dataCSV &&
         <Tooltip title={t("export .csv")}>
         <CSVLink data={dataCSV} headers={headersCSV} filename={csvFilename} target="_blank">
            <Button variant="fab" mini color="primary" aria-label="Export" tooltip={t('export .csv')}>
            <ExportIcon />
            </Button>
        </CSVLink>
        </Tooltip>}


       

      </div>
    );
  }
}


