
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

function LoadingIndicator(props) {
  return (
    <div className={'ongeaAct__loadingIndicator '+(props.overlay && 'ongeaAct__loadingIndicator--overlay')}>
    <CircularProgress/>
      <div>{/*Loading …*/}</div>
    </div>
  );
}

export default withStyles(styles)(LoadingIndicator);