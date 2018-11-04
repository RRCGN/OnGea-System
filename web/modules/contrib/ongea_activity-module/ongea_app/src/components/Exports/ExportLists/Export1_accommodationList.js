import React from 'react';
import Header from '../ExportElements/Header';
import Panel from '../../elements/Panel';
import FormRowLayout from '../../elements/FormElements/FormRowLayout';
import { SelectInput } from '../../elements/FormElements/FormElements';
import HeaderInputField from '../ExportElements/HeaderInputField';
import Grid from '@material-ui/core/Grid';
import List from '../ExportElements/List';
import {getDateForObj, getDate} from '../../../libs/utils/dateHelpers';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';




export default class Export1_accommodationList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPlaceId: null,
      stays:[],
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
              },
              {
                id:'place', 
                label: 'Place',
                value:undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'dateFrom', 
                label: 'From',
                value: null,
                type:'DateInput',
                visible:true
              },
              {
                id:'dateTo', 
                label: 'To',
                value:null,
                type:'DateInput',
                visible:true
              },




              ],
        initialValues_Header:[],
        dataList:[],
        columnVisibility:[],
        dates:[],
        listColumns:[
                                                    {id: 'stay', columnLabel:'', location: 'event.title',visible:true, order:1},
                                                    {id: 'fullPrice', columnLabel:'Persons at full price', location: (stay)=>this.getPriceCount(stay,true) ,visible:true, order:2}, 
                                                    {id: 'reducedPrice', columnLabel:'Persons at reduced Price', location: (stay)=>this.getPriceCount(stay,false) ,visible:true, order:3}
                                                    

                                              ]
    };
    
  }

componentDidMount() {
      const fields_Header = JSON.parse(JSON.stringify(this.state.fields_Header));


      this.setState({initialValues_Header:fields_Header});
     
      

  }


updateList = () => {


  const dates = this.getDates(this.state.stays);
  console.log('ff',dates);

  const dataList = this.getMultipleListsData(dates,this.state.stays,this.state.listColumns);
  this.setState({dataList, dates});
}


getMultipleListsData=(iteration,data,columns)=>{
    var dataList = [];

    for(var date of iteration){
      var staysOnDate = this.getStaysByDate(date,data);
      staysOnDate = this.removeDuplicateStays(staysOnDate);
      dataList.push(this.getListData(staysOnDate,this.state.listColumns));
    }
    
    return dataList;


}


getPriceCount = (stay, fullPrice) => {
    const staysData = this.state.stays;
    const date = new Date((stay.eventDay && stay.eventDay.length>0) ? stay.eventDay[0].date : stay.event.startDate);
    var count = 0;
    
    const stays = this.getStaysByDate(date,staysData);

    const checkFullPrice = (it) =>{
      if(fullPrice){
        return (it.reducedPrice===false || it.reducedPrice==="0");
      }else{
         return (it.reducedPrice===true || it.reducedPrice==="1");
      }
    
  }

 

    const filteredStays = stays.filter((it)=>{
      if(it.eventDay && it.eventDay.length >0 && stay.eventDay && stay.eventDay.length > 0){
            return (it.eventDay[0].id === stay.eventDay[0].id) && checkFullPrice(it);
          }else{
            return (it.event.id === stay.event.id) && checkFullPrice(it);
          }
    });

    for(var filteredStay of filteredStays){
      count = count + filteredStay.mobilityIds.length;
    }

    return count;
}




getStaysByDate = (date,stays) => {
  return stays.filter((stay)=>{
    const dateObj = new Date(date);
    var stayDate = new Date(stay.event.startDate);

    if(stay.eventDay && stay.eventDay.length>0 && stay.eventDay[0].date){
            stayDate = new Date (stay.eventDay[0].date);
        }

    return (stayDate.getFullYear() === dateObj.getFullYear() && stayDate.getMonth() === dateObj.getMonth() && stayDate.getDate() === dateObj.getDate());

  });
}

removeDuplicateStays=(stays)=>{
  var returnStays = [];

  

  for(var stay of stays){
    const exists = (returnStays.findIndex((it)=>{
          if(it.eventDay && it.eventDay.length >0 && stay.eventDay && stay.eventDay.length > 0){
            return (it.eventDay[0].id === stay.eventDay[0].id);
          }else{
            return (it.event.id === stay.event.id);
          }
        }) === -1) ? false : true;

    if(!exists){
      returnStays.push(stay);
    }
  }
  return returnStays;
}

getDates=(orderedStays)=>{
  const min = this.state.fields_Header.find((it)=>it.id==='dateFrom').value;
  const max = this.state.fields_Header.find((it)=>it.id==='dateTo').value;
  const minStamp = Date.parse(getDateForObj(min)+' '+'00:00:00');
  const maxStamp = Date.parse(getDateForObj(max)+' '+'24:00:00');
  
  var dates = [];

  
    for(var stay of orderedStays){
      var date = undefined;
      if(stay.eventDay && stay.eventDay.length >0){
        date = getDateForObj(stay.eventDay[0].date);
      }else{
        date = getDateForObj(stay.event.startDate);
      }

      const exists = dates.indexOf(date)===-1 ? false : true;

      const isInPeriod = minStamp < Date.parse(date) && Date.parse(date) < maxStamp;
       console.log(minStamp+' <<'+ Date.parse(date)+'<<'+maxStamp);
      console.log(date, isInPeriod);
      if(!exists && isInPeriod){
        dates.push(date);
      }
    }

console.log('hhhh',dates);
  return dates;
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
    this.setState({fields_Header}, this.updateList());
  }
}

handleReset = (e) => {
  
  let fields_Header = [...this.state.fields_Header];
  const index = fields_Header.findIndex(it => it.id === e.target.id.split('_')[0]);

  if(index !== -1){
    
    fields_Header[index].value = this.state.initialValues_Header[index].value;

    this.setState({fields_Header});
  }
}

handleChangePlace = (event) => {
  console.log('evetn',event);
  var fields_Header = this.state.fields_Header;
  var initialValues_Header = this.state.initialValues_Header;
  const placeName = this.props.data.places.find((it)=>(it.id===event.target.value)).name;

  fields_Header.find((it)=>it.id==='place').value = placeName;
  initialValues_Header.find((it)=>it.id==='place').value = placeName;
  

  const stays = this.getStays(event.target.value);
  const dateFrom = this.getFrom(stays);
  const dateTo = this.getTo(stays);
  
  
  fields_Header.find((it)=>it.id==='dateFrom').value = dateFrom;
  initialValues_Header.find((it)=>it.id==='dateFrom').value = dateFrom;

  fields_Header.find((it)=>it.id==='dateTo').value = dateTo;
  initialValues_Header.find((it)=>it.id==='dateTo').value = dateTo;
  


this.setState({stays,selectedPlaceId:event.target.value, fields_Header, initialValues_Header},
  this.updateList);

}

getFrom = (stays) => {
   
   
    if(stays && stays.length>0){
       for(var stay of stays){
        if(stay.eventDay && stay.eventDay.length>0 && stay.eventDay[0].date){
          return stay.eventDay[0].date;
        }else if(stay.event && stay.event.startDate){
          return stay.event.startDate;
        }
       }
    }else{
      return null;
    }
    

}

getTo = (stays) => {
    
   

    if(stays && stays.length>0){
       for(var i = stays.length-1;i>=0;i--){
        const stay = stays[i];
        if(stay.eventDay && stay.eventDay.length>0 && stay.eventDay[0].date){
          return stay.eventDay[0].date;
        }else if(stay.event && stay.event.startDate){
          return stay.event.startDate;
        }
       }
    }else{
      return null;
    }
   

}


getStays=(placeId)=>{

  var stays = [];
  
  const mobilities = this.props.data.mobilities;

  if(mobilities && mobilities.length>0){
    for(var mobility of mobilities){
      const mobilityStays = mobility.stays;
      if(mobilityStays && mobilityStays.length > 0){
        for(var mobilityStay of mobilityStays){
          
          if((stays.findIndex((it)=>(it.id === mobilityStay.id)) === -1) && mobilityStay.event && mobilityStay.event.place && (mobilityStay.event.place.id === placeId)){
            stays.push(mobilityStay);

          }
        }
      } 
    }
  }
  
  console.log('filteredStays',stays);
  stays = this.orderStaysByDate(stays);
  console.log('orderedStays',stays);
  return (stays);
}

orderStaysByDate=(stays)=>{

  const orderedStays = stays.sort(function(stayA,stayB){
        var dateA = stayA.event.startDate + ' ' + stayA.event.startTime;
        var dateB = stayB.event.startDate + ' ' + stayB.event.startTime;

        if(stayA.eventDay && stayA.eventDay.length > 0){
          dateA = stayA.eventDay[0].date;
        }
        if(stayB.eventDay && stayB.eventDay.length > 0){
          dateB = stayB.eventDay[0].date;
        }
        console.log(dateA+'   '+dateB);
        return Date.parse(dateA) - Date.parse(dateB);
    });

console.log(orderedStays.map((it)=>{
  return it.eventDay.length > 0 ? it.eventDay[0].date : it.event.startDate;

}));

return orderedStays;
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



  
  render() {
    console.log('PROS',this.props);
    const {data, t} = this.props;
    const {selectedPlaceId,fields_Header, dataList, dates} = this.state;

     var title = '';
     var subtitle = 'Please select place.';
     var isSubtitle = fields_Header.find(it => it.id === 'subtitle' && it.visible === true);
      if(fields_Header){
        title = fields_Header.find(it => it.id === 'title' && it.visible === true);

        if(selectedPlaceId && isSubtitle){
          subtitle = isSubtitle.value;
        }else if(selectedPlaceId && !isSubtitle){
          subtitle='';
        }
      }
    return (
      <div>
      <div className="ongeaAct__exports_settings">
      <Panel label={t("Choose place")}>
                  <FormRowLayout infoLabel=''>
                    <SelectInput
                      id="place"
                      type="text"
                      label={t("Place")}
                      value={selectedPlaceId || ''}
                      onChange={this.handleChangePlace}
                      onBlur={()=>{return(true);}}
                      options={data.places.length ? (data.places.map((place)=>{return({value:place.id,label:place.name});})):[{value:null,label:'No Places found in this Activity'}]}
                    />
                    </FormRowLayout>
      </Panel>
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
      <hr />
      </div> {/*settings end*/}

     <DownloadAndPrint 
            
          />

      <div className='ongeaAct__exports_printPage'>
      <div className='ongeaAct__exports_printPage-header'>
          <Header 
            title={title ? title.value : undefined}
            subtitle={subtitle}
            data={fields_Header.filter((it)=>(it.id !== 'title' && it.id !== 'subtitle'))}
            
          />

     
           </div>

      <div className='ongeaAct__exports_printPage-body'>

      {dataList && dataList.length >0 ? dataList.map((dataDay,i)=>{
          return (

            <div key={'list_'+i}>
            <h3>{getDate(dates[i])}</h3>

            <List 
                      data={dataDay}
                    />
            <br/><br/>
            </div>
                  );
      }):'null'}
      
      
      </div>
       
      </div>
      </div>
    );
  }
}


