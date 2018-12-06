import React from 'react';
import ActionSection from '../../elements/ActionSection';
import CleanStaysForm from './CleanStaysForm';


  
 

export default class MobilitiesScheduleActions extends React.Component {
 
 constructor(props) {
    super(props);

    

     this.actions = {
          cleanStays: {id:'cleanStays', label:'clean stays', title: "Delete unused stays", form:CleanStaysForm, action:(setProgress)=>this.cleanStays(setProgress), text: "As this effects all stays of this installation, please make sure nobody is editing any mobility of any activity at this moment."},

  }

  }



cleanStays = (setProgress) => {
  
  setProgress(20);

  this.props.resetList(true);
  setProgress(100);
}







  render() {

    
    const {formIsDirty} = this.props;
    
    
    
    
    return (
      <div>
      
      <ActionSection formIsDirty={formIsDirty} actions={this.actions}/>

      </div>
  );
  }
}

