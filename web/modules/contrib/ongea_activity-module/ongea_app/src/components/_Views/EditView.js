import React from 'react';
import {FormControls} from '../elements/FormElements/FormElements';
import {formEnhancer} from '../../libs/utils/formEnhancer';
import {withSnackbar} from '../elements/SnackbarProvider'
import {translate} from 'react-i18next';
import DisplayFormState from '../elements/FormElements/DisplayFormState';
import {Lists} from '../../config/content_types';
import IntroText from '../elements/IntroText';
import { Grid } from '@material-ui/core';
import {getParams} from '../../libs/api';


export class EditView extends React.Component {
  /*componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.status !== prevProps.status) {
      console.log('update')
    }
  }*/

  constructor(props) {
    super(props);

    this.state = {
      selectOptions: {},
      isSubmitting:false
    };

    this._isMounted = false;

  }

  componentWillReceiveProps(newProps) {
  
    const {status, setStatus, history, dirty, doesFormReset} = newProps;
      
    if (status && status.success && status !== this.props.status) {
      this.setState({isSubmitting:false});
      if (this.props.snackbar) 
        this.props.snackbar.showMessage(status.snackbarMessage, 'success');
      if (this.props.updateStateAfterSuccess && status.result) 
        this.props.updateStateAfterSuccess(status.result);
      setStatus({success: undefined});

      //if request header status is 201 (created) 
      if (status.result && (status.result.status === 201 || status.result.status === 200) && (!this.props.parentContentType || (this.props.parentContentType && status.wasParentCall))) {

        if (this.props.onSave) {
          // RETURN REFERENCE ID FOR NEW OBJECT 
          this
            .props
            .onSave(status.result.body);
        } else if (status.result.status === 201) {
          // GO TO EDIT VIEW
          if (this.props.parentContentType) {
            history.push('/' + this.props.parentContentType.id + '/' + status.result.body.id);
          } 
          else {

            // GO TO LIST-VIEW INSTEAD OF EDIT-VIEW
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
        this.setState({isSubmitting:false});
    }


    if(dirty !== this.props.dirty){
      
      this.props.setDirtyFormState(dirty);
    }
    

    if(doesFormReset === true && doesFormReset !== this.props.doesFormReset){
      this.props.resetForm();
      this.props.setResetForm(false);
    }


    if(newProps.newPlace && (newProps.newPlace !== this.props.newPlace)){
      
      this.props.setFieldValue('place',newProps.newPlace);
    }

    
    if(newProps.errors && newProps.errors !== this.props.errors && Object.keys(newProps.errors).length >0 && this.state.isSubmitting){
      
        this
        .props
        .snackbar
        .showMessage(this.props.t('snackbar_problem_input'), 'error');
        this.setState({isSubmitting:false});
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

    const afterGet = (result,selectId) => {
            selectOptions[selectId] = result;
            this.setState({selectOptions});
          };


    if (selects && selects.constructor === Array) 
      selects.map((select) => {

        Lists
          .getDataAsync(Lists.types[select])
          .then((result) => afterGet(result,select)).catch((error) => {
              console.error(error);

          });

        return true;
      });
    else {
      Lists
        .getDataAsync(Lists.types[selects])
        .then((result) => afterGet(result,selects))
        .catch((error) => {
              console.error(error);

        });

    }

  }
  
  getDataforSelect = (contentType, additionalOptions) => {
    
    var api = contentType.api;
    
    
    var data = [];
    if (additionalOptions && additionalOptions.constructor === Array) {
      data = additionalOptions;
    } else if (additionalOptions && additionalOptions.constructor !== Array) {
      data.push(additionalOptions);
    }

    
    const params = getParams('selectsInForms', contentType, this.props);

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

  handleSubmit = (payload) => {
    this.setState({isSubmitting:true});
    this.props.handleSubmit(payload);
  }

  render() {
    const {
      /*values,
            touched,
            errors,*/
      dirty,
      /*handleChange,
            handleBlur,*/
      /*handleSubmit,*/
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
        <form onSubmit={this.handleSubmit}>

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

       
                  <DisplayFormState {...this.props}/>
                

      </React.Fragment>
    );
  }
}
export default withSnackbar()(translate('translations')(formEnhancer(EditView)))