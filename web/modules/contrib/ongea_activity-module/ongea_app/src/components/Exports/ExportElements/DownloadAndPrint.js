import React from 'react';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import ExportIcon from '@material-ui/icons/OpenInBrowser';
import { CSVLink } from "react-csv";
import Tooltip from '@material-ui/core/Tooltip';
import ReactToPrint from "react-to-print";



class PropDataUpdatedCSVLink extends CSVLink {
    

    componentWillReceiveProps(nextProps) {
        const { data, headers, separator, uFEFF } = nextProps;
        this.setState({ href: this.buildURI(data, uFEFF, headers, separator) });
    }
}



export default class DownloadAndPrint extends React.Component {
  


    
  

  render() {
    const {t,dataCSV, headersCSV, csvFilename, print, printSectionRef} = this.props;
    
    return (

      <div id="test" className='ongeaAct__exports_downloadAndPrint'>
        
        
        {(print === false )? null : 
                <Tooltip title={t("print")}>
                <ReactToPrint
                  trigger={() => 
                                    <Button variant="fab" mini color="primary" aria-label="Print" tooltip={t('print')}>
                                        <PrintIcon />
                                     </Button>
                                    }
                  content={() => printSectionRef}
                />
                </Tooltip>
                

             }
         &nbsp;
         &nbsp;
         {dataCSV &&
         <Tooltip title={t("export_csv")}>
         <PropDataUpdatedCSVLink data={dataCSV} headers={headersCSV} filename={csvFilename} separator={";"} target="_blank">
            <Button variant="fab" mini color="primary" aria-label="Export" tooltip={t('export .csv')}>
            <ExportIcon />
            </Button>
        </PropDataUpdatedCSVLink>
        </Tooltip>}


       

      </div>
    );
  }
}


