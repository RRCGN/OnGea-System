import React from 'react';
import { ContentTypes,extendReferenceContentType } from '../../config/content_types';
import DataTable from '../elements/Tables/DataTable';
import MobilitiesScheduleActions from './elements/MobilitiesScheduleActions';
import {translate} from "react-i18next";
import Panel from '../elements/Panel';
import { formEnhancer } from '../../libs/utils/formEnhancer';
import Grid from '@material-ui/core/Grid';
import { FormControls} from '../elements/FormElements/FormElements';
import IntroText from '../elements/IntroText';
import LoadingIndicator from '../elements/LoadingIndicator';
import DisplayFormState from '../elements/FormElements/DisplayFormState';
import Button from '@material-ui/core/Button';
import {removeStay,removeParallelStays, getStayById, filterStaysByPlacesInActivity, getStays, getParallelStays} from '../../libs/utils/staysHelpers';
import { withSnackbar } from '../elements/SnackbarProvider';

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
        console.log('updateStateAfterSuccess');
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
  this.props.setDirtyFormState(true);

  if(value === '')value=null;
  
  let stays = this.props.values.stays || [];
  const staysCount = stays.length;
  const stay = getStayById(this.state.stays,id);
  var uncheckedStays = false;

  if(column.name==="attendance"){
    if(value===true && (stays.findIndex(i=>i.id===id) === -1)){
      const stay = getStayById(this.state.stays,id);
      stays = removeParallelStays(stay,stays,this.state.stays);
      uncheckedStays = (stays.length !== staysCount);
      
      stays.push({id:id});

    }else if (value===false && stays && stays.length>0){
      
      stays = removeStay(stays,id);
    }
    this.props.setFieldValue('stays',stays);
    if(uncheckedStays) {
      
      setTimeout(this.updateList,3);
    }
  }else{

    const existingStay = this.findStay(stay,{[column.name]:value});
    
    if(!existingStay){
      
      this.duplicateStay(stay,{[column.name]:value})
      .then((result)=>{
          console.log('newId',result);
          
          stays.push({id:result});
          stays = removeStay(stays,id);
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



duplicateStay = async (stay,params) => {
  var fields = Object.assign({},stay,params);
  delete fields.id;
  delete fields.mobilityIds;
  //console.log('fields',fields);

  

this.setState({isLoadingCreateStay:true});
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
          this.setState({stays,isLoadingCreateStay:false});
        }
        return result.body.id;
        

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoadingCreateStay:false});}
      });

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





  
resetList=(cleanStays) => {
  this.setState({isLoadingStays:true});
  console.log('props', this.props);

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


  if(columns && staysForDataTable && staysForDataTable.length>0) {

      for(var c of columns){
        
          for(var row of staysForDataTable){
            
            var formikStay = undefined;
            if(this.props.values && this.props.values.stays && this.props.values.stays.length>0 && row && row.id){
              
               formikStay = this.props.values.stays.find((it)=>{
                if(it && it.id){
                  return (it.id === row.id);
                }else{
                  console.error('Some stays were deleted, although they were part of a mobility.');

                    this
                      .props
                      .snackbar
                      .showMessage('Some stays were deleted, although they were part of a mobility.', 'error');
                  this.removeCorruptStay(it);
                  return false;
                }

              });
            }
              if(c.name === 'attendance'){
                console.log('111');
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
        
        c.title = t(c.title);
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

removeAllStays=()=>{
  this.props.setDirtyFormState(true);
  this.props.setFieldValue('stays',[]);
  setTimeout(this.updateList, 3);
  
}

  
  render() {
    const {isLoadingStays, nestedStays} = this.state; 
    const {columns,id,api,isEditable} = this.props.referenceContentType;
 
    const {t,data,handleSubmit,handleReset,isSubmitting,saveLabel,dirty} = this.props;
    const readOnly = this.props.readOnly;
    

    return (
      <React.Fragment>

      <form onSubmit={handleSubmit}>

          <Grid container spacing={24}>
           <Grid item xs={12} sm={6}>
            
      {!readOnly && <FormControls t={t}
                    handleReset={()=>this.resetList(false)}
                   isSubmitting={isSubmitting}
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
              remove all
            </Button>
            </div>}
      </Grid>
          </Grid>


         



       <Panel>
       {(!isLoadingStays) 
          ? (
        <React.Fragment>
          

          
           
            <DataTable 
              columns={columns}
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
      <MobilitiesScheduleActions formIsDirty={this.props.formIsDirty} resetList={this.resetList}/>
      </React.Fragment>
  );
  }
}


export default withSnackbar()(translate('translations')(formEnhancer(ScheduleListView)));
