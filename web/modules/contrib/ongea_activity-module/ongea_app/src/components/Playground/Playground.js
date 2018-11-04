import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../elements/Panel';
import Section from '../elements/Section';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {translate} from "react-i18next";
import Divider from '@material-ui/core/Divider';
import {TextInput, NumberInput} from '../elements/FormElements/FormElements';
import ApiContext from './ApiContext';
import IntegrationReferenceSelect from './IntegrationReferenceSelect';
//import GooglePlaces from '../elements/FormElements/GooglePlaces';
import withSnackbar from '../elements/SnackbarProvider/withSnackbar';


const propTypes = {
  title: PropTypes.string.isRequired,
  enabled: PropTypes.bool,
  email: PropTypes.string.isRequired
};
const defaultProps = {
  title: 'My Title',
  enabled: false,
  email: ''
};

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
});


class Playground extends React.Component {
  handleClick = (e) => {
    this.props.snackbar.showMessage(e.currentTarget.value.toUpperCase(),e.currentTarget.value);
  };
  render() {
    const {props} = this;
    const {classes, t} = props;
    /*const validationSchema = Yup
      .object()
      .shape({
        firstName: Yup
          .string()
          .min(2, "C'mon, your name is longer than that")
          .required('First name is required.'),
        lastName: Yup
          .string()
          .min(2, "C'mon, your name is longer than that")
          .required('Last name is required.'),
        email: Yup
          .string()
          .email('Invalid email address')
          .required('Email is required.'),
        gender: Yup.string(),
        currency: Yup.string(),
        startDate: Yup
          .date()
          .required('Start date is required.'),
        startTime: Yup
          .string()
          .required('Start time is required.'),
        endDate: Yup
          .date()
          .min(Yup.ref('startDate'), 'End date should be after start date.'),
        endTime: Yup
          .string()
          .compareToStart(Yup.ref('startDate'), Yup.ref('startTime'), Yup.ref('endDate'), 'End time should be after start time.')
      });*/
           

    return (
      <React.Fragment>
        <h2>Playground</h2>
        <Section label="GUI Elements">
        {/*<Panel label="Google Places with autocomplete">   
                    <GooglePlaces />
                  </Panel>*/}
                  <Grid container spacing={24}>
                    <Grid item xs>
                    <Panel className="levitate" label="Buttons">
                    <Button variant="contained" className={classes.button}>
                          Default Button
                        </Button>
                        <Button variant="contained" color="primary" className={classes.button}>
                          Primary Button
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.button}>
                          Secondary Button
                        </Button>
                  </Panel>
            </Grid>
            <Grid item xs>
            <Panel className="levitate" label="Snackbar">
           
                <Button variant="contained" value="default" onClick={this.handleClick} className={classes.button}>
                  Show Snackbar default
                </Button>
                <Button variant="contained" value="success" onClick={this.handleClick} color="primary" className={classes.button}>
                  Show Snackbar success
                </Button>
                <Button variant="contained" value="error" onClick={this.handleClick} color="secondary" className={classes.button}>
                  Show Snackbar error
                </Button>
          </Panel>
            </Grid>
          </Grid>
          
          <Panel label="Input">   
                <TextInput id="firstName" type="text" label="First Name" placeholder="John"/>
                
                <Grid container spacing={24}>
                   <Grid item xs={12} sm={6}>
                     <NumberInput
                        id="amount"
                        type="text"
                        label="Amount"
                        placeholder={t('Amount')}
                      />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                              {/*<SelectInput
                                                              id="currency"
                                                              type='text'
                                                              label={props.t("Currency")}
                                                              placeholder="choose a currency"
                                                              isCurrency
                                                            />*/}
                  </Grid>
                </Grid>
                </Panel>
             
          <Panel label="Reference Field with autocomplete">   
            <IntegrationReferenceSelect />
          </Panel>
        </Section>

        <Section>
          <Panel label="Api Context">
            <ApiContext></ApiContext>
          </Panel>
        </Section>

        {/*<Section>

          
                <FormikForm t={props.t}
                        user={{ email: '', firstName: '', lastName: '', currency:'', gender:'', startDate:'', startTime:'', endDate:'', endTime:'' }}
                        validation={validationSchema}
                                    
        </Section>/>*/}
        <Section>
          <Grid container spacing={24}>
            <Grid item xs>
              <Panel label="Typography">
                <h1>Headline 1</h1>
                <h2>Headline 2</h2>
                <h3>Headline 3</h3>
                <h4>Headline 4</h4>
                <h5>Headline 5</h5>
                <p>Paragraph</p>
                <a href="#fake-link">Link</a>
              </Panel>
            </Grid>
            <Grid item xs>
              <Panel toggle={props.enabled} label="Enable / Disable Panel">
                <Button variant="contained" className={classes.button}>
                  Default
                </Button>
                <Button variant="contained" color="primary" className={classes.button}>
                  Primary
                </Button>
                <Button variant="contained" color="secondary" className={classes.button}>
                  Secondary
                </Button>

                <Divider />
                <TextInput id="firstName" type="text" label="First Name" placeholder="John"/>

              </Panel>
            </Grid>
          </Grid>
        </Section>

        <Panel label="Grid">
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Paper>xs=12</Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper>xs=12 sm=6</Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper>xs=12 sm=6</Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper>xs=6 sm=3</Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper>xs=6 sm=3</Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper >xs=6 sm=3</Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper>xs=6 sm=3</Paper>
            </Grid>
          </Grid>
        </Panel>
      </React.Fragment>
    );
  }
}

Playground.propTypes = propTypes;
Playground.defaultProps = defaultProps;

export default withSnackbar()(withStyles(styles)(translate('translations')(Playground)));