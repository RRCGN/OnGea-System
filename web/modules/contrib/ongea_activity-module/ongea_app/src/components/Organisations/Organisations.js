import React from 'react';
import ContentView from '../_Views/ContentView'
import { ContentTypes } from '../../config/content_types';

class Organisations extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Organisations
  }

  render() {
    return (
      <ContentView {...this.props} render={() => (
        <span></span>
      )} />
  );
  }
}

export default Organisations;
//export default translate('translations')(Projects);
