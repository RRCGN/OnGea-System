import React from 'react';
import ContentView from '../_Views/ContentView'
import { ContentTypes } from '../../config/content_types';

class Activities extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Activities
  }

  render() {
        return (
      <ContentView {...this.props} render={() => (
        <span></span>
      )} />
  );
  }
}

export default Activities;
//export default translate('translations')(Projects);
 