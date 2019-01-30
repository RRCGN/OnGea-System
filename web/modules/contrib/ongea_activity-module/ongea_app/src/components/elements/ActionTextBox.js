import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';
 



export default class ActionTextBox extends React.Component {
 
 


  render() {

    var {title,text, formIsDirty} = this.props;
    var progress = this.props.progress;
    if(progress >= 100) progress = 0;

    if(formIsDirty && formIsDirty.mainForms){
      title = 'Please save form before using actions.';
      text = '';
    }
    return (
      <div className="ongeaAct__Actions_ActionTextBox">
      <Card>
      <CardContent>
      <h4>{this.props.t(title)}</h4>
      {this.props.t(text)}
      { (progress !== 0) ? <div><br/><LinearProgress color="secondary" variant="determinate" value={progress} /><br />Please wait until this is finished.</div> : null}
      </CardContent>
      </Card>
      </div>
  );
  }
}

