import React from 'react';
import { ContentTypes, extendReferenceContentType } from '../../../config/content_types';
import ScheduleListView from '../ScheduleListView';
 

export class Schedule extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Mobilities,
    referenceContentType: ContentTypes.Stays//extendReferenceContentType(ContentTypes.Organisations,ContentTypes.ActivityOrganisations)
  
  }

  render() {
    
    

    return (
      <ScheduleListView {...this.props} render={(props) => (
        <div>
            { /*console.log('ongea: PlacesForm.js this.props',props)*/ }
        </div>
      )} />
  );
  }
}




