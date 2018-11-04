import React from 'react';
import Panel from '../elements/Panel';
import {FormControls} from '../elements/FormElements/FormElements';
import {formEnhancer} from '../../libs/utils/formEnhancer';
import {withSnackbar} from '../elements/SnackbarProvider'
import {translate} from 'react-i18next';
import DisplayFormState from '../elements/FormElements/DisplayFormState';
import {Lists} from '../../config/content_types';
import IntroText from '../elements/IntroText';
import { Grid } from '@material-ui/core';


export class EditView extends React.Component {
  /*componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.status !== prevProps.status) {
      console.log('update')
    }
  }*/

  constructor(props) {
    super(props);

    this.state = {
      selectOptions: {}
    };

    this._isMounted = false;

  }

  componentWillReceiveProps(newProps) {
   
    const {status, setStatus, history, dirty, doesFormReset} = newProps;
      
    if (status && status.success && status !== this.props.status) {
      
      if (this.props.snackbar) 
        this.props.snackbar.showMessage(status.snackbarMessage, 'success');
      if (this.props.updateStateAfterSuccess && status.result) 
        this.props.updateStateAfterSuccess(status.result);
      setStatus({success: undefined});

      //if request header status is 201 (created)
      if (status.result && status.result.status === 201 && (!this.props.parentContentType || (this.props.parentContentType && status.wasParentCall))) {

        if (this.props.onSave) {
          // RETURN REFERENCE ID FOR NEW OBJECT
          this
            .props
            .onSave(status.result.body);
        } else {
          // GO TO EDIT VIEW
          if (this.props.parentContentType) {
            history.push('/' + this.props.parentContentType.id + '/' + status.result.body.id);
          } 
          else {
            // GO TO LIST-VIEW INSTEAD OF EDIT-VIEW
            console.log("AFTER ADD NEW ",this.props);
            var overviewUrl = '';
            if(this.props.contentType.id) {
              overviewUrl += '/'+this.props.contentType.id;
            }
            if(this.props.match.params.parentId){
              overviewUrl+="/"+this.props.match.params.parentId;
            }
            (overviewUrl.length>0) && history.push(overviewUrl);
            //history.push('/'+this.props.contentType.id+'/'+status.result.body.id);
          }

        }

      }

    } else if (status && status.success === false) {

      this
        .props
        .snackbar
        .showMessage(status.snackbarMessage, 'error');
    }


    if(dirty !== this.props.dirty){
      this.props.setDirtyFormState(dirty);
    }
    

    if(doesFormReset === true && doesFormReset !== this.props.doesFormReset){
      
      this.props.resetForm();
      this.props.setResetForm(false);
    }


    if(newProps.newPlace && (newProps.newPlace !== this.props.newPlace)){
      console.log('jjj',newProps.newPlace);
      this.props.setFieldValue('place',newProps.newPlace);
    }

  } 

  componentDidMount() {
     
    this._isMounted=true;
    //get Data from Database for Select Fields
    if (this.props.contentTypesForSelects) {
      if (this.props.contentTypesForSelects.constructor === Array && this.props.contentTypesForSelects.length) {
        for (var i = 0; i < this.props.contentTypesForSelects.length; i++) {

          this.getDataforSelect(this.props.contentTypesForSelects[i].contentType, this.props.contentTypesForSelects[i].additionalOptions);
        }
      } else {
        this.getDataforSelect(this.props.contentTypesForSelects.contentType, this.props.contentTypesForSelects.additionalOptions);
      }

    }

    //get Data from Lists for static select options
    if (this.props.listIdsforSelects) {
      this.getListsforSelect(this.props.listIdsforSelects);
    }


    //add activityId to Payload in Mobilities
    /*if(this.props.contentType.id === "mobilities"){
      
      this.props.setFieldValue('activityId',this.props.match.params.parentId);
    }*/

    

  }

  componentWillUnmount() {
    this._isMounted=false;
   }


  getListsforSelect = (listIds) => {
    let selectOptions = {};
    const selects = listIds;

    if (selects && selects.constructor === Array) 
      selects.map((select) => {

        Lists
          .getDataAsync(Lists.types[select])
          .then((result) => {

            selectOptions[select] = result;
            this.setState({selectOptions});
          }).catch((error) => {
              console.error(error);

          });

        return true;
      });
    else {
      Lists
        .getDataAsync(Lists.types[selects])
        .then((result) => {

          selectOptions[selects] = result;
          this.setState({selectOptions});
        })
        .catch((error) => {
              console.error(error);

        });

    }

  }
  
  getDataforSelect = (contentType, additionalOptions) => {
    
    var api = contentType.api;
    var params = {_format:'json', scope:'small'};
    if(this.props.contentType.id === 'mobilities' && contentType.id === 'organisations'){
      
       const activityId = this.props.match.params.parentId;
       params.mobility = true;
       params.activityId = activityId;
    }else if((this.props.contentType.id === 'activities' && contentType.id === 'projects') && (this.props.match && this.props.match.params.id !== 'new')){
      const activityId = this.props.match.params.id;
      params.activity = activityId;
    }
    
    var data = [];
    if (additionalOptions && additionalOptions.constructor === Array) {
      data = additionalOptions;
    } else if (additionalOptions && additionalOptions.constructor !== Array) {
      data.push(additionalOptions);
    }

    api.get(params)
      .then((result) => {
        if(this._isMounted){
        result
          .body
          .map((set) => {
            //console.log(set);
            data.push({
              value: set.id,
              label: (set.title || set.name || (set.firstname+' '+set.lastname))
            });

            return true;
          });

        this.setState({
          [contentType.id]: data
        });
      }

      })
      .catch((error) => {
        console.error(error);

      });

  }

  render() {

    const {
      /*values,
            touched,
            errors,*/
      dirty,
      /*handleChange,
            handleBlur,*/
      handleSubmit,
      handleReset,
      isSubmitting,
      /*status,
            setStatus,*/
      //setFieldValue,
      saveLabel,
      t,
      readOnly
    } = this.props;
   
    return (


      


      <React.Fragment>

      

      {!readOnly &&
        <form onSubmit={handleSubmit}>

           <Grid container spacing={24}>
           <Grid item xs={12} sm={5}>
            
          <FormControls
            t={t}
            handleReset={handleReset}
            isSubmitting={isSubmitting}
            saveLabel={saveLabel}
            dirty={dirty}></FormControls>
      
</Grid>   <Grid item xs={12} sm={7}>
            <IntroText t={t} contentTypeId={this.props.contentType.id} location={this.props.location}></IntroText>
</Grid>
          </Grid> 

          {/* TODO: Test if passing props or state is working */}
          {this
            .props
            .render(this.props, this.state)}

          <FormControls
            t={t}
            handleReset={handleReset}
            isSubmitting={isSubmitting}
            saveLabel={saveLabel}
            dirty={dirty}></FormControls>
        </form> 
      }{/* not readOnly END */}

      {readOnly &&

        this
            .props
            .render(this.props, this.state)

      }

        <Panel label="Form output">
                  <DisplayFormState {...this.props}/>
                </Panel>

      </React.Fragment>
    );
  }
}
export default withSnackbar()(translate('translations')(formEnhancer(EditView)))