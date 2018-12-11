import React from 'react';
import Panel from '../../elements/Panel';
import DownloadAndPrint from '../ExportElements/DownloadAndPrint';
import {withExportProvider} from '../withExportProvider';
import ExportSettings from '../ExportElements/ExportSettings';
import PrintPage from '../ExportElements/PrintPage';
import {getDateForObj,getDate,getTime,isInPeriod} from '../../../libs/utils/dateHelpers';
import DateSettings from '../ExportElements/DateSettings';





class Export7_scheduleList extends React.Component {


  constructor(props) {
        super(props);

        this.state = {
        eventsData:[],
          dates:[],
          dateFrom:props.data.dateFrom || null,
          dateTo:props.data.dateTo || null
        };
      
      }



  componentDidMount() {

  const listColumns = [

                        {id: 'startTime', columnLabel:'Time', location:'startTime',visible:true, order:1,sortBy:'asc'}, 
                        {id: 'category',columnLabel:'Category',location:'category',visible:true, order:2},
                        {id: 'title',columnLabel:'Event',location:'title',visible:true, order:3, },
                        {id: 'place',columnLabel:'Place',location:'place',visible:true,  order:4},
                        {id: 'description',columnLabel:'Description',location:'description',visible:true, order:5}


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
                value:this.props.data.subtitle || undefined,
                type:'TextInput',
                visible:true
              }
              




              ];

  const eventsData =this.getEventsData(this.props.data);
  
  
  const iteration = this.getDays(eventsData,this.state.dateFrom,this.state.dateTo );
  
  this.props.setData({listColumns:listColumns, data:eventsData, iteration:iteration, filterFunction:this.getEventsOfDay});
  this.props.updateList(initialValues_Header,true);
        //const stays = this.getStays(placeID);
        //this.props.updateList(stays,getStayDates(stays));
      this.setState({eventsData});
      }


    getEventsOfDay=(date,events)=>{
      var eventsOfDay = [];

      eventsOfDay = events.filter((it)=>it.startDate === date);

     
      return eventsOfDay;

    }


getEventsData = (activity)=>{

  const events = activity.events;
  var eventsData = [];

  if(events && events.length>0){
    for(var event of events){
      if(event.eventDays && event.eventDays.length>0){
          for(var eventDay of event.eventDays){
            const startDate = getDateForObj(eventDay.date);
            const startTime = getTime(eventDay.date);
            console.log('ggg',startTime);
            eventsData.push({
                        startDate:startDate,
                        startTime:startTime,
                        category:event.category,
                        title:event.title,
                        place:event.place?event.place.name:'',
                        description:event.description
                      });
          }
      }else{
          eventsData.push({
                        startDate:event.startDate,
                        startTime:event.startTime,
                        category:event.category,
                        title:event.title,
                        place:event.place?event.place.name:'',
                        description:event.description
                      });
      }
      
    }

  }
return eventsData;


}


getDays=(eventsData, dateFrom,dateTo)=>{
  var days=[];

  const exists = (event)=> days.findIndex((it)=>it===event.startDate) !== -1;


  for(var event of eventsData){
    var isEventInPeriod=true;
    if(dateFrom || dateTo){
      isEventInPeriod = isInPeriod(event.startDate, dateFrom,dateTo);
    }

    if(event.startDate && !exists(event) && isEventInPeriod){
      days.push(event.startDate);
    }
  }

  const sortedDays = days.sort(function(A,B){        
        return Date.parse(A) - Date.parse(B);
    });

  this.setState({dates:sortedDays});
  return sortedDays;
}


handleChangeDates = (dateFrom,dateTo) => {
    const dates = this.getDays(this.state.eventsData,dateFrom, dateTo);

    
    this.setState({dateFrom,dateTo, dates}, this.props.setData({iteration:dates},true));
}

 
  
  render() {
     const {t, dataList, fields_Header, columnVisibility, csvData, hasIndex,handleRequestSort, order, orderBy} = this.props;
     const {dates} = this.state;
      const headers = dates.map((it)=>(getDate(it)));
     var title = '';
     //console.log('datalist',dataList);
     if(fields_Header){
        title = fields_Header.find(it => it.id === 'title' && it.visible === true);
      }

    return (
      <div>
     
     <div className="ongeaAct__exports_settings">
          <Panel label={t("Choose time period")}>
                      
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
      />

      <DownloadAndPrint 
        t={t}
        
      />
      <PrintPage 
                  t={t}
                  fields_Header={fields_Header}
                  dataList={dataList}
                  hasIndex={hasIndex}
                  isIterated={false}
                  commentHeader={''}
                  commentFooter={''}
                  isIterated={true}
                  headers={headers}
                  handleRequestSort = {handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
      
      </div>
    );
  }
}


export default withExportProvider(Export7_scheduleList);
