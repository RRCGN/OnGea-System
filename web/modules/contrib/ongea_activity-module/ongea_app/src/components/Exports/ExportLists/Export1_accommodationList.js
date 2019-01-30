import React from 'react';
import Panel from '../../elements/Panel';
import ExportSettings from '../ExportElements/ExportSettings';
import PrintPage from '../ExportElements/PrintPage';
import { getDate} from '../../../libs/utils/dateHelpers';
import {getStaysByDate, orderStaysByDate, getStayDates,getStaysByPlace} from '../../../libs/utils/staysHelpers';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import {withExportProvider} from '../withExportProvider';
import DateSettings from '../ExportElements/DateSettings';


  

class Export1_accommodationList extends React.Component {
 

constructor(props) {
        super(props); 

        this.state = {
          stays:[],
          dateFrom:props.data.dateFrom || null,
          dateTo:props.data.dateTo || null,
          dates:[]
        };
      
      }







componentDidMount() {

   const initialValues_Header = [
              {
                id:'title', 
                label: 'Title',
                value: this.props.data.title || undefined,
                type:'TextInput',
                visible:true
              },
              {
                id:'subtitle', 
                label: 'Subtitle',
                value: this.props.data.subtitle || undefined,
                type:'TextInput',
                visible:true
              }

              ];

  const listColumns = [
               
                {id: 'place', columnLabel:'place', location: 'name' ,visible:true, order:1},
                {id: 'count', columnLabel:'people_staying_overnight', location: this.getPeopleCount,visible:true, order:2}
              ];



  const stays = this.getStays(this.props.data);
  const places = this.getPlaces(stays);
  const iteration = getStayDates(stays);


  this.props.setData({listColumns:listColumns, data:places, iteration:iteration, filterFunction:this.getPlacesByDate});
  this.props.updateList(initialValues_Header,true);

  this.setState({stays, dates:iteration});
        
      }


getStays=(data)=>{

  var stays = [];
  
  const mobilities = this.props.filterApproved(data.mobilities);

  const notExist = (mobilityStay) => (stays.findIndex((it)=>(it.id === mobilityStay.id)) === -1);

  if(mobilities && mobilities.length>0){
    for(var mobility of mobilities){
      const mobilityStays = mobility.stays;
      if(mobilityStays && mobilityStays.length > 0){
        for(var mobilityStay of mobilityStays){
          
          if(notExist(mobilityStay) && mobilityStay.event && mobilityStay.event.place && mobilityStay.event.category === 'overnight_stay'){
            stays.push(mobilityStay);

          }
        }
      } 
    }
  }
  
  
  stays = orderStaysByDate(stays);
  
  return (stays);

}

getPeopleCount = (place,columnId,date) => {

  const allStays = this.state.stays;
  const staysOnDate = getStaysByDate(date,allStays, true);

  const staysInPlace = getStaysByPlace(place,staysOnDate);

  return staysInPlace.length;

}

getPlacesByDate = (date,places) => {

  const allStays = this.state.stays;
  
    const staysOnDate = getStaysByDate(date,allStays, true);
    const placesOnDate = this.getPlaces(staysOnDate);
    return placesOnDate;

}


getPlaces=(stays)=>{

  var places = [];

  const notExist = (place) => (places.findIndex((it)=>(it.id === place.id)) === -1);
  
  if(stays && stays.length>0){
    for(var stay of stays){
      const event = stay.event;
      if(event && event.place && notExist(event.place)){
          
            places.push(event.place);          
        
      } 
    }
  }
  return places;

}




handleChangeDates = (dateFrom,dateTo) => {
    const dates = getStayDates(this.state.stays,dateFrom, dateTo);

    
    this.setState({dateFrom,dateTo, dates}, this.props.setData({iteration:dates},true));
}

  
  render() {
    
    const {t, dataList, fields_Header, columnVisibility, hasIndex,handleRequestSort, order, orderBy} = this.props;
    const {dates} = this.state;
    const headers = dates.map((it)=>(getDate(it)));
    const admitUser = (this.props.readOnly === true) ? false : true;
     
    return (

      admitUser ? 
      <div>
      <div className="ongeaAct__exports_settings">
          
          <Panel label={t("choose_period")}>
                      
            <DateSettings 
              valueFrom={this.state.dateFrom}
              valueTo={this.state.dateTo}
              initialFrom={this.props.data.dateFrom}
              initialTo={this.props.data.dateTo}
              onChange={this.handleChangeDates}
              disabled={false}
              t={t}
            />
                    
          </Panel>
      </div>

      

      <ExportSettings
        t={t} 
        handleReset={this.props.handleReset}
        handleChange_Header={this.props.handleChange_Header}
        fields_Header={fields_Header}
        handleChange_List={this.props.handleChange_List}
        columnVisibility={columnVisibility}
        hr={true}
        
      />
    
         <DownloadAndPrint 
                t={t}
                printSectionRef={this.componentRef}
              />
      
         <PrintPage 
                  ref={el => (this.componentRef = el)}
                  t={t}
                  fields_Header={fields_Header}
                  handleRequestSort = {handleRequestSort}
                  order={order}
                  commentHeader={''}
                  commentFooter={''}
                  orderBy={orderBy}
                  dataList={dataList}
                  hasIndex={hasIndex}
                  isIterated={true}
                  headers={headers}
                />

        

      </div>
      :
      <div class="ongeaAct__exports_noAdmittance">{t('no_admittance')}</div>
    );
  }
}

export default withExportProvider(Export1_accommodationList);

