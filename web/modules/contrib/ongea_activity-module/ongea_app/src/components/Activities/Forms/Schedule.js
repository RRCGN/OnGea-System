import React from 'react';
import { ContentTypes } from '../../../config/content_types';
import ReferenceView from '../../_Views/ReferenceView';
import ScheduleActions from '../elements/ScheduleActions';
 

export class ScheduleForm extends React.Component {
 
  constructor(props) {
    super(props);

    this.state = {
        isLoadingAction:false
     };

  }

  setLoadingState = (newState) => {
    this.setState({isLoadingAction:newState});
  }

  static defaultProps = {
    contentType: ContentTypes.Activities,
    referenceContentType: ContentTypes.Events
  }

  render() {
    
    return (
      <div>
      <ReferenceView setLoadingState={this.setLoadingState} isLoadingAction={this.state.isLoadingAction} {...this.props} render={(props) => (
        <div>
            { /*console.log('ongea: PlacesForm.js this.props',props)*/ }
        </div>
      )} />


      <ScheduleActions setLoadingState={this.setLoadingState} isLoadingAction={this.state.isLoadingAction} {...this.props} />

      </div>
  );
  }
}

export const Schedule = ScheduleForm;