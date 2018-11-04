import React from 'react';
import { ContentTypes,extendReferenceContentType } from '../../config/content_types';
import DataTable from '../elements/Tables/DataTable';
import {translate} from "react-i18next";
import Panel from '../elements/Panel';
import { formEnhancer } from '../../libs/utils/formEnhancer';
import Grid from '@material-ui/core/Grid';
import { FormControls} from '../elements/FormElements/FormElements';
import IntroText from '../elements/IntroText';
import LoadingIndicator from '../elements/LoadingIndicator';
import DisplayFormState from '../elements/FormElements/DisplayFormState';

import { withSnackbar } from '../elements/SnackbarProvider'

class ScheduleListView extends React.Component {
 

 

  
  constructor(props) {
    super(props);

    this.state = {
      mobilityData: this.props.data,
      events: null,
      stays: this.props.data.stays ? JSON.parse(JSON.stringify(this.props.data.stays)) : [],
      isLoading: true,
      errorMessage:'',
      parallelEventsGroups: []
     };
    this._isMounted=false;
  }
 

  componentWillReceiveProps(newProps) {
   
    const {status, setStatus} = newProps;
    if (status && status.success && status !== this.props.status) {
      
      if (this.props.snackbar) 
        this.props.snackbar.showMessage(status.snackbarMessage, 'success');
      if (this.props.updateStateAfterSuccess && status.result) 
        this.props.updateStateAfterSuccess(status.result);
      setStatus({success: undefined});
      
    } else if (status && status.success === false) {
      this
        .props
        .snackbar
        .showMessage(status.snackbarMessage, 'error');
    }
  }


componentWillUnmount() {
    this._isMounted=false;
   }

setFieldValue = (contentType,column,value,id) => {
  console.log(this.props.values,contentType,column,value,id);
  let events = this.props.values.events;
  let stays = this.props.values.stays || [];

  if(events && events.length>0){
    

    if (value===false){
      
      events = events.filter((event)=>{
        return(parseInt(event.id,10)!==id);
      });
    }
  }
  if(this.props.values[contentType] && value===false){
    //let formikReferenceIndex = this.props.values[contentType].findIndex(i=>i.id===id);
  }
  if(column.name==="attendance" && value===true && events.findIndex(i=>i.id===id) === -1){
    if(events && events.length>0){
        const data = this.state.events;
        const event = data.find((it)=>(it.id === id));
        var parallelEvents = undefined;
        if(event && event.parallelEvents.length > 0){
          parallelEvents = event.parallelEvents;
          for(var i=0; i<parallelEvents.length;i++){
            events = events.filter((it)=>(it.id!==parallelEvents[i].id));
          }
        }
        
      }
    events.push({id:id});
    stays.push({event:id});

  }
  this.props.setFieldValue('events',events);
  this.props.setFieldValue('stays',stays);
}



  componentDidMount() {
     this._isMounted=true;
     this.getEvents();
     //this.getStays();
    


  }


getEvents(){

  let contentType = ContentTypes.Activities;
    contentType.api.getSingle({id:this.props.match.params.parentId})
      .then((result) => {
        //console.log(result.body,this._isMounted);
        if(this._isMounted){
          console.log();
        this.setState({events:result.body.events,isLoading:false});}
        
        

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoading:false});}
      });

}




createNestedTableData=(events)=>{
  
  var nestedEvents = [];
  var processedEvents = [];
console.log('33evetns',events);

  for(var i=0; i<events.length; i++){
    const event = events[i];

    
    if(processedEvents.findIndex((processedEvent)=>(processedEvent.id === event.id))===-1){

      var parentEvent = Object.assign({},event);
      processedEvents.push(event);
      if(event.parallelEvents.length >0 ){
        console.log('parent',parentEvent);
          parentEvent.items = [];
          for(var j=0; j<event.parallelEvents.length;j++){
            const parallelEvent = event.parallelEvents[j];
            
            const childEvent = events.find((it)=>(it.id===parallelEvent.id));
            if(childEvent && processedEvents.findIndex((processedEvent)=>(processedEvent.id === childEvent.id))===-1){
              console.log('child',childEvent);
              parentEvent.items.push(childEvent);
              processedEvents.push(childEvent);
            }
          }
      }
      nestedEvents.push(parentEvent);
    }
  }
  
  return (nestedEvents);
}

/*getStays(){
  let contentType = ContentTypes.Stays;
  

    contentType.api.get()
      .then((result) => {
        //console.log(result.body,this._isMounted);
        if(this._isMounted){
          
        this.setState({stays:result.body,isLoadingStays:false});}

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoadingStays:false});}
      });

}*/

  
  render() {
    const {mobilityData, events, isLoading, stays} = this.state; 
    const {columns,id,api,isEditable} = this.props.referenceContentType;
 
    const {t,data,handleSubmit,handleReset,isSubmitting,saveLabel,dirty} = this.props;
    var nestedEvents = [];
    
    var eventsForDataTable = JSON.parse(JSON.stringify(events));

  
    if(columns && eventsForDataTable && eventsForDataTable.length>0) {
      for(var c of columns){
        
          for(var row of eventsForDataTable){
            
            if(this.props.values.events){
              row['attendance'] = (this.props.values.events.find((event)=>{return parseInt(event.id,10)===row.id}) === undefined) ? false : true;
            }
            if(stays){
              row['roomNumber'] = (stays.find((stay)=>{return parseInt(stay.event.id,10)===row.id})) ? stays.find((stay)=>{return parseInt(stay.event.id,10)===row.id}).roomNumber : '';
              row['reducedPrice'] = (stays.find((stay)=>{return parseInt(stay.event.id,10)===row.id})) ? stays.find((stay)=>{return parseInt(stay.event.id,10)===row.id}).reducedPrice : false;
            }
            if(c.getData !== undefined){
             row[c.name] = c.getData(row,this.props.t);
            }

          }
        
        c.title = t(c.title)
      }
    }

    if(eventsForDataTable && eventsForDataTable.length>0) {
      nestedEvents = this.createNestedTableData(JSON.parse(JSON.stringify(eventsForDataTable)));
    }

    console.log(this.props);
    console.log('stays',stays);

    return (
      <React.Fragment>

      <form onSubmit={handleSubmit}>

          <Grid container spacing={24}>
           <Grid item xs={12} sm={6}>
            
      <FormControls t={t}
             isSubmitting={isSubmitting}
             saveLabel={saveLabel}
             dirty={dirty}></FormControls>

     </Grid>   <Grid item xs={12} sm={6}>
            <IntroText t={t} contentTypeId={this.props.contentType.id} location={this.props.location}></IntroText>
      </Grid>
          </Grid>


       <Panel>
       {(!isLoading && nestedEvents.length>0) 
          ? (
        <React.Fragment>
          

          
           
            <DataTable 
              columns={columns}
              isEditable={false} 
              isDeletable={false}
              data={nestedEvents}
              contentTypeId={'stay'}
              setFieldValue={this.setFieldValue}
             />
             
        </React.Fragment>
         )
         : (
           <LoadingIndicator></LoadingIndicator>
         )
      }
      </Panel>
     
       <Panel label="Form output">
         <DisplayFormState 
           {...this.props} />
       </Panel>  
      </form>
      </React.Fragment>
  );
  }
}


export default withSnackbar()(translate('translations')(formEnhancer(ScheduleListView)));
