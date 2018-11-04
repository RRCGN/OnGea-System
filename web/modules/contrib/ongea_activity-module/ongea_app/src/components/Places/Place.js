import React from 'react';
import DetailView from '../../_Views/DetailView';

export default class Place extends Component {
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
