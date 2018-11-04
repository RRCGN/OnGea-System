import React from 'react';
import DetailView from '../../_Views/DetailView';

export default class Event extends Component {
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
