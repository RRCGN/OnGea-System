import React from 'react';
import ContentView from '../_Views/ContentView';
import {ContentTypes} from '../../config/content_types';









export default class ExportContentView extends React.Component {
  static defaultProps = {
    contentType: ContentTypes.Exports
  
  }
  render() {
   
    return (
      <ContentView {...this.props} render={() => (
        <div/>
      )} />
  );
  }
}


