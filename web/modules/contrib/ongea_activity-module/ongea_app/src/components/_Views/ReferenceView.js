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
      referenceId: 'new',
      dirtyFormDialogue:false
     };
     this._isMounted=false;
     //this.handleSearch = this.handleSearch.bind(this);
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
  
    contentType.api.getEntire({_format:'json',activity:true}) //should have activity:true
      .then((result) => {
        //console.log(result.body,this._isMounted);
        if(this._isMounted){
          var data = result.body;
          if(this.props.referenceContentType.id === 'events'){
            data = this.filterEventsByPlacesInActivity(data);
          }
        this.setState({data,isLoading:false});
        
        }
        

      })
      .catch((error) => {
        if(this._isMounted){
        this.setState({errorMessage:error,isLoading:false});}
      });

}

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  cancelFormClose=()=>{
    this.setState({dirtyFormDialogue:false});
  }

  openDirtyFormDialogue = () => {
    this.setState({dirtyFormDialogue:true});
  }


  closeForm = ()=>{
    //this.props.setDirtyFormState(false);
    this.setState({ open: false, dirtyFormDialogue:false });
    
  }


  handleClose = () => {
    console.log('hn');
    if(this.props.formIsDirty){
      this.openDirtyFormDialogue();
    }else{
      this.closeForm();
      
    }
    
  };


filterEventsByPlacesInActivity = (events) => {
  console.log('fff');
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
    
    //console.log('data',data);
    //if(this.props.data[this.props.referenceContentType.id]===undefined)this.props.data[this.props.referenceContentType.id]=[];

    for (var referenceId of this.state.referencesToAdd.split(",")) {

      let newRefItem = this.state.data.find(it=>it.id===parseInt(referenceId,10));
      
      //this.props.data[this.props.referenceContentType.id].push(newRefItem);
      
      references.push(newRefItem);
      
      
    }
    this.props.setFieldValue(this.props.referenceContentType.id,references.map((it)=>({id:it.id})));
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
    data.push(newReference);
    references.push(newReference);
    //if(this.props.data[this.props.referenceContentType.id]===undefined)this.props.data[this.props.referenceContentType.id]=[];
    //this.props.data[this.props.referenceContentType.id].push(newReference);
    this.props.setFieldValue(this.props.referenceContentType.id,references.map((it)=>({id:it.id})));
    this.props.setDirtyFormState(true);
    this.props.snackbar.showMessage('Successfully added new element','success');
    this.setState({ data:data,open: false, references });


    if((this.props.referenceContentType.id === 'events') && item.place){
      console.log('newPLACE',item.place);
      var isNewPlace = true;
      const existPlaces = this.props.data.places && this.props.data.places.length >0;
      if(existPlaces){
        isNewPlace = (this.props.data.places.find((it)=>(it.id === item.place.id)) ===undefined )? true : false;
      }
      if(isNewPlace){

        const newFieldValuePlaces = existPlaces ? this.props.data.places.concat([{id:item.place.id}]) : [{id:item.place.id}];
        this.props.setFieldValue('places',newFieldValuePlaces);
      }
    }
    
  };



deleteReferences = () => {
  console.log('thispropsdata',this.props);
  console.log('contentTypeID',this.props.contentType.id);
  console.log('referenceContentType',this.props.referenceContentType);


  const api = this.props.referenceContentType.api;
  var updatedData = [];
  var data = Object.assign(this.state.data);

    for (var referenceId of this.state.deletingRows) {
      console.log('toDelete',referenceId);
      api
        .delete({id:referenceId})
        .then((result) => {
          
           
           this
                .props
                .snackbar
                .showMessage('delete_success.','success');
        })
        .catch((error) => {
          console.log('error',error);
          this
                .props
                .snackbar
                //.showMessage('delete_success.','success');
                .showMessage('ERROR: Could not delete.','error');
        });

        updatedData = data.filter((set)=>{
          
            return(set.id !== referenceId);
          });
        data = updatedData;

      
    }
    
    this.setState({deletingRows:[], referencesToAdd:[], data});
  };

cancelDelete = () => this.setState({deletingRows: []});

openDeleteDialog = () => {

    var deletingRows = this.state.referencesToAdd.split(",");
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

    //console.log('filterList referencelist',updatedList);

    const partitionedList = partition(updatedList, function(item) { return findIndex(values, { 'id': item.id })!== -1 });
    
    //console.log('filterList partitionedList',values,partitionedList);
    
    if(partitionedList[0]){
      let _index=0;
      for(var mappedListItem of partitionedList[0]){
        mappedListItem.index = _index;
        _index++;
        var existingDataItem = values.find(it=>it.id===mappedListItem.id);
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
    const {t,data,handleSubmit,handleReset,isSubmitting,saveLabel,dirty} = this.props;
    const ReferenceRoute = (routes[id+"Detail"])?routes[id+"Detail"][0]:null;
    
    //console.log(this.props);

    

    var validationSchema = undefined;
    if(ReferenceRoute && this.props.referenceContentType.validationSchema){
       validationSchema = this.props.referenceContentType.validationSchema[ReferenceRoute.id]; // r.id is e.g. 'basic' or 'funding' in config/routes.js and should match object in config/contentTypes->validationSchema
    }
    
   
    const filteredData = this.filterList(references);
    const mappedData = (filteredData && filteredData[0])?filteredData[0]:[]; //FOR MOBILITY JUST data.mobilities;
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
            
      <FormControls t={t}
             isSubmitting={isSubmitting}
             handleReset={this.resetView}
             saveLabel={saveLabel}
             dirty={this.props.formIsDirty}></FormControls>

     </Grid>   <Grid item xs={12} sm={6}>
            <IntroText t={t} contentTypeId={this.props.contentType.id} location={this.props.location}></IntroText>
</Grid>
          </Grid>
      <Panel>
          {!isLoading
          ? (
            <DataTable
              columns={columns.filter((col)=>col!==undefined)}
              /*translatedColumnTitles={columns.map(function (obj) {
                return {name:obj.name,title:t(obj.title)};
              })}*/
              data={mappedData}
              linkTo={'/'+id+'/:id'}
              delete={this.removeReference}
              isReference={true}
              setFieldValue={this.setFieldValue}
              contentTypeId={this.props.referenceContentType.id}
              parentContentTypeId={this.props.contentType.id}
            />
           )
           : (
             <LoadingIndicator></LoadingIndicator>
           )}


        {/*<Paper>
          <pre>{this.state.data.filter(it=>it.title === this.state.searchString).length}</pre>

        <pre>MappedData.length: {mappedData.length}</pre>
        <pre>AvailableData.length: {availableData.length}</pre>
          <form onSubmit={handleSubmit}>
                    <FormControls t={t}
             handleReset={handleReset}
             isSubmitting={isSubmitting}
             dirty={dirty}></FormControls>
          <input onChange={handleChange} id="title" value={data.title} />
          <input onChange={handleChange} id={[this.props.referenceContentType.id]} value={data[this.props.referenceContentType.id].length} />
        </form>
        </Paper>*/}
      
       </Panel>
       
           <Grid container spacing={24} alignItems={'stretch'}>
            <Grid item xs={12} sm={6}>
            <Panel>
            <ReferenceSelect
            id="referencesToAdd"
            multiSelect={true} 
            label={t('Choose')+" "+t(this.props.referenceContentType.title)}
            onChange={this.handleChangeAddReference('referencesToAdd')}
            options={availableData} value={referencesToAdd}/>
            <Grid container spacing={24} alignItems={'stretch'}>
              <Grid item xs={12} sm={6}>
                <Button className="ongeaAct__referenceList__deleteButton fullWidth" disabled={(referencesToAdd.length===0)} variant="contained" onClick={this.openDeleteDialog}>{t('permanently_delete_'+this.props.referenceContentType.title,{count:referencesToAdd.length})}</Button> 
              </Grid>
              <Grid item xs={12} sm={6}>
                
                <Button className="fullWidth" disabled={(referencesToAdd.length===0)} variant="contained" color="primary" onClick={this.addReferences}>{t('add_'+this.props.referenceContentType.title,{count:referencesToAdd.length})}</Button>
              </Grid>
            </Grid>
              </Panel>
            </Grid>

            <Grid item xs={12} sm={6}>
            <Panel>
              <Button className="fullWidth" disabled={isLoading} variant="contained" color="primary" onClick={this.handleClickOpen}>{t('new_'+this.props.referenceContentType.title)}</Button>
              </Panel>
            </Grid>
            
          </Grid>

       

        
        
         <Panel label="Form output">
         <DisplayFormState 
           {...this.props} />
       </Panel>
       </form>
       {ReferenceRoute && 
       <DialogueForm open={this.state.open} title={t('add_new_'+this.props.referenceContentType.title)} onClose={this.handleClose}>
            <ReferenceRoute.component isReference={true} referenceId={this.state.referenceId} parentId={this.props.match.params.id} saveLabel="Save and add" onSave={this.addReference} parentOfReference={this.props.contentType.id} parentData={this.props.data} contentType={this.props.referenceContentType} validation={validationSchema ? validationSchema : false} setDirtyFormState={this.props.setDirtyFormState} formIsDirty={this.props.formIsDirty}/>
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