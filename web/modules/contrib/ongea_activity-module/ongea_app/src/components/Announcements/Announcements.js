import React from 'react';
import ContentView from '../_Views/ContentView'
import { ContentTypes } from '../../config/content_types';


class Announcements extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Announcements
  }

  render() {
    
    return (
      <ContentView {...this.props} render={() => (
        <span></span>
      )} />
  );
  }
}

export default Announcements;
//export default translate('translations')(Projects);
