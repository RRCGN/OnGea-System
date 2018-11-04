import React from 'react';
import Paper from '@material-ui/core/Paper';

export default class Section extends React.Component {
    render() {
      return (
        <Paper className="ongeaAct__section">
            {this.props.children}
         </Paper>
      );
    }
  }