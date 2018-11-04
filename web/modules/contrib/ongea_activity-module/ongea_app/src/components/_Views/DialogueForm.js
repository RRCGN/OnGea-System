import React from 'react';

import {translate} from "react-i18next";
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';



class DialogueForm extends React.Component {
    static defaultProps = {
        index:1
      }

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

  handleClose = () => {
    //this.setState({ open: false });
    if(this.props.onClose) this.props.onClose();

  };

  updateState = (props) => {
      if(props.open!==this.state.open){
      
    this.setState({ open: props.open });
}
  }
  componentDidUpdate(prevProps) {
          if(this.props!==prevProps){
     this.updateState(this.props);}
    }
    componentDidMount() {
       

        this.updateState(this.props);
    }


    render() {
        const {/*t,*/index} = this.props;
        const {open} = this.state;

        return (
            <React.Fragment>
                <Dialog
                open={open}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth={'md'}
                style={{top:(index*100)+'px'}}
                >
                <DialogTitle id="sub-form-dialog-title">
                    {this.props.t(this.props.title)}
                    <Button mini className="ongeaAct__dialog--close" variant="fab" onClick={this.handleClose} color="secondary">
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    {this.props.children}
                </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default translate('translations')(DialogueForm);

/*<Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth={'md'}
        >
          <DialogTitle id="form-dialog-title">{t('Add new')} {t(this.props.referenceContentType.title)}
            <Button mini className="ongeaAct__dialog--close" variant="fab" onClick={this.handleClose} color="secondary">
                <CloseIcon />
              </Button>
          </DialogTitle>
          <DialogContent>
            <ReferenceRoute.component isReference={true} saveLabel="Save and add" onSave={this.addReference} parentOfReference={this.props.contentType.id} contentType={this.props.referenceContentType}/>
          </DialogContent>
        </Dialog>*/