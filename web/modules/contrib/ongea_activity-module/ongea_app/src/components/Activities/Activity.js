import React, { Component } from 'react'
import DetailView from '../_Views/DetailView';
//import { ContentTypes } from '../../config/content_types';

export default class Activity extends Component {
  /*static defaultProps = {
    contentType: ContentTypes.Project
  }*/

  render() {
    //console.log('thisprops',this.props);
    return (
      <div>
        <DetailView {...this.props} render={() => (
         {}
        )} />
      </div>
    )
  }
}
