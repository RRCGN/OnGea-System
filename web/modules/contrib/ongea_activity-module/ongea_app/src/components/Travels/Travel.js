import React from 'react';
import DetailView from '../../_Views/DetailView';

export default class Travel extends Component {
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
