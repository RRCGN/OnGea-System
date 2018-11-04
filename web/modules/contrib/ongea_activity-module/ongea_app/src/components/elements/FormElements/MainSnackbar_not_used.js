import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


export default class MainSnackBar extends React.Component {

	constructor(props) {
      super(props);
     
      this.state = {
          	snackbar: this.props.snackbar
          	
        };



     }


     componentWillReceiveProps(newProps){
      const {snackbar} = newProps;
      
     
      if(snackbar){
      	
       this.setState({snackbar:true});
       
      }

    }


	

    snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
    }

    this.setState({ snackbar: false });
    };


    render() {

    	const {snackbar} = this.state;
    	const {snackbarMessage} = this.props;

      return (

      	<Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbar}
          autoHideDuration={6000}
          onClose={this.snackbarClose.bind(this)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{snackbarMessage}</span>}
          action={[
           
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.snackbarClose.bind(this)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

      );
    }
  }