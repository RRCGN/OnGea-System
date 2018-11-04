import React, { Component } from 'react'
import DetailView from '../_Views/DetailView';
//import { ContentTypes } from '../../config/content_types';

export default class Mobility extends Component {
  /*static defaultProps = {
    contentType: ContentTypes.Project
  }*/

  render() {
    return (
      <div>
        <DetailView {...this.props} render={() => (
         {}
        )} />
      </div>
    )
  }
}
