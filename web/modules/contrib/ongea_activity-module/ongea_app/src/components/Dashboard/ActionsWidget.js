import React from 'react';
import {translate} from "react-i18next";

import Panel from '../elements/Panel';
import Paper from '@material-ui/core/Paper';
import ActionSection from '../elements/ActionSection';
import CleanStaysForm from './elements/CleanStaysForm';
import {getStays} from '../../libs/utils/staysHelpers';
import {withSnackbar} from '../elements/SnackbarProvider';


class ActionsWidget extends React.Component {
 

  constructor(props) {
    super(props);

    

     this.actions = {
          cleanStays: {id:'cleanStays', label:'clean_up_stays', title: "delete_unused_stays", form:CleanStaysForm, action:(activityId,setProgress)=>this.cleanStays(activityId,setProgress), text: "intro_clean_up_stays_intro"},

  }

  }


  cleanStays = (activityId,setProgress) => {
  
    setProgress(20);

    getStays(activityId,true).then((stays)=>{
      this
        .props
        .snackbar
        .showMessage(this.props.t('clean_stays_success'), 'success');
      console.log('Stays cleaned with success.');
  })
  .catch((error)=>{
    this
        .props
        .snackbar
        .showMessage(this.props.t('clean_stays_error'), 'error');
    console.error(error);

  });
    setProgress(100);
  }


  
  

  render() {
    const {t} = this.props;
    
    return (
      <div>
      <h3>{t('actions')}</h3>
      <Paper>
      
          <Panel>
                <ActionSection t={this.props.t} actions={this.actions}/>       
                </Panel>
                 </Paper>
                 </div>
  );
  }
}

export default withSnackbar()(translate('translations')(ActionsWidget));


