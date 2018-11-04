import React from 'react';
import ContentView from '../_Views/ContentView'
import { ContentTypes } from '../../config/content_types';

class Projects extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Project
  }

  render() {
    return (
      <ContentView {...this.props} render={() => (
        <span></span>
      )} />
  );
  }
}

export default Projects;
//export default translate('translations')(Projects);
