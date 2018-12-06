import React from 'react';
import Header from '../ExportElements/Header';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import Footer from '../ExportElements/Footer';
import List from '../ExportElements/List';
import HeaderInputField from '../ExportElements/HeaderInputField';
import Panel from '../../elements/Panel';
import Grid from '@material-ui/core/Grid';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import { ContentTypes } from '../../../config/content_types';
import {CheckboxInput} from '../../elements/FormElements/FormElements';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';







class Export4_forYouthpassCertificates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
      fields_Header: [
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
              




              ],
        initialValues_Header:[],
        dataList:[],
        columnVisibility:[],
        hasIndex:false,
        listColumns:[

                        {id: 'country', columnLabel:'Cntr', location:'participant.country',visible:true, order:1}, 
                        {id: 'firstname', columnLabel:'First Name',location:'participant.firstname',visible:true, order:2},
                        {id: 'lastname', columnLabel:'Family Name',location:'participant.lastname',visible:true, order:3},
                        {id: 'birthDate', columnLabel:'DoB',location:'participant.birthDate',visible:true, isDate:true, order:4},
                        {id: 'languages', columnLabel:'Language(s)',location:'participant.languages',visible:true, order:5}


                     ]
    };
    
  }

static defaultProps = {
    columnsHideable:true
  }


  componentDidMount() {
      const fields_Header = JSON.parse(JSON.stringify(this.state.fields_Header));

      if(this.props.columnsHideable){
        const columnVisibility = this.orderColumns(this.combineEqualColumns(this.state.listColumns, this.state.listColumns));
        this.setState({columnVisibility});
      }

      this.setState({initialValues_Header:fields_Header});
     
      this.updateList();

  }




updateList = () => {
  const dataList = this.getListData(this.props.data.mobilities,this.state.listColumns);
  this.setState({dataList});
}


orderColumns = (columns) => {

      return columns.sort(function(a, b){return a.order-b.order});

    };

combineEqualColumns = (row, columns) =>{
    var newRow = row;
    
    var combinedColumns = [];

      for(var i=0; i<row.length; i++){
        const column = row[i]; 
       
        var equalColumns = newRow.filter(it=>(it.columnLabel === column.columnLabel));
        
        if (equalColumns.length > 1){
          equalColumns = this.orderColumns(equalColumns);
          const combinedColumnValue = [];
          for(var j=0; j<equalColumns.length; j++){
            combinedColumnValue.push(equalColumns[j].value);
          }
          const joinBy = columns.find(it=>(it.columnLabel === equalColumns[0].columnLabel)).joinBy;
          var combinedColumn = {};
          for(var key in equalColumns[0]){
            if (equalColumns[0].hasOwnProperty(key)) {
              
              if(key==='value'){ 
                  combinedColumn[key] = combinedColumnValue.join(joinBy);
                }
              else {
                combinedColumn[key] = equalColumns[0][key];
              }

            }
          }
          combinedColumns.push(combinedColumn);
          newRow = newRow.filter(it=>(it.columnLabel !== equalColumns[0].columnLabel));
          
        }
        

      }
      

      return (newRow.concat(combinedColumns));
      
      
    };

getListData=(data, columns)=>{
    
  const getDateFormat = (dateObject) => {
    
    var date = new Date(dateObject);
    //return(date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear());
    
    return (("0" + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear());
  };


  const hideColumns = (row) =>{
    var visibleColumns = [];
    var columnVisibility = [];
    if(this.state.columnVisibility.length){
       columnVisibility = this.state.columnVisibility;
    }else {
        columnVisibility = this.state.listColumns;
    }
    
    for(var i=0; i< row.length; i++){
      const column = row[i];
      


      if(columnVisibility.find(it => ((it.id === column.id) && it.visible))){
        visibleColumns.push(column);
      }

      
    }

    return visibleColumns;
  };


    var dataList = [];
    
    for(var i=0; i< data.length; i++){
      const dataRow = data[i];
      var listRow = [];
        for(var j=0; j<columns.length; j++){
          const dataColumn = columns[j];
          var value = '';
          if(dataColumn.value){
            console.log('value',dataColumn);
            value=dataColumn.value;
          }
          else if(dataColumn.location){
              if(typeof dataColumn.location === 'function'){
                value = dataColumn.location(dataRow,dataColumn.id);
              }
              else{
                const location = dataColumn.location.split('.');
                value = location.length === 2 ? dataRow[location[0]][location[1]] : dataRow[location];
              }
          }
          if(dataColumn.isDate && value){
            value = getDateFormat(value);
          }
          var listColumn = {id:dataColumn.id, columnLabel:dataColumn.columnLabel,value: value, order:dataColumn.order};
          
          //console.log('gg',this.state.columnVisibility.find(it => ((it.id === listColumn.id) && it.visible)));
          //if(this.state.columnVisibility.find(it => ((it.id === listColumn.id) && it.visible))){
            listRow.push(listColumn);
          //}
        }
        
      listRow = this.combineEqualColumns(listRow, columns);
      listRow = hideColumns(listRow);
      listRow = this.orderColumns(listRow);
      
      
      dataList.push(listRow);
      

    }
    
    return dataList;
    

}



handleChange_Header = (e) => {
  console.log(e.target);
  let fields_Header = [...this.state.fields_Header];
  const index = fields_Header.findIndex(it => it.id === e.target.id.split('_')[0]);
  if(index !== -1){
    if(e.target.type === "checkbox"){
      if(e.target.id.split('_')[1] === 'show'){
          fields_Header[index].visible = e.target.checked;
      }else{
          fields_Header[index].value = e.target.checked;
      }
      

    }else{
      fields_Header[index].value = e.target.value;
    }
    this.setState({fields_Header});
  }
}

handleChange_List = (e) => {
  console.log(e.target);
  let columnVisibility = [...this.state.columnVisibility];

  const index = columnVisibility.findIndex(it => it.id === e.target.id);
  if(e.target.type === "checkbox"){
    columnVisibility[index].visible = e.target.checked;
  }
  this.setState({columnVisibility});
  this.updateList();
}




handleReset = (e) => {
  
  let fields_Header = [...this.state.fields_Header];
  const index = fields_Header.findIndex(it => it.id === e.target.id.split('_')[0]);
  if(index !== -1){
    
    fields_Header[index].value = this.state.initialValues_Header[index].value;
    this.setState({fields_Header});
  }
}

 
 convertForCSV = (data) => {
    var dataCSV = [];
    var headersCSV = [];
  for(var i=0;i<data.length; i++){
    const row = data[i];
    var csvRow = {};
    for(var j=0;j<row.length; j++){
      const column = row[j];
      csvRow[column.id] = column.value;
      headersCSV.push({label:column.columnLabel, key:column.id});
    } 
    dataCSV.push(csvRow);
  }

    return {data:dataCSV,headers:headersCSV};
 }

  
  render() {
     console.log('PROS',this.props);
     const {t, columnsHideable} = this.props;
     const {fields_Header,columnVisibility, dataList} = this.state;
     const dataCSV = this.convertForCSV(dataList);

     var title = '';
     var subtitle = '';
     console.log('datalist',dataList);
     if(fields_Header){
        title = fields_Header.find(it => it.id === 'title' && it.visible === true);
        subtitle = fields_Header.find(it => it.id === 'subtitle' && it.visible === true);
      }

    return (
      <div>
      <div className="ongeaAct__exports_settings">
      <Panel label={t("Header")}>

      {fields_Header && fields_Header.map((field, i)=>{
        return( 
          
            <FormRowLayout infoLabel='' key={'HeaderFields_'+i}>
          {(field.id !== "dateFrom" && field.id !== "dateTo") &&
                      <HeaderInputField
                          
                          handleChange={this.handleChange_Header} 
                          handleReset={this.handleReset} 
                          field={field} 
          
                      />}

          {field.id === "dateFrom" && 
                    <Grid container spacing={40}>
                      <Grid item xs>
                     
                      <HeaderInputField
                          handleChange={this.handleChange_Header} 
                          handleReset={this.handleReset} 
                          field={field} 
          
                      />
                      </Grid>
                      <Grid item xs>
                        <HeaderInputField
                              handleChange={this.handleChange_Header} 
                              handleReset={this.handleReset} 
                              field={fields_Header.find((field)=>field.id === "dateTo")} 
                          />
                      </Grid>
                      </Grid>
                      
                    }
          </FormRowLayout>
          );

      })}


                  
      </Panel>
      <Panel label={t("List")}>
        {<FormRowLayout infoLabel=''>
        <FormControl>
              <FormLabel>{"Columns"}</FormLabel><br />
              <FormGroup>
              <Grid container spacing={40}>
              <Grid item xs>
              <CheckboxInput
                                      id={'index'}
                                      label={'Index'}
                                      value={'index'}
                                      onChange={(event)=>{this.setState({hasIndex:event.target.checked})}}
                                      checked={this.state.hasIndex}
                                      
                                    />
          {columnVisibility && columnVisibility.map((field, i)=>{
          
          return(
              <div key={'columnVisibility_1'+i}>
                {(i % 2 === 0) &&
                 <CheckboxInput
                                      id={field.id}
                                      label={field.columnLabel}
                                      value={field.id}
                                      onChange={this.handleChange_List}
                                      checked={field.visible}
                                      
                                    />
              }
            
          
                </div>
                                     );
                
                

          })}
          </Grid>
          <Grid item xs>
          {columnVisibility && columnVisibility.map((field, i)=>{
          
          return(
              <div key={'columnVisibility_2'+i}>
                {(i % 2 !== 0) &&
                 <CheckboxInput
                                      id={field.id}
                                      label={field.columnLabel}
                                      value={field.id}
                                      onChange={this.handleChange_List}
                                      checked={field.visible}
                                      
                                    />
                  }
          

              </div>
                                     );
                

          })}
          </Grid>
          </Grid>
          </FormGroup>
          </FormControl>
        </FormRowLayout>}
               
      </Panel>
      <hr />
    </div> {/*settings end*/}


      {dataCSV.data.length > 0 &&
          <DownloadAndPrint 
            dataCSV={dataCSV.data}
            headersCSV = {dataCSV.headers}
            csvFilename={(title ? (title.value) : 'unknown')+'.csv' }
          />
      }
      <div className='ongeaAct__exports_printPage'>
      <div className='ongeaAct__exports_printPage-header'>
       <Header
              title={title ? title.value : undefined}
              subtitle={subtitle ? subtitle.value : undefined}
              data={fields_Header.filter((it)=>(it.id !== 'title' && it.id !== 'subtitle' && it.id !== 'confirmation'))}
            />

     
           </div>

      <div className='ongeaAct__exports_printPage-body'>

      <List 
        data={dataList}
        hasIndex={this.state.hasIndex}
      />
      </div>
       
      </div>
      </div>
    );
  }
}

export default (Export4_forYouthpassCertificates);
