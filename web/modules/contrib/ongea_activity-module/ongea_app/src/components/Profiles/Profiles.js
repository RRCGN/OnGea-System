import React from 'react';
import ContentView from '../_Views/ContentView'
import { ContentTypes } from '../../config/content_types';

class Profiles extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Profiles
  }

  render() {
    return (
      <ContentView {...this.props} render={() => (
        <span></span>
      )} />
  );
  }
}

export default Profiles;
//export default translate('translations')(Projects);
