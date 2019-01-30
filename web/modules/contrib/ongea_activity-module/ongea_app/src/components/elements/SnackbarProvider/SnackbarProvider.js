import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

const variantIcon = {
  'success': CheckCircleIcon,
  'warning': WarningIcon,
  'error': ErrorIcon,
  'info': InfoIcon,
};


export default class SnackbarProvider extends PureComponent {
  state = {
    message: null,
    open: false,
    variant: 'default'
  }

  getChildContext () {
    return {
      snackbar: {
        showMessage: this.showMessage
      }
    }
  }

  /**
   * Display a message with this snackbar.
   * @param {string} message message to display
   * @param {string} [action] label for the action button
   * @param {function} [handleAction] click handler for the action button
   * @public
   */
  showMessage = (message,variant, action, handleAction) => {
    this.setState({ open: true, message,variant, action, handleAction })
  }

  handleActionClick = () => {
    this.handleClose()
    this.state.handleAction()
  }

  handleClose = () => {
    this.setState({ open: false, handleAction: null })
  }

  render () {
    const {
      action,
      message,
      open,
      variant
    } = this.state

    const {
      children,
      SnackbarProps
    } = this.props

    const Icon = variantIcon[variant];

    return (
      <React.Fragment>
        {children}
        <Snackbar
          {...SnackbarProps}
          className={'ongeaAct__snackbar ongeaAct__snackbar--'+variant}
          variant={variant}
          open={open}
    message={(message)?<span>{Icon && <Icon />}{message}</span>:''}
          action={action != null && (
            <Button
              color='secondary'
              size='small'
              onClick={this.handleActionClick}
            >
              {action}
            </Button>
          )}
          onClose={this.handleClose}
        />
      </React.Fragment>
    )
  }
}

SnackbarProvider.childContextTypes = {
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func
  })
}

SnackbarProvider.propTypes = {
  /**
   * The children that are wrapped by this provider.
   */
  children: PropTypes.node,
  /**
   * Props to pass through to the snackbar.
   */
  SnackbarProps: PropTypes.object
}
