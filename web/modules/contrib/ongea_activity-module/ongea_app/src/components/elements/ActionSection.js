import React from 'react';
import ActionTextBox from './ActionTextBox';
import Grid from '@material-ui/core/Grid';
import {SelectInput} from '../elements/FormElements/FormElements';
import Panel from '../elements/Panel';


export default class ActionSection extends React.Component {
 
 
 constructor(props) {
    super(props);

    this.state = {
      action: null,
      progress:0
     };

     

  }


  handleChange = (e) => {
    const action = this.props.actions[e.target.value];
    this.setState({action});

  }

  setProgress=(newProgress)=>{
    var progress = newProgress;
    if(newProgress >100) progress = 100;
    this.setState({progress});
  }


  render() {
    const {isLoadingAction, formIsDirty, actions}  = this.props;
    const {action, progress} = this.state;
    


    var options = [];
    if(actions){
        options = Object.keys(actions).map((key)=>({value:key,label:this.props.t(actions[key].label)}));
    }

    
    return (
      <div>
      
      <Panel label={this.props.t('actions')}>
      <Grid container spacing={32}>
          <Grid item xs={12} sm={6}>
            <SelectInput
                      id="action"
                      disabled={isLoadingAction}
                      type="text"
                      label={this.props.t("choose_action")}
                      value={action && action.id}
                      onBlur={()=>{}}
                      onChange={this.handleChange}
                      options={options}
                    />


 
              {action && (!formIsDirty || (formIsDirty && formIsDirty.mainForms === false)) && <action.form {...this.props} setProgress={this.setProgress} actionId={action.id} handleSubmit={action.action} />}


            
          </Grid>
          <Grid item xs={12} sm={6}>
            {action && action.text && <ActionTextBox title={action.title} formIsDirty={formIsDirty} text={action.text} progress={progress} t={this.props.t}/>}
          </Grid>
          <Grid item xs={12} sm={6}>
            
            </Grid>

      </Grid>
      </Panel>

      </div>
  );
  }
}

