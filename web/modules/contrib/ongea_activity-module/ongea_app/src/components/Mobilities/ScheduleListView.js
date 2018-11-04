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

const staysApi = ContentTypes.Stays.api;

class ScheduleListView extends React.Component {
 
 
 

  
  constructor(props) {
    super(props);

    this.state = {
     
      stays: null,
      nestedStays:[],
      mobilityStays: JSON.parse(JSON.stringify(this.props.data.stays)),
      isLoadingStays:true,
      isLoadingCreateStay:false,
      errorMessage:''
     };
    this._isMounted=false;
  }
 
 componentDidMount() {
     this._isMounted=true;
     
     this.getStays();
    

    

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
  //console.log('onchange',this.props.values,contentType,column,value,id);
  
  if(value === '')value=null;
  
  let stays = this.props.values.stays || [];
  const stay = this.getStayById(id);

  if(column.name==="attendance"){
    if(value===true && (stays.findIndex(i=>i.id===id) === -1)){
      const stay = this.getStayById(id);
      stays = this.uncheckParallelStays(stay,stays);
      stays.push({id:id});

    }else if (value===false && stays && stays.length>0){
      
      stays = this.removeStay(stays,id);
    }
    this.props.setFieldValue('stays',stays);
  }else{

    const existingStay = this.findStay(stay,{[column.name]:value});
    console.log('existingStay',this.findStay(stay,{[column.name]:value}));
    if(!existingStay){
      
      this.duplicateStay(stay,{[column.name]:value})
      .then((result)=>{
          console.log('newId',result);
          
          stays.push({id:result});
          stays = this.removeStay(stays,id);
          this.props.setFieldValue('stays',stays);
          this.updateList();
        });

      
     
    }else{
      
      this.props.setFieldValue('stays',stays);
      this.updateList();
      if (this.props.snackbar) {
        console.log('A stay like that already exists. Use that instead.');
        setTimeout(()=>{ this.props.snackbar.showMessage('A stay like that already exists. Use that instead.','error'); }, 500);
      }
    }
     
  }

  
}

removeStay=(stays,id)=>{
  console.log('removeStay');
    return stays.filter((stay)=>{
        return(parseInt(stay.id,10)!==id);
      });
}

duplicateStay = async (stay,params) => {
  var fields = Object.assign({},stay,params);
  delete fields.id;
  delete fields.mobilityIds;
  console.log('fields',fields);
  

this.setState({isLoadingCreateStay:true});

 return staysApi.create(fields)
      .then((result) => {
        //console.log(result.body,this._isMounted);
        if(this._isMounted){
            console.log('result.body',result.body);
          var stays = this.state.stays;
          const index = stays.findIndex((it)=>(it.id===stay.id));
          stays.splice(index,0,result.body);
          
          console.log('STAYS',stays);
          this.setState({stays,isLoadingCreateStay:false});
        }
        return result.body.id;
        

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoadingCreateStay:false});}
      });

}

cleanStays=(stays)=>{
    
    const filteredStays = stays.filter((it)=>((!it.event) || (it.event && it.event.length===0) || ((it.roomNumber || it.reducedPrice)&&(!it.mobilityIds || (it.mobilityIds && it.mobilityIds.length===0)))));
    console.log('filteredStays',filteredStays);
    
    

    for(var stay of filteredStays){
      console.log('id',stay.id);
      staysApi.delete({id:stay.id})
      .then((result) => {
        //console.log(result.body,this._isMounted);
        if(this._isMounted){
          console.log('deltetd',stay.id, result.body);
        }
        

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoadingCreateStay:false});}
      });

    }

    

}


uncheckParallelStays=(stay,stays)=>{

    if(stays && stays.length>0){
        if(stay){
          var parallelStays = this.getParallelStays(stay);
          for(var parallelStay of parallelStays){
            stays = stays.filter((it)=>(it.id!==parallelStay.id));
          }
        }
        
      }
      return stays;
}

findStay=(stay,newParam)=>{
  //console.log('findStay',stay,newParam);
  const {stays} = this.state;
  const alteredField = Object.keys(newParam)[0];
  const otherField = (alteredField === 'reducedPrice') ? 'roomNumber' : 'reducedPrice';
  const event = stay.event;
  const eventDay = stay.eventDay;

  const checkFields = (it) => {
    var modifiedIt = it;
    
      if(alteredField === 'reducedPrice' && it[alteredField] === '0'){
        modifiedIt[alteredField] = false;
      }else if(alteredField === 'reducedPrice' && it[alteredField] === '1'){
        modifiedIt[alteredField] = true;
      }
    
    return ((modifiedIt[alteredField] === newParam[alteredField]) && (modifiedIt[otherField] === stay[otherField]));
  };
  
   

  return stays.find((it)=>{
      if(eventDay && eventDay.length >0 && it.eventDay && it.eventDay.length >0){

          return (it.eventDay[0].id === eventDay[0].id && checkFields(it));
      }else if(event && it.event){
        return (it.event.id === event.id && checkFields(it));
      }else{
        return false;
      }
    });

}

getStayById = (id) => {
  const data = this.state.stays;
  return data.find((it)=>(it.id === id));
}

getParallelStays=(stay,forNesting)=>{
  const data = this.state.stays;
  
  const parallelEvents = stay.event ? stay.event.parallelEvents : [];
  const stayEvent = stay.event;
  
  var parallelStays = [];
  if(stayEvent && parallelEvents && parallelEvents.length >0){

    for(var parallelEvent of parallelEvents){
        var parallelStaysToThisEvent = [];
      if(forNesting){
         parallelStaysToThisEvent = data.filter((it)=>((it.event.id === parallelEvent.id) || (it.event.id === stayEvent.id)));
      }else{
         parallelStaysToThisEvent = data.filter((it)=>((it.event.id === parallelEvent.id) || ((it.event.id === stayEvent.id) && ( it.eventDay && stayEvent.eventDay && it.eventDay[0].id === stayEvent.id))));
      }
      
     
      if(parallelStaysToThisEvent){
        parallelStays.push(...parallelStaysToThisEvent);
      }
      
    }
  }
  
  return parallelStays;
}

  





getStays(){

  
    staysApi.getEntire({_format:'json',activityId:this.props.match.params.parentId})
      .then((result) => {
        //console.log(result.body,this._isMounted);
        if(this._isMounted){

        //this.cleanStays(result.body); 
        this.filterStaysByPlacesInActivity(result.body)
        .then((stays)=>{
            console.log('stays',stays);
            this.setState({stays,isLoadingStays:false}, this.updateList);
        });
        
        
        

      }})
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoadingStays:false});}
      });

}

filterStaysByPlacesInActivity = async (stays) => {
  const activityApi = ContentTypes.Activities.api;
  return activityApi.getSingle({id:this.props.match.params.parentId})
      .then((result) => {
        //console.log(result.body,this._isMounted);
       

          var filteredStays = [];
          const places = result.body.places;
          if(stays && stays.length > 0 && stays && stays.length>0 && places && places.length>0){
             filteredStays = stays.filter((it)=>{
                if(it.event && it.event.place){
                  return places.find((place)=>(place.id === it.event.place.id)) !==  undefined;
                }else{
                  return true;
                }
             });
          }
          
          return filteredStays;
        
        
      })
      .catch((error) => {
        
        console.error(error);
         return [];
      });



  
}


createNestedTableData=(stays)=>{
  
  var nestedStays = [];
  var processedStays = [];


  for(var i=0; i<stays.length; i++){
    const stay = stays[i];

    
    if(processedStays.findIndex((processedStay)=>(processedStay.id === stay.id))===-1){

      var parentStay = Object.assign({},stay);
      processedStays.push(stay);
      const parallelStays = this.getParallelStays(stay, true);
      
      
      if(parallelStays.length >0 ){
        
          parentStay.items = [];
          for(var j=0; j<parallelStays.length;j++){
            const parallelStay = parallelStays[j];
            
            const childStay = stays.find((it)=>(it.id===parallelStay.id));
            if(childStay && processedStays.findIndex((processedStay)=>(processedStay.id === childStay.id))===-1){
              
              parentStay.items.push(childStay);
              processedStays.push(childStay);
            }
          }
      }
      nestedStays.push(parentStay);
    }
  }
  
  return (nestedStays);
}


populateSpecialCells = (staysForDataTable) => {

const {columns} = this.props.referenceContentType;
const {t} = this.props;


  if(columns && staysForDataTable && staysForDataTable.length>0) {

      for(var c of columns){
        
          for(var row of staysForDataTable){
            
            var formikStay = undefined;
            if(this.props.values && this.props.values.stays && row && row.id){

               formikStay = this.props.values.stays.find((it)=>(it.id === row.id));
            }
              if(c.name === 'attendance'){
                row[c.name] = formikStay ? true : false;
              }else if(c.name === 'reducedPrice' || c.name === 'roomNumber'){
                
                /*if(formikStay){
                  //row[c.name] = formikStay[c.name];

                  row[c.name+'_disabled'] = false;
                }else{
                  
                  row[c.name+'_disabled'] = true;
                }*/
                
              }
            
            
            
            if(c.getData !== undefined){
             row[c.name] = c.getData(row,this.props.t);
            }

           // console.log(c.name,'!!!',row[c.name]);

          }
        
        c.title = t(c.title)
      }
    }
return staysForDataTable;
}


updateList=()=>{

  var staysForDataTable = JSON.parse(JSON.stringify(this.state.stays));

  staysForDataTable = this.populateSpecialCells(staysForDataTable);
  if(staysForDataTable && staysForDataTable.length>0) {
      const nestedStays = this.createNestedTableData(JSON.parse(JSON.stringify(staysForDataTable)));
      this.setState({nestedStays});
    }

  

}

  
  render() {
    const {isLoadingStays, nestedStays} = this.state; 
    const {columns,id,api,isEditable} = this.props.referenceContentType;
 
    const {t,data,handleSubmit,handleReset,isSubmitting,saveLabel,dirty} = this.props;
    
    

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
       {(!isLoadingStays) 
          ? (
        <React.Fragment>
          

          
           
            <DataTable 
              columns={columns}
              isEditable={false} 
              isDeletable={false}
              data={nestedStays}
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
