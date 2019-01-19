import React from 'react';
import DataTable from '../elements/Tables/DataTable';
import MobilitiesScheduleActions from './elements/MobilitiesScheduleActions';
import { ContentTypes} from '../../config/content_types';
import {translate} from "react-i18next";
import Panel from '../elements/Panel';
import { formEnhancer } from '../../libs/utils/formEnhancer';
import Grid from '@material-ui/core/Grid';
import { FormControls} from '../elements/FormElements/FormElements';
import IntroText from '../elements/IntroText';
import LoadingIndicator from '../elements/LoadingIndicator';
import DisplayFormState from '../elements/FormElements/DisplayFormState';
import Button from '@material-ui/core/Button';
import {removeStay,removeParallelStays, getStayById, getStays, getParallelStays, hasStayDuplicate, duplicateStay, isStayInPeriod} from '../../libs/utils/staysHelpers';
import { withSnackbar } from '../elements/SnackbarProvider';

 

class ScheduleListView extends React.Component {
 
 
 
 
  
  constructor(props) {
    super(props);

    this.state = {
     
      stays: null,
      isUpdating:false,
      nestedStays:[],
      mobilityStays: JSON.parse(JSON.stringify(this.props.data.stays)),
      isLoadingStays:true,
      errorMessage:'',
      translatedColumns:JSON.parse(JSON.stringify(props.referenceContentType.columns))
     };
    this._isMounted=false;
  }
 
 componentDidMount() {
     this._isMounted=true;
     
     getStays(this.props.match.params.parentId).then((stays)=>{

        this.setState({stays,isLoadingStays:false}, this.updateList);
     });

      

    

  }

  componentWillReceiveProps(newProps) {
   
    const {status, setStatus} = newProps;
    if (status && status.success && status !== this.props.status) {
      
      if (this.props.snackbar) 
        this.props.snackbar.showMessage(status.snackbarMessage, 'success');
      if (this.props.updateStateAfterSuccess && status.result) {
        this.props.updateStateAfterSuccess(status.result);
      }

      setStatus({success: undefined});
      this.updateList();  
      
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
  
  const stay = getStayById(this.state.stays,id);
  

  if(column.name==="attendance"){
    this.props.setDirtyFormState(true);

    if(value===true){
      this.setState({isUpdating:true});
      

      duplicateStay(stay)
      .then((newStay)=>{
          
          
          var allStays = this.state.stays;
          const index = allStays.findIndex((it)=>(it.id===stay.id));
          allStays.splice(index,0,newStay);
          
          //console.log('STAYS',stays);
          
          this.setState({stays:allStays,isUpdating:false});


          stays = removeParallelStays(newStay,stays,allStays);
          
          this.isInMobilityPeriod(newStay);
      
          stays.push({id:id});
          this.props.setFieldValue('stays',stays);
          setTimeout(this.updateList,3);

        });

      
      
      

    }else if (value===false && stays && stays.length>0){
      
      stays = removeStay(stays,id);
      this.props.setFieldValue('stays',stays);
      setTimeout(this.updateList,3);
    }
    

    


  }else{
    stay[column.name] = value;
    const formikId = stays.findIndex((it)=>(it && it.id===id));
    stays.splice(formikId,1);
    stays.push({id:stay.id});
    this.updateStay(stay);
    this.props.setFieldValue('stays',stays);
     
  }

  
}


updateStay = (stay) => {
  this.setState({isUpdating:true});
  const staysApi = ContentTypes.Stays.api;
  const requestParams={_format:'json'};

   staysApi.update({id:stay.id,...requestParams},stay)
      .then((result) => {
        //console.log(result.body,this._isMounted);
        if(this._isMounted){
           // console.log('result.body',result.body);
          var stays = this.state.stays;
          
          
          
          //console.log('STAYS',stays);
          this.setState({stays, isUpdating:false});
        }
         
        

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error});}
      });
}


/*duplicateStay = async (stay,params) => {
  var fields = Object.assign({},stay,params);
  delete fields.id;
  delete fields.mobilityIds;
  //console.log('fields',fields);

  


const requestParams={_format:'json'};
 return staysApi.create(requestParams,fields)
      .then((result) => {
        //console.log(result.body,this._isMounted);
        if(this._isMounted){
           // console.log('result.body',result.body);
          var stays = this.state.stays;
          const index = stays.findIndex((it)=>(it.id===stay.id));
          stays.splice(index,0,result.body);
          
          //console.log('STAYS',stays);
          this.setState({stays});
        }
        return result.body;
        

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error});}
      });

}*/






/*findStay=(stay,newParam)=>{
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

}*/



isInMobilityPeriod=(stay)=>{
  

  const mobility = this.props.data;
  var mobilityStart;
  var mobilityEnd;
  if(mobility.arrivalDate){
    mobilityStart = mobility.arrivalDate+' '+mobility.arrivalTime;
  }else{
    
    mobilityStart = mobility.dateFrom;
  }

  if(mobility.departureDate){
    mobilityEnd = mobility.departureDate+' '+mobility.departureTime;
  }else{
    mobilityEnd = mobility.dateTo;
  }

 
  if(mobilityStart && mobilityEnd && isStayInPeriod(stay,mobilityStart,mobilityEnd)===false){
    
    this
        .props
        .snackbar
        .showMessage(this.props.t('snackbar_stay_out_of_timeframe'), 'warning');
  }

  


}

  
resetList=(cleanStays) => {
  this.setState({isLoadingStays:true});

    this.props.setDirtyFormState(false);
    this.props.resetData();
    this.props.resetForm();

  getStays(this.props.match.params.parentId,cleanStays).then((stays)=>{
    this.setState({stays,isLoadingStays:false}, this.updateList);
  })
  .catch((error)=>{

    this.setState({errorMessage:error,isLoadingStays:false});

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
      const parallelStays = getParallelStays(this.state.stays,stay, true);
      
      
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


removeCorruptStay=(stay)=>{
  var stays = this.props.values.stays;
  const index = stays.findIndex((it)=>(it===stay));
  if(index > -1){
    stays.splice(index,1)
  }
  this.props.setFieldValue('stays',stays);
}


populateSpecialCells = (staysForDataTable) => {

const {columns} = this.props.referenceContentType;
const {t} = this.props;
const translatedColumns = JSON.parse(JSON.stringify(columns));

const findFormikStay = (row)=>this.props.values.stays.find((it)=>{
                if(it && it.id){
                  return (it.id === row.id);
                }else{
                  console.error('Some stays were deleted, although they were part of a mobility.');

                    this
                      .props
                      .snackbar
                      .showMessage(this.props.t('snackbar_stays_from_mobility_deleted'), 'error');
                  this.removeCorruptStay(it);
                  return false;
                }

              });

  if(columns && staysForDataTable && staysForDataTable.length>0) {

      for(var i=0; i<columns.length;i++){
        const c = columns[i];
        
          for(var row of staysForDataTable){
            
            var formikStay = undefined;
            if(this.props.values && this.props.values.stays && this.props.values.stays.length>0 && row && row.id){
              
               formikStay = findFormikStay(row);
            }
              if(c.name === 'attendance'){
                
                row[c.name] = formikStay ? true : false;
              }else if(c.name === 'reducedPrice' || c.name === 'roomNumber'){
                
                if(formikStay){

                  row[c.name+'_disabled'] = false;
                }else{
                  
                  row[c.name+'_disabled'] = true;
                }
                
              }
            
            
            
            if(c.getData !== undefined){
             row[c.name] = c.getData(row,this.props.t);
            }

           // console.log(c.name,'!!!',row[c.name]);

          }
          if(c.referenceType){
            translatedColumns[i].referenceType = c.referenceType;
          }
          
         translatedColumns[i].title = t(c.title);
      }
    }
return [staysForDataTable,translatedColumns];
}


updateList=()=>{

  var staysForDataTable = JSON.parse(JSON.stringify(this.state.stays));

  staysForDataTable = this.filterBlankStays(staysForDataTable);
  const returnArray = this.populateSpecialCells(staysForDataTable);
  staysForDataTable = returnArray[0];
  const translatedColumns = returnArray[1];
  if(staysForDataTable && staysForDataTable.length>0) {
    
      const nestedStays = this.createNestedTableData(JSON.parse(JSON.stringify(staysForDataTable)));
      this.setState({nestedStays, translatedColumns});
    }

  

}

shouldComponentUpdate(nextProps, nextState) {
    

    
    if(nextProps.t && nextProps.t !== this.props.t){
    this.updateList();
      return true;
    }

    
    
    return (nextState!==this.state || nextProps !== this.props);

  }


hasStayUsedDuplicate=(stay,stays, formikStays)=>{
    
    stays = stays.filter((it)=>(it.id !== stay.id));

    const hasDuplicate = stays.findIndex((it)=>{
        if(it.eventDay && it.eventDay.length >0 && stay.eventDay && stay.eventDay.length > 0){
            return (it && stay && it.eventDay[0].id === stay.eventDay[0].id && formikStays.findIndex((fit)=>(fit.id===it.id))!== -1);
          }else{
            return (it && stay && it.event.id === stay.event.id && formikStays.findIndex((fit)=>(fit && fit.id===it.id))!== -1);
          }

    }) !== -1;

    return hasDuplicate;

}


filterBlankStays=(stays)=>{

const mobilityId = this.props.match.params.id;
 
 const formikStays = this.props.values.stays || [];
 var filteredStays = [];

 const stayIsInMobility = (stay) => formikStays.findIndex((it)=>(it && stay && it.id === stay.id)) !== -1;

 const stayIsInOtherMobility = (stay) => (stay.mobilityIds && stay.mobilityIds.length > 0 && stay.mobilityIds.findIndex((it)=> {
   return (it && parseInt(it.id,10) === parseInt(mobilityId,10));
 }) === -1);

 for(var stay of stays){

  

    if(stayIsInMobility(stay)){
      filteredStays.push(stay);
    }else if(!this.hasStayUsedDuplicate(stay,stays, formikStays) && !hasStayDuplicate(stay,filteredStays) && !stayIsInOtherMobility(stay)){
      filteredStays.push(stay);
    }

    

 }
  

  return filteredStays;

}


removeAllStays=()=>{
  this.props.setDirtyFormState(true);
  this.props.setFieldValue('stays',[]);
  setTimeout(this.updateList, 3);
  
}

  
  render() {
    const {isLoadingStays, nestedStays, isUpdating, translatedColumns} = this.state; 
 
    const {t,handleSubmit,isSubmitting,saveLabel} = this.props;
    const readOnly = this.props.readOnly;

    return (
      <React.Fragment>

      <form onSubmit={handleSubmit}>

          <Grid container spacing={24}>
           <Grid item xs={12} sm={6}>
            
      {!readOnly && <FormControls t={t}
                    handleReset={()=>this.resetList(false)}
                   isSubmitting={isSubmitting || isUpdating}
                   saveLabel={saveLabel}
                   dirty={this.props.formIsDirty}></FormControls>}
      

     </Grid>   
     <Grid item xs={12} sm={6}>
            <IntroText t={t} contentTypeId={this.props.contentType.id} location={this.props.location}></IntroText>


             
      </Grid>
       <Grid item xs={12} sm={6}>
       </Grid>
      <Grid item xs={12} sm={6}>
        {!readOnly && <div style={{float:"right"}}><Button
              disabled={isSubmitting}
              variant="outlined"
              color="secondary"
              onClick={this.removeAllStays}
              >
              {t('uncheck_all')}
            </Button>
            </div>}
      </Grid>
          </Grid>


         



       <Panel>
       {(!isLoadingStays) 
          ? (
        <React.Fragment>
          

          
           
            <DataTable 
              columns={translatedColumns}
              readOnly={readOnly}
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
     
       
         <DisplayFormState 
           {...this.props} />
       
      </form>
      {/*!readOnly && <MobilitiesScheduleActions t={this.props.t} formIsDirty={this.props.formIsDirty} resetList={this.resetList}/>*/}
      </React.Fragment>
  );
  }
}


export default withSnackbar()(translate('translations')(formEnhancer(ScheduleListView)));
