import React from 'react';
import { ContentTypes } from '../../../config/content_types';
import ReferenceView from '../../_Views/ReferenceView';
 

export class TravelsForm extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Mobilities,
    referenceContentType: ContentTypes.Travels
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

export const Travels = TravelsForm;