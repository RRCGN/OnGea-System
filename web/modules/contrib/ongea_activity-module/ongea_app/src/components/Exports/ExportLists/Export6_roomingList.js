import React from 'react';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import {withExportProvider} from '../withExportProvider';
import ExportSettings from '../ExportElements/ExportSettings';
import PrintPage from '../ExportElements/PrintPage';






class Export6_roomingList extends React.Component {


  



  componentDidMount() {

  const listColumns = [

                        {id: 'country', columnLabel:'Country of Residency', location:'participant.country',translate:true,visible:true, order:1}, 
                        {id: 'firstname', columnLabel:'First name(s)',location:'participant.firstname',visible:true, order:2},
                        {id: 'lastname', columnLabel:'Family name(s)',location:'participant.lastname',visible:true, order:3, sortBy:'asc'},
                        {id: 'birthDate', columnLabel:'Birth date',location:'participant.birthDate',visible:true, isDate:true, order:4},
                        {id: 'languages', columnLabel:'Spoken languages',location:this.getLanguages,translate:true,visible:true, order:5}


                     ];


  const initialValues_Header = [
              {
                id:'title', 
                label: 'Title',
                value:this.props.data.title || undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'subtitle', 
                label: 'Subtitle',
                value:undefined,
                type:'TextInput',
                visible:false
              }
              




              ];

  this.props.setData({listColumns:listColumns, data:this.props.filterApproved(this.props.data.mobilities)});
  this.props.updateList(initialValues_Header,true);
        
      }


getLanguages = (mobility) =>{

  if(mobility.participant.languages && mobility.participant.languages.length>0){
    return mobility.participant.languages.map((it)=>(this.props.t(it))).join(', ');
  }else{
    return '';
  }

}


 
  
  render() {
     const {t, dataList, fields_Header, columnVisibility, csvData, hasIndex,handleRequestSort, order, orderBy} = this.props;
     const admitUser = (this.props.readOnly === true) ? false : true;

     var title = '';
     //console.log('datalist',dataList);
     if(fields_Header){
        title = fields_Header.find(it => it.id === 'title' && it.visible === true);
      }

    return (
      admitUser ? 
      <div>
     

    <ExportSettings
        t={t} 
        handleReset={this.props.handleReset}
        handleChange_Header={this.props.handleChange_Header}
        fields_Header={fields_Header}
        handleChange_List={this.props.handleChange_List}
        columnVisibility={columnVisibility}
      />

      <DownloadAndPrint 
        t={t}
        dataCSV={csvData && csvData.data && csvData.data.length > 0 ? csvData.data : undefined}
        headersCSV = {csvData && csvData.headers && csvData.headers.length > 0 ? csvData.headers : undefined}
        csvFilename={(title ? (title.value) : 'unknown')+'.csv' }
         print={false}
      />
      <PrintPage 
                  t={t}
                  fields_Header={fields_Header}
                  dataList={dataList}
                  hasIndex={hasIndex}
                  isIterated={false}
                  commentHeader={''}
                  commentFooter={''}
                  handleRequestSort = {handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
      
      </div>
      :
      <div class="ongeaAct__exports_noAdmittance">{t('no_admittance')}</div>
    );
  }
}


export default withExportProvider(Export6_roomingList);
