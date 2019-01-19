import React from 'react';
import ActionSection from '../../elements/ActionSection';



  
 

export default class MobilitiesScheduleActions extends React.Component {
 
 constructor(props) {
    super(props);

    

     this.actions = {

  }

  }











  render() {

    
    const {formIsDirty} = this.props;
    
    
    
    
    return (
      <div>
      
      <ActionSection t={this.props.t} formIsDirty={formIsDirty} actions={this.actions}/>

      </div>
  );
  }
}

