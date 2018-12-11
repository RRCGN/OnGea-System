/* eslint-disable no-loop-func */

import React from 'react';
import DataTable from '../elements/Tables/DataTable';
import Panel from '../elements/Panel';
import LoadingIndicator from '../elements/LoadingIndicator';
import {translate} from "react-i18next";
 
import Button from '@material-ui/core/Button';
import { ReferenceSelect } from '../elements/FormElements/FormElements';
import {partition,findIndex} from 'lodash';
import DisplayFormState from '../elements/FormElements/DisplayFormState';
import { withSnackbar } from '../elements/SnackbarProvider'
import { formEnhancer } from '../../libs/utils/formEnhancer';
import Grid from '@material-ui/core/Grid';
import { FormControls} from '../elements/FormElements/FormElements';

import { routes } from '../../config/routes';
import DialogueForm from './DialogueForm';
import IntroText from '../elements/IntroText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
 
import {getParams} from '../../libs/api';

class ReferenceView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      references: JSON.parse(JSON.stringify(this.props.data[this.props.referenceContentType.id])),
      isLoading: true,
      errorMessage:'',
      open: false,
      referencesToAdd: [],
      deletingRows: [],
      dirtyFormDialogue:false,
      editReference:null
     };
     this._isMounted=false;
  }

  componentWillReceiveProps(newProps) {
   
    const {status, setStatus, doesFormReset} = newProps;
    
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

    if(doesFormReset === true && doesFormReset !== this.props.doesFormReset){
      
      this.resetView();
      this.props.setResetForm(false);
    }

    

    

  }

  componentWillUnmount() {
    this._isMounted=false;
   }

  componentDidMount() {
    this._isMounted=true;
    if(this.props.setLoadingState){
      this.props.setLoadingState(true);
    }
    this.getData();
  }


  resetView = () => {    
    this.props.setDirtyFormState(false);
    this.setState({isLoading:true});
    this.props.resetData();
    this.getData();
    const references = JSON.parse(JSON.stringify(this.props.data[this.props.referenceContentType.id]));
    this.setState({references});
  }

getData(){
  let contentType = (this.props.referenceContentType)?this.props.referenceContentType:this.props.contentType;
  
   
  
  const params = getParams('referenceView', contentType, this.props);
    contentType.api.getEntire(params) 
      .then((result) => {
        if(this._isMounted){
          var data = result.body;
          if(this.props.referenceContentType.id === 'events'){
          }
          console.log('ddd',data);
        this.setState({data,isLoading:false});
        if(this.props.setLoadingState){
          this.props.setLoadingState(false);
        }
        
        }
        

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoading:false});}
      });

}

  handleClickOpen = (editId) => {
    var editReference = null;
    if(editId){
      editReference = this.state.data.find((it)=>(it.id===parseInt(editId,10)));
      console.log('editRef',editReference);
    }
    this.setState({ open: true, editReference });
  };

  cancelFormClose=()=>{
    this.setState({dirtyFormDialogue:false});
  }

  openDirtyFormDialogue = () => {
    this.setState({dirtyFormDialogue:true});
  }


  closeForm = ()=>{
    this.setState({ open: false, dirtyFormDialogue:false });
    
  }


  handleClose = () => {
    
    if(this.props.formIsDirty){
      this.openDirtyFormDialogue();
    }else{
      this.closeForm();
      
    }
    
  };


filterEventsByPlacesInActivity = (events) => {
 
  var filteredEvents = [];
  const places = this.props.data.places;
  if(events && events.length > 0 && places && places.length>0){
     filteredEvents = events.filter((it)=>{
        if(it.place){
          return places.find((place)=>(place.id === it.place.id)) !==  undefined;
        }else{
          return true;
        }
     });
  }
  return filteredEvents;
}


  addReferences = () => {
    this.props.setDirtyFormState(true);
    var {references} = this.state;
    

    for (var referenceId of this.state.referencesToAdd.split(",")) {

      let newRefItem = this.state.data.find(it=>it.id===parseInt(referenceId,10));
      
      
      references.push(newRefItem);
      
      
    }
    var formikReferences = [];
    for(var ref of references){
      if(ref && ref.id){
        formikReferences.push({id:ref.id});
      }
    }
    this.props.setFieldValue(this.props.referenceContentType.id,formikReferences);
    this.setState({referencesToAdd:[], references});
  };

  addReference = item => {
    
   

   var {references} = this.state;
    let newReference = {id: parseInt(item.id, 10)};
    if(this.props.referenceContentType.columns){
      for(var attribute of this.props.referenceContentType.columns){
        
          newReference[attribute.name]=item[attribute.name];
        
      }
    }
    var data = this.state.data;
    data.push(item);
    references.push(newReference);
    this.props.setFieldValue(this.props.referenceContentType.id,references.map((it)=>(it && {id:it.id})));
    this.props.setDirtyFormState(true);
    this.props.snackbar.showMessage('Successfully added new element','success');
    this.setState({ data:data,open: false, references });


    this.addNewPlace(item);
    
  };  


refreshReference = item => {
    

   var {references, data} = this.state;
    

    references = references.filter((it)=>(it && it.id!==parseInt(item.id,10)));
    data = data.filter((it)=>(it.id!==parseInt(item.id,10)));
    references.push(item);
    data.push(item);
    this.props.setFieldValue(this.props.referenceContentType.id,references.map((it)=>({id:it.id})));
    this.setState({ data, open: false, references, editReference:null });

    this.addNewPlace(item);
  };  



addNewPlace = (item) => {
  if((this.props.referenceContentType.id === 'events') && item.place && item.place.id){
      
      var isNewPlace = true;
      const existPlaces = this.props.data.places && this.props.data.places.length >0;
      if(existPlaces){
        isNewPlace = (this.props.data.places.find((it)=>{
         
          return(it.id === item.place.id);}) ===undefined )? true : false;
       // console.log('isnewPace',isNewPlace);
      }
      if(isNewPlace){
        //console.log('newPLACE',item.place);
        const newFieldValuePlaces = existPlaces ? this.props.data.places.concat([{id:item.place.id}]) : [{id:item.place.id}];
        this.props.setFieldValue('places',newFieldValuePlaces);
      }
    }
}


deleteReferences = () => {
  

  const api = this.props.referenceContentType.api;
  var updatedData = [];
  var data = Object.assign(this.state.data);
  var {references} = this.state;

    for (var referenceId of this.state.deletingRows) {
      api
        .delete({id:referenceId, _format:'json'})
        .then((result) => {
          

            
            updatedData = data.filter((set)=>{
              return(set.id !== referenceId);
            });
            data = updatedData;
            
             this.setState({deletingRows:[], referencesToAdd:[], data});




              references.splice(findIndex(references,{'id':parseInt(referenceId,10)}),1);
              var formikReferences = [];
              for(var ref of references){
                if(ref && ref.id){
                  formikReferences.push({id:ref.id});
                }
              }
              this.props.setFieldValue(this.props.referenceContentType.id,formikReferences);
              this.setState({references});


           /*this
                .props
                .snackbar
                .showMessage('delete_success.','success');*/


        })
        .catch((error) => {
          console.log('error',error);
          this
                .props
                .snackbar
                .showMessage('ERROR: Could not delete.','error');
        });
    
    }
    
    
  };

cancelDelete = () => this.setState({deletingRows: []});

openDeleteDialog = (refId) => {

  var deletingRows = [];
  if(refId){
    deletingRows = [refId];
  }else{
    deletingRows = this.state.referencesToAdd.split(',');

  }
    

    for (var i = 0; i < deletingRows.length; i++) {
      deletingRows[i] = parseInt(deletingRows[i],10);
    }
    this.setState({deletingRows});
  };

  handleChangeAddReference = name => value => {

    this.setState({
      [name]: value,
    });
  };

  removeReference = value => {
    this.props.setDirtyFormState(true);
    var {references} = this.state;
    references.splice(findIndex(references,{'id':parseInt(value,10)}),1);
    this.props.setFieldValue(this.props.referenceContentType.id,references.map((it)=>({id:it.id})));
   // this.props.data[this.props.referenceContentType.id].splice(findIndex(this.props.data[this.props.referenceContentType.id],{'id':parseInt(value,10)}),1);
    this.setState({references});
  }

  setFieldValue = (contentType,column,value,id) => {
    var limitExceeded = false;
    if(column.limit !== undefined && value===true){
      var alreadyChecked = this.state.references.filter((it)=>it[column.name]===true);
      
      if(column.limit <= alreadyChecked.length){
        limitExceeded = true;
        this
        .props
        .snackbar
        .showMessage('Limit of '+column.limit+ ' '+column.title+ ' reached.', 'error');
      }
    }
    if(!limitExceeded){
      this.props.setDirtyFormState(true);
      let formikReferenceIndex = this.props.values[contentType].findIndex(i=>i.id===id);
      
      this.props.setFieldValue((contentType+'['+formikReferenceIndex+'].'+column.name).toString(),value);



      var {references} = this.state;
      references.find((it)=>(it.id === id))[column.name] = value;
      this.setState({references});
    


    }

  }

  filterList = values =>{
    const updatedList = JSON.parse(JSON.stringify(this.state.data));


    const partitionedList = partition(updatedList, function(item) { return findIndex(values, { 'id': item.id })!== -1 });
    
    
    if(partitionedList[0]){
      let _index=0;
      for(var mappedListItem of partitionedList[0]){
        mappedListItem.index = _index;
        _index++;
        var existingDataItem = values.find(it=>it && it.id===mappedListItem.id);
        for(var requiredCols of this.props.referenceContentType.columns){
          if(mappedListItem[requiredCols.name]===undefined){
            
            mappedListItem[requiredCols.name] = (existingDataItem && existingDataItem[requiredCols.name])?existingDataItem[requiredCols.name]:(parseInt(requiredCols.defaultValue,10) || 0);
          }
        }
      }
  }
    return partitionedList;
  }

  render() {
    
    const {isLoading,referencesToAdd, references, deletingRows} = this.state;
    const {columns,id} = this.props.referenceContentType;
    const {t,handleSubmit,isSubmitting,saveLabel, isLoadingAction} = this.props;
    const ReferenceRoute = (routes[id+"Detail"])?routes[id+"Detail"][0]:null;
    const readOnly = this.props.readOnly;
    
    const isSchedule = this.props.referenceContentType && this.props.referenceContentType.id === 'events';
    const isPlaces = this.props.referenceContentType && this.props.referenceContentType.id === 'places';
    const isTravels = this.props.referenceContentType && this.props.referenceContentType.id === 'travels';

    const isEditable = isSchedule || isPlaces || isTravels;
    

    var validationSchema = undefined;
    if(ReferenceRoute && this.props.referenceContentType.validationSchema){
       validationSchema = this.props.referenceContentType.validationSchema(this.props); // r.id is e.g. 'basic' or 'funding' in config/routes.js and should match object in config/contentTypes->validationSchema
       validationSchema = validationSchema[ReferenceRoute.id];
    }
    
   
    const filteredData = this.filterList(references);
    const mappedData = (filteredData && filteredData[0])?filteredData[0]:[]; 
    const availableData = (filteredData && filteredData[1])?filteredData[1].map(item => ({
      value: item.id,
      label: item[(this.props.referenceContentType.columns.find(it=>it.isPrimary===true))?this.props.referenceContentType.columns.find(it=>it.isPrimary===true).name:this.props.referenceContentType.columns[0].name],
    })):[];
   

   if(columns && mappedData && mappedData.length>0) {
      for(var c of columns){
        if(c.getData !== undefined){
          for(var row of mappedData){
           
          row[c.name] = c.getData(row,this.props.t);
          }
        }
        c.title = t(c.title); 
      }
    }
    
        return (
      <React.Fragment>
      
      <form onSubmit={handleSubmit}>

          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
            
              {!readOnly && <FormControls t={t}
                           isSubmitting={isSubmitting || isLoadingAction}
                           handleReset={this.resetView}
                           saveLabel={saveLabel}
                           dirty={this.props.formIsDirty}></FormControls>}

            </Grid>   
            <Grid item xs={12} sm={6}>
              <IntroText t={t} contentTypeId={this.props.contentType.id} location={this.props.location}></IntroText>
            </Grid>
          </Grid>
      <Panel>
          {!isLoading
          ? (
            <React.Fragment>
            <DataTable
              columns={columns.filter((col)=>col!==undefined)}
              data={mappedData}
              readOnly={readOnly}
              linkTo={this.handleClickOpen}
              delete={isEditable && this.openDeleteDialog}
              removeReference={!isSchedule && this.removeReference}
              isReference={true}
              isEditable={isEditable?true:false}
              setFieldValue={this.setFieldValue}
              contentTypeId={this.props.referenceContentType.id}
              parentContentTypeId={this.props.contentType.id}
            />
            {isLoadingAction && <LoadingIndicator overlay></LoadingIndicator>}
            </React.Fragment>
           )
           : (
             <LoadingIndicator></LoadingIndicator>
           )}


       
      
       </Panel>
       
           {!readOnly && <Grid container spacing={24} alignItems={'stretch'}>
                       
                                    <Grid item xs={12} sm={6}>
                                        { !isSchedule && 
                                          <Panel>
                                              <ReferenceSelect
                                              id="referencesToAdd"
                                              multiSelect={true} 
                                              disabled={isLoadingAction}
                                              label={t('Choose')+" "+t(this.props.referenceContentType.title)}
                                              onChange={this.handleChangeAddReference('referencesToAdd')}
                                              options={availableData} value={referencesToAdd}/>
                                              <Grid container spacing={24} alignItems={'stretch'}>
                                                <Grid item xs={12} sm={6}>
                                                     {/*<Button className="ongeaAct__referenceList__deleteButton fullWidth" disabled={(referencesToAdd.length===0)} variant="contained" onClick={(event)=>this.openDeleteDialog()}>{t('permanently_delete_'+this.props.referenceContentType.title,{count:referencesToAdd.length})}</Button>*/} 
                                                 </Grid>
                                                <Grid item xs={12} sm={6}>
                                                  
                                                  <Button className="fullWidth" disabled={(referencesToAdd.length===0) || readOnly || isLoadingAction} variant="contained" color="primary" onClick={this.addReferences}>{t('add_'+this.props.referenceContentType.title,{count:referencesToAdd.length})}</Button>
                                                </Grid>
                                              </Grid>
                                            </Panel>
                                          }
                                      </Grid>
           
                       <Grid item xs={12} sm={6}>
                       <Panel>
                         <Button className="fullWidth" disabled={isLoading || readOnly || isLoadingAction} variant="contained" color="primary" onClick={(e)=>this.handleClickOpen()}>{t('new_'+this.props.referenceContentType.title)}</Button>
                         </Panel>
                       </Grid>
                       
                     </Grid>}

       

         {!readOnly && <FormControls t={t}
                           isSubmitting={isSubmitting || isLoadingAction}
                           handleReset={this.resetView}
                           saveLabel={saveLabel}
                           dirty={this.props.formIsDirty}></FormControls>}
        
         
         <DisplayFormState 
           {...this.props} />
      
       </form>
       {ReferenceRoute && 
       <DialogueForm open={this.state.open} title={t(this.props.referenceContentType.title)} onClose={this.handleClose}>
            <ReferenceRoute.component activityId={this.props.contentType.id === 'mobilities' ? this.props.match.params.parentId : undefined} isReference={true} data={this.state.editReference} referenceId={this.state.editReference ? this.state.editReference.id : 'new'} parentId={this.props.match.params.id} saveLabel={this.state.editReference ? "save" : "add"} onSave={this.state.editReference ? this.refreshReference : this.addReference} parentOfReference={this.props.contentType.id} parentData={this.props.data} contentType={this.props.referenceContentType} validation={validationSchema ? validationSchema : false} setDirtyFormState={this.props.setDirtyFormState} formIsDirty={this.props.formIsDirty}/>
       </DialogueForm>
       }

       <Dialog
          open={!!deletingRows.length}
          onClose={this.cancelDelete}
          >
          <DialogTitle><p><span style={{textTransform:'uppercase'}}>{t('delete')}</span></p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('permanently_delete_'+this.props.referenceContentType.id+'_confirm',{count:deletingRows.length})}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={isLoading} onClick={this.cancelDelete} color="primary">{t("cancel")}</Button>
            <Button disabled={isLoading} onClick={this.deleteReferences} color="secondary">{t("delete")}</Button>
          </DialogActions>
        </Dialog>



         <Dialog
          open={this.state.dirtyFormDialogue}
          onClose={this.cancelFormClose}
          >
          <DialogTitle><p><span style={{textTransform:'uppercase'}}>unsubmitted form</span></p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {'Would you really like to close this unsubmitted form?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button  onClick={this.cancelFormClose} color="primary">{t("cancel")}</Button>
            <Button  onClick={this.closeForm} color="secondary">{t("yes")}</Button>
          </DialogActions>
        </Dialog>


       </React.Fragment>
    )
  }
}

export default withSnackbar()(translate('translations')(formEnhancer(ReferenceView)))