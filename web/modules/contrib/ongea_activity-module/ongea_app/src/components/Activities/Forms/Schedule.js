import React from 'react';
import { ContentTypes } from '../../../config/content_types';
import ReferenceView from '../../_Views/ReferenceView';
 

export class ScheduleForm extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Activities,
    referenceContentType: ContentTypes.Events
  }

  render() {
    
    return (
      <ReferenceView {...this.props} render={(props) => (
        <div>
            { /*console.log('ongea: PlacesForm.js this.props',props)*/ }
        </div>
      )} />
  );
  }
}

export const Schedule = ScheduleForm;