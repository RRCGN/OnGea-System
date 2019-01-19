import React from 'react';
import { ContentTypes } from '../../../config/content_types';
import ReferenceView from '../../_Views/ReferenceView';
import TravelsActions from '../elements/TravelsActions';

export class TravelsForm extends React.Component {
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
    referenceContentType: ContentTypes.Travels
  }

  render() {
    const readOnly = this.props.readOnly ? this.props.readOnly : false;
    return (
      <div>
      <ReferenceView {...this.props} render={(props) => (
        <div>
            { /*console.log('ongea: PlacesForm.js this.props',props)*/ }
        </div>
      )} />
      {!readOnly && <TravelsActions setLoadingState={this.setLoadingState} isLoadingAction={this.state.isLoadingAction} {...this.props} />}
      </div>
  );
  }
}

export const Travels = TravelsForm;